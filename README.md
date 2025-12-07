# HR Workflow Designer Module

A comprehensive React-based workflow designer application built with React Flow (@xyflow/react) that allows HR administrators to visually create, configure, and test internal workflows such as onboarding, leave approval, and document verification.

## 🎯 Features

### Core Functionality

- **Visual Workflow Canvas**: Drag-and-drop interface for building workflows
- **5 Custom Node Types**:
  - **Start Node**: Workflow entry point with metadata support
  - **Task Node**: Human tasks with assignee, due date, and custom fields
  - **Approval Node**: Manager/HR approval steps with auto-approval thresholds
  - **Automated Step Node**: System-triggered actions (email, document generation, etc.)
  - **End Node**: Workflow completion with optional summary
- **Node Configuration Forms**: Dynamic, type-specific editing panels for each node
- **Mock API Integration**: Simulated backend for automations and workflow execution
- **Workflow Testing/Sandbox**: Step-by-step execution simulation with validation
- **Workflow Validation**: Automatic validation of workflow structure (start/end nodes, connections, cycles)

### User Interface

- **Node Sidebar**: Drag nodes onto canvas
- **Node Edit Panel**: Context-aware forms for configuring node properties
- **Test Panel**: Execute and visualize workflow simulation
- **Mini-map**: Overview of the entire workflow
- **Zoom Controls**: Pan and zoom functionality

## 🏗️ Architecture

### Project Structure

```
src/
├── components/
│   ├── nodes/
│   │   ├── StartNode.jsx          # Start node component
│   │   ├── TaskNode.jsx            # Task node component
│   │   ├── ApprovalNode.jsx      # Approval node component
│   │   ├── AutomatedNode.jsx      # Automated step node component
│   │   └── EndNode.jsx             # End node component
│   ├── NodeSidebar.jsx             # Draggable node palette
│   ├── NodeEditPanel.jsx           # Dynamic node configuration forms
│   ├── WorkflowTestPanel.jsx       # Workflow simulation panel
│   └── WorkflowCanvas.jsx          # Main React Flow canvas
├── services/
│   └── mockApi.js                  # Mock API service layer
├── types/
│   └── workflow.js                  # Type definitions and node factories
├── App.jsx                          # Root component
└── main.jsx                         # Application entry point
```

### Design Decisions

#### 1. **Modular Component Architecture**

- **Separation of Concerns**: Each node type is a separate component, making it easy to extend
- **Reusable Forms**: NodeEditPanel uses dynamic form generation based on node type
- **Service Layer**: Mock API is abstracted into a service layer for easy replacement with real APIs

#### 2. **State Management**

- **React Flow Hooks**: Uses `useNodesState` and `useEdgesState` for canvas state
- **Local Component State**: Node forms and panels manage their own state
- **React Flow Context**: Leverages `useReactFlow` hook for canvas operations

#### 3. **Type Safety & Extensibility**

- **Centralized Type Definitions**: All node types and data structures defined in `types/workflow.js`
- **Factory Pattern**: `createNodeData()` function ensures consistent node initialization
- **Dynamic Form Generation**: Forms adapt based on node type and selected automation actions

#### 4. **Mock API Design**

- **Async Simulation**: Realistic API delays for testing async patterns
- **Workflow Validation**: Server-side validation logic (can be moved to backend)
- **Execution Simulation**: Step-by-step workflow execution with status tracking
- **Error Handling**: Comprehensive error messages and validation feedback

#### 5. **User Experience**

- **Visual Feedback**: Selected nodes highlighted, drag previews, status indicators
- **Contextual Editing**: Edit panel appears only when node is selected
- **Real-time Updates**: Changes to node data immediately reflected in canvas
- **Validation Feedback**: Clear error messages in test panel

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and Yarn package manager

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
yarn build
```

The built files will be in the `dist/` directory.

## 📖 Usage Guide

### Creating a Workflow

1. **Add Nodes**: Drag node types from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from a node's handle to another node to create connections
3. **Configure Nodes**: Click on a node to open the edit panel and configure its properties
4. **Test Workflow**: Click "Show Test Panel" button and then "Run Simulation" to test your workflow

### Node Types & Configuration

#### Start Node
- **Title**: Workflow start title
- **Metadata**: Key-value pairs for workflow initialization

#### Task Node
- **Title** (required): Task name
- **Description**: Detailed task description
- **Assignee**: Person responsible for the task
- **Due Date**: Task deadline
- **Custom Fields**: Additional key-value metadata

#### Approval Node
- **Title**: Approval step name
- **Approver Role**: Manager, HRBP, Director, or VP
- **Auto-approve Threshold**: Number threshold for automatic approval (0 = manual)

#### Automated Step Node
- **Title**: Action name
- **Action**: Select from available automated actions (Send Email, Generate Document, etc.)
- **Action Parameters**: Dynamic fields based on selected action

#### End Node
- **End Message**: Completion message
- **Show Summary**: Toggle to display execution summary

### Workflow Validation

The system automatically validates:
- ✅ Presence of exactly one start node
- ✅ Presence of at least one end node
- ✅ Node connectivity (no orphaned nodes)
- ✅ Basic structural integrity

## 🔧 Technical Details

### Dependencies

- **@xyflow/react**: React Flow library for workflow visualization
- **React 19**: UI framework
- **Vite**: Build tool and dev server

### Key Hooks & Patterns

- `useNodesState` / `useEdgesState`: React Flow state management
- `useReactFlow`: Access to React Flow instance and methods
- `useCallback`: Optimized event handlers
- `memo`: Performance optimization for node components

### Mock API Endpoints

#### `GET /automations`
Returns available automated actions:
```json
[
  {
    "id": "send_email",
    "label": "Send Email",
    "params": ["to", "subject", "body"],
    "description": "Send an email notification"
  }
]
```

#### `POST /simulate`
Simulates workflow execution:
```json
{
  "nodes": [...],
  "edges": [...]
}
```

Returns execution log with step-by-step results.

## 🎨 Customization

### Adding New Node Types

1. Create a new node component in `src/components/nodes/`
2. Add node type to `NODE_TYPES` in `src/types/workflow.js`
3. Update `createNodeData()` to handle new node type
4. Add node to `nodeTypes` object in `WorkflowCanvas.jsx`
5. Create form fields in `NodeEditPanel.jsx`

### Extending Mock API

Edit `src/services/mockApi.js` to:
- Add new automation actions
- Modify simulation logic
- Add new validation rules

## 🧪 Testing

The application includes a built-in workflow testing panel that:
- Serializes the workflow graph
- Validates workflow structure
- Simulates step-by-step execution
- Displays execution logs with status indicators
- Shows execution summary (if enabled)

## 📝 Assumptions & Limitations

### Assumptions

1. **No Authentication**: Application assumes no user authentication is required
2. **No Persistence**: Workflows are not saved to a backend (can be added via localStorage or API)
3. **Linear Execution**: Workflow simulation follows a simple linear path (first edge)
4. **Single Start Node**: Workflows must have exactly one start node
5. **Mock Data**: All API calls are mocked for demonstration purposes

### Known Limitations

- **No Undo/Redo**: History management not implemented
- **No Export/Import**: Workflow serialization not exposed to user
- **Simple Validation**: Cycle detection is basic (can be enhanced)
- **No Templates**: Node templates not implemented
- **Single Execution Path**: Parallel branches not fully simulated

## 🚧 Future Enhancements

Potential improvements (not implemented):

- Export/Import workflows as JSON
- Node templates and presets
- Undo/Redo functionality
- Advanced cycle detection
- Parallel execution paths
- Visual validation error indicators on nodes
- Auto-layout algorithms
- Node version history
- Real backend integration
- Workflow persistence

## 📄 License

This is a prototype/demonstration project.

## 👤 Author

Built as a technical assessment demonstrating:
- React and React Flow proficiency
- Complex form handling
- Mock API integration
- Scalable architecture
- Clean code organization

---

**Note**: This is a functional prototype focused on architectural clarity and working functionality. UI polish can be enhanced as needed.
