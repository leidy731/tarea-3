// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ComedorUniversitario is Ownable {
    struct Estudiante {
        string nombre;
        string apellido;
        uint256 cedula;
        string carrera;
        uint256 ultimaVezQueComio;
        bool existe;
    }

    string[] public carreras;
    mapping(uint256 => Estudiante) public estudiantes;
    uint256 public totalComidasServidas;

    // EVENTOS
    event EstudianteRegistrado(uint256 indexed cedula, string nombre);
    event CarreraAgregada(string nombreCarrera);
    event ComidaServida(uint256 indexed cedula, uint256 fecha);
    event DonacionRecibida(address indexed donante, uint256 monto);
    event RetiroRealizado(uint256 monto, uint256 fecha);

    constructor(address _owner) Ownable(_owner) {
        carreras.push("Informatica");
        carreras.push("Electronica");
    }

    // GESTIÓN DE CARRERAS
    function agregarCarrera(string memory _nombre) public onlyOwner {
        carreras.push(_nombre);
        emit CarreraAgregada(_nombre);
    }

    function obtenerCarreras() public view returns (string[] memory) {
        return carreras;
    }

    // GESTIÓN DE ESTUDIANTES
    function registrarEstudiante(
        uint256 _cedula,
        string memory _nombre,
        string memory _apellido,
        string memory _carrera
    ) public onlyOwner {
        require(!estudiantes[_cedula].existe, "El estudiante ya esta registrado");

        estudiantes[_cedula] = Estudiante({
            nombre: _nombre,
            apellido: _apellido,
            cedula: _cedula,
            carrera: _carrera,
            ultimaVezQueComio: 0,
            existe: true
        });

        emit EstudianteRegistrado(_cedula, _nombre);
    }

    function registrarConsumo(uint256 _cedula) public onlyOwner {
        require(estudiantes[_cedula].existe, "Estudiante no registrado");
        require(block.timestamp >= estudiantes[_cedula].ultimaVezQueComio + 12 hours, "Ya comio hoy");

        estudiantes[_cedula].ultimaVezQueComio = block.timestamp;
        totalComidasServidas++;
        emit ComidaServida(_cedula, block.timestamp);
    }

    // DONACIONES Y FONDOS
    // Esta función permite que la DonatePage reciba dinero y emita el evento
    receive() external payable {
        emit DonacionRecibida(msg.sender, msg.value);
    }

    function obtenerBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function retirarFondos(uint256 _monto) public onlyOwner {
        require(address(this).balance >= _monto, "Saldo insuficiente");
        payable(owner()).transfer(_monto);
        emit RetiroRealizado(_monto, block.timestamp);
    }

    // CONSULTAS
    function puedeComer(uint256 _cedula) public view returns (bool) {
        if (!estudiantes[_cedula].existe) return false;
        return (block.timestamp >= estudiantes[_cedula].ultimaVezQueComio + 12 hours);
    }

    // Agregar esto al contrato
    function donar() public payable {
        require(msg.value > 0, "Debe enviar algo de ETH");
        emit DonacionRecibida(msg.sender, msg.value);
    }
}
