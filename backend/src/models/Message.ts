import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'read'],
        default: 'pending'
    },
    sender: {
        type: String,
        required: true
    }
});

export default mongoose.model('Message', messageSchema);
