import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';

import MathDonut from '../Math/MathDonut';
import MathDefaultBox from '../Math/MathDefaultBox';
import MathMandelbulb from '../Math/MathMandelbulb';

const Viewport = (props: {selectedVis: string}) => {

    const [localState, setLocalState] = useState(props.selectedVis);

    useEffect(() => {
        if (props.selectedVis !== localState) {
            setLocalState(props.selectedVis);
        }
    }, [props.selectedVis]);
    
    const donutActive = (activeVis: string) => {
        return activeVis === 'torus';
    }
    
    const defaultActive = (activeVis: string) => {
        return activeVis === 'default';
    }
    
    const MandelbulbActive = (activeVis: string) => {
        return activeVis === 'mandelbulb';
    }

    return (
        <div>
            <MathDefaultBox active={defaultActive(localState)}/>
            <MathDonut active={donutActive(localState)}/>
        </div>
    )
}

export default Viewport;