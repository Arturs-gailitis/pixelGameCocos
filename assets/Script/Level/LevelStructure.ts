export interface LevelContainerConfig {
    c: string;
    cap: number;
    r: number;
    col: number;
}

export interface LevelConfig {
    slot: number;
    name: string;
    tier: string;
    source: string;
    grid: string[];
    palette: Record<string, string>;
    containers: LevelContainerConfig[];
    links: unknown[];
    mystery: unknown | null;
    thick: unknown | null;
    frost: unknown | null;
    blocker: unknown | null;
    regions: unknown | null;
    shutters: unknown | null;
    pressure: unknown | null;
    split: unknown | null;
    beltCap: number;
    seed: number;
    fillRule: string;
}