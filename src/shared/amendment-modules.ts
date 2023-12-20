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
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {
        return text.replaceAll("\\", "/");
    }
}

const toWindowsPath: AmendmentModule = {
    name: "Windows Path",
    repr: "windows-path",
    description: "text.replace(\"/\", R\"\\\")",
    category: AmendmentCategories.Strings,
    inputType: "Text",
    operation: (text) => {
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


export const amendmentModules: AmendmentModule[] = [
    pandocMarkdownToHTML,
    align, plusMinus, fixUnicodeEquations,
    fakeListToList,
    pdfNewlineRemover, softWrapper,
    textToList, numbersToList, toUpper, toUnixPath, toWindowsPath,
    literalToString, stringToLiteral, stringCounter
];