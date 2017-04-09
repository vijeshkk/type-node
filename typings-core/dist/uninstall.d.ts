import { Emitter, ResolutionMap } from './interfaces';
export interface UninstallDependencyOptions {
    save?: boolean;
    saveDev?: boolean;
    savePeer?: boolean;
    global?: boolean;
    cwd: string;
    emitter?: Emitter;
}
export declare function uninstallDependency(name: string, options: UninstallDependencyOptions): Promise<UninstallDependencyOptions & {
    resolutions: ResolutionMap;
    cwd: string;
    emitter: Emitter;
}>;
export declare function uninstallDependencies(names: string[], options: UninstallDependencyOptions): Promise<UninstallDependencyOptions & {
    resolutions: ResolutionMap;
    cwd: string;
    emitter: Emitter;
}>;
