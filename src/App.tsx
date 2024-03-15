import {ChangeEvent, Fragment, SyntheticEvent, useReducer, useState} from 'react'
import './App.css'
import {Box, Button, FormControl, Grid, Snackbar, TextField, Tooltip, Typography} from "@mui/material";
import {amendmentModules} from "./shared/amendment-modules.ts";
import CodeBlock from "./components/CodeBlock";
import {AmendmentModule} from "./shared/interfaces.ts";
import {StringPipe} from "./shared/string-pipe.ts";
import PipeList from "./components/PipeList/pipe-list.tsx";
import ModuleSelector from "./components/ModuleSelector/module-selector.tsx";


function App() {
    const [open, setOpen] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const copyMe = () => {
        setOpen(true);
    };

    const [stringPipe,] = useState(new StringPipe([]));


    const handleClose = (_event: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const [selectedModule,] = useState<AmendmentModule>(amendmentModules[0]);

    const [output, setOutput] = useState<string>("No output yet.");
    const [input, setInput] = useState<string>("");


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleClick07 = () => {
        const newTextValue = stringPipe.processModule(input);
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
            <div className={"parent"}>
                <div className={"child"}>
                    <div>
                        <Grid item xs={12}><h1>Text Amender 2.1</h1></Grid>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}

                        >
                            <Grid container spacing={2}>

                                <Grid item md={4} xs={12}
                                    className={"scrollable-div"}
                                >
                                    <ModuleSelector modules={amendmentModules} onSelect={(_a) => {
                                        console.log("AMONG US");
                                        stringPipe.modules.push(_a);
                                        forceUpdate();
                                    }}>

                                    </ModuleSelector></Grid>

                                <Grid item md={2} xs={12} className={"scrollable-div"}><PipeList stringPipe={stringPipe}
                                                                    delItemFromPipe={(idx) => {
                                                                        stringPipe.modules.splice(idx, 1);
                                                                        forceUpdate();
                                                                    }}
                                >

                                </PipeList></Grid>

                                <Grid item md={4} xs={12}><FormControl className={"fc scrollable-div"}

                                                                       style={{width: "300px"}}
                                >
                                    <Box style={{"padding": "5px"}}
                                        sx={{
                                        display: "flex", flexDirection: "column", gap: "1em",


                                    }}>
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
                                                className={"process-me-button"}

                                        >
                                            Process me!
                                        </Button>

                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "1em",
                                            justifyContent: "center"
                                        }}>

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

                                </FormControl></Grid>


                                <Grid item xs={6}>
                                    <Typography className={"read-the-docs"}>                Text Amender is a tool that processes raw text programmatically, all online. Add something from the options to the pipe by clicking on it. When "process me" is clicked, the text is processed on every item in the pipe from top to bottom.
                                    </Typography>
                                </Grid>

                            </Grid>
                        </Box></div>


                </div>
                <div>


                </div>
            </div>


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
