export function logError(msg: string) {
    console.log("%c[SiBR] ERROR: "+msg, "color: #ff4545;");
}

export function logInfo(msg: string) {
    console.log("%c[SiBR] "+msg, "color: #314b7a;");
}

export function logSuccess(msg: string) {
    console.log("%c[SiBR] "+msg, "color: #7bd92e;");
}