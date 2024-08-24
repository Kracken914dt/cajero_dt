'use client';

import React, { useState } from 'react';
import ResultadoModal from '@/components/ModalRetiro';
import { mostrarMatriz, calcularBilletes } from '@/components/logicaBilletes';
import { Eye, EyeOff } from 'react-feather';

export default function CajeroAutomatico() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState(2000000); 
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [matriz, setMatriz] = useState([]);
  const [billetesEntregados, setBilletesEntregados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const correctPassword = '1234';

  const handleLogin = () => {
    if (user === 'juan' && password === correctPassword) {
      setIsAuthenticated(true);
      setMessage('Bienvenido al cajero automático');
    } else {
      setMessage('Usuario o contraseña incorrecta');
    }
    setPassword('');
  };

  const handleWithdraw = () => {
    const withdrawAmount = Number(amount);
    if (withdrawAmount > balance) {
      setMessage('Saldo insuficiente');
    } else {
      const nuevaMatriz = mostrarMatriz(withdrawAmount);
      const nuevosBilletes = calcularBilletes(nuevaMatriz);

      setBalance(balance - withdrawAmount);
      setMatriz(nuevaMatriz);
      setBilletesEntregados(nuevosBilletes);
      setMessage(`Has retirado $${withdrawAmount}`);
      setIsModalOpen(true);
    }
    setAmount('');
  };

  const handleDeposit = () => {
    const depositAmount = Number(amount);
    setBalance(balance + depositAmount);
    setMessage(`Has depositado $${depositAmount}`);
    setAmount('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMessage('');
  };

  const validateAmount = (value) => {
    if (value === '') {
      setAmount('');
      return;
    }

    // Verifica si el valor es un número positivo
    const number = Number(value);
    if (Number.isInteger(number) && number > 0) {
      setAmount(value);
    }
  };

  const validateUser = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ''); // Permite solo letras
    setUser(value);
  };

  const validatePassword = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Permite solo números
    setPassword(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-[350px] bg-gray-800 text-gray-100 p-5 rounded-lg shadow-lg">
        <div>
          <h2 className="text-2xl mb-2">Cajero Automático</h2>
          <p className="text-sm text-gray-400">Simula operaciones bancarias básicas</p>
        </div>
        <div>
          {!isAuthenticated ? (
            <div className="mt-4">
              <label htmlFor="user" className="block mb-2 text-gray-400">Usuario</label>
              <input
                id="user"
                type="text"
                value={user}
                onChange={validateUser}
                placeholder="Ingrese su usuario"
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
              />
              <label htmlFor="password" className="block mb-2 text-gray-400">Contraseña</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={validatePassword}
                  placeholder="Ingrese su contraseña"
                  className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="text-gray-400 mb-2" /> : <Eye className="text-gray-400 mb-2" />}
                </button>
              </div>
              <button onClick={handleLogin} className="w-full p-2 bg-blue-500 text-white border-none rounded cursor-pointer">
                Ingresar
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-lg font-bold mb-4">Saldo: ${balance}</p>
              <label htmlFor="amount" className="block mb-2 text-gray-400">Cantidad</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => validateAmount(e.target.value)}
                placeholder="Ingrese la cantidad"
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
              />
              <div className="flex gap-2 mb-4">
                <button onClick={handleWithdraw} className="flex-1 p-2 bg-red-500 text-white border-none rounded cursor-pointer">
                  Retirar
                </button>
                <button onClick={handleDeposit} className="flex-1 p-2 bg-green-500 text-white border-none rounded cursor-pointer">
                  Abonar
                </button>
              </div>
              <button onClick={handleLogout} className="w-full p-2 bg-transparent text-gray-400 border border-gray-600 rounded cursor-pointer">
                Salir
              </button>
            </div>
          )}
        </div>
        {isAuthenticated && (
          <div className="mt-4 text-center text-gray-400">
            <p>{message}</p>
          </div>
        )}
      </div>
      <ResultadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        billetesEntregados={billetesEntregados}
        matriz={matriz}
      />
    </div>
  );
}
