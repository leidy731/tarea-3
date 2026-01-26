"use client";

import { useState } from "react";
import { IntegerInput } from "@scaffold-ui/debug-contracts";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const DonarPage: NextPage = () => {
  const [montoDonacion, setMontoDonacion] = useState<string | bigint>("");
  const { address } = useAccount();

  // 1. Datos del Contrato
  const { data: owner } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "owner",
  });

  const { data: balanceContrato } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "obtenerBalance",
  });

  const { data: totalServidas } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "totalComidasServidas",
  });

  const { writeContractAsync: writeComedor, isPending } = useScaffoldWriteContract({
    contractName: "ComedorUniversitario",
  });

  const handleDonar = async () => {
    try {
      await writeComedor({
        functionName: "donar",
        value: montoDonacion ? BigInt(montoDonacion) : 0n,
      });
      setMontoDonacion("");
    } catch (e) {
      console.error("Error al donar:", e);
    }
  };

  const handleRetirar = async () => {
    try {
      await writeComedor({
        functionName: "retirarFondos",
        args: [montoDonacion ? BigInt(montoDonacion) : 0n],
      });
      setMontoDonacion("");
    } catch (e) {
      console.error("Error al retirar:", e);
    }
  };

  const esOwner = address === owner;

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen">
      <div className="max-w-[500px] w-full px-4 space-y-6">
        {/* Card de Donación */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">❤️</span>
              <h2 className="card-title text-2xl font-bold">Donaciones</h2>
            </div>
            <p className="text-sm text-base-content/70 mb-6">
              Tu aporte ayuda a mantener el comedor funcionando. Cualquiera puede colaborar.
            </p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Monto (Wei)</span>
              </label>
              <IntegerInput
                value={montoDonacion.toString()}
                onChange={val => setMontoDonacion(val)}
                placeholder="Monto en Wei"
              />
            </div>

            <div className="card-actions mt-6">
              <button
                className={`btn btn-primary btn-block text-lg ${isPending ? "loading" : ""}`}
                onClick={handleDonar}
                disabled={!montoDonacion || isPending || esOwner} // Bloqueado si es owner
              >
                {esOwner ? "Modo Administrador" : isPending ? "Procesando..." : "Apoyar Comedor"}
              </button>
              {esOwner && (
                <p className="text-[10px] text-center w-full opacity-50 italic">
                  Como administrador, use el panel inferior para retirar fondos.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección del Owner - Rediseño Minimalista y Profesional */}
        {esOwner && (
          <div className="card bg-base-100 border-2 border-dashed border-primary/30 shadow-lg animate-in slide-in-from-bottom-5 duration-500">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <h2 className="font-bold text-lg tracking-tight uppercase">Panel Tesorería</h2>
                </div>
                <div className="badge badge-outline border-primary text-primary px-3">Admin Access</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Total Comidas</p>
                  <p className="text-2xl font-black text-primary">{totalServidas?.toString() || "0"}</p>
                </div>
                <div className="bg-base-200/50 p-4 rounded-xl border border-base-300">
                  <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Balance ETH</p>
                  <p className="text-2xl font-black text-success truncate">
                    {balanceContrato ? (Number(balanceContrato) / 10 ** 18).toFixed(4) : "0"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className={`btn btn-primary btn-block border-none shadow-md ${isPending ? "loading" : ""}`}
                  onClick={handleRetirar}
                  disabled={isPending || !montoDonacion}
                >
                  Confirmar Retiro
                </button>
                <p className="text-[11px] text-center opacity-60 leading-tight">
                  Ingrese el monto en el campo superior para habilitar el retiro a su cuenta principal.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonarPage;
