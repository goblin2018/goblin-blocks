import Events from './events'

abstract class AbstractEvents {
  workspaceID: string | undefined
  newParentId: string | undefined
  newInputName: string | undefined
  newCoordinate: any
  element: any
  name: any
  newValue: any
  blockId: string | undefined
  group: string = Events.group
  recordUndo: boolean = Events.recordUndo
  type: string = ''
  toJson = () => {
    let json: {
      type: string
      group?: string
    } = {
      type: this.type,
    }
    if (this.group) {
      json['group'] = this.group
    }
    return json
  }

  fromJson = (json: { [x: string]: string }) => {
    this.group = json['group']
  }

  isNull = () => false
  abstract run(forward: boolean): any
  getEventWorkspace = () => {
    let workspace = Workspace.getById(this.workspaceID)
    if (!workspace) {
      throw Error('Workspace is null')
    }
    return workspace
  }
}

export default AbstractEvents
