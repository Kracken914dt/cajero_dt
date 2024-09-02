import React from 'react';

const HistorialTransaccionesModal = ({ isOpen, onClose, transactionHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-5 rounded-lg shadow-lg w-80 text-white">
        <h3 className="text-lg font-bold mb-4">Historial de Transacciones</h3>
        {transactionHistory.length === 0 ? (
          <p>No hay transacciones registradas.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto"> 
            <ul className="space-y-2">
              {transactionHistory.map((transaction, index) => (
                <li key={index} className="border-b border-gray-700 pb-2">
                  <span className="block">{transaction.date}</span>
                  <span className="block">
                    {transaction.type} de ${transaction.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full p-2 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors duration-300"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default HistorialTransaccionesModal;
