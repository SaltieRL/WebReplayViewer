import { LoadingManager, Material, Group, MaterialCreator, EventDispatcher, Texture } from "three";

declare class OBJLoader {
    constructor(manager?: LoadingManager);
    manager: LoadingManager;
    regexp: any;
    materials: Material[];
    path: string;

    load(url: string, onLoad: (group: Group) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    parse(data: string) : Group;
    setPath(value: string) : void;
    setMaterials(materials: MaterialCreator) : void;
    _createParserState() : any;
}