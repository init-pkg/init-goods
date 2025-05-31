import { describe, it, expect, beforeEach } from "vitest";
import { Branch } from "../../../../../src/base/classes/array/tree/branch";

// Test data interfaces
interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

describe("Branch Class", () => {
  let rootBranch: Branch<TreeNode>;
  let childBranch: Branch<TreeNode>;
  let leafBranch: Branch<TreeNode>;

  const rootData: TreeNode = {
    id: 1,
    name: "Root",
    children: [
      {
        id: 2,
        name: "Child 1",
        children: [
          { id: 3, name: "Grandchild 1", children: [] },
          { id: 4, name: "Grandchild 2", children: [] },
        ],
      },
      { id: 5, name: "Child 2", children: [] },
    ],
  };

  const childData: TreeNode = {
    id: 2,
    name: "Child 1",
    children: [
      { id: 3, name: "Grandchild 1", children: [] },
      { id: 4, name: "Grandchild 2", children: [] },
    ],
  };

  const leafData: TreeNode = {
    id: 3,
    name: "Grandchild 1",
    children: [],
  };

  beforeEach(() => {
    rootBranch = new Branch(rootData, "children");
    childBranch = new Branch(childData, "children");
    leafBranch = new Branch(leafData, "children");
  });

  describe("Constructor", () => {
    it("should create a branch from node data", () => {
      expect(rootBranch).toBeInstanceOf(Branch);
      expect(rootBranch.object).toEqual(rootData);
    });
  });

  describe("object getter", () => {
    it("should return the original data object", () => {
      expect(rootBranch.object).toBe(rootData);
      expect(rootBranch.object.id).toBe(1);
      expect(rootBranch.object.name).toBe("Root");
    });
  });

  describe("children getter", () => {
    it("should return children array for node with children", () => {
      const children = rootBranch.children;
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(5);
    });

    it("should return empty array for leaf node", () => {
      const children = leafBranch.children;
      expect(children).toEqual([]);
    });
  });

  describe("children setter", () => {
    it("should set children array", () => {
      const newChildren: TreeNode[] = [
        { id: 6, name: "New Child", children: [] },
      ];

      leafBranch.children = newChildren;
      expect(leafBranch.children).toEqual(newChildren);
      expect(leafBranch.object.children).toEqual(newChildren);
    });

    it("should accept ArrayLike objects", () => {
      const newChildren = {
        0: { id: 6, name: "New Child", children: [] },
        length: 1,
      };

      leafBranch.children = newChildren;
      expect(leafBranch.children).toHaveLength(1);
      expect(leafBranch.children[0].id).toBe(6);
    });
  });

  describe("mapChildrenRecursively", () => {
    it("should map children and maintain tree structure", () => {
      interface MappedNode {
        id: number;
        name: string;
        children: MappedNode[];
        originalId: number;
      }

      const mapped = rootBranch.mapChildrenRecursively<MappedNode>(
        (item, index, parent) => ({
          id: item.id,
          name: `Mapped ${item.name}`,
          children: [], // Will be filled by recursive mapping
          originalId: item.id,
        })
      );

      expect(mapped).toHaveLength(2);
      expect(mapped[0].name).toBe("Mapped Child 1");
      expect(mapped[0].children).toHaveLength(2);
      expect(mapped[0].children[0].name).toBe("Mapped Grandchild 1");
      expect(mapped[1].name).toBe("Mapped Child 2");
    });

    it("should provide correct parameters to callback", () => {
      const callbackData: Array<{
        item: TreeNode;
        index: number;
        parent: TreeNode;
        array: TreeNode[];
      }> = [];

      rootBranch.mapChildrenRecursively((item, index, parent, array) => {
        callbackData.push({ item, index, parent, array });
        return { id: item.id, name: item.name, children: [] };
      });

      expect(callbackData).toHaveLength(4); // 2 children + 2 grandchildren

      // Check first child
      expect(callbackData[0].item.id).toBe(2);
      expect(callbackData[0].index).toBe(0);
      expect(callbackData[0].parent.id).toBe(1);

      // Check first grandchild
      expect(callbackData[1].item.id).toBe(3);
      expect(callbackData[1].index).toBe(0);
      expect(callbackData[1].parent.id).toBe(2);
    });

    it("should handle empty children", () => {
      // Use a fresh leaf branch to ensure it has empty children
      const freshLeafBranch = new Branch(
        {
          id: 3,
          name: "Grandchild 1",
          children: [],
        },
        "children"
      );

      const mapped = freshLeafBranch.mapChildrenRecursively((item) => ({
        id: item.id,
        name: item.name,
        children: [],
      }));

      expect(mapped).toEqual([]);
    });
  });

  describe("forEachChildrenRecursively", () => {
    it("should iterate through all children recursively", () => {
      const visitedIds: number[] = [];

      rootBranch.forEachChildrenRecursively((item) => {
        visitedIds.push(item.id);
      });

      expect(visitedIds).toEqual([2, 3, 4, 5]);
    });

    it("should provide correct parameters to callback", () => {
      const callbackData: Array<{
        item: TreeNode;
        index: number;
        parent: TreeNode;
        array: TreeNode[];
      }> = [];

      rootBranch.forEachChildrenRecursively((item, index, parent, array) => {
        callbackData.push({ item, index, parent, array });
      });

      expect(callbackData).toHaveLength(4);

      // Check first child
      expect(callbackData[0].item.id).toBe(2);
      expect(callbackData[0].index).toBe(0);
      expect(callbackData[0].parent.id).toBe(1);
      expect(callbackData[0].array).toHaveLength(2);

      // Check first grandchild
      expect(callbackData[1].item.id).toBe(3);
      expect(callbackData[1].index).toBe(0);
      expect(callbackData[1].parent.id).toBe(2);
      expect(callbackData[1].array).toHaveLength(2);
    });

    it("should handle empty children", () => {
      // Use a fresh leaf branch to ensure it has empty children
      const freshLeafBranch = new Branch(
        {
          id: 3,
          name: "Grandchild 1",
          children: [],
        },
        "children"
      );

      const visitedIds: number[] = [];

      freshLeafBranch.forEachChildrenRecursively((item) => {
        visitedIds.push(item.id);
      });

      expect(visitedIds).toEqual([]);
    });

    it("should handle single level children", () => {
      const singleLevelBranch = new Branch(
        {
          id: 1,
          name: "Parent",
          children: [
            { id: 2, name: "Child 1", children: [] },
            { id: 3, name: "Child 2", children: [] },
          ],
        },
        "children"
      );

      const visitedIds: number[] = [];

      singleLevelBranch.forEachChildrenRecursively((item) => {
        visitedIds.push(item.id);
      });

      expect(visitedIds).toEqual([2, 3]);
    });
  });

  describe("Edge cases", () => {
    it("should handle nodes with different children key", () => {
      interface CustomNode {
        id: number;
        name: string;
        items: CustomNode[];
      }

      const customData: CustomNode = {
        id: 1,
        name: "Custom Root",
        items: [{ id: 2, name: "Custom Child", items: [] }],
      };

      const customBranch = new Branch(customData, "items");

      expect(customBranch.children).toHaveLength(1);
      expect(customBranch.children[0].id).toBe(2);
    });

    it("should handle undefined children gracefully", () => {
      interface NodeWithOptionalChildren {
        id: number;
        name: string;
        children?: NodeWithOptionalChildren[];
      }

      const nodeData: NodeWithOptionalChildren = {
        id: 1,
        name: "Node without children",
      };

      const branch = new Branch(nodeData, "children");

      // Should not throw, though children would be undefined
      expect(() => branch.children).not.toThrow();
    });
  });
});
