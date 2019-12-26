let renders = []

export function addRender(func) {
  renders.push(func)
}

export function removeRender(func) {
  for (let i = renders.length - 1; i >= 0; i--) {
    let render = renders[i]
    if (render === func) {
      renders.splice(i, 1)
    }
  }
}

export function updateRender() {
  for (let i = 0; i < renders.length; i++) {
    const render = renders[i];
    render()
  }
}
