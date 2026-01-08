# Implementación de Seguridad

## 🔐 Patrón de Autenticación de Nivel Producción

Este proyecto implementa patrones de seguridad usados en **aplicaciones financieras del mundo real** con fines educativos y de demostración.

---

## Resumen de la Implementación

### 1. Autenticación Basada en Tokens (Patrón JWT)

```typescript
// Tokens de acceso de corta duración (15 minutos)
interface AuthToken {
    accessToken: string;
    expiresAt: number;
    userId: string;
}
```

**¿Por qué?** Reduce la ventana de ataque si el token se ve comprometido.

### 2. Estrategia de Almacenamiento Seguro

```typescript
✅ sessionStorage: Tokens de acceso (eliminados al cerrar el navegador)
✅ httpOnly Cookies: Tokens de actualización (en producción con backend)
❌ localStorage: NO se usa para datos sensibles
❌ Client-side: NO se almacenan datos financieros sensibles
```

### 3. Gestión del Ciclo de Vida del Token

```typescript
// Actualización automática del token antes de expirar
useEffect(() => {
    const interval = setInterval(() => {
        if (tokenExpiresIn < 5min) {
            refreshToken(); // Actualización proactiva
        }
    }, 60000);
}, []);
```

### 4. Capas de Defensa en Profundidad

| Capa | Implementación | Propósito |
|-------|----------------|---------|
| **Transporte** | Solo HTTPS (producción) | Cifrar datos en tránsito |
| **Autenticación** | JWT con expiración | Auth sin estado |
| **Autorización** | Basado en roles (user/admin) | Control de acceso |
| **Actualización de Token** | Rotación automática | Minimizar exposición |
| **Validación de Sesión** | En cada solicitud | Verificar validez del token |
| **Logout Automático** | Al expirar el token | Forzar re-autenticación |

---

## 🛡️ Características de Seguridad Implementadas

### ✅ Lo que Incluye esta Demo:

1. **Tokens de Corta Duración (15 min)**
   - Reduce la ventana de ataque
   - Fuerza re-autenticación periódica
   
2. **Validación de Tokens**
   - Verificaciones de expiración en cada solicitud
   - Limpieza automática de tokens expirados

3. **Actualización Automática de Tokens**
   - Actualización proactiva 5 minutos antes de expirar
   - Experiencia de usuario fluida

4. **Almacenamiento Seguro**
   - sessionStorage solo para tokens
   - NO hay datos sensibles en almacenamiento del cliente

5. **Logout Automático al Expirar**
   - Usuario desconectado cuando expira el token
   - Previene ataques de sesión obsoleta

6. **Rastro de Auditoría Claro**
   - Código comentado explicando decisiones de seguridad
   - Distinciones entre producción y demo

### 🚀 Lo que Producción Agregaría:

1. **Generación de Tokens en Backend**
   ```javascript
   // Backend (ejemplo Node.js/Express)
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId, role }, SECRET_KEY, { 
       expiresIn: '15m',
       algorithm: 'HS256' 
   });
   ```

2. **Tokens de Actualización en Cookies httpOnly**
   ```javascript
   res.cookie('refreshToken', token, {
       httpOnly: true,  // No accesible vía JavaScript
       secure: true,    // Solo HTTPS
       sameSite: 'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
   });
   ```

3. **Rotación de Tokens**
   - Nuevos tokens emitidos en cada actualización
   - Tokens antiguos invalidados

4. **Limitación de Tasa**
   ```javascript
   // Backend (express-rate-limit)
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutos
       max: 5, // 5 intentos
       message: 'Demasiados intentos de inicio de sesión'
   });
   app.use('/api/auth/login', limiter);
   ```

5. **Política de Seguridad de Contenido (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'">
   ```

6. **Autenticación de Dos Factores (2FA)**
   - TOTP (Time-based One-Time Password)
   - Verificación por SMS o email

7. **Lista Negra de Tokens**
   - Almacén Redis para tokens revocados
   - Verificado en cada solicitud

8. **Registro de Auditoría**
   ```javascript
   auditLog.record({
       event: 'LOGIN_SUCCESS',
       userId,
       ip: req.ip,
       timestamp: Date.now()
   });
   ```

---

## 🔍 Estructura del Código

```
src/
├── lib/
│   └── auth-tokens.ts          # Utilidades de gestión de tokens
├── features/
│   └── auth/
│       ├── services/
│       │   └── auth.service.ts # Llamadas API de autenticación
│       └── hooks/
│           └── useAuth.ts      # Estado de auth + auto-refresh
```

### Archivos Clave:

- **`auth-tokens.ts`**: Creación, validación y ciclo de vida del token
- **`auth.service.ts`**: Comunicación con backend (simulada)
- **`useAuth.ts`**: Hook de React con lógica de auto-refresh

---

## 🧪 Consideraciones de Testing

Esta implementación es **amigable para tests**:

```typescript
// Mock de sessionStorage en tests
beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
        value: {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn()
        }
    });
});
```

---

## 📚 Mejores Prácticas Demostradas

1. ✅ **Principio de Mínimo Privilegio**: Almacenar datos mínimos del lado del cliente
2. ✅ **Defensa en Profundidad**: Múltiples capas de seguridad
3. ✅ **Fallar de Forma Segura**: Logout automático ante problemas con tokens
4. ✅ **Documentación Clara**: Cada decisión de seguridad está comentada
5. ✅ **Testeabilidad**: Toda la lógica de seguridad es testeable unitariamente
6. ✅ **Transparencia**: Clara distinción entre demo y producción

---

## 🎯 Por Qué Esto Importa para Apps Financieras

Las aplicaciones financieras requieren:

- **Cumplimiento PCI DSS**: No almacenar datos sensibles de tarjetas del lado del cliente
- **GDPR/Privacidad**: Retención mínima de datos
- **Rastros de Auditoría**: Registro completo de eventos de autenticación
- **Gestión de Sesiones**: Timeout automático por inactividad
- **Confianza Cero**: Verificar cada solicitud

Esta implementación demuestra comprensión de estos requisitos.

---

## 📖 Referencias

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Mejores Prácticas JWT](https://tools.ietf.org/html/rfc8725)
- [Mejores Prácticas de Seguridad OAuth 2.0](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [Guías de Identidad Digital NIST](https://pages.nist.gov/800-63-3/)

---

## 🤝 ¿Preguntas?

Esta implementación de seguridad fue diseñada para demostrar patrones listos para producción manteniendo claridad y valor educativo.

**Nota**: Esta es una aplicación demo. En producción, todas las operaciones criptográficas y generación de tokens serían manejadas del lado del servidor.
