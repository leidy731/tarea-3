"use client";

import type { NextPage } from "next";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ListaEstudiantes: NextPage = () => {
  const { data: eventosRegistro, isLoading: cargandoEventos } = useScaffoldEventHistory({
    contractName: "ComedorUniversitario",
    eventName: "EstudianteRegistrado",
    fromBlock: 0n,
    watch: true,
  });

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen">
      <div className="max-w-[1000px] w-full px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">Estudiantes Registrados 📋</h2>
          <div className="badge badge-primary p-4 shadow-lg">Total: {eventosRegistro?.length || 0}</div>
        </div>

        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* Head */}
              <thead>
                <tr className="bg-base-200">
                  <th>Cédula</th>
                  <th>Nombre y Apellido</th>
                  <th>Carrera</th>
                  <th>Estado Comedor</th>
                </tr>
              </thead>
              <tbody>
                {cargandoEventos ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                    </td>
                  </tr>
                ) : eventosRegistro?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-10 opacity-50 italic">
                      No hay estudiantes registrados aún.
                    </td>
                  </tr>
                ) : (
                  eventosRegistro?.map((evento, index) => (
                    <FilaEstudiante key={index} cedula={evento.args.cedula as bigint} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente secundario para leer la data individual de cada estudiante
const FilaEstudiante = ({ cedula }: { cedula: bigint }) => {
  const { data: estudiante } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "estudiantes",
    args: [cedula],
  });

  if (!estudiante) return null;

  return (
    <tr className="hover">
      <td className="font-mono font-bold text-primary">{cedula.toString()}</td>
      <td>
        <div className="flex flex-col">
          <span className="font-semibold">{estudiante[0]}</span>
          <span className="text-xs opacity-50">{estudiante[1]}</span>
        </div>
      </td>
      <td>
        <div className="badge badge-ghost">{estudiante[3]}</div>
      </td>
      <td>
        {/* Usamos el timestamp para dar un feedback visual rápido */}
        {Number(estudiante[4]) === 0 ? (
          <span className="badge badge-info gap-2">Nuevo</span>
        ) : (
          <span className="text-xs opacity-70">
            Último: {new Date(Number(estudiante[4]) * 1000).toLocaleDateString()}
          </span>
        )}
      </td>
    </tr>
  );
};

export default ListaEstudiantes;
