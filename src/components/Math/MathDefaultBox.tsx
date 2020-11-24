import { render } from '@testing-library/react';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy, disposeNode } from '../Util/garbageCollectNode';

const MathDefaultBox = (props: { active: boolean }) => {
    let id: any;

    const reqRef = useRef<any>();
    const ctxRef = useRef<HTMLHeadingElement | null>(null);
    const sceRef = useRef<THREE.Scene>(new THREE.Scene());
    const camRef = useRef<THREE.PerspectiveCamera>(
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    );
    const renRef = useRef<THREE.WebGLRenderer>(
        new THREE.WebGLRenderer({ antialias: true })
    );

    useEffect(() => {
        if (props.active) {
            initViewPort();
        } else {
            cancelVis();
        }
    }, [props.active]);

    const initViewPort = () => {
        let scene = sceRef.current;
        let camera = camRef.current;
        let renderer = renRef.current;

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;

            camera.updateProjectionMatrix();
        })

        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        let cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        camera.position.z = 5;

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
        cancelAnimationFrame(reqRef.current);
        disposeHierarchy(sceRef.current, disposeNode);
        let canvas = document.getElementsByTagName('CANVAS')
        canvas[0].remove();
    }

    return (
        <div ref={ctxRef}>

        </div>
    )
}

export default MathDefaultBox;