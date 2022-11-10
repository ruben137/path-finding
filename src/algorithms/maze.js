export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const getNextNeighbor = (neighbours) => {
  return getRandomElement(neighbours);
};
const getWallNeigbours = (grid, node) => {
  const neighbours = [];
  const { col, row } = node;
  if (row > 1)
    neighbours.push({
      ...grid[row - 2][col],
      betweenNode: grid[row - 1][col],
      // previousNode:node
    }); //up
  if (row < grid.length - 2)
    neighbours.push({
      ...grid[row + 2][col],
      betweenNode: grid[row + 1][col],
      // previousNode:node
    }); //down
  if (col > 1)
    neighbours.push({
      ...grid[row][col - 2],
      betweenNode: grid[row][col - 1],
      // previousNode:node
    }); // left
  if (col < grid[0].length - 2)
    neighbours.push({
      ...grid[row][col + 2],
      betweenNode: grid[row][col + 1],
      // previousNode:node
    }); //right
  return neighbours.filter((neighbour) => !neighbour.isVisited);
};

const getWalls = (grid, node) => {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]); //up
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]); //down
  if (col > 0) neighbours.push(grid[row][col - 1]); // left
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]); //right
  return neighbours.filter((neighbor) => neighbor.isWall);
};
const getCells = (grid, node) => {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]); //up
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]); //down
  if (col > 0) neighbours.push(grid[row][col - 1]); // left
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]); //right
  return neighbours;
};
const getUnvisitedCells = (grid, node) => {
  const neighbours = [];
  const { col, row } = node;
  if (row > 0) neighbours.push(grid[row - 1][col]); //up
  if (row < grid.length - 1) neighbours.push(grid[row + 1][col]); //down
  if (col > 0) neighbours.push(grid[row][col - 1]); // left
  if (col < grid[0].length - 1) neighbours.push(grid[row][col + 1]); //right
  return neighbours.filter((x) => !x.isVisited);
};
const handleVisitWalls = (grid, walls) => {
  walls.forEach((wall) => {
    grid[wall.row][wall.col].isVisited = true;
  });
};
const checkIfOnlyOneIsVisited = (grid, node) => {
  const cells = getCells(grid, node);
  const unvisitedCells = cells.filter((cell) => !cell.isVisited);
// handleVisitWalls(grid,unvisitedCells)
  const visitedCells = cells.filter((x) => x.isVisited);
  return visitedCells.length === 1;
};

export const depthFirstSearch = (grid, startNode) => {
  startNode.isVisited = true;
  let cellNeighbours = getWallNeigbours(grid, startNode);
  if (!cellNeighbours.length) {
    if (startNode.previousNode) {
      return depthFirstSearch(
        grid,
        grid[startNode.previousNode.row][startNode.previousNode.col]
      );
    }
    return grid.map((row) =>
      row.map((col) => ({ ...col, isVisited: false, previousNode: null }))
    );
  }
  const nextNeighbour = getNextNeighbor(cellNeighbours);
  grid[nextNeighbour.betweenNode.row][
    nextNeighbour.betweenNode.col
  ].isWall = false;
  grid[nextNeighbour.row][nextNeighbour.col].previousNode = startNode;
  return depthFirstSearch(grid, grid[nextNeighbour.row][nextNeighbour.col]);
};

export const primsAlgorith = (grid, startNode, path = []) => {
  let wallList = [];
  grid[startNode.row][startNode.col].isWall = false;
  grid[startNode.row][startNode.col].isVisited = true;
  const walls = getWalls(grid, grid[startNode.row][startNode.col]);

  wallList.push(...walls);
  while (wallList.length) {
    const randomWall = wallList[0]
    const i = wallList.findIndex(
      (wall) => wall.row === randomWall.row && wall.col === randomWall.col
    );

    if (checkIfOnlyOneIsVisited(grid, grid[randomWall.row][randomWall.col])) {
      grid[randomWall.row][randomWall.col].isWall = false;
      grid[randomWall.row][randomWall.col].isVisited = true;
      const newWalls = getWalls(grid, grid[randomWall.row][randomWall.col]);

      wallList.push(...newWalls);
    }
    const index = wallList.findIndex(
      (wall) => wall.row === randomWall.row && wall.col === randomWall.col
    );
    const filterWallList = wallList.filter((_, i) => i !== index).sort(()=>Math.random()-0.5)

    wallList = filterWallList;
  }

  return grid.map((row) =>
    row.map((col) => ({ ...col, isVisited: false, previousNode: null }))
  );
};
