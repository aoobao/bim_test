import '@/assets/css/BaseElement.scss'
import {
  addRender,
  removeRender
} from './RenderManager'
let temp_material = null

/**
 * opt
 * position   Array [0,0,0]
 * scene      Scene
 * camera     Camera
 * element    Element Dom
 * raycaster  Raycaster
 * isTop     Boolean  是否总是显示
 * extData    any
 * @export
 * @class BaseElement
 */
export class BaseElement {

  constructor(opt) {
    this.render = this.render.bind(this)
    this._position = opt.position || [0, 0, 0]
    this._offset = opt.offset || [0, 0]
    this._scene = opt.scene
    this._camera = opt.camera
    this._raycaster = opt.raycaster
    this._isTop = !!opt.isTop
    this.__first_show = false

    // this._element = opt.element

    this._extData = opt.extData || null

    this._show = false

    this.__createInstance()
  }

  __createInstance() {
    // 一开始测试用正方体,后面改成Object3D空对象
    let width = 0.5
    let geometry = new THREE.BoxGeometry(width, width, width)
    if (!temp_material) {
      temp_material = new THREE.MeshBasicMaterial({
        transparent: true,
        color: 0xff0000,
        opacity: 0.0
      })
    }
    this._instance = new THREE.Mesh(geometry, temp_material)
    // this._instance = new THREE.Object3D()
    this._instance.position.set(...this._position)

    this.__createElement()
    this.show()
  }

  __createElement() {
    let div = document.createElement('div')
    div.className = '__base_element_body'

    div.style.display = 'none'

    // div.addEventListener('contextmenu', this._onContextMenu)
    // div.addEventListener('wheel', e => {
    //   // console.log(e)
    //   console.log('element wheel')
    //   // e.preventDefault();
    // })

    elementBody.appendChild(div)
    this.__el = div
  }

  // _onContextMenu(e) {
  //   e.preventDefault()
  // }

  __updateElement(element) {
    element.style.position = 'absolute'
    element.style.left = this._offset[0] + 'px'
    element.style.top = this._offset[1] + 'px'

    this._element = element
    this.__el.innerHTML = ''
    this.__el.appendChild(element)
  }

  getElement() {
    return this._element || null
  }

  setOffset(offset) {
    this._offset = offset || [0, 0]
    if (this._element) {
      this._element.style.left = this._offset[0] + 'px'
      this._element.style.top = this._offset[1] + 'px'
    }
  }

  setPosition(position) {
    this._position = position
    this._instance.position.set(...position)
  }

  getExtData() {
    return this._extData
  }

  setExtData(data) {
    this._extData = data
  }

  getIsTop() {
    return this._isTop
  }

  setIsTop(bool) {
    this._isTop = !!bool
  }


  show() {
    if (!this._show) {
      this._show = true

      this._scene.add(this._instance)

      addRender(this.render)
    }
  }

  hide() {
    if (this._show) {
      this.__first_show = false
      this._show = false
      this._scene.remove(this._instance)
      elementBody.removeChild(this.__el)
      removeRender(this.render)
    }
  }

  destroy() {
    this.hide()
  }

  render() {
    if (this._show) {
      // console.log('render')
      let tempV = new THREE.Vector3()
      this._instance.updateWorldMatrix(true, false)
      this._instance.getWorldPosition(tempV)
      tempV.project(this._camera)

      let isTop = this.getIsTop()
      let show = true
      if (!isTop) {
        let raycaster = this._raycaster
        raycaster.setFromCamera(tempV, this._camera)
        const intersectedObjects = raycaster.intersectObjects(this._scene.children)
        show = intersectedObjects.length && this._instance === intersectedObjects[0].object
      }

      const x = (tempV.x * .5 + .5) * elementBody.clientWidth
      const y = (tempV.y * -.5 + .5) * elementBody.clientHeight
      this.__el.style.left = `${x}px`
      this.__el.style.top = `${y}px`

      if (show) {
        if (this.__hidden_index) {
          clearTimeout(this.__hidden_index)
          this.__hidden_index = null
          // console.log('清除隐藏', new Date().getTime())
        }
        this.__el.style.display = 'block'
      } else {

        // console.log('hidden')
        if (!this.__hidden_index) {
          this.__hidden_index = setTimeout(() => {
            // console.log('隐藏', new Date().getTime())
            this.__hidden_index = null
            this.__el.style.display = 'none'
          }, 500);
        }
      }


      // this.__el.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`
    }
  }
}

// function addRender(func) {
//   renders.push(func)
// }

// function removeRender(func) {
//   for (let i = renders.length - 1; i >= 0; i--) {
//     let render = renders[i]
//     if (render === func) {
//       renders.splice(i, 1)
//     }
//   }
// }


// let renders = []
let elementBody = document.body

// export function updateRender() {
//   for (let i = 0; i < renders.length; i++) {
//     const render = renders[i];
//     render()
//   }
// }

export function setAppendElementBody(element) {
  elementBody = element
}
