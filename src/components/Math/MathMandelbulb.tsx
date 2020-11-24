import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MathMandelbulb = () => {

    const ctxRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        initViewport();
    })

    const initViewport = () => {
        
        const calculateMandlebulb = () => {
            const positions: number[] = [];
            const colors   : number[] = [];

            return [positions, colors];
        }

    }

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default MathMandelbulb;