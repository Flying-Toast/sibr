import * as fs from 'fs';

export function loadConfig<T>(fileName: string): T {
    return JSON.parse(fs.readFileSync(fileName).toString());
}

interface NetConfig {
    port: number
}

interface GameConfig {
    renderDistance: number
}

export const netConfig = loadConfig<NetConfig>('resources/net_config.json');
export const gameConfig = loadConfig<GameConfig>('resources/game_config.json');