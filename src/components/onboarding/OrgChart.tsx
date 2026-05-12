"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";

// ─── Custom Node ────────────────────────────
type OrgNodeData = {
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  onUpdate: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
};

function OrgNode({ id, data }: { id: string; data: OrgNodeData }) {
  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#3ecf8e] !border-2 !border-zinc-900"
      />
      <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-4 min-w-[220px] transition-all duration-200 hover:shadow-xl hover:border-[#3ecf8e]/50">
        <div className="flex items-center gap-2 mb-3">
          <GripVertical className="w-4 h-4 text-zinc-500 cursor-grab" />
          <div className="flex-1">
            <input
              className="w-full text-sm font-bold bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-[#3ecf8e] focus:outline-none transition-colors pb-0.5 text-white placeholder:text-zinc-600"
              value={data.nome}
              placeholder="Nome do colaborador"
              onChange={(e) => data.onUpdate(id, "nome", e.target.value)}
            />
          </div>
          <button
            onClick={() => data.onDelete(id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          className="w-full text-xs font-semibold bg-[#3ecf8e]/10 text-[#3ecf8e] rounded-md px-2 py-1.5 mb-3 border border-transparent focus:outline-none focus:border-[#3ecf8e]/50 focus:bg-[#3ecf8e]/20 transition-colors placeholder:text-[#3ecf8e]/50"
          value={data.cargo}
          placeholder="Cargo"
          onChange={(e) => data.onUpdate(id, "cargo", e.target.value)}
        />

        <div className="grid grid-cols-2 gap-1.5">
          <input
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#3ecf8e]/50 focus:ring-1 focus:ring-[#3ecf8e]/50 text-zinc-300 placeholder:text-zinc-600"
            value={data.departamento}
            placeholder="Depto."
            onChange={(e) =>
              data.onUpdate(id, "departamento", e.target.value)
            }
          />
          <input
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 focus:outline-none focus:border-[#3ecf8e]/50 focus:ring-1 focus:ring-[#3ecf8e]/50 text-zinc-300 placeholder:text-zinc-600"
            value={data.email}
            placeholder="Email"
            onChange={(e) => data.onUpdate(id, "email", e.target.value)}
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#3ecf8e] !border-2 !border-zinc-900"
      />
    </div>
  );
}

const nodeTypes = { orgNode: OrgNode };

// ─── Types para exportação ──────────────────
export type OrgNodeExport = {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  parentId?: string;
};

// ─── Componente Principal ───────────────────
export function OrgChart({
  onChange,
}: {
  onChange: (nodes: OrgNodeExport[]) => void;
}) {
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const defaultNode: Node = {
    id: "org-0",
    type: "orgNode",
    position: { x: 300, y: 50 },
    data: {
      nome: "",
      cargo: "CEO / Diretor Geral",
      departamento: "",
      email: "",
      onUpdate: () => {},
      onDelete: () => {},
    },
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([defaultNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  const updateNodeData = useCallback(
    (nodeId: string, field: string, value: string) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeId) {
            return {
              ...n,
              data: { ...n.data, [field]: value },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  // Inject handlers into node data
  const nodesWithHandlers = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      onUpdate: updateNodeData,
      onDelete: deleteNode,
    },
  }));

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            style: { stroke: "#3ecf8e", strokeWidth: 2.5 },
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = () => {
    const newId = `org-${nodeIdCounter}`;
    setNodeIdCounter((c) => c + 1);

    const newNode: Node = {
      id: newId,
      type: "orgNode",
      position: {
        x: 100 + Math.random() * 400,
        y: 100 + nodeIdCounter * 120,
      },
      data: {
        nome: "",
        cargo: "",
        departamento: "",
        email: "",
        onUpdate: updateNodeData,
        onDelete: deleteNode,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Sincronizar com o componente pai
  const exportNodes = useCallback(() => {
    const exported: OrgNodeExport[] = nodes.map((n) => {
      const parentEdge = edges.find((e) => e.target === n.id);
      return {
        id: n.id,
        nome: (n.data as OrgNodeData).nome || "",
        cargo: (n.data as OrgNodeData).cargo || "",
        departamento: (n.data as OrgNodeData).departamento || "",
        email: (n.data as OrgNodeData).email || "",
        parentId: parentEdge?.source,
      };
    });
    onChange(exported);
  }, [nodes, edges, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Arraste para posicionar. Conecte os pontos para definir hierarquia.
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNode}
            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white text-zinc-300 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Adicionar Cargo
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={exportNodes}
            className="bg-[#3ecf8e] hover:bg-[#34b279] text-zinc-950 font-bold gap-1.5"
          >
            Salvar Organograma
          </Button>
        </div>
      </div>

      <div className="h-[450px] rounded-xl border border-transparent overflow-hidden bg-zinc-950/50">
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-dots"
        >
          <Controls className="!bg-zinc-900 !border-zinc-800 !text-white !rounded-lg !shadow-xl [&>button]:!border-zinc-800 [&>button]:hover:!bg-zinc-800 [&>button>svg]:!fill-zinc-400" />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#27272a"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
