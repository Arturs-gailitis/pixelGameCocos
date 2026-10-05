import { assetManager, JsonAsset } from 'cc';
import { LevelConfig } from './LevelStructure';

/** Loads and stores level_config.json data. This is not a Cocos Component. */
export class LevelConfigLoader {
    private static readonly ASSET_UUID = 'a18958b5-00e6-409f-bb45-c4d12366845d';
    private static configs: LevelConfig[] | null = null;

    /** Loads all level configurations; subsequent calls use the cached result. */
    public static async load(): Promise<LevelConfig[]> {
        if (this.configs) {
            return this.configs;
        }

        const asset = await new Promise<JsonAsset>((resolve, reject) => {
            assetManager.loadAny(this.ASSET_UUID, JsonAsset, (error, loadedAsset) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(loadedAsset as JsonAsset);
            });
        });

        this.configs = asset.json as LevelConfig[];
        return this.configs;
    }

    /** Returns a level by its `slot` number, or `undefined` when it does not exist. */
    public static async getBySlot(slot: number): Promise<LevelConfig | undefined> {
        const configs = await this.load();
        return configs.find((config) => config.slot === slot);
    }
}
