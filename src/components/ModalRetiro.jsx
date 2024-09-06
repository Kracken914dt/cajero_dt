import React from 'react';

export default function ResultadoModal({
  isOpen,
  onClose,
  billetesEntregados,
  bankName,
  userAccount,
  tipoOperacion,
  cantidadIntroducida 
}) {
  if (!isOpen) return null;

  
  const billetesAgrupados = billetesEntregados.reduce((acc, billete) => {
    if (!acc[billete.valor]) {
      acc[billete.valor] = {
        valor: billete.valor,
        cantidad: 0,
        nombre: billete.nombre,
      };
    }
    acc[billete.valor].cantidad += 1;
    return acc;
  }, {});

  const billetesAgrupadosArray = Object.values(billetesAgrupados);

  const cuentaN =
  bankName === 'Nequi' ? `0${userAccount}` : userAccount;

  
  const totalEntregado = billetesAgrupadosArray.reduce(
    (acc, billete) => acc + billete.valor * billete.cantidad,
    0
  );

  const fecha = new Date().toLocaleDateString();
  const hora = new Date().toLocaleTimeString();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Recibo de {bankName}
        </h2>
        <p className="text-sm mb-2 text-black">
          <strong>Banco:</strong> {bankName}
        </p>
        <p className="text-sm mb-2 text-black">
          <strong>Número de Cuenta: </strong> {cuentaN}
        </p>
        <p className="text-sm mb-2 text-black">
          <strong>Tipo de Operación:</strong> {tipoOperacion}
        </p>
        <p className="text-sm mb-2 text-black">
          <strong>Fecha:</strong> {fecha}
        </p>
        <p className="text-sm mb-2 text-black">
          <strong>Hora:</strong> {hora}
        </p>
        {tipoOperacion === 'abono' ? (
          <p className="text-sm mb-2 text-black">
            <strong>Total Abonado:</strong> ${cantidadIntroducida}
          </p>
        ) : (
          <>
            <p className="text-sm mb-2 text-black">
              <strong>Billetes Entregados:</strong>
            </p>
            <ul className="text-sm mb-4 text-black">
              {billetesAgrupadosArray.map((billete, index) => (
                <li key={index}>
                  {billete.cantidad} de ${billete.valor}
                </li>
              ))}
            </ul>
            <p className="text-sm mb-2 text-black">
              <strong>Total Entregado:</strong> ${totalEntregado}
            </p>
          </>
        )}
        <button
          className="bg-red-500 text-white p-2 rounded w-full mt-2"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
