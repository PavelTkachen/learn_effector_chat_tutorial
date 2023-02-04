export function oid() {
    return ((new Date().getTime() / 1000) | 0).toString(16) + 'xxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16)).toLowerCase();
}