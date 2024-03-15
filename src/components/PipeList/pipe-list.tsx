import {StringPipe} from "../../shared/string-pipe.ts";
import {IconButton, List, ListItem, ListItemText, ListSubheader} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    stringPipe: StringPipe;
    delItemFromPipe: (_idx: number) => void;
}

function PipeList({stringPipe, delItemFromPipe}: Props) {
    // console.log("Rerendering string pipe");
    return (
        <>
            <List

            >
                <ListSubheader>
                    Current pipe
                </ListSubheader>

                {stringPipe.modules.length === 0 ? <>

                </> : <></>}

                {stringPipe.modules.map((m, idx) =>
                    (<ListItem key={idx}
                               secondaryAction={
                                   <IconButton edge="end" aria-label="delete"
                                               onClick={() => delItemFromPipe(idx)}
                                   >
                                       <DeleteIcon/>
                                   </IconButton>
                               }

                    >

                        <ListItemText primary={m.name}>

                        </ListItemText>

                    </ListItem>))}
            </List>
        </>
    )
}


export default PipeList;