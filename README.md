# �️ Comedor Universitario dApp

Aplicación descentralizada (dApp) para la gestión del comedor universitario, permitiendo el registro de estudiantes, control de comidas y recepción de donaciones en ETH transparentes.

Construido con 🏗 [Scaffold-ETH 2](https://scaffoldeth.io).

## 📋 Características Principales

### Smart Contract (`ComedorUniversitario.sol`)

- **Gestión de Estudiantes**: Registro inmutable de estudiantes con nombre, apellido, cédula y carrera.
- **Control de Comidas**:
  - Registro de consumo de alimentos.
  - **Cooldown de 12 horas**: Restricción automática para evitar registros duplicados en un mismo periodo.
- **Gestión de Carreras**: El propietario puede agregar nuevas carreras universitarias.
- **Donaciones Transparentes**: Cualquier usuario puede donar ETH al contrato para subsidiar el comedor.
- **Retiro de Fondos**: Función exclusiva para el propietario para retirar los fondos acumulados/donados.

### 📜 Contrato Inteligente (Sepolia)

| Contrato               | Dirección                                    | Explorer                                                                                            |
| ---------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `ComedorUniversitario` | `0xFbD2a981d46E794eDE5aAaA1f22A479FFf2b7990` | [Ver en Etherscan](https://sepolia.etherscan.io/address/0xFbD2a981d46E794eDE5aAaA1f22A479FFf2b7990) |

## 🚀 Tecnologías

- **Smart Contract**: Solidity ^0.8.20
- **Frontend**: Next.js, React, TypeScript
- **Blockchain Interaction**: Wagmi, Viem, RainbowKit
- **Entorno de Desarrollo**: Hardhat

## 🏁 Comenzando

Para correr el proyecto localmente, necesitas tener instalado [Node.js](https://nodejs.org/), [Yarn](https://yarnpkg.com/) y [Git](https://git-scm.com/).

### 1. Clonar e Instalar

```bash
git clone <tu-repo-url>
cd comedor-dapp
yarn install
```

### 2. Iniciar la Blockchain Local

En una primera terminal, levanta tu red local de Hardhat:

```bash
yarn chain
```

### 3. Desplegar el Contrato

En una segunda terminal, despliega tu contrato inteligente:

```bash
yarn deploy
```

El contrato se encuentra en `packages/hardhat/contracts/ComedorUniversitario.sol`.
El script de despliegue está en `packages/hardhat/deploy/00_deploy_your_contract.ts`.

### 4. Iniciar el Frontend

En una tercera terminal, inicia tu aplicación Next.js:

```bash
yarn start
```

Visita tu aplicación en `http://localhost:3000`.

## 📱 Funcionalidades de la UI

- **Registrar Estudiante**: Formulario para dar de alta nuevos estudiantes en la blockchain.
- **Servir Comida**: Interfaz para verificar si un estudiante puede comer y registrar su consumo.
- **Donar**: Panel para realizar donaciones de ETH al comedor.
- **Debug Contracts**: Pestaña para interactuar directamente con todas las funciones del contrato inteligente (útil para el admin/owner).

## 📄 Licencia

Este proyecto está bajo la licencia MIT.
