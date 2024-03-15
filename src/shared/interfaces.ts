export enum AmendmentCategories {
    // Anything that has to deal with document formatted for pandoc
    Pandoc = "Pandoc",
    // Anything that deals with equations copied off Microsoft Word
    WordEquations = "WordEquations",
    // Anything that deals with reading documents that are not plain text
    Paper = "Paper",
    Boilerplate = "Boilerplate",
    Strings = "Strings",
    CSV = "CSV",
}


export interface AmendmentCategoryHolder {
    category: string;
    modules: AmendmentModule[];
}


export interface AmendmentModule {
    // display
    name: string;
    // as the ID
    repr: string;
    description: string;
    inputType?: string;
    inputExample?: string;
    warning?: string;
    operation: (_text: string) => string;
    category: AmendmentCategories;
}