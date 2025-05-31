# Goods

<p align="center">
 <a href="https://init.kz/en">
  <img src="assets/favicon.svg" width="100" height="100" alt="Logo">
 </a>
</p>

Some useful utils that imroves quality of live when developing in our primary stack

## Installation

```sh
npm install @init-kz/goods
```

## API

### React Hooks

#### `useDetailedEffect()`

useEffect with additional options for different cases

```js
useDetailedEffect(
  () => {
    // Your effect here
  },
  [deps],
  { skipFirstRender: true, stringifyDeps: true }
);
```

##### Options

- `skipFirstRender` - skips effect call on first render of component
- `stringifyDeps` - converts all objects deps to strings

#### `useClickOutside()`

Applies globalEventListener with cleanup, that triggers event when click occures outside a ref

```js
useClickOutside(ref, (event) => {
  console.log("Clicked outside ref");
});
```

##### Options

- `ref` - ref of element that will be a safe zone
- `event` - click event instance

### Data Structures

#### `Tree<T>`

A powerful tree data structure class that extends Array and provides comprehensive tree operations for hierarchical data.

```typescript
import { Tree } from "@init-kz/goods";

// Define your tree node interface
interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

// Create tree data
const treeData: TreeNode[] = [
  {
    id: 1,
    name: "Root",
    children: [
      {
        id: 2,
        name: "Child 1",
        children: [{ id: 3, name: "Grandchild 1", children: [] }],
      },
    ],
  },
];

// Initialize tree
const tree = new Tree(treeData, "children");
```

##### Constructor

- `treeArray: ArrayLike<T>` - Array-like structure containing tree data
- `childrenKey: keyof T` - Key that contains children array in each node

##### Key Methods

**Search Operations**

```typescript
// Deep search through entire tree
const result = tree.deepSearch("id", 3);
console.log(result?.object.name); // "Grandchild 1"

// Get all parents of a node
const parents = tree.getParents("id", 3);
console.log(parents.map((p) => p.name)); // ["Root", "Child 1"]

// Get immediate parent
const parent = tree.getClosestParent("id", 3);
console.log(parent?.name); // "Child 1"

// Get direct children
const children = tree.getChildren("id", 1);
console.log(children.length); // 1
```

**Hierarchy Operations**

```typescript
// Join hierarchy as string
const path = tree.joinHierachically("name", "Grandchild 1");
console.log(path); // "Root, Child 1, Grandchild 1"

// Reverse direction
const reversePath = tree.joinHierachically(
  "name",
  "Grandchild 1",
  " > ",
  "reversed"
);
console.log(reversePath); // "Grandchild 1 > Child 1 > Root"
```

**Iteration & Mapping**

```typescript
// Iterate through all nodes recursively
tree.recursiveForEach((node, index, parent, array) => {
  console.log(`${node.name} at depth ${tree.getParents("id", node.id).length}`);
});

// Flatten tree structure
const flattened = tree.flattern("id");
console.log(flattened[0].depth); // 0 (root)
console.log(flattened[0].parent); // null

// Flatten and map in one operation
const names = tree.flatternAndMap("id", (item) => item.name);
console.log(names); // ["Root", "Child 1", "Grandchild 1"]
```

**Utility Methods**

```typescript
// Get total count of all nodes
console.log(tree.flatLength); // 3

// Convert to regular array
const array = tree.toArray();
```

#### `Branch<T>`

A wrapper class for individual tree nodes that provides operations on node children.

```typescript
import { Branch } from "@init-kz/goods";

const nodeData: TreeNode = {
  id: 1,
  name: "Parent",
  children: [
    { id: 2, name: "Child 1", children: [] },
    { id: 3, name: "Child 2", children: [] },
  ],
};

const branch = new Branch(nodeData, "children");
```

##### Constructor

- `data: T` - The node data object
- `childrenKey: keyof T` - Key that contains children array

##### Key Methods

**Data Access**

```typescript
// Access original object
console.log(branch.object.name); // "Parent"

// Get/set children
console.log(branch.children.length); // 2
branch.children = [{ id: 4, name: "New Child", children: [] }];
```

**Recursive Operations**

```typescript
// Map children recursively while maintaining structure
const mapped = branch.mapChildrenRecursively((child, index, parent) => ({
  id: child.id,
  name: `Mapped ${child.name}`,
  children: [], // Will be filled by recursive mapping
  originalId: child.id,
}));

// Iterate through all children recursively
branch.forEachChildrenRecursively((child, index, parent) => {
  console.log(`Processing ${child.name}, parent: ${parent.name}`);
});
```

##### Type Safety

Both classes are fully typed with TypeScript generics:

```typescript
interface CustomNode {
  uuid: string;
  title: string;
  items: CustomNode[]; // Custom children key
}

const customTree = new Tree<CustomNode>(data, "items");
const customBranch = new Branch<CustomNode>(nodeData, "items");
```

##### Performance

- **O(n)** complexity for most operations where n is the number of nodes
- Efficient recursive operations with proper Tree instance creation
- Memory efficient with no unnecessary object duplication

## INFO

This package in active phase of development, if you encounter an issue visit [github issues](https://github.com/init-pkg/init-goods/issues)

### Contributing

Contributions are welcome! Feel free to submit issues or open pull requests to improve the project.

## License

```
The MIT License

Copyright (c) 2025 INIT.KZ
```
