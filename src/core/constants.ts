const Constants = {
  DragRadius: 3, // 判定拖动开始 最小移动距离
  FlyoutDragRadius: 10, // Flyout判定拖动开始 最小移动距离
  SnapRadius: 48, // 判定连接的最小距离
  ConnectingSnapRadius: 68, // 捕捉到连接时放大范围
  CurrentConnectionPreference: 20,
  BumpDelay: 0,
  CollapseChars: 20,
  LongPress: 750, // ms
  LineScrollMultiplier: 15, // 鼠标滚动系数
  SoundLimit: 100,
  DragStack: true,
  HSV: {
    Saturation: 0.45,
    Value: 0.65,
  },

  Sprite: {
    Width: 96,
    Height: 124,
    Url: 'sprites.png',
  },

  SvgNs: 'http://www.w3.org/2000/svg',
  HtmlNs: 'http://www.w3.org/1999/xhtml',
  InputValue: 1,
  OutputValue: 2,
  NextStatement: 3,
  PreviousStatement: 4,
  DummyInput: 5,
  AlignLeft: -1,
  AlignCenter: 0,
  AlignRight: 1,
  DragNone: 0,
  DragSticky: 1,
  DragBegin: 1,
  DragFree: 2,
  OppositeType: {
    1: 2,
    2: 1,
    3: 4,
    4: 3,
  },
  ToolboxAt: {
    Top: 0,
    Bottom: 1,
    Left: 2,
    Right: 3,
  },

  OutputShape: {
    Hexagonal: 1,
    Round: 2,
    Square: 3,
  },

  Categories: {
    motion: 'motion',
    looks: 'looks',
    sound: 'sounds',
    pen: 'pen',
    data: 'data',
    dataLists: 'data-lists',
    event: 'events',
    control: 'control',
    sensing: 'sensing',
    operators: 'operators',
    more: 'more',
  },

  DeleteArea: {
    None: null,
    Trash: 1,
    Toolbox: 2,
  },

  VariableCategoryName: 'Variable',
  ProcedureCategoryName: 'Procedure',
  RenameVariableID: 'RenameVariableID',
  DeleteVariableID: 'DeleteVariableID',
  NewBroadcastMessageID: 'NewBroadcastMessageID',
  BroadcastMessageVariableType: 'broadcast_msg',
  ListVariableType: 'list',
  ScalarVaiableType: '',
  ProceduresDefinitionBlockType: 'procedures_definition',
  ProceduresProtoTypeBlockType: 'procedures_prototype',
  ProceduresCallBlockType: 'procedures_call',
  StatusButtonState: {
    Ready: 'ready',
    NotReady: 'not ready',
  },
}

export default Constants
