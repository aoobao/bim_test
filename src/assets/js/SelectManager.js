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

  init({
    objects,
    click,
    dblclick
  }) {
    this.clear()
    this.objects = objects
    this._click = click
    this._dblclick = dblclick

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

  _moveEnter(object) {
    if (object) {
      this._outlinePass.selectedObjects = [object]
    } else {
      this._outlinePass.selectedObjects = []
    }
  }

  clearSelect() {
    this._outlinePass.selectedObjects = []
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

  }
  destroy() {
    this.clear()
    if (this._outlinePass) {
      this._outlinePass.dispose()
      this._outlinePass = null
    }
  }
}
