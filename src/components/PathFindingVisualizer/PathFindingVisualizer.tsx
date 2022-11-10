import React, { useEffect, useState } from "react";
import Node from "./Node/Node";
import { Box } from "@mui/material";
import {
  dijkstra,
  getAllNodes,
  getNodesInShortestPathOrder,
} from "../../algorithms/dijkstra";
import { depthFirstSearch, primsAlgorith } from "../../algorithms/maze";
import Layout from "../Drawer";
import { blueGrey, green, red } from "@mui/material/colors";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ShuffleOutlinedIcon from "@mui/icons-material/ShuffleOutlined";
import CleaningServicesOutlinedIcon from "@mui/icons-material/CleaningServicesOutlined";
import toast, { useToaster } from "react-hot-toast";
import { grey } from "@mui/material/colors";
export type TypeNode = {
  row: number;
  col: number;
  isStart?: boolean;
  isFinish?: boolean;
  distance?: number;
  isVisited?: boolean;
  isWall?: boolean;
  previousNode?: TypeNode | null;
  isWeighted?: boolean;
};
export type NodeOption =
  | "isWall"
  | "isWeighted"
  | "isStart"
  | "isFinish"
  | "reset"
  | "isVisited";
export type Grid = TypeNode[][];
const colLength = 53;
const generateNodes = (blank?: boolean) => {
  const grid = [];
  let wall = true;
  for (let row = 0; row < 35; row++) {
    const currentRow = [];

    for (let col = 0; col < colLength; col++) {
      if (Boolean(row % 2)) {
        if (col === 0) {
          wall = false;
        }
        wall = !wall;
      } else {
        wall = true;
      }
      // wall = Boolean(row % 2) ? !wall : true;
      const currentNode = {
        col,
        row,
        isStart: row === 17 && col === 5,
        isFinish: row === 17 && col === 45,
        distance: Infinity,
        isVisited: false,
        isWall:
          (row === 17 && col === 5) || (row === 17 && col === 45)
            ? false
            : wall,
        // isWall:true,
        previousNode: null,
      };
      currentRow.push(currentNode);
    }
    grid.push(currentRow);
  }
  if (blank) {
    return grid.map((row) =>
      row.map((col) => ({
        ...col,
        isWall: false,
        isStart: false,
        isFinish: false,
      }))
    );
  }
  return depthFirstSearch(grid, grid[1][1]);
  // return primsAlgorith(grid, grid[1][1]);
  return grid
};
const PathFindingVisualizer = () => {
  const { toasts } = useToaster();
  const [blankGrid, setBlankGrid] = useState<boolean>(false);
  const [nodeOption, setNodeOption] = useState<NodeOption>("isWall");
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const [animation, setAnimation] = useState<boolean>(false);
  const [state, setState] = useState<{
    grid: Grid;
    initialGrid: Grid;
    mousePressed?: boolean;
  }>({
    grid: [],
    initialGrid: [],
    mousePressed: false,
  });

  // useEffect(() => {

  //   // setNodes(path);
  // }, []);

  const handleGenerateNodes = (blank?: boolean) => {
    const grid = generateNodes(blank);
    const initialGrid = generateNodes();
    setState({ grid, initialGrid: initialGrid });
  };
  useEffect(() => {
    handleGenerateNodes();
  }, []);
  const handleResetGrid = (
    allNodes: TypeNode[],
    grid: Grid,
    initialGrid: Grid
  ) => {
    allNodes.forEach((node) => {
      grid[node.row][node.col].isVisited = false;
      grid[node.row][node.col].previousNode = null;
      grid[node.row][node.col].distance = Infinity;
      initialGrid[node.row][node.col].isVisited = false;
      initialGrid[node.row][node.col].previousNode = null;
      initialGrid[node.row][node.col].distance = Infinity;
    });
  };
  const handleResetNodes = (allNodes: TypeNode[]) => {
    allNodes.forEach((node) => {
      const element: HTMLElement | null = document.getElementById(
        `node-${node.row}-${node.col}`
      );
      if (
        element?.className === "node node-shortest-path" ||
        element?.className === "node node-visited"
      ) {
        element.className = "node";
      }
    });
  };
  const visualizeDijkstra = () => {
    const { grid, initialGrid } = state;
    const allNodes = getAllNodes(grid);
    handleResetGrid(allNodes, grid, initialGrid);
    handleResetNodes(allNodes);
    const startNode = allNodes.find((item: TypeNode) => item.isStart);
    const finishNode = allNodes.find((item: TypeNode) => item.isFinish);
    if (!startNode) {
      if (!toasts.length) {
        toast.error("Don't forget to add a start point");
      }
      return;
    }
    if (!finishNode) {
      if (!toasts.length) {
        toast.error("Don't forget to add a finish point");
      }

      return;
    }
    setAnimation(true);
    setBlankGrid(false);
    const visitedNodesInOrder: any = dijkstra(grid, startNode, finishNode);
    const shortestPath = getNodesInShortestPathOrder(finishNode);
    handleAnimateDijkstra(visitedNodesInOrder, shortestPath);
  };
  function handleAnimateDijkstra(
    visitedNodesInOrder: any[],
    shortestPath: any[]
  ) {
    for (let i = 0; i < visitedNodesInOrder?.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          handleAnimateShortestPath(shortestPath);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const element: HTMLElement | null = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (
          element &&
          element.className !== "node start-node" &&
          element.className !== "node finish-node"
        ) {
          element.className = "node node-visited";
        }
      }, 5 * i);
    }
  }
  function handleAnimateShortestPath(shortestPath: any[]) {
    for (let i = 0; i < shortestPath.length; i++) {
      if (i === shortestPath.length - 1) {
        setTimeout(() => {
          setAnimation(false);
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const node = shortestPath[i];
        const element: HTMLElement | null = document.getElementById(
          `node-${node.row}-${node.col}`
        );
        if (
          element &&
          element.className !== "node start-node" &&
          element.className !== "node finish-node"
        ) {
          element.className = "node node-shortest-path";
        }
      }, 50 * i);
    }
  }

  const handleNodeOption = (nodeOption: NodeOption, id?: number) => {
    setNodeOption(nodeOption);
    if (id) {
      setSelectedKey(id);
    }
  };

  return (
    <Layout
      selectedKey={selectedKey}
      tools={[
        {
          name: "Solve maze",
          icon: (
            <CheckCircleOutlineOutlinedIcon
              fontSize="large"
              sx={{ color: "#fff" }}
            />
          ),
          onClick: (e) => visualizeDijkstra(),
          disabled: animation,
        },
        {
          name: "Random maze",
          icon: <ShuffleOutlinedIcon fontSize="large" sx={{ color: "#fff" }} />,
          onClick: () => handleGenerateNodes(),
          disabled: animation,
        },
        {
          name: "Blank grid",
          icon: (
            <CleaningServicesOutlinedIcon
              fontSize="large"
              sx={{ color: "#fff" }}
            />
          ),
          onClick: () => {
            handleGenerateNodes(true);
            setBlankGrid(true);
          },
          disabled: animation,
        },
        {
          name: "Wall point",
          icon: (
            <Box
              sx={{
                width: "30px",
                height: "30px",
                bgcolor: "#2979ff",
                borderRadius: "50%",
              }}
            />
          ),
          onClick: () => handleNodeOption("isWall", 1),
          id: 1,
          disabled: animation,
        },
        {
          name: "Start point",
          icon: (
            <Box
              sx={{
                width: "30px",
                height: "30px",
                bgcolor: green[500],
                borderRadius: "50%",
              }}
            />
          ),
          onClick: () => handleNodeOption("isStart", 2),
          id: 2,
          disabled: animation,
        },
        {
          name: "Final point",
          icon: (
            <Box
              sx={{
                width: "30px",
                height: "30px",
                bgcolor: red[500],
                borderRadius: "50%",
              }}
            />
          ),
          onClick: () => handleNodeOption("isFinish", 3),
          id: 3,
          disabled: animation,
        },
        {
          name: "Blank space",
          icon: (
            <Box
              sx={{
                width: "30px",
                height: "30px",
                bgcolor: "#fff",
                borderRadius: "50%",
              }}
            />
          ),
          onClick: () => handleNodeOption("reset", 4),
          id: 4,
          disabled: animation,
        },
      ]}
    >
      {/* <button onClick={visualizeDijkstra}>click</button>
      <button onClick={() => setNodeOption("isWeighted")}>weight</button> */}

      <div
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: grey[900],
        }}
      >
        {/* <Box sx={{ width: "60%", display: "flex" }}> */}

        <div
          style={{
            width: `60%`,
            display: "flex",
            flexWrap: "wrap",
            outline: `1px solid ${blueGrey[900]}`,
          }}
          onMouseLeave={() => setState({ ...state, mousePressed: false })}
        >
          {state.grid.map((row: any, i: number) =>
            row.map((col: TypeNode, i: number) => (
              <Node
                key={i}
                node={col}
                setState={setState}
                state={state}
                nodeOption={nodeOption}
                colLength={colLength}
                blankGrid={blankGrid}
              />
            ))
          )}
        </div>

        {/* </Box> */}
      </div>
    </Layout>
  );
};

export default PathFindingVisualizer;
