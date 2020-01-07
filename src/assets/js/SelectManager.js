import {
  OutlinePass
} from "~plugin/postprocessing/OutlinePass";

/**
 * 物体选择的管理类,给需要选中的物体加上鼠标移动上去的效果,以及点击效果.
 * opt
 */
export class SelectManager {
  constructor(opt) {
    this._moveEnter = this._moveEnter.bind(this)
    this._clickHandle = this._clickHandle.bind(this)
    this._dblClickHandle = this._dblClickHandle.bind(this)
    this._initialize(opt)
  }
  _initialize(opt) {
    this._resolution = opt.resolution
    this._scene = opt.scene
    this._camera = opt.camera
    this._composer = opt.composer
    this._eventBus = opt.eventBus

    this._outlinePass = new OutlinePass(this._resolution, this._scene, this._camera)
    this._composer.addPass(this._outlinePass)
  }

  // 初始化選擇器控制
  init({
    objects,
    click,
    dblclick,
    moveIn,
    moveOut
  }) {
    this.clear()
    this.objects = objects
    this._click = click
    this._dblclick = dblclick
    this._moveIn = moveIn
    this._moveOut = moveOut

    // 鼠标移入事件
    this._eventBus.change(objects, this._moveEnter)
    if (typeof click === 'function') {
      this._eventBus.on(objects, 'click', this._clickHandle)
    }
    if (typeof dblclick === 'function') {
      this._eventBus.on(objects, 'dblclick', this._dblClickHandle)
    }
  }

  _clickHandle(floor) {
    typeof this._click === 'function' && this._click(floor)
  }

  _dblClickHandle(floor) {
    typeof this._dblclick === 'function' && this._dblclick(floor)
  }

  _moveEnter(object, old, event) {
    if (object) {
      this._outlinePass.selectedObjects = [object]
      // 移入
      typeof this._moveIn === 'function' && this._moveIn(object, event)
    } else {
      this.clearSelect()
      typeof this._moveOut === 'function' && this._moveOut(old, event)
    }
  }

  clearSelect() {
    this._outlinePass.selectedObjects = []
    // 移出事件
  }

  clear() {
    this.clearSelect()
    // 移除事件
    if (this._eventBus) {
      //TODO
      this._eventBus.change(null)
      this._eventBus.off(this.objects, 'click', this._clickHandle)
      this._eventBus.off(this.objects, 'dblclick', this._dblClickHandle)
    }
    this.objects = null
    this._click = null
    this._dblclick = null
    this._moveIn = null
    this._moveOut = null

  }
  destroy() {
    this.clear()
    if (this._outlinePass) {
      this._outlinePass.dispose()
      this._outlinePass = null
    }
  }
}
