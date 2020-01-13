const DISTANCE = 10
/**
 * opt
 * dom  canvas
 * camera
 */
export class EventBus {
  constructor(opt) {
    this._clickHandle = this._clickHandle.bind(this)
    this._moveinHandle = this._moveinHandle.bind(this)
    this._dblclickHandle = this._dblclickHandle.bind(this)
    // this._onContextMenu = this._onContextMenu.bind(this)
    this._onMouseDown = this._onMouseDown.bind(this)
    this._onMouseUp = this._onMouseUp.bind(this)
    this._initialize(opt)
  }

  _initialize (opt) {
    this._dom = opt.dom
    this._camera = opt.camera
    this._raycaster = opt.raycaster
    // this._scene = opt.scene
    this._width = this._dom.offsetWidth
    this._height = this._dom.offsetHeight

    window.addEventListener('resize', () => {
      this._width = this._dom.offsetWidth
      this._height = this._dom.offsetHeight
    })


    this._mouse = new THREE.Vector2()

    // 移入移出模型临时存储
    this._movein_dic = new Set()
    this._moveout_dic = new Set()

    this._move_enter_object = null

    this._event_list = {
      // click: {},
      // movein: {},
      // moveout: {},
      // dblclick: {},
      // right_click: {},

      click: new Map(),
      movein: new Map(),
      moveout: new Map(),
      dblclick: new Map(),
      right_click: new Map(),
      // moveenter: new Map(),
      // moveover: new Map()
    }

    this._mouse_left_down = [0, 0]
    this._mouse_down = [0, 0]

    this._event_back = [] // 用来存储鼠标右键没有命中任何目标时的事件

    this._event_dblclick = [] // 用来存储鼠标右键双击后的事件

    this._move_change_list = null // Set

    // 当前移入的dom
    this._active_move_object = null
    this._move_change_fun = null

    // this._raycaster = new THREE.Raycaster()
    // this._dom.addEventListener('click', this._clickHandle, false)
    this._dom.addEventListener('dblclick', this._dblclickHandle, false)
    // this._dom.addEventListener('contextmenu', this._onContextMenu)
    this._dom.addEventListener('mousemove', this._moveinHandle, false)

    this._dom.addEventListener('mousedown', this._onMouseDown, false)
    this._dom.addEventListener('mouseup', this._onMouseUp, false)
  }

  _onMouseDown (e) {
    // console.log(e)
    let button = e.button
    // 对右键进行处理
    if (button === 2) {
      let x = e.offsetX
      let y = e.offsetY
      this._mouse_down = [x, y]
    } else if (button === 0) {
      let x = e.offsetX
      let y = e.offsetY
      // let time = new Date().getTime()
      this._mouse_left_down = [x, y]
    }
  }

  _onMouseUp (e) {
    let button = e.button
    // console.log(e)
    if (button === 2) {
      // debugger
      let x = e.offsetX
      let y = e.offsetY
      let distance = Math.pow((x * x - Math.pow(this._mouse_down[0], 2)) + (y * y - Math.pow(this._mouse_down[1], 2)), 0.5)
      if (distance < DISTANCE) {
        // 右击事件
        this._onContextMenu(e)
      } else {
        // 右键拖拽事件,直接抛弃
      }
    } else if (button === 0) {

      let x = e.offsetX
      let y = e.offsetY
      let distance = Math.pow((x * x - Math.pow(this._mouse_left_down[0], 2)) + (y * y - Math.pow(this._mouse_left_down[1], 2)), 0.5)
      if (distance < DISTANCE) {
        this._clickHandle(e)
      }
    }
  }


  _onContextMenu (e) {
    // e.preventDefault()
    // console.log('contextMenu', e)
    let flag = this._mouseChangeHandle(e, 'right_click')
    // 如果当次右键没有执行任何回调,执行全局右键事件
    if (!flag) {

      // 当300毫秒内再次点击右键,执行双击事件.
      if (this._dbl_right_click_index) {
        // 只有300毫秒内再次响应右键事件,_dbl_right_click_index才不为null
        clearTimeout(this._dbl_right_click_index)
        this._dbl_right_click_index = null
        this._onDblRightClick(e)
      }

      // 延迟300毫秒执行右键事件
      this._dbl_right_click_index = setTimeout(() => {
        this._dbl_right_click_index = null
        for (let i = 0; i < this._event_back.length; i++) {
          const func = this._event_back[i]
          func()
        }
      }, 300);
    }
  }

  _onDblRightClick (e) {
    for (let i = 0; i < this._event_dblclick.length; i++) {
      const func = this._event_dblclick[i]
      func(e)
    }
  }

  _clickHandle (e) {

    if (e.detail == 1) {

      if (this._clickIndex) {
        clearTimeout(this._clickIndex)
        this._clickIndex = null
      }
      this._clickIndex = setTimeout(() => {
        this._clickIndex = null
        this._mouseChangeHandle(e, 'click')
      }, 300);
    }
    // console.log('click', e, e.detail)
  }

  _dblclickHandle (e) {
    // console.log('dblclick', e, e.detail)
    if (this._clickIndex) {
      clearTimeout(this._clickIndex)
      this._clickIndex = null
      this._mouseChangeHandle(e, 'dblclick')
    }
  }

  // 移入移出事件
  _moveinHandle (e) {
    // console.log(e)
    this._updateMousePosition(e)
    if (this._move_change_list && this._move_change_list.size > 0) {
      let activeObject = null
      let intersects = this._checkIntersection(this._move_change_list)
      if (intersects.length > 0) {
        activeObject = intersects[0].object
      }
      if (activeObject !== this._active_move_object) {
        typeof this._move_change_fun === 'function' && this._move_change_fun(activeObject, this._active_move_object, e)
        this._active_move_object = activeObject
      }
    }

    if (this._event_list.movein.size > 0) {
      // 移入判断
      let intersects = this._checkIntersection('movein')
      if (intersects && intersects.length > 0) {
        let activeObject = intersects[0].object
        // let uuid = activeObject.uuid
        // let ctx = this._event_list.movein[uuid]
        let map = this._event_list.movein
        // 如果之前不存在,调用移入事件方法.
        if (map.has(activeObject) && !this._movein_dic.has(activeObject)) {
          // let funcs = ctx.functions
          let funcs = map.get(activeObject)
          funcs.forEach(func => {
            func(activeObject)
          })
          this._movein_dic.add(activeObject)
        }
        // 清理当前存在在_movein_dic中,但是实际射线计算没有相交的物体,下次再次移入时再次调用移入事件
        let dic = new Set(intersects.map(t => t.object))
        this._movein_dic.forEach(key => {
          if (!dic.has(key)) {
            this._movein_dic.delete(key)
          }
        })
      } else {
        // 如果射线没有任何物体相交,直接清空所有之前存入的movein物体.
        this._movein_dic.clear()
      }
    }


    // 移出判断
    let outEventMap = this._event_list.moveout
    if (outEventMap.size > 0) {
      let outIntersects = this._checkIntersection('moveout')
      // 如果存在等待移出的物体,先判断是否已经移出.
      if (this._moveout_dic.size > 0) {
        let dic = new Set(outIntersects.map(t => t.object))
        this._moveout_dic.forEach(key => {
          if (!dic.has(key)) {
            // 执行移出事件
            if (outEventMap.has(key)) {
              let funcs = outEventMap.get(key)
              funcs.forEach(func => {
                func(key)
              })
            }
            // let uuid = key.uuid
            // let ctx = outEvent[uuid]
            // if (ctx) {
            //   let funcs = ctx.functions
            //   funcs.forEach(func => {
            //     func(key)
            //   })
            // }
            this._moveout_dic.delete(key)
          }
        })
      }

      // 将第一个物体添加到_moveout_dic中去等待移出时执行.
      if (outIntersects && outIntersects.length > 0) {
        let activeObject = outIntersects[0].object
        this._moveout_dic.add(activeObject)
      }
    }
  }



  _updateMousePosition (e) {
    let x = e.offsetX
    let y = e.offsetY
    let dx = (x / this._width) * 2 - 1
    let dy = 1 - (y / this._height) * 2

    this._mouse.set(dx, dy)
  }


  _mouseChangeHandle (e, eventName) {
    this._updateMousePosition(e)

    return this._runIntersection(eventName)
  }

  _runIntersection (eventName) {
    let flag = false // 是否存在被执行的方法
    let map = this._event_list[eventName]
    let intersects = this._checkIntersection(eventName)
    if (intersects.length > 0) {
      let activeObject = intersects[0].object
      // let uuid = activeObject.uuid
      // let context = eventObj[uuid]
      // let funcs = context.functions
      // funcs.forEach(func => {
      //   func(activeObject)
      // });
      if (map.has(activeObject)) {
        let funcs = map.get(activeObject)
        if (funcs.length > 0) flag = true
        funcs.forEach(func => {
          func(activeObject)
        });
      }
    }
    return flag
  }

  _checkIntersection (eventName) {
    let map
    if (typeof eventName === 'string') {
      map = this._event_list[eventName]
    } else {
      // Set
      map = eventName
    }

    if (map.size === 0) return []
    let objects = [...map.keys()]

    let mouse = this._mouse
    let camera = this._camera
    let raycaster = this._raycaster

    raycaster.setFromCamera(mouse, camera)

    let intersects = raycaster.intersectObjects(objects, false)

    return intersects
  }

  change (objects, func) {
    if (objects) {
      this._move_change_list = new Set(objects)
      this._active_move_object = null
      this._move_change_fun = func
    } else {
      this._move_change_list = null
      this._move_change_fun = null
      this._active_move_object = null
    }

  }

  addRightClick (func) {
    this._event_back.push(func)
  }

  removeRightClick (func) {
    for (let i = this._event_back.length - 1; i >= 0; i--) {
      const fun = this._event_back[i];
      if (fun === func) {
        this._event_back.splice(i, 1)
      }
    }
  }

  addDblRightClick (func) {
    this._event_dblclick.push(func)
  }

  removeDblRightClick (func) {
    for (let i = this._event_dblclick.length - 1; i >= 0; i--) {
      const fun = this._event_dblclick[i];
      if (fun === func) {
        this._event_dblclick.splice(i, 1)
      }
    }
  }



  on (object, eventName, func) {
    if (Array.isArray(object)) {
      object.forEach(o => {
        this.on(o, eventName, func)
      })
      return
    }
    let _event = this._event_list
    let map = _event[eventName]
    if (!map) {
      console.warn('不支持订阅该事件,', eventName)
      return
    }
    let funcs = []
    if (map.has(object)) {
      funcs = map.get(object)
    }
    funcs.push(func)

    map.set(object, funcs)

  }

  off (object, eventName, func) {
    if (Array.isArray(object)) {
      object.forEach(o => {
        this.off(o, eventName, func)
      })
      return
    }
    let map = this._event_list[eventName]
    if (!map) {
      console.log('无法识别的事件,', eventName)
      return
    }
    if (map.has(object)) {
      let funcs = map.get(object)
      for (let i = funcs.length - 1; i >= 0; i--) {
        const fun = funcs[i]
        if (fun == func) {
          funcs.splice(i, 1)
        }
      }
      if (funcs.length === 0) {
        map.delete(object)
      }
    }
  }

  removeAll (eventName = null, object = null) {
    let eventNames = Object.keys(this._event_list)
    for (let i = 0; i < eventNames.length; i++) {
      const name = eventNames[i]
      if (name === eventName || eventName === null) {
        let map = this._event_list[name]
        if (object === null) {
          map.clear()
        } else if (map.has(object)) {
          map.delete(object)
        }
      }
    }
  }

  destroy () {
    this.removeAll()
    this._dom.removeEventListener('click', this._clickHandle, false)
    this._dom.removeEventListener('dblclick', this._dblclickHandle, false)
    // this._dom.removeEventListener('contextmenu', this._onContextMenu)
    this._dom.removeEventListener('mousemove', this._moveinHandle, false)

    this._dom.removeEventListener('mousedown', this._onMouseDown, false)
    this._dom.removeEventListener('mouseup', this._onMouseUp, false)
  }
}

let eventBus = null

export function createEventBus (opt) {
  if (eventBus) {
    eventBus.destroy()
  }
  eventBus = new EventBus(opt)
  return eventBus
}

export function getEventBus () {
  return eventBus
}
