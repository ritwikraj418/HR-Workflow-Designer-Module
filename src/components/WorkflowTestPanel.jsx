import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { simulateWorkflow } from '../services/mockApi';

const WorkflowTestPanel = ({ onClose }) => {
  const { getNodes, getEdges } = useReactFlow();
  const [isRunning, setIsRunning] = useState(false);
  const [executionLog, setExecutionLog] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setIsRunning(true);
    setError(null);
    setExecutionLog(null);

    const nodes = getNodes();
    const edges = getEdges();

    if (nodes.length === 0) {
      setError('Workflow is empty. Add some nodes first.');
      setIsRunning(false);
      return;
    }

    try {
      const workflowData = {
        nodes: nodes.map((node) => ({
          id: node.id,
          type: node.type,
          data: node.data,
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      };

      const result = await simulateWorkflow(workflowData);

      if (result.success) {
        setExecutionLog(result);
      } else {
        setError(result.error || 'Simulation failed');
        if (result.errors) {
          setError(result.errors.join(', '));
        }
      }
    } catch (err) {
      setError(`Failed to simulate workflow: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return '#10b981';
      case 'executing':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 4,
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        minWidth: '400px',
        maxWidth: '500px',
        maxHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Workflow Test Panel</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          ×
        </button>
      </div>

      <button
        onClick={handleTest}
        disabled={isRunning}
        style={{
          padding: '10px 16px',
          background: isRunning ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '16px',
        }}
      >
        {isRunning ? 'Running...' : 'Run Simulation'}
      </button>

      {error && (
        <div
          style={{
            padding: '12px',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {executionLog && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            padding: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Execution Log
          </h4>
          {executionLog.log && executionLog.log.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {executionLog.log.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    padding: '10px',
                    background: '#f9fafb',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${getStatusColor(entry.status)}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>
                      Step {entry.step}: {entry.nodeTitle}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        background: getStatusColor(entry.status),
                        color: 'white',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px' }}>
                    {entry.nodeType} • {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#374151' }}>{entry.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
              No execution log available
            </div>
          )}

          {executionLog.summary && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                background: '#ecfdf5',
                borderRadius: '4px',
                border: '1px solid #10b981',
              }}
            >
              <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>Summary</h5>
              <div style={{ fontSize: '12px', color: '#065f46' }}>
                <div>Total Nodes: {executionLog.summary.totalNodes}</div>
                <div>Completed: {executionLog.summary.completedNodes}</div>
                <div>Execution Time: {executionLog.summary.executionTime}</div>
                <div>Status: {executionLog.summary.status}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {!executionLog && !error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
          Click "Run Simulation" to test your workflow
        </div>
      )}
    </div>
  );
};

export default WorkflowTestPanel;

