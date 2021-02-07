import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

// Types 
import * as MBROT from '../../types/MandelbrotTypes';
import { HexBase64BinaryEncoding, HexBase64Latin1Encoding } from 'crypto';

const MathMandelbrot = (props: { active: boolean }) => {

    const MAX_ITERATION: number = 100;
    const REAL_SET     : MBROT.MandelbrotStartEnd = { start: -2, end: 1 };
    const IMAGINARY_SET: MBROT.MandelbrotStartEnd = { start: -1, end: 1 };

    // Request animation ref
    const reqRef = useRef<any>();
    // Scene ref
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    // Geometry buffer ref
    const geoRef = useRef<THREE.BufferGeometry | null>(null);
    // Context ref 
    const ctxRef = useRef<HTMLHeadingElement   | null>(null);
    // Points ref
    const poiRef = useRef<THREE.Points | THREE.Object3D>(new THREE.Points());
    // Camera ref
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    // Renderer ref
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer()
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

    const mapMandelbrot = (): [number[], any[]] => {
        let complex : MBROT.MandelbrotComplexSet,
            curColor: string;

        const positions: number[] = [];
        
        const colors: any[] = [
            0x000,    0xc16fda, 0x9a58d4, 0xa75fd6, 
            0xb567d8, 0x8b51d1, 0x5b3bcb, 0x6c42cd, 
            0x7c49cf, 0x212fc2, 0x2729c4, 0x382ec6, 
            0x4a34c8, 0x1a36bf, 0x0e46bb, 0x143dbd,
            0xe38fdd, 0xcc77dd, 0xd77fdf, 0xe187e1,
            0xecb2d6, 0xe698da, 0xe8a1d8, 0xeaa9d6,
            0xf5d7e1, 0xefbbd7, 0xf1c4d9, 0xf3cedc,
            0xffffff, 0xf8e1e6, 0xfaebed, 0xfcf4f5,
        ];

        const color = new THREE.Color();

        // Iterate through each pixel on the Canvas, and evalute if that pixels 
        // sits within out complex plane/Mandelbrot set
        for (let i = 0; i < window.innerWidth; i++) {
            for (let j = 0; j < window.innerHeight; j++) {
                complex = {
                    x: REAL_SET.start + (i / window.innerWidth) * (REAL_SET.end - REAL_SET.start),
                    y: IMAGINARY_SET.start + (j / window.innerHeight) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
                }

                const [m, isMandelbrotSet]: any = calculateMandelbrot(complex);

                if (m >= 3.5) {
                    positions.push(i, j, 0);
                    curColor = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1]
                    color.set(curColor);
                    colors.push(color.r, color.g, color.b);
                }
            }
        }
        return [positions, colors];
    }

    const initViewport = (): void => {
        /**
         * TYPES
         */

        let camera  : any = camRef.current,
            scene   : any = sceRef.current,
            renderer: any = renRef.current,
            points  : any;

        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xB57C7C);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 650;

        // Init our buffer
        const geometry = new THREE.BufferGeometry();

        // Retrieve positions and colors for Buffer
        const [positions, colors] = mapMandelbrot();

        // Init Render Aesthetics
        const material = new THREE.PointsMaterial({ size: 1, vertexColors: true });

        // Store Buffer information
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Wrap up initializing geometrys and set ref 
        geometry.center()
        geoRef.current = geometry;

        // Wrap up initializing Points and set ref
        points = new THREE.Points(geometry, material);
        poiRef.current = points;

        // Init Renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create Canvas
        document.body.appendChild(renderer.domElement);

        // Init Scene
        scene.add(points);
        renderer.render(scene, camera);

        // Keeps canvas responsive
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        });
    }

    const cancelVis = (): void => {
        if (isOpened) {
            // Stop requestAnimationFrame
            cancelAnimationFrame(reqRef.current);

            // Garbage Collection
            disposeHierarchy(sceRef.current, disposeNode);

            // Renderer cleanup
            renRef.current.dispose();

            // Remove scene
            sceRef.current.remove(poiRef.current);

            // Retrieve HtmlCollection of canvas's
            let canvas = document.getElementsByTagName('CANVAS');

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