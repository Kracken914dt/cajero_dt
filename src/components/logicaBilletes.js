import B10k from '@/assets/images/B10k.png'
import B20k from '@/assets/images/B20k.png'
import B50k from '@/assets/images/B50k.png'
import B100k from '@/assets/images/B100k.png'

export const billetes = [
  { billete: '10k', valor: 10000, img: B10k },
  { billete: '20k', valor: 20000, img: B20k },
  { billete: '50k', valor: 50000, img: B50k },
  { billete: '100k', valor: 100000, img: B100k },
];

export function mostrarMatriz(cantidad) {
  if (cantidad <= 0 || cantidad % 10000 !== 0) {
    console.error('La cantidad debe ser un múltiplo de 10 y positivo');
    return [];
  }

  let matriz = [];
  let suma = 0;
  let alcanzado = false; 
  let totalRows = 0; 

  console.log('10k  20k  50k  100k');

  while (!alcanzado) {
    let fila = new Array(totalRows).fill(0); 
    let sePudoSumar = false;
    let sumaTemporal = suma; 

    for (let j = totalRows; j < billetes.length; j++) {
      if (sumaTemporal + billetes[j].valor <= cantidad) {
        fila.push(1);
        sumaTemporal += billetes[j].valor;
        sePudoSumar = true;

        if (sumaTemporal === cantidad) {
          alcanzado = true; 
          suma = sumaTemporal; 
          break; 
        }
      } else {
        fila.push(0);
      }
    }

    suma = sumaTemporal; 
    matriz.push(fila);
    console.log(fila.map(n => n.toString()).join(' ')); 

    if (!sePudoSumar && fila.slice(totalRows).every(v => v === 0)) {
      if (fila.slice(totalRows).some(v => v === 1)) {
        totalRows++;
      } else {
        totalRows = 0;
      }
    } else {
      totalRows++;
    }
  }

  return matriz;
}

export function calcularBilletes(matriz) {
  let billeteEntrega = [];

  matriz.forEach((fila) => {
    fila.forEach((valor, columnaIndex) => {
      if (valor === 1) {
        billeteEntrega.push(billetes[columnaIndex]);
      }
    });
  });

  return billeteEntrega;
}
