import { createEvent, createStore, merge, sample } from "effector";
import { $isLogged, $session } from "../../entities/session";
import { IMessage, ISession, messageApi, sessionApi } from "../../shared/api";
import { messageDeleteFx, messageSendFx } from "../../shared/api/message";

export const $loggedIn = $isLogged;
export const $userName = $session.map(item => item?.name || "");
export const $messages = createStore<IMessage[]>([]);
export const $messageText = createStore<string>("");

export const $messageDeleting = messageApi.messageDeleteFx.pending;
export const $messageSending = messageApi.messageSendFx.pending;

export const messageDeleteClicked = createEvent<IMessage>();
export const messageSendClicked = createEvent();
export const messageEnterPressed = createEvent();
export const messageTextChanged = createEvent<string>();
export const loginClicked = createEvent();
export const logoutClicked = createEvent();
export const pageMounted = createEvent();


sample({
    clock: pageMounted,
    target: [messageApi.messagesLoadFx, sessionApi.sessionLoadFx]
});

$messages.on(messageApi.messagesLoadFx.doneData, (_, messages) => messages);
$session.on(sessionApi.sessionLoadFx.doneData, (_, session) => session);
$messages.on(messageApi.messageSendFx.doneData, (messages, message) => [...messages, message]);
$messageText.on(messageTextChanged, (_, text) => text);
const messageSend = merge([messageEnterPressed, messageSendClicked]);

sample({
    clock: messageSend,
    source: { author: $session, text: $messageText },
    filter: (form): form is { author: ISession; text: string } => {
        return form.author !== null;
    },
    target: messageApi.messageSendFx
});

sample({
    clock: loginClicked,
    target: sessionApi.sessionCreateFx
});

sample({
    clock: sessionApi.sessionCreateFx.doneData,
    target: $session
})

sample({
    clock: sessionApi.sessionCreateFx.fail,
    fn: () => null,
    target: $session
});

sample({
    clock: logoutClicked,
    target: sessionApi.sessionDeleteFx
})

sample({
    clock: sessionApi.sessionDeleteFx.finally,
    fn: () => null,
    target: $session
});

$messageText.on(messageSendFx, () => '');

sample({
    clock: messageSendFx.fail,
    fn: ({ params }) => params.text,
    target: $messageText
});

sample({
    clock: messageDeleteClicked,
    target: messageApi.messageDeleteFx
});

$messages.on(messageApi.messageDeleteFx.done, (messages, { params: toDelete }) => {
    return messages.filter(message => message.id !== toDelete.id);
})

