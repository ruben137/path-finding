import React from "react";
import { Grid, NodeOption, TypeNode } from "../PathFindingVisualizer";
import "./Node.css";
import ToysIcon from "@mui/icons-material/Toys";
import { useState, useEffect } from "react";
import { blueGrey, grey } from "@mui/material/colors";
interface Props {
  node: TypeNode;
  paint?: boolean;
  setState: React.Dispatch<
    React.SetStateAction<{
      grid: Grid;
      initialGrid: Grid;
      mousePressed?: boolean;
    }>
  >;
  state: {
    grid: Grid;
    initialGrid: Grid;
    mousePressed?: boolean;
  };
  nodeOption: NodeOption;
  colLength: number;
  blankGrid: boolean;
}
const nodeOptions: NodeOption[] = [
  "isWall",
  "isVisited",
  "isFinish",
  "isStart",
  "isWeighted",
];
const Node = ({
  node,
  state,
  setState,
  nodeOption,
  colLength,
  blankGrid,
}: Props) => {
  const handleClassName = (): string => {
    if (node.isWeighted) {
      return "node weight-node";
    }
    if (node.isWall) {
      return "node wall-node";
    }
    if (node.isFinish) {
      return "node finish-node";
    }

    if (node.isStart) {
      return "node start-node";
    }
    return "node";
  };
  const handleFilterOptions = (nodeOption: NodeOption): NodeOption[] => {
    return nodeOptions.filter((option) => option !== nodeOption);
  };
  const handleFinishAndStart = (grid: Grid, initialGrid: Grid) => {
    if (nodeOption === "reset") {
      return;
    }
    const allNodes = state.grid.reduce((a, b) => [...b, ...a], []);
    const prevNode = allNodes.find((node) => node[nodeOption]);
    if (prevNode) {
      grid[prevNode.row][prevNode.col][nodeOption] = false;
      initialGrid[prevNode.row][prevNode.col][nodeOption] = false;
    }
  };
  const handleWall = (node: TypeNode, pressed: boolean) => {
    let { grid, initialGrid } = state;
    const newNode = node;
    // if (nodeOption === "reset") {
    //   newNode.isFinish = false;
    //   newNode.isStart = false;
    //   newNode.isWall = false;
    //   newNode.isWeighted = false;
    //   grid[newNode.row][newNode.col] = newNode;
    //   initialGrid[newNode.row][newNode.col] = newNode;
    //   setState({ ...state, grid, initialGrid });
    //   return;
    // }
    const filteredOptions = handleFilterOptions(nodeOption);

    filteredOptions.forEach((option: NodeOption) => {
      if (option !== "reset") {
        newNode[option] = false;
      }
    });

    if (nodeOption === "isStart" || nodeOption === "isFinish") {
      handleFinishAndStart(grid, initialGrid);
    }
    if (nodeOption !== "reset") {
      newNode[nodeOption] = true;
    }
    grid[newNode.row][newNode.col] = newNode;
    initialGrid[newNode.row][newNode.col] = newNode;
    if (pressed) {
      setState({ grid, initialGrid, mousePressed: pressed });
    } else {
      setState({ ...state, grid, initialGrid });
    }
  };
  const handleMouseDown = () => {
    handleWall(node, true);
  };

  const handleMouseEnter = () => {
    if (!state.mousePressed) return;
    handleWall(node, false);
  };

  const handleMouseUp = () => {
    setState({ ...state, mousePressed: false });
  };
  const className = handleClassName();

  useEffect(() => {
    const element: HTMLElement | null = document.getElementById(
      `node-${node.row}-${node.col}`
    );
    if (
      element?.className === "node node-shortest-path" ||
      element?.className === "node node-visited"
    ) {
      element.className = handleClassName();
    }
  }, [state.grid]);
  return (
    <div
      id={`node-${node.row}-${node.col}`}
      className={className}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      style={{
        position: "relative",
        width: `calc(100%/${colLength})`,
        paddingBottom: `calc(100%/${colLength})`,
        outline: blankGrid ? `1px solid ${blueGrey[900]}` : "none",
      }}
    >
      {node.isWeighted && (
        <ToysIcon
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
          }}
        />
      )}
    </div>
  );
};

export default Node;
