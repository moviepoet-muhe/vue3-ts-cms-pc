interface TreeNode {
  id: string
  pid: string
  children?: TreeNode[]
  [key: string]: any
}

// flatData: [
//   {id: '1', pid: '', name: '一级 1'},
//   {id: '2', pid: '1', name: '二级 1-1'},
//   {id: '3', pid: '1', name: '二级 1-2'}
// ]

// map: {
//   ['1']: {id: '1', pid: '', name: '一级 1', children: []},
//   ['2']: {id: '2', pid: '1', name: '二级 1-1', children: []},
//   ['3']: {id: '3', pid: '1', name: '二级 1-2', children: []}
// }

// [
//   {id: '1', pid: '', name: '一级 1', children: [
//     {id: '2', pid: '1', name: '二级 1-1', children: []},
//     {id: '3', pid: '1', name: '二级 1-2', children: []}
//   ]},
// ]


/**
 * 将扁平数据转树形数据
 * @param flatData 
 * @returns 
 */
function convertToTree(flatData: TreeNode[]): TreeNode[] {
  // 创建哈希表和根节点数组
  const map = new Map<string, TreeNode>()
  const tree: TreeNode[] = []

  // 第一遍遍历：创建节点映射
  flatData.forEach(item => {
    map.set(item.id, { ...item, children: [] })
  })

  // 第二遍遍历：构建树结构
  flatData.forEach(item => {
    const node = map.get(item.id)
    if (!item.pid || !map.has(item.pid)) {
      // 根节点（假设 pid 为 0 或父节点不存在时视为根节点）
      tree.push(node!)
    } else {
      // 找到父节点并添加到其 children
      const parent = map.get(item.pid)
      if (parent) {
        parent.children!.push(node!)
      }
    }
  })

  return tree
}

/**
 * 查找树中的所有叶子节点（支持多根节点树）
 * @param nodes 树节点数组
 * @returns 所有叶子节点数组
 */
function findLeafNodes(nodes: TreeNode[]): TreeNode[] {
  const leaves: TreeNode[] = []

  nodes.forEach(node => {
    // 当前节点是叶子节点
    if (!node.children || node.children.length === 0) {
      leaves.push(node)
    } else {
      // 递归处理子节点并合并结果
      leaves.push(...findLeafNodes(node.children))
    }
  })

  return leaves
}

export {
  convertToTree,
  findLeafNodes,
}