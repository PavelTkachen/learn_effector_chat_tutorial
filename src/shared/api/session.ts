import { createEffect } from "effector";
import { Config, starWars, uniqueNamesGenerator } from "unique-names-generator";
import { oid } from "../lib/oid";
import { wait } from "../lib/wait";

export interface ISession {
    id: string;
    name: string;
}

const nameGenerator: Config = { dictionaries: [starWars] };
const createName = () => uniqueNamesGenerator(nameGenerator);

const LocalStorageKey = "session-storage";

export const sessionLoadFx = createEffect<void, ISession | null, Error>(async () => {
    const source = localStorage.getItem(LocalStorageKey);
    await wait();
    if (!source) {
        return null;
    }
    return JSON.parse(source);
})

export const sessionDeleteFx = createEffect(async () => {
    localStorage.removeItem(LocalStorageKey);
    await wait();
})

export const sessionCreateFx = createEffect(async () => {
    const session: ISession = {
        id: oid(),
        name: createName()
    }
    localStorage.setItem(LocalStorageKey, JSON.stringify(session));
    return session;
})