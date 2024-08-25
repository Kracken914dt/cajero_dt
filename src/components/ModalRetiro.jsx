import Image from 'next/image';
import React, { useState } from 'react';

export default function ResultadoModal({ isOpen, onClose, billetesEntregados, matriz }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  // Contar la cantidad de cada billete
  const cantidadBilletes = billetesEntregados.reduce((acc, billete) => {
    acc[billete.billete] = (acc[billete.billete] || 0) + 1;
    return acc;
  }, {});

  // Calcular el total entregado
  const totalEntregado = billetesEntregados.reduce((acc, billete) => acc + billete.valor, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 text-2xl">
          ×
        </button>
        <h3 className="text-2xl font-semibold mb-6">Resultados del Retiro</h3>
        <div>
          <h4 className="text-xl font-medium mb-4">Billetes entregados:</h4>
          <ul className="flex flex-wrap gap-4 overflow-auto max-h-64">
            {billetesEntregados.map((billete, index) => (
              <li key={index} className="flex flex-col items-center">
                <Image src={billete.img} className="w-52 h-auto" alt={`Billete de ${billete.billete}`} />
                <span>{billete.billete}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-8">
            <div>
              <h4 className="text-xl font-medium">Total entregado:</h4>
              <div className="text-lg font-mono">${totalEntregado.toLocaleString()}</div>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 bg-blue-500 text-white rounded"
            >
              {showDetails ? 'Ocultar detalles' : 'Más detalles'}
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xl font-medium">Cantidad de cada billete:</h4>
                {Object.entries(cantidadBilletes).map(([billete, cantidad]) => (
                  <div key={billete} className="text-lg font-medium">
                    {billete}: {cantidad}
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xl font-medium">Matriz:</h4>
                <div className="mt-4">
                  <div className="font-medium">10k  20k   50k   100k</div>
                  {matriz.map((fila, index) => (
                    <div key={index} className="text-lg font-mono">
                      {fila.map((n) => n.toString()).join(' | ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
