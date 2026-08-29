# Express Middleware & CORS

## Middleware

### Definition
Functions that have access to `req`, `res`, and `next` objects in the request-response cycle.

### Capabilities
- **Modify** `req`/`res` objects
- **End** the request-response cycle (send response)
- **Must** call `next()` if not ending the cycle

### Common Built-in Middleware

#### `express.json()`
- Parses JSON request bodies
- For `POST`, `PUT`, `PATCH` methods
- Data available at `req.body`

#### `express.urlencoded({ extended: true/false })`
- Parses URL-encoded form data
- For HTML form submissions
- `extended: true` allows nested objects/arrays

---

## CORS (Cross-Origin Resource Sharing)

### Definition
Browser security feature that blocks cross-origin requests by default (same-origin policy).

### How It Works

1. **Preflight Request** (for complex requests)
   - Browser sends `OPTIONS` request before actual request
   - Checks if origin is allowed
   - Server responds with CORS headers

2. **Actual Request**
   - Sent only if preflight succeeds
   - Server must include appropriate CORS headers in response

### Key Headers
- `Access-Control-Allow-Origin`: Specifies allowed origins
- `Access-Control-Allow-Methods`: Specifies allowed HTTP methods
- `Access-Control-Allow-Headers`: Specifies allowed headers
- `Access-Control-Allow-Credentials`: Allows cookies/credentials

### Solution
Use `cors` middleware package to handle CORS headers automatically.

```javascript
const cors = require('cors');
app.use(cors()); // Enable all CORS requests
