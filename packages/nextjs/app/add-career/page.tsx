"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AddCareer: NextPage = () => {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const { address } = useAccount();

  // 1. Verificar si es el administrador
  const { data: owner } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "owner",
  });

  const { writeContractAsync: writeComedor, isPending } = useScaffoldWriteContract({
    contractName: "ComedorUniversitario",
  });

  const handleCrearCarrera = async () => {
    if (!nombreCarrera) return;
    try {
      await writeComedor({
        functionName: "agregarCarrera",
        args: [nombreCarrera],
      });
      setNombreCarrera("");
    } catch (e) {
      console.error("Error al crear carrera:", e);
    }
  };

  const esOwner = address === owner;

  if (!esOwner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <div className="alert alert-error max-w-md shadow-lg">
          <span>Acceso denegado. Solo el administrador puede agregar carreras.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen">
      <div className="max-w-[500px] w-full px-4">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🎓</span>
              <h2 className="card-title text-2xl font-bold">Nueva Carrera</h2>
            </div>
            <p className="text-sm text-base-content/70 mb-6">
              Agregue una nueva carrera universitaria para que esté disponible en el registro de estudiantes.
            </p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium ml-2">Nombre de la Carrera *</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Ingenieria Mecanica"
                className="input input-bordered focus:border-primary w-full"
                value={nombreCarrera}
                onChange={e => setNombreCarrera(e.target.value)}
              />
            </div>

            <div className="card-actions mt-6">
              <button
                className={`btn btn-primary btn-block h-12 text-lg ${isPending ? "loading" : ""}`}
                onClick={handleCrearCarrera}
                disabled={isPending || !nombreCarrera}
              >
                {isPending ? "Guardando..." : "Registrar Carrera"}
              </button>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-6 px-4">
          <div className="text-xs opacity-50 flex items-start gap-2">
            <span>ℹ️</span>
            <p>
              Al confirmar, la carrera se guardará en la blockchain y aparecerá instantáneamente en el formulario de
              registro de estudiantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCareer;
