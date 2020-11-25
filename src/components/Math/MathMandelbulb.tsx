import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * 
 * References!
 * https://github.com/royvanrijn/mandelbulb.js/blob/master/mandelbulb.js
 * http://bugman123.com/Hypercomplex/
 * https://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
 */

const MathMandelbulb = (props: { active: boolean }) => {

    const ITERATIONS    : number = 20.0;
    const POWER         : number =    8;

    let z: number[] = [0.0, 0.0, 0.0];

    // Geometry buffer ref
    const geoRef = useRef<any>();
    // Request animation ref
    const reqRef = useRef<any>();
    // Points ref
    const poiRef = useRef<any>();
    // Context ref 
    const ctxRef = useRef<HTMLHeadingElement | null>(null);
    // Scene ref
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    // Camera ref
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    // Renderer ref
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true })
    );

    const [isOpened, setIsOpened] = useState<boolean>(false)

    useEffect(() => {
        console.log(calculateMandlebulb([0.1, 0.1, 0.1]))
        if (props.active) {
            initViewport();
        } else {
            // console.log(calculateMandlebulb([0, 0, 0]))
        }
    }, []);

    const calculateMandlebulb = (pos: number[]) => {
        let x    : number, 
            y    : number, 
            z    : number, 
            r    : number, 
            phi  : number, 
            theta: number;
        
        x = pos[0];
        y = pos[1];
        z = pos[2];

        // Trigonomic Execution of the next point in the mandelbulb

        // Polar Coordinates
        r     = Math.sqrt((x**2 + y**2 + x**2));
        theta = Math.acos(y/r);
        phi   = Math.atan(x/z);

        // Scale and rotate the point
        r     = Math.pow(r, POWER);
        theta = Math.pow(theta, POWER);
        phi   = Math.pow(phi, POWER);

        // convert back to cartesian coordinates
        x = r * Math.sin(theta) * Math.sin(phi);
        y = r * Math.cos(theta);
        z = r * Math.sin(theta) * Math.cos(phi);

        return [x, y, z] 
    }

    const initViewport = () => {
        let camera: any = camRef.current,
            scene: any = sceRef.current,
            renderer: any = renRef.current,
            points: any;
        
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xC4C4C4);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 15;

            const geometry = new THREE.BufferGeometry();

            // const mandelbulb = calculateMandlebulb()

            // Center it

            // set the geoRef

            // Set Points
    }

    return (
        <div ref={ctxRef}>
            
        </div>
    )
}

export default MathMandelbulb;