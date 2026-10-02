# Instrucciones para GitHub Copilot

## Stack y alcance

- Este repositorio contiene dos aplicaciones independientes: `backend/` y `frontend/`, cada una con su propio `package.json` y `package-lock.json`. Ejecuta los comandos desde la carpeta correspondiente.
- Backend: Node.js 22.13 o superior con módulos ES, Express 5, TypeScript 5, `tsx`/`nodemon`, TypeORM y MySQL (`mysql2`). La autenticación usa `bcrypt` para contraseñas y `jsonwebtoken` para emitir y verificar tokens. La configuración de entorno carga `dotenv`.
- Frontend: JavaScript ES modules con React 19, React DOM, Vite 8, React Router 7, Axios y Yup. Los componentes usan JSX. El React Compiler está habilitado en Vite.
- No agregues una tecnología, dependencia, framework de estado, biblioteca de formularios, test runner o formatter sin comprobar primero que sea necesario y acordarlo con los patrones existentes.

## Organización

- Backend: `backend/src/index.ts` configura Express, middleware, rutas y conexión de base de datos. Mantén el código de cada dominio en `backend/src/modules/<dominio>/`.
- Para el dominio de usuarios, conserva la separación existente: `*.routes.ts` registra endpoints y validadores; `*.controller.ts` traduce HTTP a llamadas de servicio; `*.service.ts` contiene reglas de negocio; `*.repository.ts` consulta y persiste mediante TypeORM; `*.entity.ts` define entidades.
- Los middlewares compartidos van en `backend/src/middlewares/`; la configuración de TypeORM en `backend/src/database/data-source.ts`.
- Frontend: `frontend/src/main.jsx` inicia React; `App.jsx` delega el enrutamiento a `routes/AppRoutes.jsx`; las pantallas están en `pages/`; componentes reutilizables en `components/`; integraciones HTTP en `api/`; funciones y validación por dominio en `modules/<dominio>/`.
- Mantén la lógica de llamadas de autenticación en `modules/auth/hooks/useAuth.js`, los esquemas Yup en `modules/auth/schemes/` y el cliente compartido en `api/api.js`. No dupliques configuración HTTP en pantallas.
- `backend/src/index.js` y `backend/src/apiLibros.js` son ejemplos JavaScript heredados, separados del arranque actual TypeScript. No los uses como punto de entrada de la aplicación actual ni mezcles esos ejemplos en la funcionalidad de usuarios sin una solicitud explícita.

## Convenciones de código

- Sigue el estilo del archivo y del módulo que estés modificando; el repositorio no tiene formatter configurado y presenta estilos mixtos de comillas, punto y coma e indentación. No hagas reformateos amplios no relacionados.
- En backend, usa TypeScript estricto (`strict: true`), tipos explícitos de Express cuando correspondan e imports ESM con extensión `.js`, siguiendo el patrón de los archivos TypeScript existentes.
- Nombra clases y componentes React en PascalCase. Usa nombres de archivos de dominio y funciones exportadas en minúscula/camelCase, como `user.service.ts`, `findByEmail` y `useAuth`.
- Conserva los nombres de campos y mensajes en español donde ya formen parte del contrato, por ejemplo `nombre`, `creadoEn` y `{ message }`. No cambies nombres JSON o rutas existentes incidentalmente.
- En React, usa componentes funcionales y hooks. Mantén cada componente enfocado en su vista o responsabilidad; extrae lógica reutilizable a hooks/módulos siguiendo el patrón de autenticación.
- Usa estado local con `useState` cuando el estado pertenezca a una pantalla o hook. No introduzcas un store global: no existe uno en el proyecto.
- Respeta las reglas ESLint de React Hooks y React Refresh del frontend. El React Compiler está activado; no añadas memoización manual (`useMemo`/`useCallback`) salvo que la implementación existente o una necesidad medida la justifique.

## Validación, APIs y errores

- Valida los datos de entrada en el servidor; no confíes únicamente en la validación del navegador. El middleware actual `validateBodyMiddleware` comprueba campos obligatorios y las pantallas usan esquemas Yup. Reutiliza Yup donde corresponda en frontend; no crees validadores paralelos sin necesidad.
- Si amplías la validación backend, conserva el middleware de Express y el contrato JSON actual. Zod también figura como dependencia backend, pero no hay un patrón de uso establecido: no lo introduzcas ni mezcles bibliotecas de validación sin una razón clara.
- Mantén las rutas bajo `/api/users` y registra rutas específicas en `user.routes.ts`; agrega reglas de negocio en el servicio, acceso a datos en el repositorio y respuestas HTTP en el controlador.
- Accede a MySQL mediante el `AppDataSource` y repositorios de TypeORM. Define el modelo persistente en entidades; evita consultas o persistencia duplicadas en controladores y rutas.
- En frontend, usa la instancia Axios exportada por `api/api.js`. Su base URL se configura con `VITE_API_URL` y, en ausencia de esa variable, usa `http://localhost:8080/api/users`.
- Conserva el patrón de errores del frontend: mostrar errores de campo provenientes de Yup y errores generales del hook/API. En backend, responde con JSON `{ message }` y códigos HTTP apropiados; usa `AppError` y `errorHandlerMiddleware` para errores compartidos cuando resulte compatible con el flujo actual.
- No expongas trazas, contraseñas, hashes, tokens, credenciales ni configuración sensible en respuestas, logs o código del navegador. Al registrar usuarios, persiste únicamente el hash generado con `bcrypt`, nunca la contraseña en claro.
- El backend carga variables con `dotenv/config`. El ejemplo `backend/.env.example` documenta `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET` y `JWT_EXPIRES_IN`; usa variables de entorno y no incrustes secretos ni copies los valores de ejemplo a código o commits. En Vite, solo las variables prefijadas con `VITE_` están destinadas al cliente; nunca pongas secretos allí.
- El login emite un JWT y `authMiddleware` verifica los tokens Bearer en rutas protegidas; el cliente Axios envía el token almacenado. Conserva ese contrato y no expongas el secreto JWT al frontend.

## Pruebas y calidad

- No hay una suite de pruebas configurada. El script `test` del backend es un placeholder que termina con error; no lo presentes como prueba funcional ni inventes resultados. Si agregas tests, primero integra una herramienta de pruebas de forma explícita y documenta su uso.
- El único lint configurado es el del frontend: ejecuta `npm run lint` desde `frontend/`. La configuración ESLint cubre archivos `.js` y `.jsx` y excluye `dist`.
- No hay scripts de lint, formato o pruebas funcionales en el backend. Usa el script de desarrollo o inicio para comprobar cambios cuando sea posible; no afirmes que pasó un typecheck independiente si no se ejecutó.
- Backend: `npm run dev` inicia `src/index.ts` con nodemon/tsx; `npm start` inicia el mismo archivo una vez. `npm test` actualmente falla intencionalmente como placeholder.
- Frontend: `npm run dev` inicia Vite; `npm run build` genera la compilación de producción; `npm run preview` sirve la compilación; `npm run lint` ejecuta ESLint.
- No hay script raíz que coordine ambas aplicaciones. Instala dependencias con `npm install` dentro de `backend/` o `frontend/` según corresponda.

## Cambios seguros y consistentes

- Antes de cambiar una interfaz, ruta, campo de entidad o respuesta API, localiza y actualiza de forma coordinada sus consumidores frontend/backend para no romper el contrato.
- Haz cambios pequeños y localizados. No reescribas los ejemplos heredados, no migres JavaScript a TypeScript ni reorganices carpetas fuera del alcance solicitado.
- No registres datos sensibles ni expongas la configuración de base de datos al modificar la configuración.
- Mantén las contraseñas protegidas con `bcrypt`; nunca devuelvas `passwordHash` en respuestas públicas. Revisa qué entidad se serializa desde los controladores y filtra campos internos cuando sea necesario.
- No cambies `synchronize` de TypeORM ni añadas migraciones/configuración de despliegue suponiendo un entorno que no está documentado; señala el impacto y sigue el mecanismo existente o solicita contexto.
- No agregues endpoints, autenticación, autorización, persistencia o comportamiento que solo aparezcan como comentarios o intención futura. Comprueba primero el flujo implementado y preserva los contratos existentes.