# Security Implementation

## 🔐 Production-Grade Authentication Pattern

This project implements security patterns used in **real-world financial applications** for educational and demonstration purposes.

---

## Implementation Overview

### 1. Token-Based Authentication (JWT Pattern)

```typescript
// Short-lived access tokens (15 minutes)
interface AuthToken {
    accessToken: string;
    expiresAt: number;
    userId: string;
}
```

**Why?** Reduces attack window if token is compromised.

### 2. Secure Storage Strategy

```typescript
✅ sessionStorage: Access tokens (cleared on browser close)
✅ httpOnly Cookies: Refresh tokens (in production with backend)
❌ localStorage: NOT used for sensitive data
❌ Client-side: NO sensitive financial data stored
```

### 3. Token Lifecycle Management

```typescript
// Automatic token refresh before expiration
useEffect(() => {
    const interval = setInterval(() => {
        if (tokenExpiresIn < 5min) {
            refreshToken(); // Proactive refresh
        }
    }, 60000);
}, []);
```

### 4. Defense in Depth Layers

| Layer | Implementation | Purpose |
|-------|----------------|---------|
| **Transport** | HTTPS only (production) | Encrypt data in transit |
| **Authentication** | JWT with expiration | Stateless auth |
| **Authorization** | Role-based (user/admin) | Access control |
| **Token Refresh** | Automatic rotation | Minimize exposure |
| **Session Validation** | On every request | Verify token validity |
| **Auto Logout** | On token expiration | Force re-authentication |

---

## 🛡️ Security Features Implemented

### ✅ What This Demo Includes:

1. **Short-Lived Tokens (15 min)**
   - Reduces attack window
   - Forces periodic re-authentication
   
2. **Token Validation**
   - Expiration checks on every request
   - Automatic cleanup of expired tokens

3. **Automatic Token Refresh**
   - Proactive refresh 5 minutes before expiration
   - Seamless user experience

4. **Secure Storage**
   - sessionStorage for tokens only
   - NO sensitive data in client storage

5. **Auto-Logout on Expiration**
   - User is logged out when token expires
   - Prevents stale session attacks

6. **Clear Audit Trail**
   - Commented code explaining security decisions
   - Production vs demo distinctions

### 🚀 What Production Would Add:

1. **Backend Token Generation**
   ```javascript
   // Backend (Node.js/Express example)
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId, role }, SECRET_KEY, { 
       expiresIn: '15m',
       algorithm: 'HS256' 
   });
   ```

2. **Refresh Tokens in httpOnly Cookies**
   ```javascript
   res.cookie('refreshToken', token, {
       httpOnly: true,  // Not accessible via JavaScript
       secure: true,    // HTTPS only
       sameSite: 'strict',
       maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
   });
   ```

3. **Token Rotation**
   - New tokens issued on each refresh
   - Old tokens invalidated

4. **Rate Limiting**
   ```javascript
   // Backend (express-rate-limit)
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 5, // 5 attempts
       message: 'Too many login attempts'
   });
   app.use('/api/auth/login', limiter);
   ```

5. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self'">
   ```

6. **Two-Factor Authentication (2FA)**
   - TOTP (Time-based One-Time Password)
   - SMS or email verification

7. **Token Blacklisting**
   - Redis store for revoked tokens
   - Checked on every request

8. **Audit Logging**
   ```javascript
   auditLog.record({
       event: 'LOGIN_SUCCESS',
       userId,
       ip: req.ip,
       timestamp: Date.now()
   });
   ```

---

## 🔍 Code Structure

```
src/
├── lib/
│   └── auth-tokens.ts          # Token management utilities
├── features/
│   └── auth/
│       ├── services/
│       │   └── auth.service.ts # Authentication API calls
│       └── hooks/
│           └── useAuth.ts      # Auth state + auto-refresh
```

### Key Files:

- **`auth-tokens.ts`**: Token creation, validation, and lifecycle
- **`auth.service.ts`**: Backend communication (simulated)
- **`useAuth.ts`**: React hook with auto-refresh logic

---

## 🧪 Testing Considerations

This implementation is **test-friendly**:

```typescript
// Mock sessionStorage in tests
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

## 📚 Best Practices Demonstrated

1. ✅ **Principle of Least Privilege**: Store minimal data client-side
2. ✅ **Defense in Depth**: Multiple security layers
3. ✅ **Fail Secure**: Auto-logout on token issues
4. ✅ **Clear Documentation**: Every security decision is commented
5. ✅ **Testability**: All security logic is unit-testable
6. ✅ **Transparency**: Clear distinction between demo and production

---

## 🎯 Why This Matters for Financial Apps

Financial applications require:

- **PCI DSS Compliance**: No sensitive card data stored client-side
- **GDPR/Privacy**: Minimal data retention
- **Audit Trails**: Complete logging of auth events
- **Session Management**: Automatic timeout on inactivity
- **Zero Trust**: Verify every request

This implementation demonstrates understanding of these requirements.

---

## 📖 References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)

---

## 🤝 Questions?

This security implementation was designed to demonstrate production-ready patterns while maintaining clarity and educational value.

**Note**: This is a demo application. In production, all cryptographic operations and token generation would be handled server-side.
