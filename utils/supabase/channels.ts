const reg: Record<string, unknown> = {};
export function setSharedChannel(name: string, ch: unknown) { reg[name] = ch; }
export function getSharedChannel<T>(name: string): T | null { return (reg[name] || null) as T | null; }
