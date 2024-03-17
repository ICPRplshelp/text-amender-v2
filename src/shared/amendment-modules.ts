import {AmendmentCategories, AmendmentModule} from "./interfaces.ts";

const align: AmendmentModule = {
    name: "Align",
    repr: "align",
    inputType: "MS Word Stacked Math",
    description: "Converts MS Word stacked equations into LaTeX-compatible code. Open a new equation box, set equation mode to LaTeX, select the series of stacked equations you want to copy, hit copy, and paste it in the text box. Then, click on process me. If you're using the Align option, equations should be stacked with SHIFT+ENTER. To minimize errors, I strongly recommend starting each new line with an operator. MS Word's copy-paste results are not consistent so expect errors.",
    category: AmendmentCategories.WordEquations,
    operation: (text) => {
        const fixUpBadNotation = (s: string) => {
            const tli: string[][] = [
                ['\\{', '\\lbrace'],
                ['\\}', '\\rbrace'],
                ['\\emsp', '\\quad']
            ];
            for (const tl of tli) {
                s = s.replaceAll(tl[0], tl[1]);
            }
            return s;
        }
        const t2 = text.replaceAll('\n', '\\bigm').split("\\bigm");
        const t3 = t2.map(s => `& ${fixUpBadNotation(s)} \\\\`);
        const t4 = t3.join('\n');
        return "$$\\begin{aligned}\n" + t4 + "\n\\end{aligned}$$\n";
    }
}

const fixUnicodeEquations: AmendmentModule = {
    name: "Unicode Copy",
    repr: "unicode-copy",
    inputType: "UnicodeMath code",
    description: "Type an equation in MS Word (keep the mode on UnicodeMath), and copy it to here. This converts it into a form that Google's search can read. Not all operators are supported, so only use elementary arithmetic, complex numbers, and the choose operator",
    category: AmendmentCategories.WordEquations,
    operation: (text) => {
        return text.replaceAll('⋅', '*')
            .replaceAll(' ', '')
            .replaceAll('¦', ' choose ')
            .replaceAll('log_', 'log')
            .replaceAll('〖', '(').replaceAll('〗', ')')
            .replaceAll('█', '')
            .replaceAll('@', '')
            .replace(/\)\d+/g, function (match) {
                return ")*" + match.slice(1);
            });
    }
}


const pandocMarkdownToHTML: AmendmentModule = {
    name: "Pandoc Markdown to HTML",
    repr: "pandoc-markdown",
    inputType: "Pandoc Markdown",
    description: "Takes Markdown text, and converts and Pandoc Markdown DIVs into HTML DIVs.",
    category: AmendmentCategories.Pandoc,
    operation: (text) => {
        const pattern = /::: (.*?)[\n ]+(.*?)[\n ]+:::/g;
        return text.replaceAll(pattern, '<div class="$1">\n$2\n</div>');
    }
}

const fakeListToList: AmendmentModule = {
    name: "Fake List to List",
    repr: "fake-list-to-list",
    description: "Did someone try to write a list by using dashes, but forgot to add newlines before? Does some text look like this: \"-Point 1 -Point 2- Point 3-Point 4?\" This solves it.",
    inputType: "Text",
    category: AmendmentCategories.Paper,
    operation: (text) => {
        const pattern = /-/g;
        return text.replaceAll(pattern, '\n\n - ');
    }
}

const pdfNewlineRemover: AmendmentModule = {
    name: "PDF Newline Remover",
    repr: "pdf-newline-remover",
    description: "Removes all newlines that aren't preceded with a period",
    inputType: "Text from PDF",
    category: AmendmentCategories.Paper,
    operation: (text) => {
        text = text.replaceAll(".\n", "DOTNEWNt34#$@%#");
        text = text.replaceAll("\n", " ");
        text = text.replaceAll("DOTNEWNt34#$@%#", ".\n");
        return text;
    }
}

const softWrapper: AmendmentModule = {
    name: "Soft Wrapper",
    repr: "soft-wrapper",
    inputType: "Text from MD",
    category: AmendmentCategories.Paper,

    description: "Removes all lone newline characters. Do not modify text in markdown source code blocks.",
    operation: (text) => {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = text.match(codeBlockRegex) || [];
        text = text.replace(codeBlockRegex, '<CODEBLOCK>');
        const singleNewlineRegex = /(?<!\n)\n(?!\n)/g;
        text = text.replace(singleNewlineRegex, ' ');

        codeBlocks.forEach((codeBlock) => {
            text = text.replace('<CODEBLOCK>', codeBlock);
        });
        return text;
    }
}

const plusMinus: AmendmentModule = {
    name: "Plus Minus",
    repr: "plus-minus",
    description: "Splits up equations with the plus minus sign into a complex number. - is the real component, and + is the imaginary component (it's like this for readability from left to right).",
    category: AmendmentCategories.WordEquations,
    inputType: "Equation with ±",
    operation: (text) => {
        const t1 = text.replaceAll("±", "+").replaceAll("∓", "-");
        const t2 = text.replaceAll("±", "-").replaceAll("∓", "+");
        return `(${t2}) + i*(${t1})`; // t1 + "\n\n" + t2;
    }
}

const textToList: AmendmentModule = {
    name: "Text to List",
    repr: "text-to-list",
    description: "print(text.split('\\n'))",
    category: AmendmentCategories.Boilerplate,
    inputType: "Text",
    operation: (text) => {
        return JSON.stringify(text.trim().split("\n"))
    }
}

const numbersToList: AmendmentModule = {
    name: "Numbers to List",
    repr: "num-to-list",
    description: "print([int(n) for n in text.split('\\n')]); 0 for invalid",
    category: AmendmentCategories.Boilerplate,
    inputType: "Text",
    operation: (text) => {
        const safeParseFloat = (content: string) => {
            const a2 = parseFloat(content);
            if (isNaN(a2)) {
                return 0;
            }
            return a2;
        }

        return JSON.stringify(text.trim().split("\n").map(t => safeParseFloat(t)))
    }
}

const toUpper: AmendmentModule = {
    name: "To Upper Case",
    repr: "upper",
    description: "upper(text)",
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {
        return text.toUpperCase();
    }
}

const toUnixPath: AmendmentModule = {
    name: "Unix Path",
    repr: "unix-path",
    description: "text.replace(R\"\\\", \"/\")",
    category: AmendmentCategories.Paths,
    inputType: "Text",
    operation: (text) => {
        return text.replaceAll("\\", "/");
    }
}

const toWindowsPath: AmendmentModule = {
    name: "Windows Path",
    repr: "windows-path",
    description: "text.replace(\"/\", R\"\\\"); also renames /c and /mnt/c for bash / wsl users",
    category: AmendmentCategories.Paths,
    inputType: "Text",
    operation: (text) => {
        if(text.startsWith("/c")){
            text = text.replace("/c", "C:");
        } else if (text.startsWith("/mnt/c")) {
            text = text.replace("/mnt/c", "C:");
        }
        return text.replaceAll("/", "\\");
    }
}

const literalToString: AmendmentModule = {
    name: "Literal to String",
    repr: "literal-to-string",
    description: "repr^-1(text)",
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {

        try {
            const jsonObj: string[] = JSON.parse(`["${text.replaceAll('"', '\\"')}"]`);
            return jsonObj[0];
        } catch (e) {
            return "Invalid string literal";
        }
    }
}

const stringToLiteral: AmendmentModule = {
    name: "String to Literal",
    repr: "string-to-literal",
    description: "repr(text)",
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {
        return JSON.stringify(text);
    }
}

const stringCounter: AmendmentModule = {
    name: "String Counter",
    repr: "string-counter",
    description: "To make it easier to count indices of a string",
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {
        const bigList: string[] = [];
        let i: number = 0;
        for (const ch of text) {
            bigList.push(`-${text.length - i} | ${i}: ${JSON.stringify(ch)}`);
            i++;
        }
        return bigList.join("\n");
    }
}

const toMath = (st: string) => {
    // https://stackoverflow.com/questions/22703574/how-can-i-add-the-multiplication-sign-to-an-algebraic-expression-through-regex
    return st.trim().replaceAll("⋅", "*").replaceAll(" ", "*").replaceAll("^''", "_q").replaceAll("^'", "_p").replaceAll(/(?<=[a-zA-Z0-9])(?=[a-zA-Z])/g, "*");
}


const toMathAM: AmendmentModule = {
    name: "Math to Code",
    repr: "to-math",
    description: "Converts a math-like expression (in UnicodeMath - copied from MS Word) to code",
    category: AmendmentCategories.WordEquations,
    inputType: "Equation",
    operation: toMath
}

function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

const transposeMatrix: AmendmentModule = {
    name: "Transpose Matrix",
    repr: "transpose-matrix",
    description: "Transposes a Microsoft Word Equation Editor Matrix. You may paste the entire Matrix, but the brackets for the matrix may not be (circular parenthesis), and the matrix may not contain nested matrices. The Matrix will always be output inside [square brackets]."
    ,
    category: AmendmentCategories.WordEquations,
    inputType: "Equation",
    operation: (text) => {
        const firstBracket = text.indexOf("(");
        const lastBracket = text.lastIndexOf(")");
        if (firstBracket === -1 || lastBracket === -1) {
            return `Invalid input: ${firstBracket}, ${lastBracket} | ${text}`;
        }
        const matrixText = text.slice(firstBracket + 1, lastBracket);
        console.log(matrixText);
        const mtmt = matrixText.split("@").map(line => line.split("&"));
        const mtmtTransposed = transpose(mtmt);
        const tpAsString = mtmtTransposed.map(nl => nl.join("&")).join("@");
        return `[■(${tpAsString})]`
    }
}


const wordMatrixToCode: AmendmentModule = {
    name: "Matrix to code",
    repr: "matrix-to-code",
    description: "Converts a Matrix in MS Word Format to code. You may paste the entire Matrix, but the brackets for the matrix may not be (circular parenthesis), and the matrix may not contain nested matrices",
    category: AmendmentCategories.WordEquations,
    inputType: "Equation",
    operation: (text) => {

        /*
        [■(1&2&3@4&5&6@7&8&9)]
        34s/(26a+16b+14c)
         */
        const firstBracket = text.indexOf("(");
        const lastBracket = text.lastIndexOf(")");
        if (firstBracket === -1 || lastBracket === -1) {
            return `Invalid input: ${firstBracket}, ${lastBracket} | ${text}`;
        }
        const matrixText = text.slice(firstBracket + 1, lastBracket);
        console.log(matrixText);
        const mtmt = matrixText.split("@").map(line => line.split("&").map(toMath));

        return JSON.stringify(mtmt).replaceAll('"', "");
    }
}


const tsvToCsv: AmendmentModule = {
    name: "TSV to CSV",
    repr: "tsv-to-csv",
    description: "Converts Tab-Seperated-Value files into CSV files. This assumes that no cell contains commas.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        return text.replaceAll("\t", ",");
    }
}

const csvToTsv: AmendmentModule = {
    name: "CSV to TSV",
    repr: "csv-to-tsv",
    description: "Converts Comma-Seperated-Value files into Tab-separate-value strings. This assumes that no cell contains commas.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        return text.replaceAll(",", "\t");
    }
}

function toNumberBooleanOrString(s: string) {
    const trimmed = s.trim();
    if (s === "") {
        return null;
    }
    if (trimmed.toLowerCase() === "true") {
        return true;
    }
    if (trimmed.toLowerCase() === "false") {
        return false;
    }
    const numberAttempt = Number(trimmed);
    if (!isNaN(numberAttempt)) {
        return numberAttempt
    }
    return trimmed;
}


function csvToList(text: string) {
    return text.split("\n").map(sp => sp.split(",").map(s => {
        return s.trim()
    }));
}

function listToCSV(text: (string | number | boolean | undefined | null)[][]): string {
    const csv = text.map(row => row.join(","));
    return csv.join("\n");
}


function csvToJson(text: string) {
    text = text.trim();
    const arr = text.split("\n").map(sp => sp.split(",").map(s => {
        return s.trim()
    }));
    const obj: { [key: string]: string | boolean | number | null } = {};
    for (const row of arr) {
        obj[row[0]] = toNumberBooleanOrString(row[1]);
    }
    return JSON.stringify(obj);
}

const csvToJsonKeysBlankNull: AmendmentModule = {
    name: "CSV to JSON Blank Null",
    repr: "csv-to-json",
    description: "Converts a specific CSV format into JSON. First column are the keys, second column are the values. The keys will always be treated as strings. Number conversions will happen if possible. If the string is TRUE or FALSE (case-insensitive), it will be converted to a boolean. Blank values will be set to null. All keys and values are trimmed before processing.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        return csvToJson(text);
    }
}

const tsvToJsonKeysBlankNull: AmendmentModule = {
    name: "TSV to JSON Blank Null",
    repr: "tsv-to-json",
    description: "Converts a specific TSV format into JSON. First column are the keys, second column are the values. The keys will always be treated as strings. Number conversions will happen if possible. If the string is TRUE or FALSE (case-insensitive), it will be converted to a boolean. Blank values will be set to null. All keys and values are trimmed before processing.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        return csvToJson(text.replaceAll("\t", ","));
    }
}


const csvToJsonKeys: AmendmentModule = {
    name: "CSV to JSON Strings only",
    repr: "csv-to-json-strings",
    description: "Converts a specific CSV format into JSON. First column are the keys, second column are the values. Everything will remain a string.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        text = text.trim();
        const arr = text.split("\n").map(sp => sp.split(",").map(s => {
            return s.trim()
        }));
        const obj: { [key: string]: string } = {};
        for (const row of arr) {
            obj[row[0]] = (row[1]);
        }
        return JSON.stringify(obj);
    }
}

const spaceToTabs: AmendmentModule = {
    name: "Space to Tabs",
    repr: "space-to-tabs",
    description: "Any run of spaces more than 4 long gets changed to one tab",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        return text.replace(/ {4,}/g, '\t');
    }
}

const stripLeadingSpaces: AmendmentModule = {
    name: "Strip Leading and Trailing Spaces",
    repr: "strip-leading-spaces",
    description: "Run str.strip (trim) on each line",
    category: AmendmentCategories.Strings,
    operation: (text) => {
        return text.split("\n").map(t => t.trim()).join("\n");
    }
}

const strip: AmendmentModule = {
    name: "Strip",
    repr: "strip",
    description: "str.strip() (or trim in Java/JS)",
    category: AmendmentCategories.Strings,
    operation: (text) => {
        return text.trim();
    }
}


function findIndices<T>(list: T[], predicate: (value: T) => boolean): number[] {
    const indices: number[] = [];
    for (let i = 0; i < list.length; i++) {
        if (predicate(list[i])) {
            indices.push(i);
        }
    }
    return indices;
}


const selectFromCSV: AmendmentModule = {
    name: "Remove TEMP and blank columns from CSV",
    repr: "select-from-csv",
    description: "Removes all columns with a header starting with TEMP (case sensitive)",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        const csvData = csvToList(text);
        if (csvData.length === 0) {
            return "Invalid input";
        }
        const header = csvData[0];
        const indices = findIndices(header, (t) => t.trim() === "" || t.startsWith("TEMP"));
        const filteredCSV = csvData.map((sl) => sl.filter((_, index) => !indices.includes(index)));
        return listToCSV(filteredCSV);
    }
}


const extractNumberFromCsv: AmendmentModule = {
    name: "Extract Number From CSV",
    repr: "extract-number-from-csv",
    description: "Given a CSV, replace all cells with the first \"number\" present in that cell, if any of them contain text. For example, if a cell contained \"val = 333\", this should change the cell to just 333.",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        function findFirstNumber(str: string): string {
            const match = str.match(/-?\d+(\.\d+)?/);
            return match ? match[0] : "";
        }

        return text.split("\n").map(t => t.split(",").map(v => findFirstNumber(v)).join(",")).join("\n");
    }
}

const toGitBash: AmendmentModule = {
    name: "To Git Bash Path",
    repr: "git-bash-2",
    description: "Converts a Windows file path to a Git bash file path",
    category: AmendmentCategories.Paths,
    operation: (text) => {
        const t1 = text.replaceAll("\\", "/");
        return t1.replace("C:", "/c");
    }
}

const toWSLPath: AmendmentModule = {
    name: "To WSL Path",
    repr: "wsl-path-2",
    description: "Converts a Windows file path to a Git bash file path",
    category: AmendmentCategories.Paths,
    operation: (text) => {
        const t1 = text.replaceAll("\\", "/");
        return t1.replace("C:", "/mnt/c");
    }
}


const stripSurroundingQuotes: AmendmentModule = {
    name: "Strip surrounding quotes",
    repr: "Strip surrounding quotes",
    description: "Strip surrounding quotation marks, single or double quotes",
    category: AmendmentCategories.Strings,
    operation: (text) => {
        return text.replace(/^['"]+|['"]+$/g, '');
    }
}


const thisPCFoldersAccessToFullPath: AmendmentModule = {
    name: "This PC Folders to Full Path",
    repr: "Strip surrounding quotes",
    description: "Appends the full Windows path to folders in THIS PC: 3D Objects, Desktop, Documents, Downloads, Music, Pictures, Videos",
    category: AmendmentCategories.Paths,
    operation: (text) => {
        const targetFolders = ["3D Objects", "Desktop", "Documents", "Downloads", "Music", "Pictures", "Videos"];
        for (const tf of targetFolders) {
            if (text.startsWith(tf)) {
                text = text.replace(tf, `C:\\Users\\%USERNAME%\\${tf}`)
            }
        }
        return text;
    }
}

const extAmendmentModules: AmendmentModule[] = ["csv", "json", "md", "html", "tex"].map(ext => {
    return {
        name: `.${ext}`,
        repr: `${ext}-ext`,
        description: `Changes the download format to .${ext}`,
        category: AmendmentCategories.ForceExtension,
        operation: (text) => {
            return text
        }
    }
})

const removeDuplicatesFromList: AmendmentModule = {
    name: "Remove Duplicates",
    repr: "dupe-remover",
    description: "Given a list of strings delimited by a newline, remove duplicates and preserve order otherwise",
    category: AmendmentCategories.Strings,
    operation: (text: string) => {
        const strs = text.split("\n");
        const uniqueStrings = strs.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        return uniqueStrings.join("\n");
    }
}

const toMarkdownTable: AmendmentModule = {
    name: "To Markdown Table",
    repr: "md-tbl",
    description: "Converts a CSV to a Markdown table",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        const arr = csvToList(text);
        const maxLength = Math.max(...arr.map(subArr => subArr.length));
        let table = '';
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            for (let j = row.length; j < maxLength; j++) {
                row.push('');
            }
            table += '| ' + row.join(' | ') + ' |\n';
            if (i === 0) {
                table += '| ' + '--- |'.repeat(maxLength) + '\n';
            }
        }
        return table;
    }
}
const toLaTeXTable: AmendmentModule = {
    name: "To LaTeX Table",
    repr: "tex-tbl",
    description: "Converts a CSV to a LaTeX table",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        const arr = csvToList(text);
        const maxLength = Math.max(...arr.map(subArr => subArr.length));
        let table = '\\begin{tabular}{' + 'c '.repeat(maxLength) + '}\n';
        for (let i = 0; i < arr.length; i++) {
            const row = arr[i];
            for (let j = row.length; j < maxLength; j++) {
                row.push('');
            }
            table += row.join(' & ') + ' \\\\\n';
            if (i === 0) {
                table += '\\hline\n';
            }
        }
        table += '\\end{tabular}';
        return table;
    }
}


function nanToDefault(num: number, default2: number) : number {
    if (isNaN(num)){
        return default2;
    }
    return num;
}

const csvToJSONRows: AmendmentModule = {
    name: "CSV to JSON Rows",
    repr: "csv-to-json-real",
    description: "Convert a CSV to a JSON, each element is a row. Must have a header. The first actual row determines the types, which is inferred",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const types = lines[1].split(',').map(item => isNaN(Number(item)) ? 'string' : 'number');
        const json = [];

        for (let i = 1; i < lines.length; i++) {
            const obj: { [key: string]: string | boolean | number | null } = {};
            const currentline = lines[i].split(',');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = types[j] === 'number' ? nanToDefault(parseFloat(currentline[j]), 0) : currentline[j];
            }

            json.push(obj);
        }

        return JSON.stringify(json);
    }
}


const json2DListToCSV: AmendmentModule = {
    name: "JSON 2D list to CSV",
    repr: "json-2d-csv",
    description: "Converts a 2D JSON array to a CSV",
    category: AmendmentCategories.CSV,
    operation: (text) => {
        const jsonStr = text;
        let data;
        try {
            data = JSON.parse(jsonStr) as string[][];
        } catch (e) {
            return ("Invalid JSON");
        }

        if (!Array.isArray(data) || !data.every(Array.isArray)) {
            return ("Not a 2D array");
        }

        const maxCols = Math.max(...data.map(row => row.length));

        return data.map(row => {
            const newRow = row.slice();
            while (newRow.length < maxCols) {
                newRow.push("");
            }
            return newRow.join(",");
        }).join("\n");

    }
}



export const amendmentModules: AmendmentModule[] = [
    textToList, numbersToList, toUnixPath, toWindowsPath, toGitBash, toWSLPath, thisPCFoldersAccessToFullPath, stripSurroundingQuotes, toUpper,
    literalToString, stringToLiteral, removeDuplicatesFromList, stringCounter, toMathAM, wordMatrixToCode, fixUnicodeEquations,
    transposeMatrix, tsvToCsv, csvToTsv, tsvToJsonKeysBlankNull, csvToJsonKeysBlankNull, csvToJsonKeys, spaceToTabs, stripLeadingSpaces, extractNumberFromCsv,
    pandocMarkdownToHTML, strip, selectFromCSV, toMarkdownTable, toLaTeXTable,csvToJSONRows,
    align, plusMinus, fakeListToList, json2DListToCSV,
    pdfNewlineRemover, softWrapper, ...extAmendmentModules
];