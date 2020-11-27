import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

const MathDefaultBox = (props: { active: boolean }) => {

    const reqRef = useRef<any>();
    const cubRef = useRef<any>();
    const ctxRef = useRef<HTMLHeadingElement | null>(null);
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true })
    );

    const [isOpened, setIsOpened] = useState<boolean>(false)

    useEffect(() => {
        if (props.active) {
            setIsOpened(true);
            initViewPort();
        } else {
            cancelVis();
        }
    }, [props.active]);

    const initViewPort = () => {
        /**
         * TYPES
         * Need to abstract these and put them into a Types file
         */
        let scene = sceRef.current;
        let camera = camRef.current;
        let renderer = renRef.current;
        // Hard coded Cube route to create lines. 
        let squarePos: number[] = [
            0, 0, 1, 0, 1, 1, 1, 1, 1,
            1, 0, 1, 1, 0, 0, 1, 1, 0, 
            0, 1, 0, 0, 1, 1, 0, 0, 0,
            0, 0, 1, 0, 1, 0, 0, 0, 0,
            1, 0, 0, 1, 0, 1, 1, 1, 0,
            1, 1, 1, 1, 0, 0, 0, 0, 1, 
            1, 0, 1
        ];

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        })

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(squarePos, 3));

        geometry.center();

        let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Line(geometry, material);

        scene.add(cube);
        camera.position.z = 5;

        cubRef.current = cube;
        sceRef.current = scene;
        camRef.current = camera;
        renRef.current = renderer;


        let animate = () : void => {
            reqRef.current = requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }

    const cancelVis = () => {
        // Stop requestAnimationFrame
        cancelAnimationFrame(reqRef.current);

        // Garbage Collection
        disposeHierarchy(sceRef.current, disposeNode);

        // Renderer cleanup
        renRef.current.dispose();

        // Remove the current scene
        sceRef.current.remove(cubRef.current)

        // Retrieve HtmlCollection of canvas's
        let canvas = document.getElementsByTagName('CANVAS')

        // Remove all canvas elements
        for (let i = 0; i < canvas.length; i++) {
            canvas[0].remove();
        }

        setIsOpened(false);
    }

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default MathDefaultBox;