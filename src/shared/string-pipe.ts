import {AmendmentCategories, AmendmentModule} from "./interfaces.ts";

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

    /**
     * Returns the extension, with no dot in front of it.
     */
    getExtension() {
        let currentExtension = "txt";
        for(const module of this.modules){
            if(module.category === AmendmentCategories.ForceExtension){
                currentExtension = module.repr.split("-")[0] ?? ".txt";
            }
        }
        return currentExtension;
    }
}