const Style = {
  getSize: (el: HTMLElement) => ({
    width: Number(el.style.width),
    height: Number(el.style.height),
  }),
}

export default Style
