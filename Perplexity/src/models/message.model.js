import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: [true, 'Chat is required'],
    },
    content: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['user', 'ai'],
        required: [true, 'Message role is required'],
    },
});

const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
