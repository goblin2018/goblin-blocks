import AbstractEvents from './abstractEvents'
import {v4 as uuidv4} from 'uuid';
;

export const EventType = {
  Create: 'CREATE',
  BlockCreate: 'CREATE',
  Delete: 'Delete',
  BlockDelete: 'Delete',
  Change: 'Change',
  BlockChange: 'Change',
  Move: 'Move',
  DragOutside: 'DragOutside',
  EndDrag: 'EndDrag',
  BlockMove: 'Move',
  VarCreate: 'VarCreate',
  VarDelete: 'VarDelete',
  VarRename: 'VarRename',
  CommentCreate: 'CommentCreate',
  CommentMove: 'CommentMove',
  CommentChange: 'CommentChange',
  CommentDelete: 'CommentDelete',
  UI: 'ui',
}

class Events {
  static group: string = ''
  static recordUndo: boolean = true
  disabled: number = 0

  fireQueue: AbstractEvents[] = []

  fire = (event: AbstractEvents) => {
    if (!this.isEnabled()) return

    if (!this.fireQueue.length) {
      setTimeout(this.fireNow, 0)
    }
    this.fireQueue.push(event)
  }
  isEnabled = () => this.disabled === 0
  fireNow = () => {
    let queue = this.filter(this.fireQueue, true)
    this.fireQueue.length = 0
    for (let i = 0, event; (event = queue[i]); i++) {
      var workspace = Workspace.getById(event.workspaceID)
      if (workspace) {
        workspace.fireChangeListener(event)
      }
    }
  }

  filter = (queueIn: AbstractEvents[], forward: boolean) => {
    let queue = [...queueIn]
    if (!forward) {
      queue.reverse()
    }

    let mergedQueue = []
    let hash = Object.create(null)
    // 合并事件
    for (let i = 0, event; (event = queue[i]); i++) {
      if (!event.isNull()) {
        let key = [event.type, event.blockId, event.workspaceID].join(' ')
        let lastEntry = hash[key]
        let lastEvent = lastEntry ? lastEntry.event : null
        if (!lastEntry) {
          hash[key] = { event: event, index: i }
          mergedQueue.push(event)
        } else if (event.type === EventType.Move && lastEntry.index === i - 1) {
          lastEvent.newParentId = event.newParentId
          lastEvent.newInputName = event.newInputName
          lastEvent.newCoordinate = event.newCoordinate
          lastEntry.index = i
        } else if (
          event.type === EventType.Change &&
          event.element === lastEvent.element &&
          event.name === lastEvent.name
        ) {
          lastEvent.newValue = event.newValue
        } else if (
          event.type === EventType.UI &&
          event.element === 'click' &&
          (lastEvent.element === 'commentOpen' ||
            lastEvent.element === 'mutatorOpen' ||
            lastEvent.element === 'warningOpen')
        ) {
          lastEvent.newValue = event.newValue
        } else {
          hash[key] = { event: event, index: 1 }
          mergedQueue.push(event)
        }
      }
    }

    queue = mergedQueue.filter((e) => !e.isNull())
    if (!forward) {
      queue.reverse()
    }

    // 跳过第一个事件
    for (var i = 1, event; (event = queue[i]); i++) {
      if (event.type === EventType.Change && event.element === 'mutation') {
        queue.unshift(queue.splice(i, 1)[0])
      }
    }
    return queue
  }

  clearPendingUndo = () => {
    for (var i = 0, event; (event = this.fireQueue[i]); i++) {
      event.recordUndo = false
    }
  }

  disable = () => {
    this.disabled++
  }
  enable = () => {
    this.disabled--
  }

  getGroup = () => Events.group
  // TODO: 修改此接口，参数可为bool 或者string
  setGroup = (state: boolean | string) => {
    if (typeof state === 'boolean') {
      Events.group = state ? uuidv4() : ''
    } else {
      Events.group = state
    }
  }

  // 获取子孙id
  getDescendantIds = (block: any) => {
    let ids = []
    let descendants = block.getDescendants(false)
    for (var i = 0, descendant; (descendant = descendants[i]); i++) {
      ids[i] = descendant.id
    }
    return ids
  }

  fromJson = (json: any, workspace: any) => {
    var event
    switch (json.type) {
      case EventType.Create:
        event = new EventType.Create(null)
        break
      case EventType.Delete:
        event = new Events.Delete(null)
        break
      case EventType.Change:
        event = new EventType.Change(null)
        break
      case EventType.Move:
        event = new EventType.Move(null)
        break
      case EventType.VarCreate:
        event = new EventType.VarCreate(null)
        break
      case EventType.VarDelete:
        event = new EventType.VarDelete(null)
        break
      case EventType.VarRename:
        event = new EventType.VarRename(null)
        break
      case EventType.COMMENT_CREATE:
        event = new EventType.CommentCreate(null)
        break
      case EventType.CommentChange:
        event = new EventType.CommentChange(null)
        break
      case EventType.CommentMove:
        event = new EventType.CommentMove(null)
        break
      case EventType.CommentDelete:
        event = new EventType.CommentDelete(null)
        break
      case EventType.UI:
        event = new EventType.Ui(null)
        break
      case EventType.DragOutside:
        event = new EventType.DragBlockOutside(null)
        break
      case EventType.EndDrag:
        event = new EventType.EndBlockDrag(null, false)
        break
      default:
        throw Error('Unknown event type.')
    }
    event.fromJson(json)
    event.workspaceId = workspace.id
    return event
  }

  disableOrphans = (event: AbstractEvents) => {
    if (event.type === EventType.Move || event.type === EventType.Create) {
      this.disable()
      var workspace = Workspace.getById(event.workspaceID)
      var block = workspace.getBlockById(event.blockId)
      if (block) {
        if (block.getParent() && !block.getParent().disabled) {
          var children = block.getDescendants(false)
          for (var i = 0, child; (child = children[i]); i++) {
            child.setDisabled(false)
          }
        } else if (
          (block.outputConnection || block.previousConnection) &&
          !workspace.isDragging()
        ) {
          do {
            block.setDisabled(true)
            block = block.getNextBlock()
          } while (block)
        }
      }
      this.enable()
    }
  }
}

export default Events
