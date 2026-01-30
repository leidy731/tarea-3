"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const FormStudent: React.FC = () => {
  //states
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [carrera, setCarrera] = useState("");

  // Leer las carreras desde el Smart Contract
  const { data: listaCarreras } = useScaffoldReadContract({
    contractName: "ComedorUniversitario",
    functionName: "obtenerCarreras",
  });

  const { writeContractAsync: writeComedorUniversitarioContract, isPending } = useScaffoldWriteContract({
    contractName: "ComedorUniversitario",
  });

  const handleRegistrar = async () => {
    try {
      await writeComedorUniversitarioContract({
        functionName: "registrarEstudiante",
        args: [BigInt(cedula), nombre, apellido, carrera],
      });
      setNombre("");
      setApellido("");
      setCedula("");
      setCarrera("");
    } catch (e) {
      console.error("Error al registrar:", e);
    }
  };

  useEffect(() => {
    const cedulaParam = location.search.split("cedula=")[1] || "";
    setCedula(cedulaParam);
  }, []);

  return (
    <div className="flex flex-col items-center py-10 bg-base-200 min-h-screen">
      <div className="max-w-[500px] w-full px-4">
        {/* Card Principal */}
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">📝</span>
              <h2 className="card-title text-2xl font-bold">Registro de Estudiante</h2>
            </div>
            <p className="text-sm text-base-content/70 mb-6">
              Ingresa los datos para dar de alta al estudiante en la blockchain.
            </p>

            <div className="grid grid-cols-1 gap-4">
              {/* Fila: Nombre y Apellido */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text font-medium">Nombre</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="input input-bordered focus:border-primary"
                    value={nombre}
                    onChange={e => setNombre(e.target.value.slice(0, 35))} // Límite de 35 caracteres
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text font-medium">Apellido</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    className="input input-bordered focus:border-primary"
                    value={apellido}
                    onChange={e => setApellido(e.target.value.slice(0, 35))} // Límite de 35 caracteres
                  />
                </div>
              </div>

              {/* Fila: Cédula */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Cédula de Identidad</span>
                </label>
                <input
                  type="number"
                  placeholder="Ej: 25123456"
                  className="input input-bordered focus:border-primary w-full"
                  value={cedula}
                  onChange={e => {
                    if (e.target.value.length <= 10) setCedula(e.target.value); // Límite de 10 caracteres
                  }}
                />
              </div>

              {/* Fila: Carrera */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Carrera</span>
                </label>
                <select
                  className="select select-bordered w-full focus:border-primary"
                  value={carrera}
                  onChange={e => setCarrera(e.target.value)}
                >
                  <option value="">Selecciona carrera</option>
                  {listaCarreras?.map((item: string, index: number) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de Acción */}
              <div className="card-actions justify-end mt-6">
                <button
                  className={`btn btn-primary btn-block text-white ${isPending ? "loading" : ""}`}
                  onClick={handleRegistrar}
                  disabled={isPending || !nombre || !apellido || !cedula || !carrera}
                >
                  {isPending ? "Procesando..." : "Registrar Estudiante"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Informativo */}
        <div className="mt-6 flex justify-center">
          <div className="badge badge-outline gap-2 p-4 opacity-50">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            Conectado a la Red del Comedor
          </div>
        </div>
      </div>
    </div>
  );
};
