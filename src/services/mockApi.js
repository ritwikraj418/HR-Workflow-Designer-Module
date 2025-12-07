const MOCK_AUTOMATIONS = [
  {
    id: 'send_email',
    label: 'Send Email',
    params: ['to', 'subject', 'body'],
    description: 'Send an email notification',
  },
  {
    id: 'generate_doc',
    label: 'Generate Document',
    params: ['template', 'recipient', 'format'],
    description: 'Generate a document from template',
  },
  {
    id: 'update_record',
    label: 'Update Record',
    params: ['recordId', 'field', 'value'],
    description: 'Update a database record',
  },
  {
    id: 'create_notification',
    label: 'Create Notification',
    params: ['userId', 'message', 'priority'],
    description: 'Create an in-app notification',
  },
  {
    id: 'schedule_reminder',
    label: 'Schedule Reminder',
    params: ['reminderDate', 'message', 'recipient'],
    description: 'Schedule a reminder for a future date',
  },
];

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAutomations = async () => {
  await delay(300);
  return {
    success: true,
    data: MOCK_AUTOMATIONS,
  };
};

export const simulateWorkflow = async (workflowData) => {
  await delay(800);
  
  const { nodes, edges } = workflowData;
  const executionLog = [];
  const visited = new Set();
  
  const startNode = nodes.find((n) => n.type === 'start');
  if (!startNode) {
    return {
      success: false,
      error: 'No start node found',
      log: [],
    };
  }
  
  const validationErrors = validateWorkflow(nodes, edges);
  if (validationErrors.length > 0) {
    return {
      success: false,
      error: 'Workflow validation failed',
      errors: validationErrors,
      log: [],
    };
  }
  
  let currentNode = startNode;
  let step = 1;
  
  while (currentNode && !visited.has(currentNode.id)) {
    visited.add(currentNode.id);
    
    const timestamp = new Date().toISOString();
    let logEntry = {
      step,
      timestamp,
      nodeId: currentNode.id,
      nodeType: currentNode.type,
      nodeTitle: currentNode.data?.title || currentNode.data?.label || 'Untitled',
      status: 'executing',
      message: '',
    };
    
    switch (currentNode.type) {
      case 'start':
        logEntry.message = `Workflow started: ${currentNode.data?.title || 'Start'}`;
        logEntry.status = 'completed';
        break;
        
      case 'task':
        logEntry.message = `Task assigned to: ${currentNode.data?.assignee || 'Unassigned'}`;
        logEntry.status = 'pending';
        await delay(200);
        logEntry.status = 'completed';
        logEntry.message += ' - Task completed';
        break;
        
      case 'approval':
        const threshold = currentNode.data?.autoApproveThreshold || 0;
        if (threshold > 0) {
          logEntry.message = `Auto-approved by ${currentNode.data?.approverRole || 'Manager'} (threshold: ${threshold})`;
        } else {
          logEntry.message = `Approval required from ${currentNode.data?.approverRole || 'Manager'}`;
          logEntry.status = 'pending';
          await delay(300);
          logEntry.status = 'approved';
          logEntry.message += ' - Approved';
        }
        break;
        
      case 'automated':
        const actionId = currentNode.data?.actionId;
        const action = MOCK_AUTOMATIONS.find((a) => a.id === actionId);
        if (action) {
          logEntry.message = `Executing: ${action.label}`;
          logEntry.status = 'executing';
          await delay(400);
          logEntry.status = 'completed';
          logEntry.message += ' - Action completed successfully';
        } else {
          logEntry.message = 'No action selected';
          logEntry.status = 'skipped';
        }
        break;
        
      case 'end':
        logEntry.message = currentNode.data?.endMessage || 'Workflow completed';
        logEntry.status = 'completed';
        executionLog.push(logEntry);
        return {
          success: true,
          log: executionLog,
          summary: currentNode.data?.showSummary ? generateSummary(nodes, executionLog) : null,
        };
    }
    
    executionLog.push(logEntry);
    
    const outgoingEdges = edges.filter((e) => e.source === currentNode.id);
    if (outgoingEdges.length === 0) {
      if (currentNode.type !== 'end') {
        executionLog.push({
          step: step + 1,
          timestamp: new Date().toISOString(),
          nodeId: currentNode.id,
          nodeType: currentNode.type,
          status: 'error',
          message: 'No outgoing connection found',
        });
      }
      break;
    }
    
    const nextEdge = outgoingEdges[0];
    currentNode = nodes.find((n) => n.id === nextEdge.target);
    step++;
  }
  
  return {
    success: true,
    log: executionLog,
  };
};

const validateWorkflow = (nodes, edges) => {
  const errors = [];
  
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have at least one start node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one start node');
  }
  
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have at least one end node');
  }
  
  const nodeIds = new Set(nodes.map((n) => n.id));
  const edgeMap = new Map();
  edges.forEach((e) => {
    if (!edgeMap.has(e.source)) {
      edgeMap.set(e.source, []);
    }
    edgeMap.get(e.source).push(e.target);
  });
  
  const connectedNodes = new Set();
  edges.forEach((e) => {
    connectedNodes.add(e.source);
    connectedNodes.add(e.target);
  });
  
  nodes.forEach((n) => {
    if (!connectedNodes.has(n.id) && n.type !== 'start' && n.type !== 'end') {
      errors.push(`Node "${n.data?.title || n.id}" is not connected`);
    }
  });
  
  return errors;
};

const generateSummary = (nodes, log) => {
  const completed = log.filter((l) => l.status === 'completed' || l.status === 'approved').length;
  const total = nodes.length;
  
  return {
    totalNodes: total,
    completedNodes: completed,
    executionTime: `${log.length * 0.5}s (simulated)`,
    status: completed === total ? 'success' : 'partial',
  };
};
