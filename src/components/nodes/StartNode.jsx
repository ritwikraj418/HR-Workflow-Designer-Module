import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const StartNode = ({ data, selected }) => {
  return (
    <div
      className={`start-node ${selected ? 'selected' : ''}`}
      style={{
        padding: '12px 16px',
        background: '#10b981',
        color: 'white',
        borderRadius: '8px',
        minWidth: '120px',
        textAlign: 'center',
        fontWeight: '600',
        boxShadow: selected ? '0 0 0 2px #059669' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontSize: '14px' }}>{data?.title || 'Start'}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#059669' }} />
    </div>
  );
};

export default memo(StartNode);

