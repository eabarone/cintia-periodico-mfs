let adminsCollection = null;
let publishersCollection = null;

function inicializarPublishers() {
    try {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.warn('⚠️ Firebase no está disponible para publishers');
            return;
        }

        const dbLocal = firebase.firestore();
        adminsCollection = dbLocal.collection('admins');
        publishersCollection = dbLocal.collection('publishers');

        console.log('✅ Colecciones de admins y publishers inicializadas');
    } catch (error) {
        console.error('❌ Error al inicializar colecciones de publishers:', error);
    }
}

async function esAdminValido(emailAdmin) {
    try {
        if (!adminsCollection) {
            throw new Error('Firebase no está inicializado para admins');
        }

        if (!emailAdmin) {
            return false;
        }

        const snapshot = await adminsCollection.where('email', '==', emailAdmin).get();
        return !snapshot.empty;
    } catch (error) {
        console.error('❌ Error al validar admin:', error);
        return false;
    }
}

async function crearPublisher(datos) {
    try {
        if (!publishersCollection) {
            throw new Error('Firebase no está inicializado para publishers');
        }

        const nombre = datos && datos.nombre ? datos.nombre.trim() : '';
        const email = datos && datos.email ? datos.email.trim() : '';
        const adminEmail = datos && datos.adminEmail ? datos.adminEmail.trim() : '';

        if (!nombre || !email || !adminEmail) {
            return { exito: false, motivo: 'DATOS_INVALIDOS' };
        }

        const adminEsValido = await esAdminValido(adminEmail);
        if (!adminEsValido) {
            return { exito: false, motivo: 'ADMIN_NO_VALIDO' };
        }

        const snapshot = await publishersCollection.where('email', '==', email).get();
        if (!snapshot.empty) {
            return { exito: false, motivo: 'PUBLISHER_DUPLICADO' };
        }

        const nuevoPublisher = {
            nombre: nombre,
            email: email,
            authorized_by: adminEmail,
            fechaRegistro: new Date().toISOString()
        };

        await publishersCollection.add(nuevoPublisher);
        console.log('✅ Publisher creado:', email);

        return { exito: true };
    } catch (error) {
        console.error('❌ Error al crear publisher:', error);
        return { exito: false, motivo: 'ERROR_DESCONOCIDO' };
    }
}

async function esPublisherValido(emailPublisher) {
    try {
        if (!publishersCollection) {
            throw new Error('Firebase no está inicializado para publishers');
        }

        if (!emailPublisher) {
            return false;
        }

        const snapshot = await publishersCollection.where('email', '==', emailPublisher).get();
        return !snapshot.empty;
    } catch (error) {
        console.error('❌ Error al validar publisher:', error);
        return false;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPublishers);
} else {
    inicializarPublishers();
}
