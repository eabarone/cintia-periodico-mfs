/**
 * SUSCRIPTORES.JS
 * Maneja la gestión de suscriptores en Firebase
 * 
 * FUNCIONES DISPONIBLES:
 * - guardarSuscriptor(suscriptor)
 * - obtenerSuscriptores()
 */

// Referencia a la colección de suscriptores en Firebase
let suscriptoresCollection = null;

/**
 * Inicializa la colección de suscriptores en Firebase
 * Esta función se llama automáticamente al cargar la página
 */
function inicializarSuscriptores() {
    try {
        // Verificar que Firebase esté disponible
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.warn('⚠️ Firebase no está disponible para suscriptores');
            return;
        }

        // Obtener referencia a la colección
        const db = firebase.firestore();
        suscriptoresCollection = db.collection('suscriptores');
        
        console.log('✅ Colección de suscriptores inicializada');
    } catch (error) {
        console.error('❌ Error al inicializar colección de suscriptores:', error);
    }
}

/**
 * Guarda un nuevo suscriptor en Firebase
 * 
 * @param {Object} suscriptor - Datos del suscriptor
 * @param {string} suscriptor.nombre - Nombre del suscriptor
 * @param {string} suscriptor.email - Email del suscriptor
 * @returns {Promise<boolean>} - true si se guardó correctamente, false si hubo error
 * 
 * EJEMPLO DE USO:
 * const guardado = await guardarSuscriptor({
 *     nombre: 'Juan Pérez',
 *     email: 'juan@ejemplo.com'
 * });
 */
async function guardarSuscriptor(suscriptor) {
    try {
        // Verificar que Firebase esté disponible
        if (!suscriptoresCollection) {
            throw new Error('Firebase no está inicializado');
        }

        // Validar datos
        if (!suscriptor.nombre || !suscriptor.email) {
            throw new Error('Nombre y email son requeridos');
        }

        // Verificar si el email ya existe
        const snapshot = await suscriptoresCollection
            .where('email', '==', suscriptor.email)
            .get();

        if (!snapshot.empty) {
            console.warn('⚠️ El email ya está suscrito:', suscriptor.email);
            return false;
        }

        // Guardar en Firebase
        const nuevoSuscriptor = {
            nombre: suscriptor.nombre,
            email: suscriptor.email,
            fechaSuscripcion: new Date().toISOString()
        };

        await suscriptoresCollection.add(nuevoSuscriptor);
        console.log('✅ Suscriptor guardado en Firebase:', suscriptor.email);
        return true;

    } catch (error) {
        console.error('❌ Error al guardar suscriptor en Firebase:', error);
        return false;
    }
}

/**
 * Obtiene todos los suscriptores desde Firebase
 * 
 * @returns {Promise<Array>} - Array con todos los suscriptores
 * 
 * EJEMPLO DE USO:
 * const suscriptores = await obtenerSuscriptores();
 * console.log(`Total: ${suscriptores.length}`);
 */
async function obtenerSuscriptores() {
    try {
        // Verificar que Firebase esté disponible
        if (!suscriptoresCollection) {
            console.warn('⚠️ Firebase no está disponible. No hay suscriptores.');
            return [];
        }

        // Obtener de Firebase
        const snapshot = await suscriptoresCollection.get();
        const suscriptores = [];
        
        snapshot.forEach(doc => {
            suscriptores.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ ${suscriptores.length} suscriptores obtenidos de Firebase`);
        return suscriptores;

    } catch (error) {
        console.error('❌ Error al obtener suscriptores de Firebase:', error);
        return [];
    }
}

// Inicializar cuando se carga la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSuscriptores);
} else {
    inicializarSuscriptores();
}
