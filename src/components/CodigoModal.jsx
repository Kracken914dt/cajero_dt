import React, { useState, useEffect } from 'react';

function CodigoVerificacionModal({ isOpen, onClose, onSuccess, onFail }) {
  const [codigo, setCodigo] = useState('');
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [intentosRestantes, setIntentosRestantes] = useState(3);
  const [mensajeError, setMensajeError] = useState('');
  const [tiempoRestante, setTiempoRestante] = useState(5 * 60); // 5 minutos en segundos

  useEffect(() => {
    let timer;

    if (isOpen) {
      generarNuevoCodigo();

      // Configura el temporizador de 5 minutos para regenerar el código
      timer = setInterval(() => {
        setTiempoRestante((prevTiempo) => {
          if (prevTiempo <= 1) {
            generarNuevoCodigo();
            return 5 * 60; // Reinicia el temporizador
          }
          return prevTiempo - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isOpen]);

  const generarNuevoCodigo = () => {
    const nuevoCodigo = Math.floor(100000 + Math.random() * 900000).toString();
    setCodigoGenerado(nuevoCodigo);
    setIntentosRestantes(3);
    setCodigo('');
    setMensajeError('');
    setTiempoRestante(5 * 60); // Reinicia el temporizador
  };

  const handleCodigoChange = (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) { // Expresión regular para permitir solo números
      setCodigo(value);
    }
  };

  const handleSubmit = () => {
    if (codigo === codigoGenerado) {
      onSuccess();
      onClose();
    } else {
      setIntentosRestantes(intentosRestantes - 1);
      setMensajeError(`Código incorrecto. Te quedan ${intentosRestantes - 1} intentos.`);
      if (intentosRestantes - 1 === 0) {
        onFail();
        onClose();
      }
    }
  };

  const formatoTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 text-white p-5 rounded-lg">
          <h2 className="text-2xl mb-4">Introduce el código de verificación</h2>
          <p className="mb-4 text-lg">Tu código: <span className="font-bold">{codigoGenerado}</span></p>
          <p className="mb-4 text-lg">Tiempo restante: <span className="font-bold">{formatoTiempo(tiempoRestante)}</span></p>
          <input
            type="text"
            value={codigo}
            onChange={handleCodigoChange}
            placeholder="Código de 6 dígitos"
            className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded"
            maxLength={6}
          />
          {mensajeError && <p className="text-red-500 mb-4">{mensajeError}</p>}
          <div className="flex justify-between">
            <button
              onClick={handleSubmit}
              className="w-full p-2 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-700 transition-colors duration-300 mr-2"
            >
              Verificar
            </button>
            <button
              onClick={onClose}
              className="w-full p-2 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors duration-300"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CodigoVerificacionModal;
