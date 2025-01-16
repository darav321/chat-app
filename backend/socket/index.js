import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
import getUserDetailFromToken from '../helpers/getUserDetailFromToken.js'
import User from '../models/user.model.js'
export const app = express()
import {Conversation,Message} from '../models/conversation.model.js'
import { getConversation } from '../helpers/getConversation.js'

export const server = http.createServer(app)
const io = new Server(server, {
    cors : {
        origin: "https://chat-more-zwg6.vercel.app/",
        credentials : true
    }
})

const onlineUser = new Set()

io.on('connection',async (socket)=>{
    console.log("connect user", socket.id)

    const token = socket.handshake.auth.token

    console.log(token)

    const user = await getUserDetailFromToken(token)

    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser', Array.from(onlineUser))

    socket.on('message', async (userid) => {
        console.log('Received message event with userid:', userid);
        const userDetails = await User.findById(userid).select("-password");
    
        const payload = {
            _id: userDetails._id,
            name: userDetails.name,
            profilePic: userDetails.profilePic,
            email: userDetails.email,
            online: onlineUser.has(userid),
        };
    
        console.log('Emitting message-user with payload:', payload);
        socket.emit('message-user', payload);  // Emit back to the sender

        const getConversation = await Conversation.findOne({
            $or : [
                {sender:user?._id?.toString(), reciever:userid},
                {sender:userid, reciever:user?._id?.toString()}
            ]
        }).sort({updatedAt : -1}).populate('messages')

        console.log(getConversation)

        if(getConversation?.messages){
            socket.emit("message", getConversation.messages)
        }
        


    });

    socket.on('new-msg', async (data)=>{

        let conversation = await Conversation.findOne({
            $or : [
                {sender:data.sender, reciever:data.reciever},
                {sender:data.reciever, reciever:data.sender}
            ]
        })

        if(!conversation){
            const createConversation = await Conversation({
                sender : data.sender,
                reciever : data.reciever
            })
            conversation = await createConversation.save()
        }

        const message = new Message({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId : data.msgByUserId
        })

        const saveMessage = await message.save()

        const updateConversation = await Conversation.updateOne({
            _id : conversation._id
        }, {
            $push : {
                messages : saveMessage._id
            }
        })

        const getConversation = await Conversation.findOne({
            $or : [
                {sender:data.sender, reciever:data.reciever},
                {sender:data.reciever, reciever:data.sender}
            ]
        }).populate('messages').sort({updatedAt : -1})

        console.log("message-data", getConversation.messages)

        io.to(data.sender).emit('message', getConversation?.messages || [])
        io.to(data.reciever).emit('message', getConversation?.messages || [])

        

    })

    socket.on('sidebar',async (id)=>{

        if(id) {
            const currentConversation = await Conversation.find({
                $or : [
                    {sender : id},
                    {reciever : id}
                ]
            }).sort({updatedAt : -1}).populate('messages').populate('sender').populate('reciever')
    
            console.log('currentConversation',currentConversation)
    
            const conversation = currentConversation.map((msg)=>{
    
                const countUnseenMsg = msg.messages.reduce((prev,curr) => prev+(curr.seen ? 0 : 1),0)
                return{
                    _id : msg._id,
                    sender : msg.sender,
                    reciever : msg.reciever,
                    unseenMsg : countUnseenMsg,
                    lastMsg : msg.messages[msg.messages.length - 1]
                }
            })
    
            socket.emit('side', conversation)
        }
    })    

    socket.on('seen', async(msgByUserId)=>{
        let conversation = await Conversation.findOne({
            $or : [
                {sender : user?._id?.toString(), reciever : msgByUserId},
                {sender : msgByUserId, reciever : user?._id?.toString()}
            ]
        })
        const conversationMsgId = conversation?.messages || []

        const updateMessage = await Message.updateMany(
            {_id : {"$in" : conversationMsgId}, msgByUserId : msgByUserId},
            {"$set" : {seen : true}}
        )

        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReciever = await getConversation(msgByUserId)

        io.to(user?._id?.toString()).emit('conversation', conversationSender)
        io.to(msgByUserId).emit('conversation', conversationReciever)
    })

    socket.on('disconnect', () => {
        onlineUser.delete(user?._id.toString())
        console.log('disconnect', socket.id)
    })
})