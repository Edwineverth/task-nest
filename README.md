
# Backend for Task, User, and Auth Management

Este proyecto es un backend construido en Node.js que utiliza Firebase, Express y TypeScript. Está diseñado para gestionar tareas, usuarios y autenticación, implementando funcionalidades de creación, actualización, eliminación y autenticación de usuarios y tareas.

## Estructura del Proyecto

```plaintext
src
├── __mocks__            # Mocks para pruebas, incluyendo firebase-admin
├── config               # Configuración de inyección de dependencias
├── controllers          # Controladores para manejar las peticiones HTTP
├── firebase             # Configuración de Firebase
├── interfaces           # Interfaces de servicios y repositorios
├── middleware           # Middlewares para autenticación y limitación de tasa
├── models               # Modelos de datos para User y Task
├── repositories         # Repositorios para manejo de datos
├── routes               # Rutas para los módulos de autenticación, tareas y usuarios
├── services             # Servicios para lógica de negocio
├── test                 # Pruebas unitarias para controladores y servicios
└── validators           # Validadores para datos de entrada
```

## Dependencias

- `bcrypt`: Para el hash de contraseñas.
- `dotenv`: Manejo de variables de entorno.
- `express-rate-limit`: Limitación de solicitudes.
- `firebase-admin`: SDK de Firebase Admin.
- `firebase-functions`: Para implementar funciones en Firebase.
- `joi`: Validación de datos.
- `jsonwebtoken`: Para generación y verificación de tokens JWT.
- `reflect-metadata` y `tsyringe`: Para inyección de dependencias.

## Scripts de npm

- **`lint`**: Ejecuta ESLint para analizar el código.
- **`lint:fix`**: Ejecuta ESLint y corrige automáticamente los errores.
- **`format`**: Formatea el código usando Prettier.
- **`build`**: Compila el código TypeScript a JavaScript.
- **`build:watch`**: Compila el código en modo de observación.
- **`serve`**: Inicia el emulador de Firebase para funciones.
- **`shell`**: Inicia el entorno shell de Firebase Functions.
- **`start`**: Inicia el entorno shell de funciones como desarrollo.
- **`start:dev`**: Inicia el emulador en modo de depuración.
- **`deploy`**: Despliega las funciones a Firebase.
- **`logs`**: Muestra los logs de funciones de Firebase.
- **`test`**: Ejecuta las pruebas con Jest.
- **`test:watch`**: Ejecuta las pruebas en modo observación.

## Configuración de Firebase

En `src/firebase/firebase.ts`:

```typescript
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();
export { db };
```

## Inyección de Dependencias

El proyecto utiliza `tsyringe` para la inyección de dependencias, con la configuración en `src/config/container.ts`. Los servicios y repositorios están registrados en el contenedor para facilitar la prueba y el uso en la aplicación.

## Rutas

Las rutas están definidas en `src/routes/` y se dividen en módulos:

- **authRoutes**: Rutas para autenticación.
- **taskRoutes**: Rutas para gestión de tareas.
- **userRoutes**: Rutas para gestión de usuarios.

## Pruebas

Las pruebas se encuentran en `src/test/` y están organizadas en carpetas para **controladores** y **servicios**. Los tests están escritos en Jest, utilizando mocks para Firebase y otras dependencias externas.

### Estructura de pruebas

```plaintext
src/test
├── controllers          # Pruebas para los controladores
└── services             # Pruebas para los servicios
```

Ejecuta las pruebas con:

```bash
npm run test
```

### Mocks de Firebase

Se utiliza un mock para `firebase-admin` en `src/__mocks__/firebase-admin.ts` para simular la funcionalidad de Firebase en los tests.

## Validación de Entradas

Las validaciones de entradas se realizan utilizando `joi` y se encuentran en `src/validators/`. Cada validador se encarga de las validaciones específicas de los datos de entrada en las rutas correspondientes.

## Ejemplo de Uso

1. **Clona el repositorio**:
   ```bash
   git clone <repositorio>
   cd <directorio-del-proyecto>
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   Crea un archivo `.env` y define las variables necesarias, como `JWT_SECRET` para la autenticación con JWT.

4. **Ejecuta el servidor localmente**:
   ```bash
   npm run serve
   ```

5. **Despliegue en Firebase**:
   Asegúrate de haber configurado tu proyecto de Firebase y luego despliega con:
   ```bash
   npm run deploy
   ```

## Autenticación

El sistema de autenticación utiliza JWT. Las credenciales de usuario se validan y un token se genera en el login, permitiendo el acceso a las rutas protegidas.

## Middlewares

- **Authenticator**: Verifica el token JWT en rutas protegidas.
- **RateLimiter**: Limita el número de solicitudes que puede hacer un usuario.

## Estándares de Código

Este proyecto utiliza ESLint con la configuración de Google y Prettier para mantener la consistencia en el estilo del código.

---

Este README.md proporciona un resumen claro del proyecto, su estructura y las instrucciones para correrlo, así como detalles sobre pruebas, autenticación y configuración de dependencias.
