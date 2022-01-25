const Dom = {
  createDom: (type: string, className: string): HTMLElement => {
    let div = document.createElement(type)
    div.className = className
    return div
  },
}

export default Dom
