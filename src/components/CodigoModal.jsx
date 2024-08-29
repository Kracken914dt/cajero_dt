
const CodigoModal = ({ isOpen, onClose, codigoIngresado, setCodigoIngresado, onCodigoSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg w-80">
        <h2 className="text-lg mb-4 text-black">Introduce el código de verificación</h2>
        <input
          type="text"
          value={codigoIngresado}
          onChange={(e) => setCodigoIngresado(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          placeholder="Ingrese el código"
        />
        <button
          onClick={onCodigoSubmit}
          className="bg-blue-500 text-white w-full p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Verificar Código
        </button>
        <button
          onClick={onClose}
          className="mt-2 bg-red-500 text-white w-full p-2 rounded hover:bg-red-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default CodigoModal;
