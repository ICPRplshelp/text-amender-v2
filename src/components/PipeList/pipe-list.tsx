import {StringPipe} from "../../shared/string-pipe.ts";

interface Props {
    stringPipe: StringPipe;
}

function PipeList({stringPipe}: Props) {
    return (
        <>TEST
            <div>
                {stringPipe.modules.map(m =>
                    (<div id={m.repr}>{m.name}</div>))}
            </div>
        </>
    )
}


export default PipeList;