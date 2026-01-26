"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const AdminDashboard: NextPage = () => {
  const { address } = useAccount();

  // 1. Datos de Identidad
  const { data: owner } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "owner",
  });

  // 2. Estadísticas de Uso
  const { data: totalComidas } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "totalComidasServidas",
  });

  const { data: balanceContrato } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "obtenerBalance",
  });

  const { data: listaCarreras } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "obtenerCarreras",
  });

  const esOwner = address === owner;

  if (!esOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="alert alert-error max-w-md shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="OpenSans-10 10l-2 2m0 0l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Acceso denegado. Solo el administrador puede ver esta página.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen px-4">
      <div className="max-w-[800px] w-full">
        <h1 className="text-3xl font-bold mb-8 text-base-content flex items-center gap-3">
          <span>⚙️</span> Panel de Control Administrativo
        </h1>

        {/* Fila de Cards Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body items-center text-center">
              <p className="text-sm font-bold opacity-50 uppercase">Fondos Totales</p>
              <p className="text-3xl font-black text-primary">
                {balanceContrato ? (Number(balanceContrato) / 10 ** 18).toFixed(4) : "0"} ETH
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body items-center text-center">
              <p className="text-sm font-bold opacity-50 uppercase">Comidas Servidas</p>
              <p className="text-3xl font-black text-secondary">{totalComidas?.toString() || "0"}</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body items-center text-center">
              <p className="text-sm font-bold opacity-50 uppercase">Carreras Activas</p>
              <p className="text-3xl font-black text-accent">{listaCarreras?.length || "0"}</p>
            </div>
          </div>
        </div>

        {/* Sección de Gestión de Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg border-b pb-2">Información del Contrato</h3>
              <div className="space-y-3 mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-60">Admin Address:</span>
                  <span className="font-mono text-xs">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Status:</span>
                  <span className="badge badge-success badge-sm">Operativo</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Red:</span>
                  <span className="font-medium">Blockchain Local</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg border-b pb-2">Carreras Registradas</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {listaCarreras?.map((carrera, index) => (
                  <div key={index} className="badge badge-ghost p-3">
                    {carrera}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 alert alert-info bg-opacity-20 shadow-none border-dashed">
          <p className="text-xs">
            <strong>Nota:</strong> Esta pantalla consolida los datos de los mappings y variables de estado del contrato
            para facilitar la toma de decisiones presupuestarias.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
