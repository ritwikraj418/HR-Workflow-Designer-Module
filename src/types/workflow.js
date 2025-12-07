export const NODE_TYPES = {
  START: 'start',
  TASK: 'task',
  APPROVAL: 'approval',
  AUTOMATED: 'automated',
  END: 'end',
};

export const NODE_LABELS = {
  [NODE_TYPES.START]: 'Start',
  [NODE_TYPES.TASK]: 'Task',
  [NODE_TYPES.APPROVAL]: 'Approval',
  [NODE_TYPES.AUTOMATED]: 'Automated Step',
  [NODE_TYPES.END]: 'End',
};

export const createNodeData = (type, overrides = {}) => {
  const base = {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    label: NODE_LABELS[type],
    ...overrides,
  };

  switch (type) {
    case NODE_TYPES.START:
      return {
        ...base,
        title: 'Start Workflow',
        metadata: {},
      };
    case NODE_TYPES.TASK:
      return {
        ...base,
        title: 'New Task',
        description: '',
        assignee: '',
        dueDate: '',
        customFields: {},
      };
    case NODE_TYPES.APPROVAL:
      return {
        ...base,
        title: 'Approval Required',
        approverRole: 'Manager',
        autoApproveThreshold: 0,
      };
    case NODE_TYPES.AUTOMATED:
      return {
        ...base,
        title: 'Automated Action',
        actionId: '',
        actionParams: {},
      };
    case NODE_TYPES.END:
      return {
        ...base,
        endMessage: 'Workflow Completed',
        showSummary: false,
      };
    default:
      return base;
  }
};
