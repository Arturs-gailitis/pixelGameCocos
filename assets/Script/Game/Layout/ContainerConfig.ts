import { _decorator, Color, Component, MeshRenderer, Node } from 'cc';
import { LevelConfigLoader } from '../../Level/LevelConfigLoader';

const { ccclass, property } = _decorator;

@ccclass('ContainerConfig')
export class ContainerConfig extends Component {
    @property({ tooltip: 'The slot of the level to use from level_config.json.' })
    public levelSlot = 1;

    @property({ type: Node, tooltip: 'Parent containing the Column nodes. Uses this node when empty.' })
    public containersRoot: Node | null = null;

    protected async start(): Promise<void> {
        await this.applyColor();
    }

    /** Applies palette colors to all visual containers, matched by their column and row. */
    public async applyColor(): Promise<void> {
        const level = await LevelConfigLoader.getBySlot(this.levelSlot);
        if (!level) {
            console.warn(`[ContainerConfig] Level slot ${this.levelSlot} was not found.`);
            return;
        }

        const root = this.containersRoot ?? this.node;
        const columns = root.children
            .filter((child) => child.name.startsWith('Column'))
            .sort((left, right) => left.position.x - right.position.x);

        for (const container of level.containers) {
            const column = columns[container.col];
            const slot = column?.children
                .slice()
                .sort((top, bottom) => bottom.position.y - top.position.y)[container.r];
            const renderer = slot?.getComponentInChildren(MeshRenderer);
            const hexColor = level.palette[container.c];

            if (!slot || !renderer || !hexColor) {
                console.warn(
                    `[ContainerConfig] Missing visual container or palette color for column ${container.col}, row ${container.r}.`,
                );
                continue;
            }

            const color = new Color();
            Color.fromHEX(color, hexColor);

            // A material instance prevents one container from recoloring another one.
            renderer.getMaterialInstance(0)?.setProperty('mainColor', color);
        }
    }
}
