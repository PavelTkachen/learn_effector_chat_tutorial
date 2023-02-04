import { createEffect } from "effector";
import { oid } from "../lib/oid";
import { wait } from "../lib/wait";

interface IAuthor {
    id: string;
    name: string;
};

export interface IMessage {
    id: string;
    author: IAuthor;
    text: string;
    timestemp: number;
}
interface ISendMessage {
    text: string;
    author: IAuthor;
}

const LocalStorageKey = 'message-history-storage';
function loadHistory(): IMessage[] | void {
    const source = localStorage.getItem(LocalStorageKey);
    if (source) {
        return JSON.parse(source);
    }
    return undefined;
}
function saveHistory(messages: IMessage[]) {
    localStorage.setItem(LocalStorageKey, JSON.stringify(messages));
}

export const messagesLoadFx = createEffect<void, IMessage[], Error>(async () => {
    const history = loadHistory();
    await wait();
    return history ?? [];
});

export const messageSendFx = createEffect(async({text, author} : ISendMessage) => {
    const message: IMessage = {
        id: oid(),
        author,
        text,
        timestemp: Date.now()
    };
    const history = await messagesLoadFx();
    await wait();
    saveHistory([...history, message]);
    return message;
});

export const messageDeleteFx = createEffect(async(message: IMessage) => {
    const history = await messagesLoadFx();
    const updated = history.filter(item => item.id === message.id);
    await wait();
    saveHistory(updated);
})