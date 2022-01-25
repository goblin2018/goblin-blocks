import Dom from './dom'
import Style from './style'

const ArrowSize = 16
const BorderSize = 1
const ArrowHorizontalPadding = 12
const PaddingY = 20
const AnimationTime = 0.25

class DropDownDiv {
  constructor() {}
  DIV: HTMLElement | undefined
  boundsElement: HTMLElement | undefined
  content: HTMLElement | undefined
  arrow_: HTMLElement | undefined
  owner_!: null

  animateOutTimer_: any = null
  onHide_: Function | null = null

  createDom = () => {
    if (this.DIV) {
      return
    }

    this.DIV = Dom.createDom('div', 'blocklyDropDownDiv')
    document.body.appendChild(this.DIV)

    this.content = Dom.createDom('div', 'blocklyDropDownContent')
    this.DIV.appendChild(this.content)
    this.arrow_ = Dom.createDom('div', 'blocklyDropDownArrow')
    this.DIV.appendChild(this.arrow_)
    this.DIV.style.transition =
      'transform ' + AnimationTime + 's, ' + 'opacity ' + AnimationTime + 's'
  }

  setBoundsElement = (boundsElement: HTMLElement) => {
    this.boundsElement = boundsElement
  }

  getContentDiv = () => this.content

  clear = () => {
    this.content!.innerHTML = ''
    this.content!.style.width = ''
  }

  setColor = (background: string, border: string) => {
    this.DIV!.style.backgroundColor = background
    this.DIV!.style.borderColor = border
  }

  setCategory = (category: string) => {
    this.DIV!.setAttribute('data-category', category)
  }

  showPositionedByBlock = (
    owner: any,
    block: any,
    onHide: any,
    secondaryYOffset: number
  ) => {
    let scale = block.workspace.scale
    let bBox = { width: block.width, height: block.height }
    bBox.width *= scale
    bBox.height *= scale

    let position = block.getSvgRoot().getBoundingClientRect()
    let primaryX = position.left + bBox.width / 2
    let primaryY = position.top + bBox.height

    let secondaryX = primaryX
    let secondaryY = primaryY

    if (secondaryYOffset) {
      secondaryY += secondaryYOffset
    }

    this.setBoundsElement(block.workspace.getParentSvg().parentNode)
    return this.show(this, primaryX, primaryY, secondaryX, secondaryY, onHide)
  }

  show = (
    owner: any,
    primayX: any,
    primaryY: any,
    secondaryX: any,
    secondaryY: any,
    onHide: any
  ) => {
    this.owner_ = owner
    this.onHide_ = onHide

    let div = this.DIV!
    let metrics = this.getPositionMetrics(
      primayX,
      primaryY,
      secondaryX,
      secondaryY
    )
    this.arrow_!.style.transform =
      'translate(' +
      metrics.arrowX +
      'px,' +
      metrics.arrowY +
      'px) rotate(45deg)'
    this.arrow_!.setAttribute(
      'class',
      metrics.arrowAtTop
        ? 'blocklyDropDownArrow arrowTop'
        : 'blocklyDropDownArrow arrowBottom'
    )

    div.style.left = metrics.initialX + 'px'
    div.style.top = metrics.initialY + 'px'
    // Show the div.
    div.style.display = 'block'
    div.style.opacity = '1'
    // Add final translate, animated through `transition`.
    // Coordinates are relative to (initialX, initialY),
    // where the drop-down is absolutely positioned.
    var dx = metrics.finalX - metrics.initialX
    var dy = metrics.finalY - metrics.initialY
    div.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'
    return metrics.arrowAtTop
  }
  isVisible = (): boolean => !!this.owner_

  getPositionMetrics = (
    primaryX: number,
    primaryY: number,
    secondaryX: number,
    secondaryY: number
  ) => {
    var div = this.DIV!
    var boundPosition = this.boundsElement!.getBoundingClientRect()

    var boundSize = Style.getSize(this.boundsElement!)
    var divSize = Style.getSize(div)

    // First decide if we will render at primary or secondary position
    // i.e., above or below
    // renderX, renderY will eventually be the final rendered position of the box.
    var renderX, renderY, renderedSecondary
    // Can the div fit inside the bounds if we render below the primary point?
    if (primaryY + divSize.height > boundPosition.top + boundSize.height) {
      // We can't fit below in terms of y. Can we fit above?
      if (secondaryY - divSize.height < boundPosition.top) {
        // We also can't fit above, so just render below anyway.
        renderX = primaryX
        renderY = primaryY + PaddingY
        renderedSecondary = false
      } else {
        // We can fit above, render secondary
        renderX = secondaryX
        renderY = secondaryY - divSize.height - PaddingY
        renderedSecondary = true
      }
    } else {
      // We can fit below, render primary
      renderX = primaryX
      renderY = primaryY + PaddingY
      renderedSecondary = false
    }
    // First calculate the absolute arrow X
    // This needs to be done before positioning the div, since the arrow
    // wants to be as close to the origin point as possible.
    var arrowX = renderX - ArrowSize / 2
    // Keep in overall bounds
    arrowX = Math.max(
      boundPosition.left,
      Math.min(arrowX, boundPosition.left + boundSize.width)
    )

    // Adjust the x-position of the drop-down so that the div is centered and within bounds.
    var centerX = divSize.width / 2
    renderX -= centerX
    // Fit horizontally in the bounds.
    renderX = Math.max(
      boundPosition.left,
      Math.min(renderX, boundPosition.left + boundSize.width - divSize.width)
    )
    // After we've finished caclulating renderX, adjust the arrow to be relative to it.
    arrowX -= renderX

    // Pad the arrow by some pixels, primarily so that it doesn't render on top of a rounded border.
    arrowX = Math.max(
      ArrowHorizontalPadding,
      Math.min(arrowX, divSize.width - ArrowHorizontalPadding - ArrowSize)
    )

    // Calculate arrow Y. If we rendered secondary, add on bottom.
    // Extra pixels are added so that it covers the border of the div.
    var arrowY = renderedSecondary ? divSize.height - BorderSize : 0
    arrowY -= ArrowSize / 2 + BorderSize

    // Initial position calculated without any padding to provide an animation point.
    var initialX = renderX // X position remains constant during animation.
    var initialY
    if (renderedSecondary) {
      initialY = secondaryY - divSize.height // No padding on Y
    } else {
      initialY = primaryY // No padding on Y
    }

    return {
      initialX: initialX,
      initialY: initialY,
      finalX: renderX,
      finalY: renderY,
      arrowX: arrowX,
      arrowY: arrowY,
      arrowAtTop: !renderedSecondary,
    }
  }

  hideIfOwner = (owner: any) => {
    if (this.owner_ === owner) {
      this.hide()
      return true
    }
    return false
  }
  hide = () => {
    let div = this.DIV!
    div.style.transform = 'translate(0px, 0px)'
    div.style.opacity = '0'
    this.animateOutTimer_ = setTimeout(() => {
      this.hideWithoutAnimation()
    }, AnimationTime * 1000)

    if (this.onHide_) {
      this.onHide_()
      this.onHide_ = null
    }
  }
  hideWithoutAnimation = () => {
    if (!this.isVisible()) {
      return
    }
    var div = this.DIV!
    this.animateOutTimer_ && window.clearTimeout(this.animateOutTimer_)
    div.style.transform = ''
    div.style.top = ''
    div.style.left = ''
    div.style.display = 'none'
    this.clear()
    this.owner_ = null
    if (this.onHide_) {
      this.onHide_()
      this.onHide_ = null
    }
  }
}

export default DropDownDiv
