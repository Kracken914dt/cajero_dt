import Image from 'next/image';
import React from 'react';

export default function ResultadoModal({ isOpen, onClose, billetesEntregados, matriz }) {
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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-2xl">
          ×
        </button>
        <h3 className="text-2xl font-semibold mb-6">Resultados del Retiro</h3>
        <div>
          <h4 className="text-xl font-medium mb-4">Billetes entregados:</h4>
          <ul className="flex flex-wrap gap-4 overflow-auto max-h-64">
            {billetesEntregados.map((billete, index) => (
              <li key={index} className="flex flex-col items-center">
                <Image src={billete.img} className="w-52 h-auto" />
                <span>{billete.billete}</span>
              </li>
            ))}
          </ul>
          <h4 className="text-xl font-medium mt-8 text-black">Cantidad de cada billete:</h4>
          <div className="mt-4">
            {Object.entries(cantidadBilletes).map(([billete, cantidad]) => (
              <div key={billete} className="text-lg font-medium text-black">
                {billete}: {cantidad}
              </div>
            ))}
          </div>
          <h4 className="text-xl font-medium mt-8 text-black">Matriz:</h4>
          <div className="mt-4">
            <div className="font-medium text-black">10k  20k   50k   100k</div>
            {matriz.map((fila, index) => (
              <div key={index} className="text-lg font-mono text-black">
                {fila.map((n) => n.toString()).join(' | ')}
              </div>
            ))}
          </div>
          <h4 className="text-xl font-medium mt-8 text-black">Total entregado:</h4>
          <div className="text-lg font-mono text-black">${totalEntregado.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
