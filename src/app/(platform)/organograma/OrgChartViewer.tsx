"use client";

import { useCallback, useEffect, useState } from "react";
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
import { GripVertical, Network, Users } from "lucide-react";

type OrgNodeData = {
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
};

function OrgNode({ data }: { id: string; data: OrgNodeData }) {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#3ecf8e] !border-2 !border-zinc-900"
      />
      <div className="bg-zinc-900 rounded-xl shadow-2xl border border-zinc-800 p-4 min-w-[220px] hover:border-[#3ecf8e]/40 transition-all duration-200">
        <div className="flex items-center gap-2 mb-3">
          <GripVertical className="w-4 h-4 text-zinc-600" />
          <p className="text-sm font-bold text-white truncate flex-1">
            {data.nome || <span className="text-zinc-600 italic">Sem nome</span>}
          </p>
        </div>
        <div className="bg-[#3ecf8e]/10 text-[#3ecf8e] rounded-md px-2 py-1.5 mb-3 text-xs font-semibold border border-[#3ecf8e]/10">
          {data.cargo || "Sem cargo"}
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-zinc-500">
          {data.departamento && (
            <span className="truncate">{data.departamento}</span>
          )}
          {data.email && (
            <span className="truncate col-span-2 text-zinc-600">{data.email}</span>
          )}
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

type OrgNodeProps = {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  parentId?: string;
};

export default function OrgChartViewer({
  initialNodes,
  companyName,
}: {
  initialNodes: OrgNodeProps[];
  companyName: string;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (initialNodes.length === 0) return;

    // Construir nós do React Flow a partir do banco
    const flowNodes: Node[] = initialNodes.map((n, index) => ({
      id: n.id,
      type: "orgNode",
      position: {
        x: 150 + (index % 4) * 280,
        y: 80 + Math.floor(index / 4) * 200,
      },
      data: {
        nome: n.nome,
        cargo: n.cargo,
        departamento: n.departamento,
        email: n.email,
      },
    }));

    // Construir edges a partir de parent_id
    const flowEdges: Edge[] = initialNodes
      .filter((n) => n.parentId)
      .map((n) => ({
        id: `e-${n.parentId}-${n.id}`,
        source: n.parentId!,
        target: n.id,
        style: { stroke: "#3ecf8e", strokeWidth: 2 },
        animated: true,
      }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [initialNodes, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            style: { stroke: "#3ecf8e", strokeWidth: 2 },
            animated: true,
          },
          eds
        )
      );
    },
    [setEdges]
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organograma</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Estrutura hierárquica de{" "}
            <span className="text-white font-medium">{companyName}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-center">
            <p className="text-2xl font-bold text-white">{initialNodes.length}</p>
            <p className="text-xs text-zinc-500">colaboradores</p>
          </div>
        </div>
      </div>

      {initialNodes.length === 0 ? (
        /* Estado vazio */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 py-24">
          <Network className="mb-4 h-12 w-12 text-zinc-700" />
          <h3 className="text-lg font-semibold text-zinc-300">
            Organograma vazio
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-zinc-500">
            Nenhum colaborador foi adicionado ao organograma ainda. Complete o
            onboarding para definir a estrutura da empresa.
          </p>
          <a
            href="/onboarding"
            className="mt-6 rounded-lg bg-[#3ecf8e] px-5 py-2.5 text-sm font-bold text-zinc-950 transition-all hover:bg-[#34b279]"
          >
            Ir para Onboarding
          </a>
        </div>
      ) : (
        /* Visualizador do Organograma */
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
            <Users className="h-4 w-4 text-[#3ecf8e]" />
            <h2 className="text-sm font-semibold text-white">
              Hierarquia Organizacional
            </h2>
            <span className="ml-auto text-xs text-zinc-500">
              Arraste para reorganizar • Conecte os pontos para definir hierarquia
            </span>
          </div>
          <div style={{ height: "600px" }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
            >
              <Controls
                className="!bg-zinc-900 !border-zinc-800 !rounded-lg !shadow-xl"
                style={{ button: { borderColor: "#27272a" } }}
              />
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1.5}
                color="#27272a"
              />
            </ReactFlow>
          </div>
        </div>
      )}
    </div>
  );
}
