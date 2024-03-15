import {AmendmentModule} from "./interfaces.ts";

export class StringPipe {
    modules: AmendmentModule[];

    processModule(text: string): string {
        for (const module of this.modules) {
            text = module.operation(text);
        }
        return text;
    }

    constructor(modules: AmendmentModule[]) {
        this.modules = modules;
    }
}