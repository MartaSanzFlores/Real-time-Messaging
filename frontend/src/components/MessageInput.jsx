import { useState } from 'react';

function MessageInput({ onSendMessage}) {

    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
    
        // Check if message is empty
        if (message.trim() === '') {
            return;
        }

        // Send message
        onSendMessage(message);

        // Clear input
        setMessage('');
    }

    return (
        <div className="w-full fixed bottom-0 mt-4 p-8 bg-gray-100">
            <div className="flex items-center w-full">
                <input
                    type="text"
                    className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-12 pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                    placeholder="Enter your message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
                <button
                    className="h-10 w-20 ml-2 rounded bg-gray-600 px-4 border text-center font-semibold text-white transition-all hover:bg-[#fbb03b]"
                    type="button"
                    onClick={handleSendMessage}
                    >
                    Send
                </button>
            </div>
        </div> 
    )
}

export default MessageInput;