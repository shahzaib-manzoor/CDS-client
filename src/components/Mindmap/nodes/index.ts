import type { Node, NodeTypes, BuiltInNode } from "@xyflow/react";
import { PositionLoggerNode } from "./PositionLoggerNode";
import  TextUpdaterNode  from "./TextUpdaterNode";

export type PositionLoggerNode = Node<
  {
    label?: string;
  },
  "position-logger"
>;

export type AppNode = BuiltInNode | PositionLoggerNode | any;

export const initialNodes: AppNode[] = [
   
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  "textUpdater": TextUpdaterNode,
 
} satisfies NodeTypes;
