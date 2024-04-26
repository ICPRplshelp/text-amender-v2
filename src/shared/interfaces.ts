export enum AmendmentCategories {
    // Anything that has to deal with document formatted for pandoc
    Strings = "Strings",
    CSV = "CSV",

    // Anything that deals with equations copied off Microsoft Word
    WordEquations = "WordEquations",
    // Anything that deals with reading documents that are not plain text
    Paper = "Paper",
    Boilerplate = "Boilerplate",
    Paths = "Paths",
    Pandoc = "Pandoc",
    Markdown = "Markdown",
    ForceExtension = "ForceExtension",
    // this only changes the download label. For that, have the operation do nothing, and the repr, everything before the first dash is the download extension
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