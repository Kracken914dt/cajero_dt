'use client';

import React, { useState, useEffect } from 'react';
import ResultadoModal from '@/components/ModalRetiro';
import { mostrarMatriz, calcularBilletes } from '@/components/logicaBilletes';
import { Eye, EyeOff } from 'react-feather';
import HistorialTransaccionesModal from '@/components/HistorialTransaccionesModal';
import CodigoVerificacionModal from '@/components/CodigoModal'
import { FaHistory, FaSignOutAlt, FaDollarSign, FaHandHoldingUsd } from 'react-icons/fa'; // Iconos para botones
import cajero from "@/assets/images/cajero.png";
import Image from 'next/image';


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
  const [bankName, setBankName] = useState('');
  const [operationType, setOperationType] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0); 
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [pass, setPass] = useState(0);

  const correctPassword = '1234';

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = localStorage.getItem('user');
    const storedBankName = localStorage.getItem('bankName');
    const storedBalance = localStorage.getItem('balance');
    const savedTransactionHistory = localStorage.getItem('transactionHistory');
  
    if (storedIsAuthenticated && storedUser && storedBankName) {
      setIsAuthenticated(true);
      setUser(storedUser);
      setBankName(storedBankName);
      setBalance(storedBalance ? parseInt(storedBalance, 10) : 2000000);
      setTransactionHistory(JSON.parse(savedTransactionHistory) || []);
    }
  }, []);

  const handleLogin = () => {
    if (isAccountLocked) {
      setMessage('Cuenta bloqueada.');
      return;
    }
  
    if ((user === '3118432456' || user === '13118432456') && password === correctPassword) {
      setIsAuthenticated(true);
      setMessage('Bienvenido al cajero automático');
      const bank = user.startsWith('3') ? 'Nequi' : 'Bancolombia Ahorro a la mano';
      setBankName(bank);
      setLoginAttempts(0);
  
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', user);
      localStorage.setItem('balance', balance.toString());
      localStorage.setItem('bankName', bank);
      localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    } else {
      const attemptsLeft = 2 - loginAttempts;
      setLoginAttempts((prev) => prev + 1);
  
      if (loginAttempts + 1 >= 3) {
        setIsAccountLocked(true);
        setMessage('Cuenta bloqueada.');
      } else {
        setMessage(`Número de cuenta o contraseña incorrecta. Intentos restantes: ${attemptsLeft}`);
      }
    }
  
    setPassword('');
  };


   useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
      localStorage.setItem('balance', balance.toString());
    }
  }, [isAuthenticated, transactionHistory, balance]);


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
      console.log(withdrawAmount)
      setOperationType('retiro');
      setTransactionHistory((prev) => [
        ...prev,
        { type: 'Retiro', amount: withdrawAmount, date: new Date().toLocaleString() },
      ]);
      setIsModalOpen(true);
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
      setPass(depositAmount);
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

  const handleWithdrawWithVerification = (withdrawAmount) => {
    setAmount(withdrawAmount);
    setIsVerificationModalOpen(true);
  };

  const handleVerificationSuccess = () => {
    handleWithdraw(Number(amount)); 
  };

  const handleVerificationFail = () => {
    handleLogout(); 
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


  const isLoginDisabled = user.trim() === '' || password.trim() === '';

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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('balance');
    localStorage.removeItem('bankName');
    localStorage.removeItem('transactionHistory');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="hidden lg:block"> 
      <Image src={cajero} alt="Cajero" className="w-72 h-auto object-cover" />
      </div>
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
                disabled={isLoginDisabled}
                className={`w-full p-2 border-none rounded cursor-pointer transition-colors duration-300 ${
                  isLoginDisabled
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-700 text-white'
                }`}
              >
                Ingresar
              </button>
              {message && <p className="text-red-500 mt-2">{message}</p>}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl font-light mb-4">Bienvenido a {bankName}</p>
              <p className="text-lg font-bold mb-4">Saldo: ${balance}</p>
              {showAmountInput && (
                <>
                  <label htmlFor="amount" className="block mb-1 text-gray-400">
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
                  <div className="flex gap-2 py-1">
                    <button
                      onClick={() => handleWithdrawWithVerification(Number(amount))}
                      disabled={isWithdrawDisabled}
                      className="flex-1 p-2 bg-red-500 mt-2 rounded hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 text-white"
                    >
                      <FaDollarSign size={20} className="text-base"/>
                      Retirar
                    </button>
                    <button
                      onClick={handleDeposit}
                      className="flex-1 p-2 bg-green-500 mt-2 rounded hover:bg-green-700 transition-colors duration-300 flex items-center justify-center gap-2 text-white"
                    >
                      <FaHandHoldingUsd size={20} className="text-base"/>
                      Abonar
                    </button>
                  </div>
                </>
              )}
              {message && <p className="text-red-500 mt-2">{message}</p>}
              <div className="flex flex-wrap gap-2 mb-4 py-2">
                {[20000, 100000, 200000, 300000, 600000].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleWithdrawWithVerification(value)}
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
                  className="flex-1 p-2 bg-blue-600 mt-2 rounded hover:bg-blue-800 transition-colors duration-300 flex items-center justify-center gap-2 text-white"
                >
                  <FaHistory size={30} className="text-base"/>
                  Historial de Transacciones
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 p-2 bg-red-600 mt-2 rounded hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 text-white"
                >
                  <FaSignOutAlt size={20} className="text-base"/>
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
        <HistorialTransaccionesModal
          isOpen={showTransactionHistory}
          onClose={() => setShowTransactionHistory(false)}
          transactionHistory={transactionHistory}
        />
        <CodigoVerificacionModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onSuccess={handleVerificationSuccess}
          onFail={handleVerificationFail}
          bankName={bankName} 
        />
        {isModalOpen && (
          <ResultadoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            matriz={matriz}
            bankName={bankName}
            userAccount={user}
            billetesEntregados={billetesEntregados}
            tipoOperacion={operationType} 
            cantidadIntroducida = {pass}
          />
        )}
      </div>
    </div>
  );
}