import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

// Types 
import * as MBROT from '../../types/MandelbrotTypes';

const MathMandelbrot = (props: { active: boolean }) => {

    const MAX_ITERATION = 80;
    const REAL_SET     : MBROT.MandelbrotStartEnd = { start: -2, end: 1 };
    const IMAGINARY_SET: MBROT.MandelbrotStartEnd = { start: -1, end: 1 };

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

    const [isOpened, setIsOpened] = useState<boolean>(false);

    useEffect(() => {
        if(props.active) {
            setTimeout(() => {
                setIsOpened(true)
                initViewport();
            }, 300);
        } else {
            cancelVis();
        }
    }, [props.active])

    const calculateMandelbrot = (c: MBROT.MandelbrotComplexSet) => {
        let z: MBROT.MandelbrotComplexSet = { x: 0, y: 0 }, 
            p: MBROT.MandelbrotComplexSet, 
            n: number = 0,
            d: number;
        
        do {

            p = {
                x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
                y: 2 * z.x * z.y
            }
            z = {
                x: p.x + c.x,
                y: p.y + c.y
            }
            d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2))
            n += 1

        } while (d <= 2 && n < MAX_ITERATION)

        return [n, d <= 2]
    }   

    const mapMandelbrot = () => {
        let complex: MBROT.MandelbrotComplexSet;

        const positions: number[] = [];
        const colors   : number[] = [];
        const color = new THREE.Color();

        for (let i = 0; i < window.innerWidth; i++) {
            for (let j = 0; j < window.innerHeight; j++) {
                complex = {
                    x: REAL_SET.start + (i / window.innerWidth) * (REAL_SET.end - REAL_SET.start),
                    y: IMAGINARY_SET.start + (j / window.innerHeight) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
                }

                const [m, isMandelbrotSet] = calculateMandelbrot(complex);
                if (isMandelbrotSet) {
                    positions.push(i, j, 0);
                    color.setRGB(255, 255, 255);
                    colors.push(color.r, color.g, color.b);
                }
            }
        }
        return [positions, colors];
    }

    const initViewport = () => {
        /**
         * TYPES
         */

        let camera: any = camRef.current,
            scene: any = sceRef.current,
            renderer: any = renRef.current,
            points: any;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xB57C7C);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 1000;

        const geometry = new THREE.BufferGeometry();

        const mandelbrot = mapMandelbrot();
        const positions  = mandelbrot[0];
        const colors     = mandelbrot[1];

        const material = new THREE.PointsMaterial({ size: 1, vertexColors: true });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        geoRef.current = geometry;

        geometry.center()

        points = new THREE.Points(geometry, material);

        poiRef.current = points;
        scene.add(points);

        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        renderer.render(scene, camera);
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

    return (
        <div>

        </div>
    )
}

export default MathMandelbrot;