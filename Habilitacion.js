const readlineSync = require('readline-sync');

// Clase base para representar a una persona
class Persona {
    #ciudad;
    constructor(ciudad) {
        this.#ciudad = ciudad;
    }
    get ciudad() {
        return this.#ciudad;
    }
}

// Clase para representar a un campesino, que hereda de Persona
// herencia: la clase campesino hereda el atributo ciudad de la clase persona

class Campesino extends Persona {
    #estrato;
    #cultivo;
    #hectareas;
    constructor(estrato, ciudad, cultivo, hectareas) {
        super(ciudad);
        this.#estrato = estrato;
        this.#cultivo = cultivo;
        this.#hectareas = hectareas;
    }
    get estrato() {
        return this.#estrato;
    }
    get cultivo() {
        return this.#cultivo;
    }
    get hectareas() {
        return this.#hectareas;
    }
}

// Clase base abstracta para representar una transacción
class Transaccion {
    #ciudad;
    #cultivo;
    #valor;
    constructor(ciudad, cultivo, valor) {
        this.#ciudad = ciudad;
        this.#cultivo = cultivo;
        this.#valor = valor;
    }
    get ciudad() {
        return this.#ciudad;
    }
    get cultivo() {
        return this.#cultivo;
    }
    get valor() {
        return this.#valor;
    }
    // Método abstracto que debe ser implementado por subclases
    calcularComision() {
        throw new Error('Método calcularComision debe ser implementado por subclases');
    }
    //Control de errores que sirve para las subclases
}

// Clase para representar una venta, que hereda de Transaccion
class Venta extends Transaccion {
    calcularComision() {
        let comision = 0;
        if (this.cultivo === 'frutas') {
            comision = this.valor * 0.05;
        } else {
            if (this.ciudad === 'extranjero') {
                comision = this.valor * 0.25;
            } else {
                comision = this.valor * 0.07;
            }
        }
        return comision;
    }
}

// Clase Nodo para la implementación de la lista enlazada
class Nodo {
    #dato;
    #siguiente;
    constructor(dato, siguiente = null) {
        this.#dato = dato;
        this.#siguiente = siguiente;
    }
    get dato() {
        return this.#dato;
    }
    get siguiente() {
        return this.#siguiente;
    }
    set siguiente(nuevoSiguiente) {
        this.#siguiente = nuevoSiguiente;
    }
}

// Clase ListaEnlazada para manejar listas enlazadas
class ListaEnlazada {
    #cabeza;
    constructor() {
        this.#cabeza = null;
    }
    agregar(dato) {
        if (!this.#cabeza) {
            this.#cabeza = new Nodo(dato);
        } else {
            let actual = this.#cabeza;
            while (actual.siguiente) {
                actual = actual.siguiente;
            }
            actual.siguiente = new Nodo(dato);
        }
    }
    obtenerCabeza() {
        return this.#cabeza;
    }
}

// Clase para representar la Cooperativa Campesina
class CooperativaCampesina {
    #campesinos;
    #ciudadesVulnerables;
    #ventas;
    constructor(ciudadesVulnerables) {
        this.#campesinos = new ListaEnlazada();
        this.#ciudadesVulnerables = ciudadesVulnerables;
        this.#ventas = new ListaEnlazada();
    }

    agregarCampesino(campesino) {
        this.#campesinos.agregar(campesino);
    }

    agregarVenta(venta) {
        this.#ventas.agregar(venta);
    }

    calcularSubsidio(campesino) {
        let subsidio = 0;
        const ciudadesVulnerables = this.#ciudadesVulnerables;
        const numCiudadesVulnerables = ciudadesVulnerables.length;
        
        for (let i = 0; i < numCiudadesVulnerables; i++) {
            if (ciudadesVulnerables[i] === campesino.ciudad) {
                if (campesino.estrato === 2) {
                    subsidio = campesino.hectareas * 0.1;
                } else if (campesino.estrato === 1) {
                    subsidio = campesino.hectareas * 0.2;
                }
                return subsidio;
            }
        }

        if (campesino.estrato === 2) {
            subsidio = campesino.hectareas * 0.04;
        } else if (campesino.estrato === 1) {
            subsidio = campesino.hectareas * 0.05;
        }

        return subsidio;
    }

    calcularTotalSubsidios() {
        let totalSubsidios = 0;
        let actual = this.#campesinos.obtenerCabeza();
        while (actual) {
            totalSubsidios += this.calcularSubsidio(actual.dato);
            actual = actual.siguiente;
        }
        return totalSubsidios;
    }

    calcularTotalComisiones() {
        let totalComisiones = 0;
        let actual = this.#ventas.obtenerCabeza();
        while (actual) {
            totalComisiones += actual.dato.calcularComision();
            actual = actual.siguiente;
        }
        return totalComisiones;
    }

    verificaPerdida() {
        const totalSubsidios = this.calcularTotalSubsidios();
        const totalComisiones = this.calcularTotalComisiones();
        return totalComisiones < totalSubsidios;
    }

    calcularSubsidiosPorCiudad(ciudades) {
        let totalSubsidios = 0;
        let actual = this.#campesinos.obtenerCabeza();
        while (actual) {
            if (actual.dato.estrato === 1) {
                for (let i = 0; i < ciudades.length; i++) {
                    if (ciudades[i] === actual.dato.ciudad) {
                        totalSubsidios += this.calcularSubsidio(actual.dato);
                        break;
                    }
                }
            }
            actual = actual.siguiente;
        }
        return totalSubsidios;
    }

    calcularComisionesPorCiudadYCultivo(ciudad, cultivo) {
        let totalComisiones = 0;
        let actual = this.#ventas.obtenerCabeza();
        while (actual) {
            if (actual.dato.ciudad === ciudad && actual.dato.cultivo === cultivo) {
                totalComisiones += actual.dato.calcularComision();
            }
            actual = actual.siguiente;
        }
        return totalComisiones;
    }
}

// Definir ciudades consideradas como de alta vulnerabilidad
const ciudadesVulnerables = ['Manizales', 'Barranquilla', 'Pereira'];

// Ejemplo de uso
const cooperativa = new CooperativaCampesina(ciudadesVulnerables);

// El usuario ingresa datos de campesinos
const numCampesinos = readlineSync.questionInt('Ingrese el numero de campesinos: ');
for (let i = 0; i < numCampesinos; i++) {
    const estrato = readlineSync.questionInt(`Ingrese el estrato del campesino ${i + 1}: `);
    const ciudad = readlineSync.question('Ingrese la ciudad del campesino: ');
    const cultivo = readlineSync.question('Ingrese el cultivo del campesino: ');
    const hectareas = readlineSync.questionFloat('Ingrese la cantidad de hectareas cultivadas: ');
    const campesino = new Campesino(estrato, ciudad, cultivo, hectareas);
    cooperativa.agregarCampesino(campesino);
}

// Ejemplo de agregar ventas
const numVentas = readlineSync.questionInt('Ingrese el numero de ventas: ');
for (let i = 0; i < numVentas; i++) {
    const ciudad = readlineSync.question('Ingrese la ciudad de la venta: ');
    const cultivo = readlineSync.question('Ingrese el cultivo de la venta: ');
    const valor = readlineSync.questionFloat('Ingrese el valor de la venta: ');
    const venta = new Venta(ciudad, cultivo, valor);
    cooperativa.agregarVenta(venta);
}

// Calcular y mostrar información
console.log('Valor total de subsidios otorgados a nivel nacional:', cooperativa.calcularTotalSubsidios());
console.log('Valor total de dinero recaudado en comisiones a nivel nacional:', cooperativa.calcularTotalComisiones());
console.log('¿La cooperativa pierde dinero?', cooperativa.verificaPerdida() ? 'Sí' : 'No');

// Ejemplo de cálculo de subsidios para un conjunto de ciudades dadas
const ciudadesEjemplo = ['Manizales', 'Barranquilla', 'Pereira'];
console.log('Valor total de subsidios para las ciudades dadas:', cooperativa.calcularSubsidiosPorCiudad(ciudadesEjemplo));

// Ejemplo de cálculo de comisiones para una ciudad y cultivo dados
const ciudadEjemplo = 'Cartagena';
const cultivoEjemplo = 'Yuca';
console.log('Valor total de comisiones para la ciudad y cultivo dados:', cooperativa.calcularComisionesPorCiudadYCultivo(ciudadEjemplo, cultivoEjemplo));

