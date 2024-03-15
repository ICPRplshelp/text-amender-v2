import {AmendmentCategories, AmendmentCategoryHolder, AmendmentModule} from "./interfaces.ts";

export function groupIntoCategories(modules: AmendmentModule[]): AmendmentCategoryHolder[] {
    return Object.keys(AmendmentCategories).map(category => {
        return {
            category: category,
            modules: modules.filter(module => module.category == category)
        }
    })
}