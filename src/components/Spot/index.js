import {
  BaseElement
} from '@/assets/js/BaseElement'
import './index.scss'

export default class SpotView extends BaseElement {
  constructor(opt) {
    super({
      ...opt,
      offset: [-15, -15]
    })
    this._clickHandle = this._clickHandle.bind(this)
    this._initialize(opt)
  }

  _initialize(opt) {
    // this.color = opt._color || 'red'
    this._click = opt.click
    this._createElement()
  }

  _createElement() {
    let div = document.createElement('div')
    div.className = '__spot_container'
    div.addEventListener('click', this._clickHandle, false)
    super.__updateElement(div)
    if (this.isWarning()) {
      this.showWarning()
    }
  }

  _clickHandle() {
    let data = super.getExtData()
    typeof this._click === 'function' && this._click(data)
  }

  isWarning() {
    return !!this._isWarning
  }

  showWarning() {
    let element = super.getElement()
    this._isWarning = true
    element && element.classList.add('warning')
  }

  hideWarning() {
    let element = super.getElement()
    this._isWarning = false
    element && element.classList.remove('warning')
  }

  destroy() {
    super.destroy()
    // TODO
  }
}
