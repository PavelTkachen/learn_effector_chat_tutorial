
import { useEvent, useList, useStore } from 'effector-react';
import React from 'react';
import * as model from './model';

export function ChatPage() {
    const handlePageMount = useEvent(model.pageMounted);
    React.useEffect(() => {
        handlePageMount();
    }, [handlePageMount])
    return (
        <div className='parent'>
            <ChatHistory />
            <MessageForm />
        </div>
    )
}
function ChatHistory() {
    const messageDeleting = useStore(model.$messageDeleting);
    const onMessageDelete = useEvent(model.messageDeleteClicked);
    const messages = useList(model.$messages, {
        keys: [messageDeleting],
        fn: message => (
            <div className="message-item" key={message.timestemp}>
                <h3>From: {message.author.name}</h3>
                <p>{message.text}</p>
                <button
                    onClick={() => onMessageDelete(message)}
                    disabled={messageDeleting}
                >
                    {messageDeleting ? "Deleting" : "Delete"}
                </button>
            </div>
        )
    })
    return (
        <div className='chat-history'>
            {messages}
        </div>
    )
}

function MessageForm() {
    const isLogged = useStore(model.$loggedIn);
    return isLogged ? <SendMessage /> : <LoginForm />
}

function SendMessage() {
    const userName = useStore(model.$userName);
    const messageText = useStore(model.$messageText);
    const messageSending = useStore(model.$messageSending);

    const handleLogout = useEvent(model.logoutClicked);
    const handleTextChange = useEvent(model.messageTextChanged);
    const handleEnterPress = useEvent(model.messageEnterPressed);
    const handleSendClick = useEvent(model.messageSendClicked);
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleEnterPress();
        }
    };

    return (
        <div className='message-form'>
            <h3>{userName}</h3>
            <input
                value={messageText}
                onChange={event => handleTextChange(event.target.value)}
                onKeyDown={handleKeyPress}
                className="chat-input"
                placeholder='Type a message...'
            />
            <button onClick={() => handleSendClick()} disabled={messageSending}>
                {messageSending ? "Sending..." : "Send"}
            </button>
            <button onClick={() => handleLogout()}>Log out</button>
        </div>
    )
}

function LoginForm() {
    const handleLogin = useEvent(model.loginClicked);
    return (
        <div className='message-form'>
            <div>Please, log in to be able to send messages</div>
            <button onClick={() => handleLogin()}>Login as a random user</button>
        </div>
    )
}