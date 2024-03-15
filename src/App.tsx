import {ChangeEvent, Fragment, ReactNode, SyntheticEvent, useState} from 'react'
import './App.css'
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    Tooltip
} from "@mui/material";
import {amendmentModules} from "./shared/amendment-modules.ts";
import CodeBlock from "./components/CodeBlock";
import {AmendmentModule} from "./shared/interfaces.ts";
import {StringPipe} from "./shared/string-pipe.ts";
import PipeList from "./components/PipeList/pipe-list.tsx";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


// function groupIntoCategories(modules: AmendmentModule[]): AmendmentCategoryHolder[] {
//     return Object.keys(AmendmentCategories).map(category => {
//         return {
//             category: category,
//             modules: modules.filter(module => module.category === category)
//         }
//     })
// }


function App() {
    const [open, setOpen] = useState(false);

    const copyMe = () => {
        setOpen(true);
    };

    const [stringPipe, _] = useState(new StringPipe(amendmentModules));


    const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const [selectedModule, setSelectedModule] = useState<AmendmentModule>(amendmentModules[0]);


    const optionPrompt = "Option";
    const [output, setOutput] = useState<string>("No output yet.");
    const [input, setInput] = useState<string>("");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleChange = (event: SelectChangeEvent, _child: ReactNode) => {
        const me = event.target.value;
        const curAmendmentModule = amendmentModules.find(item => {
            return item.repr === me;
        });
        if (curAmendmentModule) {
            setSelectedModule(curAmendmentModule);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleClick07 = () => {
        const newTextValue = selectedModule.operation(input);
        setOutput(newTextValue);

    }

    const action = (
        <Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                CLOSE
            </Button>
        </Fragment>
    );


    return (
        <>
            <h1>Text Amender 2.0</h1>
            <div>


                <PipeList stringPipe={stringPipe}>

                </PipeList>

                <FormControl>
                    <Box sx={{
                        display: "flex", flexDirection: "column", gap: "1em",

                    }}>
                        <FormControl>
                            <InputLabel id="dropdown-label"> {optionPrompt} </InputLabel>
                            <Select
                                label={optionPrompt}
                                labelId="dropdown-label"
                                id="dropdown"
                                value={selectedModule.repr}
                                onChange={handleChange}
                                MenuProps={MenuProps}
                            >
                                {amendmentModules.map(item => {
                                    return <MenuItem key={item.repr} value={item.repr}>
                                        {item.name}
                                    </MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                        <TextField
                            id="outlined-multiline-flexible"
                            label={selectedModule.inputType}
                            multiline
                            maxRows={12} // You can adjust the number of rows as needed
                            fullWidth
                            value={input}
                            onChange={handleInputChange}
                        />

                        <Button variant={"contained"} onClick={handleClick07}
                                style={{minWidth: "310px"}}
                        >
                            Process me!
                        </Button>

                        <Box sx={{display: "flex", flexDirection: "row", gap: "1em", justifyContent: "center"}}>

                            <Tooltip
                                placement={"left"}
                                title={"Copy to clipboard"}
                            ><Button variant={"outlined"} onClick={() => {
                                navigator.clipboard.writeText(output).then(() => {
                                    copyMe();
                                    console.log("Copied!");


                                }).catch(() => {
                                    console.log("I couldn't copy it!");
                                });
                            }}>
                                Copy
                            </Button></Tooltip>
                            <Tooltip
                                placement={"right"}
                                title={"Copy to input"}><Button variant={"outlined"} onClick={() => {
                                setInput(output);
                            }}>
                                Pipe
                            </Button></Tooltip>

                        </Box>
                        <CodeBlock>
                            {output}
                        </CodeBlock></Box>

                </FormControl>

            </div>
            <div className={"center-me"}><p className="read-the-docs">
                {selectedModule.description}
            </p></div>

            {/*<p className="read-the-docs">*/}
            {/*    Text Amender is a tool that processes raw text programmatically, all online.*/}
            {/*</p>*/}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Copied"
                action={action}
            />
        </>
    )
}

export default App
