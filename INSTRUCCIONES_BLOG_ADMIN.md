# 📝 Guía Rápida - Admin Blog IPC Solder

## 🔐 Acceso al Sistema

**URL de acceso:** https://www.ipcsolder.com/admin/login

**Credenciales:**
- Email: [El que configuraste en Supabase]
- Contraseña: [La que configuraste en Supabase]

---

## 📋 Funciones Principales

### 1️⃣ Crear Nuevo Post

1. Haz clic en **"Nuevo Post"**
2. Completa los campos en ambos idiomas (🇪🇸 Español y 🇺🇸 English)
3. Usa la **barra de herramientas** para dar formato al contenido
4. Revisa en **👁️ Vista Previa** cómo se verá publicado
5. Guarda como **Borrador** o **Publica** directamente

### 2️⃣ Editar Post Existente

1. En el Dashboard, haz clic en **"Editar"** en el post que quieras modificar
2. Realiza los cambios necesarios
3. **IMPORTANTE:** Guarda los cambios antes de salir (verás advertencia si no lo haces)
4. Publica cuando estés listo

---

## 🎨 Barra de Herramientas de Formato

Usa estos botones para dar formato al contenido sin escribir HTML:

| Botón | Función | Resultado |
|-------|---------|-----------|
| **B** | Negrita | Texto en **negrita** |
| **I** | Cursiva | Texto en *cursiva* |
| **H2** | Título Principal | Título grande centrado |
| **H3** | Subtítulo | Subtítulo destacado |
| **P** | Párrafo | Párrafo normal |
| **• Lista** | Lista con viñetas | Lista de puntos |
| **BR** | Salto de línea | Espacio extra |
| **🖼️** | Insertar imagen | Imagen desde URL |
| **⬅️➡️** | Centrar texto | Texto centrado |
| **⚠️** | Texto importante | Advertencia centrada |

**Cómo usar:**
1. Selecciona el texto que quieres formatear
2. Haz clic en el botón correspondiente
3. El formato se aplica automáticamente

---

## 📎 Agregar Documentos de Apoyo

### ¿Para qué sirve?

Agregar documentos descargables al final de tus blogs (fichas técnicas, catálogos, manuales, etc.) sin ocupar espacio en el servidor.

### 🎯 Cómo funciona:

1. **Subes el documento a la nube** (Google Drive o Dropbox)
2. **Obtienes un enlace público**
3. **Usas el botón 📎 en el editor** para agregarlo
4. **Aparece automáticamente** en la sección "Recursos Adicionales" al final del blog

---

## ☁️ Cómo Obtener Enlaces Públicos

### 📁 Google Drive (Recomendado):

**Paso 1: Subir el archivo**
1. Ve a https://drive.google.com
2. Haz clic en "Nuevo" → "Subir archivo"
3. Selecciona tu documento (PDF, Excel, Word, ZIP, etc.)
4. Espera a que termine de subir

**Paso 2: Hacer el archivo público**
1. Haz clic derecho en el archivo → "Compartir"
2. En "Acceso general", haz clic en "Restringido"
3. Selecciona **"Cualquier persona con el enlace"**
4. Asegúrate que diga **"Lector"** (no "Editor")
5. Haz clic en "Copiar enlace"

**Paso 3: Convertir el enlace (IMPORTANTE)**

El enlace que copiaste se ve así:
```
https://drive.google.com/file/d/1ABC123xyz/view?usp=sharing
```

Necesitas convertirlo a formato de descarga directa:
```
https://drive.google.com/uc?export=download&id=1ABC123xyz
```

**Cómo hacerlo:**
- Copia solo el ID (la parte entre `/d/` y `/view`)
- Usa este formato: `https://drive.google.com/uc?export=download&id=TU_ID_AQUI`

**✅ Ventajas de Google Drive:**
- 15 GB gratis
- Muy confiable
- Enlaces no expiran
- Fácil de actualizar archivos

**⚠️ Importante:**
- ✅ Solo el archivo específico será público
- ✅ Nadie puede ver tus otros archivos de Drive
- ✅ Solo pueden ver/descargar, no editar
- ❌ NO compartas carpetas completas, solo archivos individuales

---

### 📦 Dropbox:

**Paso 1: Subir el archivo**
1. Ve a https://www.dropbox.com
2. Haz clic en "Subir" → "Archivos"
3. Selecciona tu documento
4. Espera a que termine de subir

**Paso 2: Crear enlace público**
1. Pasa el mouse sobre el archivo
2. Haz clic en "Compartir"
3. Haz clic en "Crear enlace"
4. Haz clic en "Copiar enlace"

**Paso 3: Modificar el enlace (IMPORTANTE)**

El enlace que copiaste termina en `?dl=0`:
```
https://www.dropbox.com/s/abc123/archivo.pdf?dl=0
```

Cámbialo a `?dl=1` para descarga directa:
```
https://www.dropbox.com/s/abc123/archivo.pdf?dl=1
```

**✅ Ventajas de Dropbox:**
- 2 GB gratis (menos que Drive)
- Enlaces simples
- Descarga directa fácil

**⚠️ Importante:**
- ✅ Solo el archivo específico será público
- ✅ Nadie puede ver tus otros archivos
- ✅ Solo pueden descargar, no editar

---

## 📎 Usar el Botón de Documentos en el Editor

**Paso a paso:**

1. **Prepara tu documento:**
   - Súbelo a Google Drive o Dropbox
   - Obtén el enlace público (siguiendo las instrucciones arriba)
   - Copia el enlace

2. **En el editor del blog:**
   - Haz clic en el botón **📎** en la barra de herramientas
   - Se abrirá el modal "Agregar Documento"

3. **Completa el formulario:**
   - **URL del documento:** Pega el enlace público
   - **Título:** Ej: "Ficha Técnica Soldadura SAC305"
   - **Tipo:** Selecciona (PDF, Excel, Word, ZIP, Imagen, Otro)
   - **Descripción:** (Opcional) Ej: "Especificaciones técnicas completas"

4. **Haz clic en "Agregar Documento"**
   - Se agregará automáticamente a la sección "Recursos Adicionales"
   - Aparecerá al final del contenido
   - Puedes agregar múltiples documentos

5. **Vista previa:**
   - Cambia a la pestaña "👁️ Vista Previa"
   - Verás la sección "📚 Recursos Adicionales" al final
   - Verifica que los enlaces funcionen

---

## 📚 Cómo se ve en el Blog

Al final de tu artículo aparecerá:

```
═══════════════════════════════════
📚 Recursos Adicionales
═══════════════════════════════════

📄 Ficha Técnica Soldadura SAC305
   Especificaciones técnicas completas

📊 Tabla de Temperaturas
   Guía de referencia rápida

📦 Archivos CAD
   Modelos 3D para diseño
```

Cada documento es un enlace clickeable que abre en nueva pestaña.

---

## ⚠️ Mejores Prácticas

### ✅ Hacer:
- Usa nombres descriptivos para los documentos
- Agrega descripciones breves y útiles
- Verifica que los enlaces funcionen antes de publicar
- Usa Google Drive para archivos grandes (hasta 15GB gratis)
- Mantén los archivos organizados en carpetas en tu Drive

### ❌ Evitar:
- No uses enlaces temporales o que expiren
- No compartas carpetas completas (solo archivos individuales)
- No uses servicios poco confiables
- No olvides cambiar `?dl=0` a `?dl=1` en Dropbox
- No olvides convertir el enlace de Drive al formato correcto

---

## 🖼️ Insertar Imágenes en el Contenido

### ¿Cómo agregar imágenes dentro del artículo?

1. **Sube tu imagen a un servicio en la nube:**
   - Google Drive (enlace público)
   - Imgur (gratuito, recomendado)
   - Dropbox (enlace público)
   - Tu propio servidor

2. **Obtén el enlace público de la imagen:**

   **Para Imgur (Recomendado):**
   - Ve a https://imgur.com
   - Haz clic en "New post"
   - Sube tu imagen
   - Haz clic derecho en la imagen → "Copiar dirección de imagen"
   - El enlace debe terminar en `.jpg`, `.png` o `.webp`

   **Para Google Drive:**
   - Sube la imagen a Drive
   - Clic derecho → "Obtener enlace"
   - Cambia a "Cualquier persona con el enlace"
   - Copia el ID del enlace (la parte entre `/d/` y `/view`)
   - Usa este formato: `https://drive.google.com/uc?id=TU_ID_AQUI`

3. **Insertar en el editor:**
   - Coloca el cursor donde quieres la imagen
   - Haz clic en el botón **🖼️** en la barra de herramientas
   - Pega la URL de la imagen
   - Agrega una descripción (opcional pero recomendado)
   - Elige la alineación (Izquierda, Centro, Derecha)
   - Haz clic en "Insertar Imagen"

4. **Resultado:**
   - La imagen se muestra reducida en el blog (máximo 800px)
   - Al hacer clic, se abre en tamaño completo en nueva pestaña
   - El blog permanece abierto en segundo plano

### ⚠️ Importante sobre imágenes:

- ✅ Usa servicios confiables (Imgur, Google Drive, Dropbox)
- ✅ Verifica que el enlace termine en `.jpg`, `.png` o `.webp`
- ✅ Prueba el enlace en el navegador antes de insertarlo
- ✅ Usa la vista previa para verificar que se vea bien
- ❌ NO uses enlaces temporales o que expiren
- ❌ NO uses imágenes de sitios que requieran login
- ❌ NO uses imágenes con derechos de autor sin permiso

---

## 🖼️ Carga de Imagen Destacada

### Paso a Paso:

1. **Ubicación:** En el panel derecho "Configuración" → sección "Imagen Destacada"

2. **Subir imagen:**
   - Haz clic en **"Seleccionar imagen"**
   - Elige una imagen de tu computadora
   - Formatos aceptados: JPG, PNG, WebP
   - Tamaño recomendado: 1200x630px (ratio 16:9)
   - Peso máximo: 2MB

3. **Proceso de carga:**
   - La imagen se sube automáticamente a Supabase Storage
   - Verás una barra de progreso
   - Cuando termine, aparecerá una vista previa

4. **Cambiar imagen:**
   - Haz clic en el ícono de **basura (🗑️)** para eliminar la actual
   - Sube una nueva imagen siguiendo el paso 2

5. **Importante:**
   - La imagen se guarda automáticamente al subirla
   - NO necesitas guardar el post para que la imagen se mantenga
   - Si eliminas la imagen, se borra inmediatamente del servidor

### ⚠️ Notas sobre imágenes:

- ✅ La imagen aparece en: tarjetas de blog, post completo, redes sociales
- ✅ Se optimiza automáticamente para web
- ✅ Puedes cambiarla en cualquier momento
- ❌ NO uses imágenes muy pesadas (ralentiza la carga)
- ❌ NO uses imágenes con texto importante (pueden no verse en móvil)

---

## 🤖 Ayuda con IA (ChatGPT/Gemini)

### Generar contenido formateado:

1. En el campo "Contenido", verás una caja azul con un **prompt para IA**
2. Haz clic en **"📋 Copiar Prompt"**
3. Pégalo en ChatGPT o Gemini
4. Reemplaza `[PEGA AQUÍ TU CONTENIDO]` con tu texto
5. La IA te devolverá **4 secciones:**
   - 🇪🇸 ESPAÑOL - RESUMEN
   - 🇪🇸 ESPAÑOL - CONTENIDO HTML
   - 🇺🇸 ENGLISH - EXCERPT
   - 🇺🇸 ENGLISH - CONTENT HTML

6. Copia cada sección en su campo correspondiente:
   - Resumen ES → Pestaña 🇪🇸, campo "Resumen"
   - Contenido ES → Pestaña 🇪🇸, campo "Contenido"
   - Resumen EN → Pestaña 🇺🇸, campo "Resumen"
   - Contenido EN → Pestaña 🇺🇸, campo "Contenido"

---

## 👁️ Vista Previa

**¿Para qué sirve?**
- Ver exactamente cómo se verá el blog antes de publicar
- Revisar el formato en ambos idiomas
- Detectar errores de espaciado o formato

**Cómo usar:**
1. Haz clic en la pestaña **"👁️ Vista Previa"**
2. Cambia entre 🇪🇸 ES y 🇺🇸 EN para ver ambas versiones
3. Regresa a las pestañas de idioma para seguir editando

---

## ⚠️ Cambios Sin Guardar

**Indicadores:**
- Badge amarillo en el header: **"⚠️ Cambios sin guardar"**
- Modal de confirmación al intentar salir
- Advertencia del navegador al cerrar la pestaña

**Recomendación:**
- Guarda frecuentemente con **"Guardar Borrador"**
- No cierres la pestaña sin guardar
- Si ves el badge amarillo, guarda antes de salir

---

## 📊 Estados del Post

| Estado | Descripción | Visible en web |
|--------|-------------|----------------|
| **Borrador** | En edición, no publicado | ❌ No |
| **Publicado** | Visible para todos | ✅ Sí |
| **Archivado** | Oculto pero guardado | ❌ No |

---

## 💡 Tips y Mejores Prácticas

### ✅ Hacer:
- Usa la vista previa antes de publicar
- Completa ambos idiomas (ES y EN)
- Agrega imagen destacada siempre
- Usa la barra de herramientas para formato consistente
- Guarda como borrador mientras trabajas

### ❌ Evitar:
- Publicar sin revisar la vista previa
- Dejar campos vacíos en inglés
- Cerrar sin guardar cambios
- Usar imágenes muy pesadas
- Copiar texto con formato de Word (puede traer código basura)

---

## 🆘 Problemas Comunes

**"No puedo subir la imagen"**
- Verifica que sea JPG, PNG o WebP
- Reduce el tamaño si es mayor a 2MB
- Intenta con otra imagen

**"Perdí mis cambios"**
- Siempre guarda antes de salir
- Usa "Guardar Borrador" frecuentemente
- No ignores las advertencias de cambios sin guardar

**"El formato no se ve bien"**
- Usa la barra de herramientas en lugar de escribir HTML
- Revisa en Vista Previa antes de publicar
- Usa el prompt de IA para formato correcto

**"No sé cómo centrar un título"**
- Selecciona el texto
- Haz clic en el botón **H2** (para título principal)
- O usa el botón **⬅️➡️** para centrar cualquier texto

---

## 📞 Soporte

Si tienes dudas o problemas, contacta al administrador del sistema.

**Recuerda:** Siempre puedes practicar creando posts como **Borrador** sin publicarlos.

---

*Última actualización: Enero 2026*
