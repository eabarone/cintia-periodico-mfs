/**
 * SISTEMA DE NOTIFICACIONES POR EMAIL
 * 
 * Este archivo contiene las funciones para enviar notificaciones por email
 * usando EmailJS (servicio gratuito).
 * 
 * CONFIGURACIÓN REQUERIDA:
 * 1. Crear cuenta en https://www.emailjs.com/
 * 2. Crear un servicio de email (Gmail, Outlook, etc.)
 * 3. Crear una plantilla de email
 * 4. Obtener las credenciales y reemplazarlas abajo
 * 
 * NOTA: La gestión de suscriptores está en suscriptores.js
 */

// ⚠️ IMPORTANTE: El profesor debe configurar estas credenciales
const EMAIL_CONFIG = {
    serviceId: 'service_b32zhmu',      // Reemplazar con tu Service ID de EmailJS
    templateId: 'template_uyo0tfr',    // Reemplazar con tu Template ID de EmailJS
    publicKey: 'cY6slwOqb-rSqpmt_'       // Reemplazar con tu Public Key de EmailJS
};

/**
 * Inicializa EmailJS
 * Esta función debe llamarse al cargar la página
 */
function inicializarEmailJS() {
    // Inicializar EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAIL_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado correctamente');
    } else {
        console.error('❌ EmailJS no está cargado. Asegúrate de incluir el script en el HTML.');
    }
}

/**
 * Envía una notificación por email a un suscriptor
 * 
 * @param {Object} datos - Datos para el email
 * @param {string} datos.destinatario - Email del destinatario
 * @param {string} datos.nombreDestinatario - Nombre del destinatario
 * @param {string} datos.tituloArticulo - Título del artículo nuevo
 * @param {string} datos.contenidoArticulo - Resumen del artículo
 * @returns {Promise} - Promesa que se resuelve cuando el email se envía
 * 
 * EJEMPLO DE USO:
 * enviarNotificacion({
 *     destinatario: 'estudiante@ejemplo.com',
 *     nombreDestinatario: 'Juan Pérez',
 *     tituloArticulo: 'Nuevo artículo publicado',
 *     contenidoArticulo: 'Este es un resumen del artículo...'
 * });
 */
async function enviarNotificacion(datos) {
    try {
        // Validar que EmailJS esté cargado
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS no está cargado');
        }

        // Validar datos requeridos
        if (!datos.destinatario || !datos.nombreDestinatario || !datos.tituloArticulo) {
            throw new Error('Faltan datos requeridos para enviar el email');
        }

        // Preparar los parámetros para la plantilla
        // IMPORTANTE: Los nombres deben coincidir EXACTAMENTE con las variables en EmailJS
        const parametros = {
            destinatario: datos.destinatario,
            nombreDestinatario: datos.nombreDestinatario,
            tituloArticulo: datos.tituloArticulo,
            contenidoArticulo: datos.contenidoArticulo || 'Nuevo artículo disponible'
        };

        // Enviar el email usando EmailJS
        const respuesta = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            parametros
        );

        console.log('✅ Email enviado exitosamente a:', datos.destinatario);
        return { success: true, respuesta };

    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Envía notificaciones a todos los suscriptores
 * 
 * @param {Object} articulo - Datos del artículo nuevo
 * @param {string} articulo.titulo - Título del artículo
 * @param {string} articulo.contenido - Contenido del artículo
 * @returns {Promise} - Promesa con los resultados del envío
 * 
 * EJEMPLO DE USO:
 * notificarSuscriptores({
 *     titulo: 'Nuevo artículo',
 *     contenido: 'Contenido del artículo...'
 * });
 */
async function notificarSuscriptores(articulo) {
    try {
        // Obtener lista de suscriptores
        const suscriptores = await obtenerSuscriptores();

        if (suscriptores.length === 0) {
            console.log('ℹ️ No hay suscriptores para notificar');
            return { success: true, enviados: 0 };
        }

        console.log(`📧 Enviando notificaciones a ${suscriptores.length} suscriptores...`);

        // Crear resumen del artículo (primeros 200 caracteres)
        const resumen = articulo.contenido.substring(0, 200) + '...';

        // Enviar email a cada suscriptor
        const promesas = suscriptores.map(suscriptor => 
            enviarNotificacion({
                destinatario: suscriptor.email,
                nombreDestinatario: suscriptor.nombre,
                tituloArticulo: articulo.titulo,
                contenidoArticulo: resumen
            })
        );

        // Esperar a que todos los emails se envíen
        const resultados = await Promise.all(promesas);
        
        const exitosos = resultados.filter(r => r.success).length;
        const fallidos = resultados.filter(r => !r.success).length;

        console.log(`✅ Notificaciones enviadas: ${exitosos} exitosas, ${fallidos} fallidas`);
        
        return { 
            success: true, 
            enviados: exitosos, 
            fallidos: fallidos 
        };

    } catch (error) {
        console.error('❌ Error al notificar suscriptores:', error);
        return { success: false, error: error.message };
    }
}

// Inicializar EmailJS cuando se carga la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEmailJS);
} else {
    inicializarEmailJS();
}
