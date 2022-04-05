import './style.css'
import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

let speed = 0
let position = 0

window.addEventListener('wheel',(e)=>{
  speed = e.deltaY
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 30

const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.getElementById('bg'),
    antialias: true
  }
)

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

renderer.render(scene, camera)

const geometry = new THREE.BoxGeometry(10, 10, 10)
const material = new THREE.MeshBasicMaterial({ color: '#ffffff' })
const cube = new THREE.Mesh(geometry, material)

//scene.add(cube)

const fbxLoader = new FBXLoader()

fbxLoader.load(
    'assets/iphone.fbx',
    (object) => {
        object.traverse( (child)=> {
             if (child.isMesh) {
                 child.material = material
                 if (child.material) {
                     child.material.transparent = false
                 }
             }
         })
         console.log(object)
         object.scale.set(.1, .1, .1)
        scene.add(object)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

function animate(){
  requestAnimationFrame(animate)
  position += speed
  speed *= 0.8

  cube.rotation.x += position * 0.001
  cube.rotation.y += 0.01
  
  renderer.render(scene, camera)
}

animate()
