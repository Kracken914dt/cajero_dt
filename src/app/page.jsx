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
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [playAudio, setPlayAudio] = useState(false);
  const [bankName, setBankName] = useState('');
  const [operationType, setOperationType] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const correctPassword = '1234';

  const handleLogin = () => {
    if ((user === '03118432456' || user === '13118432456') && password === correctPassword) {
      setIsAuthenticated(true);
      setMessage('Bienvenido al cajero automático');
      setBankName(user.startsWith('0') ? 'Nequi' : 'Bancolombia Ahorro a la mano');
    } else {
      setMessage('Número de cuenta o contraseña incorrecta');
    }
    setPassword('');
  };

  const handleWithdraw = (withdrawAmount) => {
    if (withdrawAmount > balance) {
      setMessage('Saldo insuficiente');
    } else {
      const nuevaMatriz = mostrarMatriz(withdrawAmount);
      const nuevosBilletes = calcularBilletes(nuevaMatriz);

      setBalance(balance - withdrawAmount);
      setMatriz(nuevaMatriz);
      setBilletesEntregados(nuevosBilletes);
      setMessage(`Has retirado $${withdrawAmount}`);
      setOperationType('retiro');
      setTransactionHistory((prev) => [
        ...prev,
        { type: 'Retiro', amount: withdrawAmount, date: new Date().toLocaleString() },
      ]);
      setIsModalOpen(true);
      setPlayAudio(true);
    }
    setAmount('');
    setIsWithdrawDisabled(true);
  };

  const handleDeposit = () => {
    const depositAmount = Number(amount);
    if (depositAmount >= 10000 && depositAmount % 10000 === 0) {
      setBalance(balance + depositAmount);
      setMessage(`Has depositado $${depositAmount}`);
      setOperationType('abono');
      setTransactionHistory((prev) => [
        ...prev,
        { type: 'Abono', amount: depositAmount, date: new Date().toLocaleString() },
      ]);
      setIsModalOpen(true);
    } else {
      setMessage('Introduce una cantidad válida para depositar');
    }
    setAmount('');
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
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUser(value);
  };

  const validatePassword = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPassword(value);
  };

  const toggleAmountInput = () => {
    setShowAmountInput(!showAmountInput);
  };

  const toggleTransactionHistory = () => {
    setShowTransactionHistory(!showTransactionHistory);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setBalance(2000000);
    setUser('');
    setPassword('');
    setAmount('');
    setMessage('');
    setMatriz([]);
    setBilletesEntregados([]);
    setOperationType('');
    setTransactionHistory([]);
    setShowTransactionHistory(false);
    setPlayAudio(false);
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
              <label htmlFor="user" className="block mb-2 text-gray-400">
                Número de cuenta
              </label>
              <input
                id="user"
                type="text"
                value={user}
                onChange={validateUser}
                placeholder="Ingrese su número de cuenta"
                className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
              />
              <label htmlFor="password" className="block mb-2 text-gray-400">
                Contraseña
              </label>
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
              <button
                onClick={handleLogin}
                className="w-full p-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-300"
              >
                Ingresar
              </button>
              {message && <p className="text-red-500 mt-2">{message}</p>}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl font-light mb-4">Bienvenido {bankName}</p>
              <p className="text-lg font-bold mb-4">Saldo: ${balance}</p>
              {showAmountInput && (
                <>
                  <label htmlFor="amount" className="block mb-2 text-gray-400">
                    Cantidad
                  </label>
                  <input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={validateAmount}
                    placeholder="Ingrese la cantidad"
                    className="w-full p-2 bg-gray-600 text-gray-100 border border-gray-600 rounded mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleWithdraw(Number(amount))}
                      disabled={isWithdrawDisabled}
                      className="flex-1 p-2 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-700 hover:text-white transition-colors duration-300"
                    >
                      Retirar
                    </button>
                    <button
                      onClick={handleDeposit}
                      className="flex-1 p-2 bg-green-600 text-white border-none rounded cursor-pointer hover:bg-green-700 hover:text-white transition-colors duration-300"
                    >
                      Abonar
                    </button>
                  </div>
                </>
              )}
              {message && <p className="text-red-500 mt-2">{message}</p>}
              <div className="flex flex-wrap gap-2 mb-4">
                {[20000, 100000, 200000, 300000, 600000].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleWithdraw(value)}
                    className="flex-1 p-2 bg-gray-500 text-white border-none rounded cursor-pointer hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Retirar ${value}
                  </button>

                ))}
                {showAmountInput ? (
                  <>
                    <button
                      onClick={toggleAmountInput}
                      className="flex-1 p-2 bg-yellow-500 text-white border-none rounded cursor-pointer hover:bg-yellow-700 hover:text-white transition-colors duration-300"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={toggleAmountInput}
                    className="flex-1 p-2 bg-yellow-500 text-white border-none rounded cursor-pointer hover:bg-yellow-700 hover:text-white transition-colors duration-300"
                  >
                    Otro valor o Operacion
                  </button>
                )}
                <button
                  onClick={toggleTransactionHistory}
                  className="flex-1 p-2 bg-blue-600 text-white border-none rounded cursor-pointer hover:bg-blue-700 hover:text-white transition-colors duration-300"
                >
                  Historial de Transacciones
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 p-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 hover:text-white transition-colors duration-300"
                >
                  Salir
                </button>
              </div>
              {showTransactionHistory && (
                <div className="mt-4 bg-gray-700 p-3 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Historial de Transacciones</h3>
                  {transactionHistory.length === 0 ? (
                    <p>No hay transacciones registradas.</p>
                  ) : (
                    <ul>
                      {transactionHistory.map((transaction, index) => (
                        <li key={index} className="mb-2">
                          {transaction.date}: {transaction.type} de ${transaction.amount}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {isModalOpen && (
          <ResultadoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            matriz={matriz}
            bankName={bankName}
            userAccount={user}
            billetesEntregados={billetesEntregados}
            tipoOperacion={operationType} 
          />
        )}
        {playAudio && <CajeroAudio />}
      </div>
    </div>
  );
}
