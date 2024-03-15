import {AmendmentCategoryHolder, AmendmentModule} from "../../shared/interfaces.ts";
import {groupIntoCategories} from "../../shared/group-categories.ts";
import {useMemo, useReducer, useState} from "react";
import {Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import './styles.css';
interface Props {
    modules: AmendmentModule[];
    onSelect: (_module: AmendmentModule) => void;
}

type ACH2 = {
    holder: AmendmentCategoryHolder;
    open: boolean;
}

function ModuleSelector(props: Props) {
    const grouped = useMemo(() => groupIntoCategories(props.modules), [props.modules]);
    const [holder,] = useState(grouped.map(g => {
            return {holder: g, open: false} as ACH2
        })
    );
    const [, forceUpdate] = useReducer(x => x + 1, 0);


    // console.log("RERENDER", holder);
    return (
        <>
            <List >
                <ListSubheader>
                    Operations
                </ListSubheader>

                {holder.map((item, _index) => (<div key={item.holder.category}>
                    <ListItemButton onClick={() => {
                        item.open = !item.open;
                        forceUpdate();
                    }}>

                        <ListItemText primary={item.holder.category}

                        />
                        {item.open ? <ExpandLess/> : <ExpandMore/>}


                    </ListItemButton>
                    <Collapse
                        in={item.open} timeout="auto" unmountOnExit>
                        {
                            item.holder.modules.map((item, _index) => (
                                <div key={item.repr}>
                                    <List component="div" disablePadding>
                                        <ListItemButton sx={{pl: 4}}
                                                        onClick={() => {
                                                            props.onSelect(item);
                                                        }}
                                        >
                                            <ListItemText primary={item.name}/>

                                            <Tooltip placement="top-end" title={item.description}>

                                                <ListItemIcon>
                                                    <HelpOutlineIcon/>
                                                </ListItemIcon>


                                            </Tooltip>


                                        </ListItemButton>
                                    </List>
                                </div>
                            ))
                        }
                    </Collapse>
                </div>))}
            </List>

        </>
    );
}

export default ModuleSelector;