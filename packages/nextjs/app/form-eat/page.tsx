"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const MarcarComida: NextPage = () => {
  const [cedula, setCedula] = useState("");

  const { data: puedeComer, isLoading: validando } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "puedeComer",
    args: [cedula ? BigInt(cedula) : 0n],
  });

  const { data: infoEstudiante } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "estudiantes",
    args: [cedula ? BigInt(cedula) : 0n],
  });

  const { writeContractAsync: writeComedorContract, isPending } = useScaffoldWriteContract({
    contractName: "ComedorUniversitario",
  });

  const handleMarcarConsumo = async () => {
    try {
      await writeComedorContract({
        functionName: "registrarConsumo",
        args: [BigInt(cedula)],
      });
      setCedula("");
    } catch (e) {
      console.error("Error al registrar consumo:", e);
    }
  };

  const estudianteExiste = infoEstudiante ? infoEstudiante[5] : false;
  const nombreCompleto = infoEstudiante ? `${infoEstudiante[0]} ${infoEstudiante[1]}` : "";
  const carreraEstudiante = infoEstudiante ? infoEstudiante[3] : "";

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen">
      {/* Estilo local para quitar flechas del input number */}
      <style jsx>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="max-w-[500px] w-full px-4">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🍽️</span>
              <h2 className="card-title text-2xl font-bold">Punto de Control</h2>
            </div>
            <p className="text-sm text-base-content/70 mb-6">
              Ingrese la cédula del estudiante para validar y registrar su comida de hoy.
            </p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium ml-2">Cédula del Estudiante *</span>
              </label>
              <input
                type="number"
                placeholder="Ej: 25123456"
                className={`input input-bordered text-center text-2xl h-16 focus:border-primary w-full ${
                  cedula && !puedeComer && !validando ? "border-error" : ""
                }`}
                value={cedula}
                onChange={e => {
                  if (e.target.value.length <= 10) setCedula(e.target.value);
                }}
              />
            </div>

            {cedula && estudianteExiste && (
              <div className="mt-6 p-4 rounded-lg bg-base-200 animate-in fade-in duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase font-bold opacity-50">Estudiante</p>
                    <p className="text-lg font-bold">{nombreCompleto}</p>
                    <p className="text-sm">{carreraEstudiante}</p>
                  </div>
                  <div className={`badge ${puedeComer ? "badge-success" : "badge-error"} p-3 text-white`}>
                    {puedeComer ? "APTO" : "YA COMIÓ"}
                  </div>
                </div>
              </div>
            )}

            {/* Alerta con botón de redirección si no existe */}
            {cedula && !estudianteExiste && !validando && (
              <div className="alert alert-warning mt-4 flex flex-col sm:flex-row items-center gap-4">
                <span className="text-sm font-medium">No registrado en el sistema.</span>
                <Link href={`/add-student?cedula=${cedula}`} className="btn btn-sm btn-ghost border-current">
                  Registrar Estudiante
                </Link>
              </div>
            )}

            <div className="card-actions mt-6">
              <button
                className={`btn btn-primary btn-block h-12 text-lg ${isPending ? "loading" : ""}`}
                onClick={handleMarcarConsumo}
                disabled={isPending || !puedeComer || !cedula}
              >
                {isPending ? "Registrando..." : "Confirmar Entrega de Comida"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center opacity-40 text-xs">
          <p>Solo personal autorizado puede registrar consumos.</p>
          <p>Blockchain ID: ComedorUniversitario-v1</p>
        </div>
      </div>
    </div>
  );
};

export default MarcarComida;
