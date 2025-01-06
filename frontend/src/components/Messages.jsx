import { useEffect, useState } from "react";

import Message from "./Message";
import MessageInput from './MessageInput';

function Messages( { userId } ) {

    const [isFetching, setIsFetching] = useState(false);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    const sendMessage = async (message) => {
        try {

            // POST message
            const response = await fetch("http://localhost:3000/messages/createMessage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    content: message,
                }),
            });

            const data = await response.json();

            // check error response (400 or 500)
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            // Add message to state
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data.savedMessage._id,
                    content: data.savedMessage.content,
                    senderName: data.savedMessage.senderName,
                    senderId: data.savedMessage.senderId,
                    status: data.savedMessage.status,
                    createdAt: new Date(data.savedMessage.createdAt).toLocaleString(),
                },
            ]);

        } catch (err) {

            setError(err.message);
        }
    }

    useEffect(() => {
        const fetchMessages = async () => {

            try {

                // loading
                setIsFetching(true);

                // GET messages
                const response = await fetch("http://localhost:3000/messages/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });

                const data = await response.json();

                // check error response (400 or 500)
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong!");
                }

                // Transform dates
                const formattedMessages = data.messages.map((message) => ({
                    ...message,
                    createdAt: new Date(message.createdAt).toLocaleString(),
                }));

                setMessages(formattedMessages);

            } catch (err) {

                setError(err.message);
            }

            setIsFetching(false);
        };

        fetchMessages();
    }, []);

    // Is error 
    if (error) {
        return <p className="text-center mt-32">{error}</p>;
    }

    // Is fetching
    if (isFetching) {
        return <p className="text-center mt-32">Loading...</p>;
    }

    return (
        <>
            {messages.length === 0 ? (
                <p>No messages</p>
            ) : (
                messages.map((message) => (
                    <Message
                        key={message._id}
                        senderName={message.senderName}
                        senderId={message.senderId}
                        date={message.createdAt}
                        content={message.content}
                        status={message.status}
                    />
                ))
            )}
            <MessageInput
                onSendMessage={sendMessage}
            />
        </>

    );
}

export default Messages;