import { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { NODE_TYPES } from '../types/workflow';
import { getAutomations } from '../services/mockApi';

const NodeEditPanel = ({ selectedNode, onClose }) => {
  const { updateNodeData } = useReactFlow();
  const [formData, setFormData] = useState({});
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metadataFields, setMetadataFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    if (selectedNode) {
      setFormData(selectedNode.data || {});
      
      if (selectedNode.type === NODE_TYPES.AUTOMATED) {
        loadAutomations();
      }
      
      if (selectedNode.type === NODE_TYPES.START && selectedNode.data?.metadata) {
        setMetadataFields(
          Object.entries(selectedNode.data.metadata).map(([key, value]) => ({ key, value }))
        );
      }
      
      if (selectedNode.type === NODE_TYPES.TASK && selectedNode.data?.customFields) {
        setCustomFields(
          Object.entries(selectedNode.data.customFields).map(([key, value]) => ({ key, value }))
        );
      }
    }
  }, [selectedNode]);

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const response = await getAutomations();
      if (response.success) {
        setAutomations(response.data);
      }
    } catch (error) {
      console.error('Failed to load automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!selectedNode) return;

    const updatedData = { ...formData };

    if (selectedNode.type === NODE_TYPES.START) {
      const metadata = {};
      metadataFields.forEach(({ key, value }) => {
        if (key) metadata[key] = value;
      });
      updatedData.metadata = metadata;
    }

    if (selectedNode.type === NODE_TYPES.TASK) {
      const customFieldsObj = {};
      customFields.forEach(({ key, value }) => {
        if (key) customFieldsObj[key] = value;
      });
      updatedData.customFields = customFieldsObj;
    }

    if (selectedNode.type === NODE_TYPES.AUTOMATED && formData.actionId) {
      const selectedAction = automations.find((a) => a.id === formData.actionId);
      if (selectedAction) {
        const actionParams = {};
        selectedAction.params.forEach((param) => {
          actionParams[param] = formData[`param_${param}`] || '';
        });
        updatedData.actionParams = actionParams;
      }
    }

    updateNodeData(selectedNode.id, updatedData);
    onClose();
  };

  const addMetadataField = () => {
    setMetadataFields([...metadataFields, { key: '', value: '' }]);
  };

  const updateMetadataField = (index, field, value) => {
    const updated = [...metadataFields];
    updated[index] = { ...updated[index], [field]: value };
    setMetadataFields(updated);
  };

  const removeMetadataField = (index) => {
    setMetadataFields(metadataFields.filter((_, i) => i !== index));
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  const updateCustomField = (index, field, value) => {
    const updated = [...customFields];
    updated[index] = { ...updated[index], [field]: value };
    setCustomFields(updated);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  if (!selectedNode) return null;

  const selectedAction = automations.find((a) => a.id === formData.actionId);

  return (
    <div
      style={{
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 4,
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        minWidth: '320px',
        maxWidth: '400px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          Edit {selectedNode.type} Node
        </h3>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {selectedNode.type === NODE_TYPES.START && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Start Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter start title"
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Metadata (Key-Value)</label>
                <button
                  onClick={addMetadataField}
                  style={{
                    padding: '4px 8px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  + Add
                </button>
              </div>
              {metadataFields.map((field, index) => (
                <div key={index} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                    style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                    style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <button
                    onClick={() => removeMetadataField(index)}
                    style={{
                      padding: '6px 10px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedNode.type === NODE_TYPES.TASK && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                  minHeight: '60px',
                  resize: 'vertical',
                }}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee || ''}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter assignee name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Custom Fields</label>
                <button
                  onClick={addCustomField}
                  style={{
                    padding: '4px 8px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  + Add
                </button>
              </div>
              {customFields.map((field, index) => (
                <div key={index} style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  <input
                    type="text"
                    placeholder="Key"
                    value={field.key}
                    onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                    style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                    style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                  />
                  <button
                    onClick={() => removeCustomField(index)}
                    style={{
                      padding: '6px 10px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedNode.type === NODE_TYPES.APPROVAL && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter approval title"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Approver Role
              </label>
              <select
                value={formData.approverRole || 'Manager'}
                onChange={(e) => handleInputChange('approverRole', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
              >
                <option value="Manager">Manager</option>
                <option value="HRBP">HRBP</option>
                <option value="Director">Director</option>
                <option value="VP">VP</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Auto-approve Threshold
              </label>
              <input
                type="number"
                value={formData.autoApproveThreshold || 0}
                onChange={(e) => handleInputChange('autoApproveThreshold', parseInt(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                min="0"
                placeholder="0 = manual approval"
              />
            </div>
          </>
        )}

        {selectedNode.type === NODE_TYPES.AUTOMATED && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter action title"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                Action
              </label>
              {loading ? (
                <div style={{ padding: '8px', textAlign: 'center', color: '#666' }}>Loading...</div>
              ) : (
                <select
                  value={formData.actionId || ''}
                  onChange={(e) => handleInputChange('actionId', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '13px',
                  }}
                >
                  <option value="">Select an action</option>
                  {automations.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {selectedAction && (
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                  Action Parameters
                </label>
                {selectedAction.params.map((param) => (
                  <div key={param} style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder={param}
                      value={formData[`param_${param}`] || ''}
                      onChange={(e) => handleInputChange(`param_${param}`, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '13px',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {selectedNode.type === NODE_TYPES.END && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                End Message
              </label>
              <input
                type="text"
                value={formData.endMessage || ''}
                onChange={(e) => handleInputChange('endMessage', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                placeholder="Enter end message"
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={formData.showSummary || false}
                  onChange={(e) => handleInputChange('showSummary', e.target.checked)}
                  style={{ width: '18px', height: '18px' }}
                />
                Show Summary
              </label>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeEditPanel;

