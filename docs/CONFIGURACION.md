# 🔧 Configuración Completa del Proyecto
## Firebase + EmailJS - Guía Paso a Paso

Esta guía te ayudará a configurar Firebase (base de datos) y EmailJS (envío de correos) para el periódico estudiantil.

---

## 📋 Requisitos Previos

- Una cuenta de Google (para Firebase)
- Una cuenta de Gmail (para enviar emails)
- Los archivos del proyecto descargados

---

## PARTE 1: Configurar Firebase (Base de Datos)

### Paso 1: Crear el Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Nombre del proyecto: `periodico-estudiantil` (o el que prefieras)
4. Haz clic en **"Continuar"**
5. **Desactiva** Google Analytics (no lo necesitamos)
6. Haz clic en **"Crear proyecto"**
7. Espera unos segundos y haz clic en **"Continuar"**

### Paso 2: Activar Firestore (Base de Datos)

1. En el menú lateral, busca **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Iniciar en modo de prueba"** o **"Start in test mode"**
4. Haz clic en **"Siguiente"**
5. Ubicación: Deja la predeterminada (generalmente `us-central`)
6. Haz clic en **"Habilitar"** o **"Enable"**
7. Espera a que se cree la base de datos

### Paso 3: Obtener las Credenciales de Firebase

1. En el menú lateral, haz clic en el **ícono de engranaje ⚙️** → **"Configuración del proyecto"**
2. Baja hasta la sección **"Tus aplicaciones"**
3. Haz clic en el ícono **`</>`** (Web)
4. Nombre de la app: `periodico-web`
5. **NO** marques "Firebase Hosting"
6. Haz clic en **"Registrar app"**
7. Verás un código similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "periodico-xxxxx.firebaseapp.com",
  projectId: "periodico-xxxxx",
  storageBucket: "periodico-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

8. **COPIA** estos valores (los necesitarás en el Paso 5)
9. Haz clic en **"Continuar a la consola"**

### Paso 4: Extender las Reglas de Seguridad (Importante)

Por defecto, Firebase solo permite acceso por 30 días. Vamos a extenderlo:

1. En el menú lateral, ve a **"Firestore Database"**
2. Haz clic en la pestaña **"Reglas"** o **"Rules"**
3. Verás algo como esto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 9);
    }
  }
}
```

4. **Cambia** la fecha a 6 meses o 1 año en el futuro. Por ejemplo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 12, 31);
    }
  }
}
```

5. Haz clic en **"Publicar"** o **"Publish"**

---

## PARTE 2: Configurar EmailJS (Envío de Correos)

### Paso 1: Crear Cuenta en EmailJS

1. Ve a https://www.emailjs.com/
2. Haz clic en **"Sign Up"** (Registrarse)
3. Regístrate con tu email de Gmail
4. Verifica tu email (revisa tu bandeja de entrada)
5. Inicia sesión en EmailJS

### Paso 2: Conectar tu Gmail

1. En el dashboard, ve a **"Email Services"** (menú lateral)
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"**
4. Haz clic en **"Connect Account"**
5. Selecciona tu cuenta de Gmail
6. Acepta los permisos
7. **Service Name**: Deja el predeterminado o ponle `gmail_service`
8. Haz clic en **"Create Service"**
9. **COPIA** el **Service ID** (ejemplo: `service_x9w2jbg`) - Lo necesitarás después

### Paso 3: Crear la Plantilla de Email

1. En el menú lateral, ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Verás un editor con campos. **Configúralos así:**

#### **Subject (Asunto):**
```
Nuevo artículo publicado: {{tituloArticulo}}
```

#### **Content (Contenido del email):**
```
Hola {{nombreDestinatario}},

¡Tenemos un nuevo artículo en nuestro periódico estudiantil!

📰 Título: {{tituloArticulo}}

📝 Resumen:
{{contenidoArticulo}}

Visita nuestro periódico para leer el artículo completo.

Saludos,
El equipo del Periódico Estudiantil
```

#### **To email (Destinatario):**
```
{{destinatario}}
```

#### **From name (Nombre del remitente):**
```
Periódico Estudiantil
```

4. Haz clic en **"Save"** (Guardar)
5. **COPIA** el **Template ID** (ejemplo: `template_o9srlkn`) - Lo necesitarás después

### Paso 4: Obtener tu Public Key

1. En el menú lateral, ve a **"Account"** (tu perfil)
2. En la sección **"API Keys"**, verás tu **Public Key**
3. **COPIA** el **Public Key** (ejemplo: `4OxJMcxZ46BHKuzm8`)

---

## PARTE 3: Configurar los Archivos del Proyecto

### Paso 5: Configurar `articulos.js`

1. Abre el archivo `js/articulos.js`
2. Busca la sección de configuración de Firebase (líneas 15-22 aproximadamente)
3. **Reemplaza** los valores con los que copiaste en el **Paso 3 de Firebase**:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "TU_AUTH_DOMAIN_AQUI",
    projectId: "TU_PROJECT_ID_AQUI",
    storageBucket: "TU_STORAGE_BUCKET_AQUI",
    messagingSenderId: "TU_MESSAGING_SENDER_ID_AQUI",
    appId: "TU_APP_ID_AQUI"
};
```

4. Guarda el archivo

### Paso 6: Configurar `email.js`

1. Abre el archivo `js/email.js`
2. Busca la sección de configuración de EmailJS (líneas 16-20 aproximadamente)
3. **Reemplaza** los valores con los que copiaste en EmailJS:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'TU_SERVICE_ID_AQUI',      // Del Paso 2 de EmailJS
    templateId: 'TU_TEMPLATE_ID_AQUI',    // Del Paso 3 de EmailJS
    publicKey: 'TU_PUBLIC_KEY_AQUI'       // Del Paso 4 de EmailJS
};
```

4. Guarda el archivo

---

## ✅ Verificar que Todo Funciona

### Prueba 1: Verificar Firebase

1. Abre `index.html` en tu navegador
2. Abre la **Consola del navegador** (F12)
3. Deberías ver: `✅ Firebase inicializado correctamente`
4. Si ves un error, revisa que copiaste bien las credenciales en `articulos.js`

### Prueba 2: Publicar un Artículo

1. Ve a la sección **"Publicar Nuevo Artículo"**
2. Llena el formulario:
   - **Título**: `Prueba de artículo`
   - **Banner**: `https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800`
   - **Contenido**: `Este es un artículo de prueba para verificar que Firebase funciona correctamente.`
3. Haz clic en **"Publicar Artículo"**
4. Deberías ver: `¡Artículo publicado exitosamente!`
5. El artículo debe aparecer en la sección de **"Artículos Publicados"**

### Prueba 3: Suscribirse

1. Ve a la sección **"Suscríbete a Nuestro Boletín"**
2. Llena el formulario con tu nombre y email
3. Haz clic en **"Suscribirse"**
4. Deberías ver: `¡Suscripción exitosa!`

### Prueba 4: Verificar Envío de Emails

1. Publica un nuevo artículo (como en la Prueba 2)
2. Si hay suscriptores, deberías ver en la consola: `📧 Enviando notificaciones a X suscriptores...`
3. Revisa tu email (el que usaste para suscribirte)
4. Deberías recibir un correo con el nuevo artículo

---

## 🎯 Resumen de Credenciales

Guarda estos valores en un lugar seguro:

### Firebase:
- ✅ apiKey
- ✅ authDomain
- ✅ projectId
- ✅ storageBucket
- ✅ messagingSenderId
- ✅ appId

### EmailJS:
- ✅ Service ID
- ✅ Template ID
- ✅ Public Key

---

## ❓ Problemas Comunes

### Error: "Firebase not defined"
- **Solución**: Verifica que los scripts de Firebase estén en el HTML antes de `articulos.js`

### Error: "EmailJS not defined"
- **Solución**: Verifica que el script de EmailJS esté en el HTML antes de `email.js`

### No se guardan los artículos
- **Solución**: Revisa las credenciales de Firebase en `articulos.js`
- **Solución**: Verifica que las reglas de Firestore permitan lectura/escritura

### No llegan los emails
- **Solución**: Revisa las credenciales de EmailJS en `email.js`
- **Solución**: Verifica que la plantilla tenga las variables correctas: `{{destinatario}}`, `{{nombreDestinatario}}`, `{{tituloArticulo}}`, `{{contenidoArticulo}}`
- **Solución**: Revisa la carpeta de spam

### Error: "Permission denied"
- **Solución**: Extiende las reglas de seguridad de Firestore (ver Paso 4 de Firebase)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la **Consola del navegador** (F12) para ver errores específicos
2. Verifica que copiaste correctamente todas las credenciales
3. Asegúrate de que los archivos JS estén en la carpeta `js/`

---

**¡Listo! Tu periódico estudiantil está completamente configurado.** 🎉
