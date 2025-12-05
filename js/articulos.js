/**
 * SISTEMA DE GESTIÓN DE ARTÍCULOS CON FIREBASE
 * 
 * Este archivo contiene las funciones base para guardar y obtener artículos.
 * Los estudiantes deben integrar estas funciones con la interfaz HTML.
 * 
 * NOTA PARA EL PROFESOR: Configurar Firebase en la sección de abajo.
 * Los estudiantes NO necesitan saber que usa Firebase, solo usan las funciones.
 */

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE FIREBASE (SOLO PARA EL PROFESOR)
// ═══════════════════════════════════════════════════════════════
// Instrucciones en README.md - Sección "Configuración de Firebase"

const firebaseConfig = {
  apiKey: "AIzaSyCIabWdsipy6La2mE6mSaX1KTiSVi0pHcU",
  authDomain: "newspapper---mfs.firebaseapp.com",
  projectId: "newspapper---mfs",
  storageBucket: "newspapper---mfs.firebasestorage.app",
  messagingSenderId: "911207280713",
  appId: "1:911207280713:web:09a0e3c5b5c8552de68f98"
};

// Inicializar Firebase (solo si está configurado)
let db = null;
let useFirebase = false;

if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== 'TU_API_KEY_AQUI') {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        useFirebase = true;
        console.log('✅ Firebase conectado - Los artículos se guardarán en la nube');
    } catch (error) {
        console.warn('⚠️ Firebase no disponible, usando localStorage');
        useFirebase = false;
    }
} else {
    console.log('ℹ️ Usando localStorage (Firebase no configurado)');
}

// ═══════════════════════════════════════════════════════════════
// FIN DE CONFIGURACIÓN - Los estudiantes NO necesitan ver esto
// ═══════════════════════════════════════════════════════════════

/**
 * Guarda un nuevo artículo (Firebase o localStorage)
 * 
 * @param {Object} articulo - Objeto con los datos del artículo
 * @param {string} articulo.titulo - Título del artículo
 * @param {string} articulo.banner - URL de la imagen del banner
 * @param {string} articulo.contenido - Contenido completo del artículo
 * @returns {Promise<boolean>} - true si se guardó correctamente, false si hubo error
 * 
 * EJEMPLO DE USO:
 * const nuevoArticulo = {
 *     titulo: "Mi primer artículo",
 *     banner: "https://ejemplo.com/imagen.jpg",
 *     contenido: "Este es el contenido del artículo..."
 * };
 * guardarArticulo(nuevoArticulo);
 */
async function guardarArticulo(articulo) {
    try {
        // Validar que el artículo tenga los campos requeridos
        if (!articulo.titulo || !articulo.banner || !articulo.contenido) {
            console.error('Error: El artículo debe tener título, banner y contenido');
            return false;
        }

        // Crear el nuevo artículo con datos adicionales
        const nuevoArticulo = {
            id: generarId(),
            titulo: articulo.titulo,
            banner: articulo.banner,
            contenido: articulo.contenido,
            fecha: new Date().toISOString(),
            fechaLegible: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            autorNombre: articulo.autorNombre || '',
            autorEmail: articulo.autorEmail || ''
        };

        if (useFirebase) {
            // Guardar en Firebase
            await db.collection('articulos').doc(nuevoArticulo.id).set(nuevoArticulo);
            console.log('✅ Artículo guardado en la nube:', nuevoArticulo.titulo);
        } else {
            // Guardar en localStorage
            const articulos = await obtenerArticulos();
            articulos.unshift(nuevoArticulo);
            localStorage.setItem('articulos', JSON.stringify(articulos));
            console.log('✅ Artículo guardado localmente:', nuevoArticulo.titulo);
        }

        return true;

    } catch (error) {
        console.error('❌ Error al guardar el artículo:', error);
        return false;
    }
}

/**
 * Obtiene todos los artículos guardados (Firebase o localStorage)
 * 
 * @returns {Promise<Array>} - Array con todos los artículos guardados
 * 
 * EJEMPLO DE USO:
 * const articulos = await obtenerArticulos();
 * articulos.forEach(articulo => {
 *     console.log(articulo.titulo);
 * });
 */
async function obtenerArticulos() {
    try {
        if (useFirebase) {
            // Obtener de Firebase
            const snapshot = await db.collection('articulos')
                .orderBy('fecha', 'desc')
                .get();
            
            const articulos = [];
            snapshot.forEach(doc => {
                articulos.push(doc.data());
            });
            
            return articulos;
        } else {
            // Obtener de localStorage
            const articulosJSON = localStorage.getItem('articulos');
            
            if (!articulosJSON) {
                return [];
            }

            return JSON.parse(articulosJSON);
        }

    } catch (error) {
        console.error('❌ Error al obtener artículos:', error);
        return [];
    }
}

/**
 * Obtiene un artículo específico por su ID
 * 
 * @param {string} id - ID del artículo a buscar
 * @returns {Object|null} - El artículo encontrado o null si no existe
 */
function obtenerArticuloPorId(id) {
    const articulos = obtenerArticulos();
    return articulos.find(articulo => articulo.id === id) || null;
}

/**
 * Elimina un artículo por su ID
 * 
 * @param {string} id - ID del artículo a eliminar
 * @returns {boolean} - true si se eliminó correctamente
 */
function eliminarArticulo(id) {
    try {
        const articulos = obtenerArticulos();
        const articulosFiltrados = articulos.filter(articulo => articulo.id !== id);
        
        localStorage.setItem('articulos', JSON.stringify(articulosFiltrados));
        console.log('✅ Artículo eliminado exitosamente');
        return true;

    } catch (error) {
        console.error('❌ Error al eliminar artículo:', error);
        return false;
    }
}

/**
 * Genera un ID único para cada artículo
 * 
 * @returns {string} - ID único generado
 */
function generarId() {
    return 'art_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Crea artículos de ejemplo para pruebas
 * Esta función es solo para demostración
 */
function crearArticulosDeEjemplo() {
    const ejemplos = [
        {
            titulo: "Inauguración de la Nueva Biblioteca",
            banner: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
            contenido: "Nuestra escuela celebra la apertura de una moderna biblioteca equipada con tecnología de última generación. Los estudiantes ahora tienen acceso a miles de recursos digitales y físicos para apoyar su aprendizaje."
        },
        {
            titulo: "Equipo de Debate Gana Torneo Regional",
            banner: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800",
            contenido: "El equipo de debate de nuestra escuela ha logrado un triunfo histórico al ganar el torneo regional. Los estudiantes demostraron excelentes habilidades de argumentación y trabajo en equipo."
        },
        {
            titulo: "Feria de Ciencias 2024",
            banner: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
            contenido: "La feria de ciencias anual fue un gran éxito, con proyectos innovadores presentados por estudiantes de todos los grados. Desde experimentos de química hasta robots programables, la creatividad estuvo presente en cada stand."
        }
    ];

    ejemplos.forEach(articulo => guardarArticulo(articulo));
    console.log('✅ Artículos de ejemplo creados');
}

// Descomentar la siguiente línea para crear artículos de ejemplo
// crearArticulosDeEjemplo();
