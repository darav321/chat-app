import mongoose from "mongoose";
import User from "./user.model.js";

const messageSchema = new mongoose.Schema({
    text : {
        type : String,
        default : ""
    },
    imageUrl : {
        type : String,
        default : "",
    },
    videoUrl : {
        type : String,
        default : "",
    },
    seen : {
        type : Boolean,
        default : false,
    },
    msgByUserId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
}, {timestamps : true})

const converSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : 'User'
    },
    reciever : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    messages : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'Message'
        }
    ]
}, {timestamps : true})

const Message = new mongoose.model('Message', messageSchema)
const Conversation = new mongoose.model('Conversation', converSchema)

export {Message, Conversation}