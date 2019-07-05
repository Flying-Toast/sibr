export function logError(msg: string) {
    console.log("%c[SiBR] %cERROR: "+msg, "color: #314b7a;", "color: #ff4545;");
}

export function logInfo(msg: string) {
    console.log("%c[SiBR] "+msg, "color: #314b7a;");
}

export function logSuccess(msg: string) {
    console.log("%c[SiBR] %c"+msg, "color: #314b7a;", "color: #7bd92e;");
}