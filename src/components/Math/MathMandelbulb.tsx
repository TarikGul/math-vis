import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

import * as MBROT from '../../types/MandelbulbTypes';

/**
 * 
 * References!
 * https://github.com/royvanrijn/mandelbulb.js/blob/master/mandelbulb.js
 * http://bugman123.com/Hypercomplex/
 * https://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
 * http://www.alenspage.net/ComplexNumbers.htm#:~:text=In%20the%203%2Ddimensional%20complex,and%20the%20i%2Cj%20plane.
 */

const MathMandelbulb = (props: { active: boolean }) => {

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
        new THREE.WebGLRenderer({ antialias: true })
    );

    const [isOpened, setIsOpened] = useState<boolean>(false);

    useEffect(() => {
        if (props.active) {
            setTimeout(() => {
                setIsOpened(true)
                initViewport();
            }, 300);
        } else {
            cancelVis();
        }
    }, [props.active]);

    const calculateMandlebulb = (pos: MBROT.MandelbulbComplexSet): [number[], boolean] => {
        let x0: number = pos.x, 
            y0: number = pos.y, 
            z0: number = pos.z,
            n0: number = 0;

        let n    : number = 8, 
            x    : number = 0,
            y    : number = 0,
            z    : number = 0;

        let color: number[] = [];

        for(let i = 0; i < 32; i++) {
            let r    : number,
                theta: number,
                phi  : number;

            r     = Math.sqrt(x*x + y*y + z*z);
            theta = Math.atan2(Math.sqrt(x*x + y*y), z);
            phi   = Math.atan2(y, x);

            x = r**n * Math.sin(theta*n) * Math.cos(phi*n) + x0;
            y = r**n * Math.sin(theta*n) * Math.sin(phi*n) + y0;
            z = r**n * Math.cos(theta*n) + z0;

            n0 += 1;         

            if((x**2 + y**2 + z**2) > 2) break;
        }

        let random: number = Math.floor(Math.random() * 80) + 40;

        // Random assortement of blue
        color.push(170);
        color.push(random);
        color.push(random);
        
        return [color, n0 === 32]
    }

    const mapMandelbulb = (): [number[], any[]] => {
        let complex : MBROT.MandelbulbComplexSet,
            curColor: string;

        const positions: number[] = [];

        const colors: any[] = [
            0x000, 0xc16fda, 0x9a58d4, 0xa75fd6,
            0xb567d8, 0x8b51d1, 0x5b3bcb, 0x6c42cd,
            0x7c49cf, 0x212fc2, 0x2729c4, 0x382ec6,
            0x4a34c8, 0x1a36bf, 0x0e46bb, 0x143dbd,
            0xe38fdd, 0xcc77dd, 0xd77fdf, 0xe187e1,
            0xecb2d6, 0xe698da, 0xe8a1d8, 0xeaa9d6,
            0xf5d7e1, 0xefbbd7, 0xf1c4d9, 0xf3cedc,
            0xffffff, 0xf8e1e6, 0xfaebed, 0xfcf4f5,
        ];

        const color = new THREE.Color();

        let ymax: number = window.innerHeight - (window.innerHeight / 15),
            xmax: number = window.innerWidth  - (window.innerWidth  / 15),
            xmin: number = (window.innerWidth  / 15),
            ymin: number = (window.innerHeight / 15);
        // let p = 50;
        for (let p = -200; p < 200; p+=2) { // this is our z values

            //Iterating through each pixel
            for (let i = xmin; i < xmax; i+= 2) { // original iterator i++
                for (let j = ymin; j < ymax; j += 1) { // original iterator j++

                    let z: number = p < 0 ? (p / 200.0) * -1 : p / 200.0;

                    complex = {
                        // Original multplication values x -> 4.0 y -> 4.0
                        x: 3.0 * (i - (window.innerWidth  /2.0)) / window.innerWidth,
                        y: 3.0 * (j - (window.innerHeight /2.0)) / window.innerHeight,
                        z: z
                    }

                    const [m, isMandelbulb] = calculateMandlebulb(complex);

                    if(isMandelbulb) {
                        positions.push(i, j, p);
                        curColor = `rgb(${m[0]},${m[1]},${m[2]})`;
                        color.set(curColor);
                        colors.push(color.r, color.g, color.b);
                    }
                }
            }
        }
        return [positions, colors];
    }

    const initViewport = (): void => {
        /**
         * TYPES
         * Need to abstract these and put them into a Types file
         */
        let camera  : any = camRef.current,
            scene   : any = sceRef.current,
            renderer: any = renRef.current,
            points  : any;
        
        
        // Init the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xB57C7C);

        // Setup camera -> Canvas
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 550;
        
        // Init our buffer
        const geometry = new THREE.BufferGeometry();

        // Retrieve our postions and colors
        const [positions, colors] = mapMandelbulb();

        // Init Aesthetics
        const material = new THREE.PointsMaterial({ size: 0.011, vertexColors: true });
        const light    = new THREE.AmbientLight(0x404040);

        // Store Buffer information
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        // Wrap up initializing geometrys and set reference
        geometry.computeBoundingSphere();
        geometry.center();
        geoRef.current = geometry;

        // Wrap up initializing Points and set reference
        points = new THREE.Points(geometry, material);
        points.frustumCulled = false;
        poiRef.current = points;

        // Init scene
        scene.add(light)
        scene.add(points);

        // Init Renderer
        renderer = new THREE.WebGLRenderer({ antialias: false });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create Canvas
        document.body.appendChild(renderer.domElement);

        // Keeps canvas responsive
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        });

        // This will be our animation frame function
        let animate = function () {
            reqRef.current = requestAnimationFrame(animate);
            render()
        };

        function render() {

            // Rotate and Re-Render
            points.rotation.x += 0.002;
            points.rotation.y += 0.002;
            renderer.render(scene, camera);
        }
        animate();
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
        <div ref={ctxRef}>
            
        </div>
    )
}

export default MathMandelbulb;