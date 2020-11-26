import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

/**
 * 
 * References!
 * https://github.com/royvanrijn/mandelbulb.js/blob/master/mandelbulb.js
 * http://bugman123.com/Hypercomplex/
 * https://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
 */

const MathMandelbulb = (props: { active: boolean }) => {

    const ITERATIONS    : number =  200.0;
    const POWER         : number =    8.0;
    const DEPTH_OF_FIELD: number =   25.0;

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
        if (props.active) {
            initViewport();
        } else {
            cancelVis();
        }
    }, [props.active]);

    const calculateMandlebulb = (pos: number[]) => {
        const color = new THREE.Color();

        let sinTheta : number,
            theta    : number,
            phi      : number,
            zr       : number,   
            dr       : number,
            r        : number,
            z        : number[] = [0.0, 0.0, 0.0],
            positions: number[] = [],
            colors   :    any[] = [];

        // Update Z
        setTo(z, pos);


        dr = 1.0;
        r  = 0.0;
        for (let i = 0; i < ITERATIONS; i++) {
            r = length(z);

            if (r > DEPTH_OF_FIELD) break;

            theta    = Math.acos(z[2] / r);
            phi      = Math.atan2(z[1], z[0]);
            dr       = Math.pow(r, POWER - 1.0) * POWER * dr + 1.0;
            zr       = Math.pow(r, POWER);
            theta    = theta * POWER;
            phi      = phi * POWER;
            sinTheta = Math.sin(theta);
            z[0]     = sinTheta * Math.cos(phi);
            z[1]     = Math.sin(phi) * sinTheta;
            z[2]     = Math.cos(theta);

            positions.push(z[0], z[1], z[2]);

            Math.floor(Math.random() * Math.floor(255));

            color.setRGB(0, 0, 0);
            colors.push(color.r, color.g, color.b);
        }
        // return 0.5 * Math.log(r) * r / dr;
        return [positions, colors];
    }

    const initViewport = () => {
        let camera  : any = camRef.current,
            scene   : any = sceRef.current,
            renderer: any = renRef.current,
            points  : any;
        
        let positions: number[] = [];
        let colors   :    any[] = [];
        
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xB57C7C);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;
        
        const geometry = new THREE.BufferGeometry();

        let w = [-1.6905239445560225, 1.2500000000000002, -0.5168450375912946];

        // for(let i = 0; i < ITERATIONS; i++) {
            let result: any = calculateMandlebulb(w);

            // Push to positions, which will be used in BufferGeometry
            // positions.push(result[0], result[1], result[2])

            // setNewVector(w, result);
        // }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(result[0], 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(result[1], 3))
        geometry.computeBoundingSphere();

        const material = new THREE.PointsMaterial({ size: 0.011, vertexColors: true });
        const light = new THREE.AmbientLight(0x404040);

        geometry.center()

        geoRef.current = geometry;

        points = new THREE.Points(geometry, material);

        points.frustumCulled = false;
        poiRef.current = points;
        scene.add(light)
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        let animate = function () {
            requestAnimationFrame(animate);
            render()
        };
        function render() {

            // w[0] += -0.00001;
            // w[1] +=  0.00001;

            // // w[0] += -0.000000000000001;
            // // w[1] +=  0.000000000000001;
            // // w[2] += -0.000000000000001;

            w[0] += -0.0000000000000005;
            w[1] +=  0.0000000000000005;
            w[2] +=  0.0000000000000005;

            let newResult    = calculateMandlebulb(w);
            let newPositions =  newResult[0];
            let newColors    =  newResult[1];

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3));
            renderer.render(scene, camera);
        }
        animate();
    }

    const cancelVis = () => {
        if (isOpened) {
            // Stop requestAnimationFrame
            cancelAnimationFrame(reqRef.current);

            // Garbage Collection
            disposeHierarchy(sceRef.current, disposeNode);

            // Renderer cleanup
            renRef.current.dispose();

            // Remove scene
            sceRef.current.remove(poiRef.current)

            // Retrieve HtmlCollection of canvas's
            let canvas = document.getElementsByTagName('CANVAS')

            // Remove all canvas elements
            for (let i = 0; i < canvas.length; i++) {
                canvas[0].remove();
            }

            setIsOpened(false);
        }
    }

    const setNewVector = (v1: number[], v2: number[]) => {
        v1[0] = v2[0];
        v1[1] = v2[1];
        v1[2] = v2[2];
    }

    function length(z: any) {
        return Math.sqrt(z[0] * z[0] + z[1] * z[1] + z[2] * z[2]);
    }

    function scalarMultiply(a: any, amount: any) {
        a[0] *= amount;
        a[1] *= amount;
        a[2] *= amount;
        return a;
    }

    function setTo(v1: any, v2: any) {
        v1[0] = v2[0];
        v1[1] = v2[1];
        v1[2] = v2[2];
        return v1;
    }


    return (
        <div ref={ctxRef}>
            
        </div>
    )
}

export default MathMandelbulb;