import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fireVertexShader from './shaders/fireVertex.glsl?raw';
import fireFragmentShader from './shaders/fireFragment.glsl?raw';

import oceanVertexShader from './shaders/oceanVertex.glsl?raw';
import oceanFragmentShader from './shaders/oceanFragment.glsl?raw';

import spaceVertexShader from './shaders/spaceVertex.glsl?raw';
import spaceFragmentShader from './shaders/spaceFragment.glsl?raw';

import trippyFragmentShader from './shaders/trippyFragment.glsl?raw';
import trippyVertexShader from './shaders/trippyVertex.glsl?raw';

import geometryFragmentShader from './shaders/geometryFragment.glsl?raw';
import geometryVertexShader from './shaders/geometryVertex.glsl?raw';

import mandelbrotFragmentShader from './shaders/mandelbrotFragment.glsl?raw';
import mandelbrotVertexShader from './shaders/mandelbrotVertex.glsl?raw';

let soundString1 = new Audio('/assets/sounds/string1.mp3');
let soundString2 = new Audio('/assets/sounds/string2.mp3');
let soundString3 = new Audio('/assets/sounds/string3.mp3');
let soundString4 = new Audio('/assets/sounds/string4.mp3');
let soundString5 = new Audio('/assets/sounds/string5.mp3');
let soundString6 = new Audio('/assets/sounds/string6.mp3');



const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const fov = 45;
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, size.width / size.height, near, far);
camera.position.x = 14;
camera.position.y = 15;
camera.position.z = 12;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;



const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const texture = new THREE.TextureLoader().load('/assets/baked.jpg');
const texture2 = new THREE.TextureLoader().load('/assets/fire.jpg');
const texture3 = new THREE.TextureLoader().load('/assets/ocean.jpg');


texture.flipY = -1;
texture2.flipY = -1;


const material = new THREE.MeshBasicMaterial({ map: texture });
scene.background = new THREE.Color('black');

const ballMaterialFire = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture2 },
    },
    vertexShader: fireVertexShader,
    fragmentShader: fireFragmentShader
});

const ballMaterialOcean = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture3 },
    },
    vertexShader: oceanVertexShader,
    fragmentShader: oceanFragmentShader
});

const ballMaterialSpace = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture3 },

    },
    vertexShader: spaceVertexShader,
    fragmentShader: spaceFragmentShader
});


const ballMaterialTrippy = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture3 },


    },
    vertexShader: trippyVertexShader,
    fragmentShader: trippyFragmentShader
});


const ballMaterialGeometry = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture3 },


    },
    vertexShader: geometryVertexShader,
    fragmentShader: geometryFragmentShader
});


const ballMaterialMandelbrot = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(size.width, size.height) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iChannel0: { value: texture3 },


    },
    vertexShader: mandelbrotVertexShader,
    fragmentShader: mandelbrotFragmentShader
});


const loader = new GLTFLoader();
loader.load(
    '/assets/photobooth.glb',
    (gltf) => {
        console.log(gltf);
        gltf.scene.position.setY(-2);
        gltf.scene.position.setX(-2);
        gltf.scene.position.setZ(-1);
        console.log(gltf.scene.position);

        gltf.scene.traverse(child => {
            // console.log(child.name);
            child.material = material;

        })
        scene.add(gltf.scene);

    }
);

const clock = new THREE.Clock();


window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    // console.log(pointer.x, pointer.y);
});

const draw = () => {
    const elapsedTime = clock.getElapsedTime();
    ballMaterialFire.uniforms.iTime.value = elapsedTime;
    ballMaterialOcean.uniforms.iTime.value = elapsedTime;
    ballMaterialSpace.uniforms.iTime.value = elapsedTime;
    ballMaterialTrippy.uniforms.iTime.value = elapsedTime;
    ballMaterialGeometry.uniforms.iTime.value = elapsedTime;
    ballMaterialMandelbrot.uniforms.iTime.value = elapsedTime;



    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);


    for (let i = 0; i < intersects.length; i++) {

        if (intersects[0].object.name === "string_1") {
            intersects[0].object.material = ballMaterialFire;
            soundString1.play();
            scene.traverse(child => {
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialFire;
                }
            })
        } else if (intersects[0].object.name === "string_2") {
            intersects[0].object.material = ballMaterialFire;
            soundString2.play();
            scene.traverse(child => {
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialOcean;
                }
            })
        } else if (intersects[0].object.name === "string_3") {
            intersects[0].object.material = ballMaterialFire;
            soundString3.play();
            scene.traverse(child => {
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialSpace;
                }
            })
        } else if (intersects[0].object.name === "string_4") {
            intersects[0].object.material = ballMaterialFire;
            soundString4.play();
            scene.traverse(child => {
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialTrippy;
                }
            })
        } else if (intersects[0].object.name === "string_5") {
            intersects[0].object.material = ballMaterialFire;
            soundString5.play();
            scene.traverse(child => {
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialGeometry;
                }
            })
        } else if (intersects[0].object.name === "string_6") {
            intersects[0].object.material = ballMaterialFire;
            soundString6.play();
            scene.traverse(child => {
                // console.log(child.name);
                const child_cut = child.name.slice(0, 6);
                if (child.name === "guitar_body") {
                    child.material = ballMaterialMandelbrot;
                }
            })
        } else {
            scene.traverse(child => {
                // console.log(child.name);
                const stringName = child.name.slice(0, 6);
                if (stringName === "string") {
                    child.material = material;
                }
            })
        }
    }

    renderer.render(scene, camera);

    requestAnimationFrame(draw);
};

window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});








draw();
