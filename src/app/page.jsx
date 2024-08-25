'use client';

import React, { useState } from 'react';
import ResultadoModal from '@/components/ModalRetiro';
import { mostrarMatriz, calcularBilletes } from '@/components/logicaBilletes';
import { Eye, EyeOff } from 'react-feather';
import CajeroAudio from '@/components/CajeroAudio';

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
  const [isWithdrawDisabled, setIsWithdrawDisabled] = useState(true);
  const [playAudio, setPlayAudio] = useState(false); 

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
      document.querySelector('audio').play();
    }
    setAmount('');
    setIsWithdrawDisabled(true);
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

  const validateAmount = (e) => {
    const value = e.target.value;
    const regex = /^[1-9]\d*$/; 

    if (value === '' || !regex.test(value)) {
        setAmount('');
        setIsWithdrawDisabled(true);
        setMessage('Introduce un valor numérico positivo');
        return;
    }

    const number = Number(value);
    if (number >= 10000 && number % 10000 === 0) {
        setAmount(value);
        setIsWithdrawDisabled(false);
        setMessage('');
    } else {
        setAmount(value);
        setIsWithdrawDisabled(true);
        setMessage('La cantidad debe ser redondeada y de 10.000 para arriba');
    }
};

  const validateUser = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z]/g, ''); 
    setUser(value);
  };

  const validatePassword = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
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
                  {showPassword ? <EyeOff className="text-gray-400 mb-4" /> : <Eye className="text-gray-400 mb-4" />}
                </button>
              </div>
              <button onClick={handleLogin} className="w-full p-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-300">
                Ingresar
              </button>
              {message && (
                <p className="text-red-500 mt-2">{message}</p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl font-light mb-4">Bienvenido {user}</p>
              <p className="text-lg font-bold mb-4">Saldo: ${balance}</p>
              <label htmlFor="amount" className="block mb-2 text-gray-400">Cantidad</label>
              <input
                id="amount"
                type="text" 
                value={amount}
                onChange={validateAmount}
                placeholder="Ingrese la cantidad"
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
              />
              {message && (
                <p className="text-red-500 mt-2">{message}</p>
              )}
              <div className="flex gap-2 mb-4">
                <button onClick={handleWithdraw} className="flex-1 p-2 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-700 hover:text-white transition-colors duration-300" disabled={isWithdrawDisabled}>
                  Retirar
                </button>
                <CajeroAudio play={playAudio} />
                <button onClick={handleDeposit} className="flex-1 p-2 bg-green-600 text-white border-none rounded cursor-pointer hover:bg-green-700 hover:text-white transition-colors duration-300">
                  Abonar
                </button>
              </div>
                <button
                  onClick={handleLogout}
                  className="w-full p-2 bg-transparent text-gray-400 border border-gray-600 rounded cursor-pointer hover:bg-gray-600 hover:text-white transition-colors duration-300"
                >
                  Salir
                </button>
            </div>
          )}
        </div>
      </div>
      <CajeroAudio />
      <ResultadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        billetesEntregados={billetesEntregados}
        matriz={matriz}
      />
    </div>
  );
}
