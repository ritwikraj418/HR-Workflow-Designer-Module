# HR Workflow Designer Module

A React-based workflow designer application built with React Flow (@xyflow/react) that allows HR administrators to visually create, configure, and test internal workflows such as onboarding, leave approval, and document verification.

## Architecture

### Project Structure

```
src/
├── components/
│   ├── nodes/
│   │   ├── StartNode.jsx
│   │   ├── TaskNode.jsx
│   │   ├── ApprovalNode.jsx
│   │   ├── AutomatedNode.jsx
│   │   └── EndNode.jsx
│   ├── NodeSidebar.jsx
│   ├── NodeEditPanel.jsx
│   ├── WorkflowTestPanel.jsx
│   └── WorkflowCanvas.jsx
├── services/
│   └── mockApi.js
├── types/
│   └── workflow.js
├── App.jsx
└── main.jsx
```

### Component Architecture

- **WorkflowCanvas**: Main React Flow canvas component managing nodes and edges state
- **Node Components**: Five custom node types (Start, Task, Approval, Automated, End) with memoized rendering
- **NodeSidebar**: Draggable node palette for adding nodes to canvas
- **NodeEditPanel**: Dynamic configuration forms for each node type
- **WorkflowTestPanel**: Workflow simulation and execution testing panel
- **Mock API Service**: Simulated backend for automations and workflow execution

### State Management

- React Flow hooks (`useNodesState`, `useEdgesState`) for canvas state
- Local component state for forms and UI panels
- React Flow context (`useReactFlow`) for canvas operations

### Data Flow

1. User drags node from sidebar → `onDragStart` sets node type in data transfer
2. User drops on canvas → `onDrop` converts coordinates and adds node
3. User clicks node → Opens `NodeEditPanel` with node data
4. User edits form → Updates node data via `updateNodeData`
5. User tests workflow → Serializes graph and sends to mock API

## How to Run

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

## Design Decisions

### 1. Modular Component Architecture

- **Separation of Concerns**: Each node type is a separate component, making it easy to extend
- **Reusable Forms**: NodeEditPanel uses dynamic form generation based on node type
- **Service Layer**: Mock API is abstracted into a service layer for easy replacement with real APIs

### 2. React Flow Integration

- **Custom Nodes**: All node types are custom React components with memoization for performance
- **Drag and Drop**: Implemented using native HTML5 drag-and-drop API with React Flow coordinate conversion
- **State Management**: Uses React Flow's built-in state hooks for canvas management

### 3. Type Safety & Extensibility

- **Centralized Type Definitions**: All node types and data structures defined in `types/workflow.js`
- **Factory Pattern**: `createNodeData()` function ensures consistent node initialization
- **Dynamic Form Generation**: Forms adapt based on node type and selected automation actions

### 4. Mock API Design

- **Async Simulation**: Realistic API delays for testing async patterns
- **Workflow Validation**: Server-side validation logic (can be moved to backend)
- **Execution Simulation**: Step-by-step workflow execution with status tracking
- **Error Handling**: Comprehensive error messages and validation feedback

### 5. User Experience

- **Visual Feedback**: Selected nodes highlighted, drag previews, status indicators
- **Contextual Editing**: Edit panel appears only when node is selected
- **Real-time Updates**: Changes to node data immediately reflected in canvas
- **Validation Feedback**: Clear error messages in test panel

## What They Completed vs. What They Would Add With More Time

### Completed Features

✅ **Core Workflow Canvas**
- Drag-and-drop node creation from sidebar
- Node connection with edges
- Node selection and deletion
- Canvas controls (zoom, pan, minimap)

✅ **Five Custom Node Types**
- Start Node with metadata support
- Task Node with assignee, due date, and custom fields
- Approval Node with approver role and auto-approval threshold
- Automated Step Node with dynamic action parameters
- End Node with completion message and summary toggle

✅ **Node Configuration Forms**
- Dynamic, type-specific editing panels
- Key-value pair management for metadata and custom fields
- Dynamic parameter fields based on selected automation actions
- Form validation and data persistence

✅ **Mock API Integration**
- GET /automations endpoint returning available actions
- POST /simulate endpoint for workflow execution
- Realistic async delays and error handling
- Workflow structure validation

✅ **Workflow Testing/Sandbox**
- Step-by-step execution simulation
- Execution log with status indicators
- Workflow validation (start/end nodes, connections)
- Execution summary with statistics

✅ **Architecture & Code Quality**
- Clean folder structure with separation of concerns
- Reusable custom hooks and components
- Type definitions and factory patterns
- Modular, extensible design

### What Would Be Added With More Time

🔲 **Export/Import Functionality**
- Export workflow as JSON
- Import workflow from JSON file
- Workflow templates library

🔲 **Enhanced User Experience**
- Undo/Redo functionality
- Node templates and presets
- Visual validation error indicators on nodes
- Auto-layout algorithms for better node positioning

🔲 **Advanced Workflow Features**
- Parallel execution paths support
- Conditional branching logic
- Node version history
- Workflow comparison and diffing

🔲 **Backend Integration**
- Real API endpoints replacing mock service
- Workflow persistence to database
- User authentication and authorization
- Workflow sharing and collaboration

🔲 **Advanced Validation**
- Cycle detection algorithms
- Complex workflow rule validation
- Real-time validation feedback
- Visual error highlighting

🔲 **Performance Optimizations**
- Virtual scrolling for large workflows
- Node rendering optimizations
- Workflow execution caching
- Lazy loading of node components

🔲 **Documentation & Testing**
- Comprehensive unit tests
- Integration tests for workflow execution
- Storybook documentation for components
- User guide and tutorials
