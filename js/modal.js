/**
 * SISTEMA DE MODAL PARA ARTÍCULOS
 * 
 * Este archivo contiene las funciones para mostrar artículos completos en un modal.
 * Los estudiantes NO necesitan modificar este archivo, solo usar las funciones.
 * 
 * FUNCIONES DISPONIBLES:
 * - abrirModal(articulo) - Abre el modal con el artículo completo
 * - cerrarModal() - Cierra el modal
 */

/**
 * Abre el modal y muestra el artículo completo
 * 
 * @param {Object} articulo - Objeto con los datos del artículo
 * @param {string} articulo.titulo - Título del artículo
 * @param {string} articulo.banner - URL de la imagen
 * @param {string} articulo.contenido - Contenido completo
 * @param {string} articulo.fecha - Fecha del artículo
 * 
 * EJEMPLO DE USO:
 * abrirModal({
 *     titulo: "Mi artículo",
 *     banner: "https://...",
 *     contenido: "Contenido completo...",
 *     fecha: "9 de noviembre de 2024"
 * });
 */
function abrirModal(articulo) {
    const modal = document.getElementById('modal-articulo');
    
    // Actualizar contenido del modal
    document.getElementById('modal-banner').src = articulo.banner;
    document.getElementById('modal-titulo').textContent = articulo.titulo;
    document.getElementById('modal-fecha').textContent = '📅 ' + articulo.fecha;
    document.getElementById('modal-contenido').textContent = articulo.contenido;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll del body
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    const modal = document.getElementById('modal-articulo');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
}

// Inicializar eventos del modal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    
    // Cerrar modal al hacer clic fuera del contenido
    const modal = document.getElementById('modal-articulo');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('modal-articulo');
            if (modal && modal.classList.contains('active')) {
                cerrarModal();
            }
        }
    });
    
    console.log('✅ Sistema de modal inicializado');
});
