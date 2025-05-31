import { describe, it, expect, beforeEach } from "vitest";
import { Tree } from "../../../../../src/base/classes/array/tree/tree";
import { FlattenedObject } from "../../../../../src/base/classes/array/tree/abstractions";

// Test data interfaces
interface TreeNode {
  id: number;
  name: string;
  children: TreeNode[];
}

interface FlatNode {
  id: number;
  name: string;
  children: FlatNode[];
  parent: number | null;
  depth: number;
}

describe("Tree Class", () => {
  let simpleTree: Tree<TreeNode>;
  let complexTree: Tree<TreeNode>;
  let emptyTree: Tree<TreeNode>;

  const simpleTreeData: TreeNode[] = [
    {
      id: 1,
      name: "Root 1",
      children: [
        {
          id: 2,
          name: "Child 1.1",
          children: [
            { id: 3, name: "Grandchild 1.1.1", children: [] },
            { id: 4, name: "Grandchild 1.1.2", children: [] },
          ],
        },
        { id: 5, name: "Child 1.2", children: [] },
      ],
    },
  ];

  const complexTreeData: TreeNode[] = [
    {
      id: 1,
      name: "Root 1",
      children: [
        {
          id: 2,
          name: "Child 1.1",
          children: [
            { id: 3, name: "Grandchild 1.1.1", children: [] },
            { id: 4, name: "Grandchild 1.1.2", children: [] },
          ],
        },
        { id: 5, name: "Child 1.2", children: [] },
      ],
    },
    {
      id: 6,
      name: "Root 2",
      children: [
        {
          id: 7,
          name: "Child 2.1",
          children: [{ id: 8, name: "Grandchild 2.1.1", children: [] }],
        },
      ],
    },
  ];

  beforeEach(() => {
    simpleTree = new Tree(simpleTreeData, "children");
    complexTree = new Tree(complexTreeData, "children");
    emptyTree = new Tree<TreeNode>([], "children");
  });

  describe("Constructor", () => {
    it("should create a tree from array data", () => {
      expect(simpleTree).toBeInstanceOf(Tree);
      expect(simpleTree).toBeInstanceOf(Array);
      expect(simpleTree.length).toBe(1);
      expect(simpleTree[0].id).toBe(1);
    });

    it("should handle empty array", () => {
      expect(emptyTree.length).toBe(0);
    });
  });

  describe("flatLength", () => {
    it("should return total count of all nodes in tree", () => {
      expect(simpleTree.flatLength).toBe(5); // 1 root + 2 children + 2 grandchildren
      expect(complexTree.flatLength).toBe(8); // 2 roots + 3 children + 3 grandchildren
      expect(emptyTree.flatLength).toBe(0);
    });
  });

  describe("getParents", () => {
    it("should return empty array for root element", () => {
      const parents = simpleTree.getParents("id", 1);
      expect(parents).toEqual([]);
    });

    it("should return correct parents for child element", () => {
      const parents = simpleTree.getParents("id", 2);
      expect(parents).toEqual([
        { id: 1, name: "Root 1", children: expect.any(Array) },
      ]);
    });

    it("should return correct parents for grandchild element", () => {
      const parents = simpleTree.getParents("id", 3);
      expect(parents).toHaveLength(2);
      expect(parents[0].id).toBe(1);
      expect(parents[1].id).toBe(2);
    });

    it("should return empty array for non-existent element", () => {
      const parents = simpleTree.getParents("id", 999);
      expect(parents).toEqual([]);
    });

    it("should work with string fields", () => {
      const parents = simpleTree.getParents("name", "Grandchild 1.1.1");
      expect(parents).toHaveLength(2);
      expect(parents[0].name).toBe("Root 1");
      expect(parents[1].name).toBe("Child 1.1");
    });
  });

  describe("getClosestParent", () => {
    it("should return null for root element", () => {
      const parent = simpleTree.getClosestParent("id", 1);
      expect(parent).toBeNull();
    });

    it("should return immediate parent for child element", () => {
      const parent = simpleTree.getClosestParent("id", 2);
      expect(parent?.id).toBe(1);
    });

    it("should return immediate parent for grandchild element", () => {
      const parent = simpleTree.getClosestParent("id", 3);
      expect(parent?.id).toBe(2);
    });

    it("should return null for non-existent element", () => {
      const parent = simpleTree.getClosestParent("id", 999);
      expect(parent).toBeNull();
    });
  });

  describe("getChildren", () => {
    it("should return children for element with children", () => {
      const children = simpleTree.getChildren("id", 1);
      expect(children).toHaveLength(2);
      expect(children[0].id).toBe(2);
      expect(children[1].id).toBe(5);
    });

    it("should return empty array for element without children", () => {
      const children = simpleTree.getChildren("id", 3);
      expect(children).toEqual([]);
    });

    it("should return empty array for non-existent element", () => {
      const children = simpleTree.getChildren("id", 999);
      expect(children).toEqual([]);
    });
  });

  describe("deepSearch", () => {
    it("should find root element", () => {
      const result = simpleTree.deepSearch("id", 1);
      expect(result?.object.id).toBe(1);
    });

    it("should find child element", () => {
      const result = simpleTree.deepSearch("id", 2);
      expect(result?.object.id).toBe(2);
    });

    it("should find grandchild element", () => {
      const result = simpleTree.deepSearch("id", 3);
      expect(result?.object.id).toBe(3);
    });

    it("should return undefined for non-existent element", () => {
      const result = simpleTree.deepSearch("id", 999);
      expect(result).toBeUndefined();
    });

    it("should work with string fields", () => {
      const result = simpleTree.deepSearch("name", "Child 1.1");
      expect(result?.object.name).toBe("Child 1.1");
    });
  });

  describe("joinHierarchically", () => {
    it("should join hierarchy in default direction (parent -> children)", () => {
      const result = simpleTree.joinHierachically("name", "Grandchild 1.1.1");
      expect(result).toBe("Root 1, Child 1.1, Grandchild 1.1.1");
    });

    it("should join hierarchy in reversed direction (children -> parent)", () => {
      const result = simpleTree.joinHierachically(
        "name",
        "Grandchild 1.1.1",
        ", ",
        "reversed"
      );
      expect(result).toBe("Grandchild 1.1.1, Child 1.1, Root 1");
    });

    it("should use custom divider", () => {
      const result = simpleTree.joinHierachically(
        "name",
        "Grandchild 1.1.1",
        " > "
      );
      expect(result).toBe("Root 1 > Child 1.1 > Grandchild 1.1.1");
    });

    it("should return error message for non-existent element", () => {
      const result = simpleTree.joinHierachically("name", "Non-existent");
      expect(result).toBe("Item not found");
    });

    it("should work for root element", () => {
      const result = simpleTree.joinHierachically("name", "Root 1");
      expect(result).toBe("Root 1");
    });
  });

  describe("recursiveForEach", () => {
    it("should iterate through all elements in tree", () => {
      const visitedIds: number[] = [];
      simpleTree.recursiveForEach((item) => {
        visitedIds.push(item.id);
      });
      expect(visitedIds).toEqual([1, 2, 3, 4, 5]);
    });

    it("should provide correct parameters to callback", () => {
      const callbackData: Array<{
        item: TreeNode;
        index: number;
        parent: TreeNode | null;
        array: TreeNode[];
      }> = [];

      simpleTree.recursiveForEach((item, index, parent, array) => {
        callbackData.push({ item, index, parent, array });
      });

      expect(callbackData).toHaveLength(5);
      expect(callbackData[0].item.id).toBe(1);
      expect(callbackData[0].index).toBe(0);
      expect(callbackData[0].parent).toBeNull();
    });
  });

  describe("flattern", () => {
    it("should flatten tree structure", () => {
      const flattened = simpleTree.flattern("id");
      expect(flattened).toHaveLength(5);

      // Check root element
      expect(flattened[0].id).toBe(1);
      expect(flattened[0].depth).toBe(0);
      expect(flattened[0].parent).toBeNull();

      // Check child element
      const child = flattened.find((item) => item.id === 2);
      expect(child?.depth).toBe(1);
      expect(child?.parent).toBe(1);

      // Check grandchild element
      const grandchild = flattened.find((item) => item.id === 3);
      expect(grandchild?.depth).toBe(2);
      expect(grandchild?.parent).toBe(2);
    });

    it("should include children when withChildren option is true", () => {
      const flattened = simpleTree.flattern("id", { withChildren: true });
      const rootItem = flattened.find((item) => item.id === 1);
      expect(rootItem?.children).toHaveLength(2);
    });

    it("should exclude children when withChildren option is false or not provided", () => {
      const flattened = simpleTree.flattern("id", { withChildren: false });
      const rootItem = flattened.find((item) => item.id === 1);
      expect(rootItem?.children).toEqual([]);
    });
  });

  describe("flatternAndMap", () => {
    it("should flatten and map with default callback", () => {
      const result = simpleTree.flatternAndMap("id");
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should flatten and map with custom callback", () => {
      const result = simpleTree.flatternAndMap("id", (item) => item.name);
      expect(result).toEqual([
        "Root 1",
        "Child 1.1",
        "Grandchild 1.1.1",
        "Grandchild 1.1.2",
        "Child 1.2",
      ]);
    });

    it("should provide correct parameters to callback", () => {
      const callbackData: Array<{ index: number; array: any[] }> = [];

      simpleTree.flatternAndMap("id", (item, index, array) => {
        callbackData.push({ index, array });
        return item.id;
      });

      expect(callbackData).toHaveLength(5);
      expect(callbackData[0].index).toBe(0);
      expect(callbackData[0].array).toHaveLength(5);
    });
  });

  describe("toArray", () => {
    it("should convert tree to regular array", () => {
      const array = simpleTree.toArray();
      expect(Array.isArray(array)).toBe(true);
      expect(array).toHaveLength(1);
      expect(array[0].id).toBe(1);
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle empty tree operations", () => {
      expect(emptyTree.flatLength).toBe(0);
      expect(emptyTree.getParents("id", 1)).toEqual([]);
      expect(emptyTree.getClosestParent("id", 1)).toBeNull();
      expect(emptyTree.getChildren("id", 1)).toEqual([]);
      expect(emptyTree.deepSearch("id", 1)).toBeUndefined();
    });

    it("should handle tree with single element without children", () => {
      const singleNodeTree = new Tree(
        [{ id: 1, name: "Single", children: [] }],
        "children"
      );

      expect(singleNodeTree.flatLength).toBe(1);
      expect(singleNodeTree.getParents("id", 1)).toEqual([]);
      expect(singleNodeTree.getChildren("id", 1)).toEqual([]);
    });

    it("should handle undefined/null values in search", () => {
      expect(simpleTree.getParents("id", null)).toEqual([]);
      expect(simpleTree.getParents("id", undefined)).toEqual([]);
      expect(simpleTree.deepSearch("id", null)).toBeUndefined();
    });
  });
});
