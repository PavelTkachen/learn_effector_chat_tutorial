import { createStore } from "effector";
import { ISession } from "../../shared/api";

export const $session = createStore<ISession | null>(null);
export const $isLogged = $session.map(session => session !== null);