import React, { useState } from 'react';

// import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import '../../styles/Console.scss';

const Console = (props: { setSelectedVis: any }) => {
    const [selected, setSelected] = useState<string>('default');

    const update = (e: any) => {
        setSelected(e.currentTarget.value);
        props.setSelectedVis(e.currentTarget.value);
    }

    return (
        <div className='console-wrapper'>
            <div className="icon icon-expand"> 
                {/* <FontAwesomeIcon icon={faBars} /> */}
            </div>
            <select value={selected} onChange={(e) => update(e)}>
                <option value="default">Box</option>
                <option value="torus">Torus</option>
                <option value="mandelbulb">Mandelbulb</option>
            </select>
        </div>
    )
}

export default Console;