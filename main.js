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
renderer.setClearColor(0x000000, 0)

renderer.render(scene, camera)

const material = new THREE.MeshStandardMaterial({ color:0xffffff, metalness:0, roughness:0.8 })

const geometry = new THREE.SphereGeometry(1, 32, 32)
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

const fbxLoader = new FBXLoader()

const iphones = new THREE.Group();

fbxLoader.load(
    'assets/iphone.fbx',
    (iphone) => {
        iphone.traverse( (child)=> {
             if (child.isMesh) {
                 child.material = material
                 if (child.material) {
                     child.material.transparent = false
                 }
             }
         })
         iphone.scale.set(.1, .1, .1)
         addIphone(iphone, 5)

         const iphonesBox = new THREE.Box3().setFromObject( iphones );
         const x = iphonesBox.getCenter(new THREE.Vector3()).x
         iphones.position.set(-x,0,0)
         
         scene.add(iphones)

         
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

const addIphone = (iphone, count) => {
  for(let i = 0; i < count; i++) {
    const newIphone = iphone.clone()
    newIphone.position.set(10 *i,0,0)
    //newIphone.rotation.y =  Math.PI * 0.1
    iphones.add(newIphone)
  }
}


const pointLight = new THREE.PointLight(0xffffff, 0.4)
pointLight.position.set(5, 5, 5)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

scene.add(pointLight)

function animate(){
  requestAnimationFrame(animate)
  position += speed
  speed *= 0.8
  /* if(iphone){
    iphone.rotation.y += 0.01
    iphone.rotation.x += 0.01
  } */


  renderer.render(scene, camera)
}

animate()
