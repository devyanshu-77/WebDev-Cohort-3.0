# Authentication & JWT Notes

## Table of Contents
1. [Authentication Basics](#authentication-basics)
2. [Authentication Workflow](#authentication-workflow)
3. [Stateful Tokens](#stateful-tokens)
4. [JWT (JSON Web Token)](#jwt-json-web-token)
5. [JWT Security](#jwt-security)
6. [JWT Verification Process](#jwt-verification-process)

---

## Authentication Basics

**Definition:** Authentication is the process of verifying the identity of a user—confirming they are who they claim to be.

**Purpose:** Authentication ensures that only legitimate users can access a system or application.

---

## Authentication Workflow

### Basic Flow

1. **User Action:** A user visits a website and attempts to sign in or sign up
2. **Credentials Submission:** The user provides their credentials (username/password, etc.)
3. **Token Generation:** The server verifies the credentials and generates a token
4. **Token Usage:** The token is returned to the client and used to verify the user's identity on subsequent requests

### Token Definition

A **token** is a unique identifier provided to an authenticated user. It acts as a credential that proves the user has been authenticated and can be used to access protected resources without re-entering credentials.

---

## Stateful Tokens

### What Are Stateful Tokens?

Stateful tokens are tokens whose validity and information are stored on the server side. The server must maintain a record of each issued token.

### How Stateful Tokens Work

1. When a token is issued, it is stored in the database
2. On each request, the server queries the database to validate the token
3. The token remains valid until the user logs out or deletes their account
4. Upon logout, the token is deleted from the database

### Performance Trade-off

**Downside:** Each authentication check requires a database lookup, adding an extra round trip from the server to the database. This can impact performance, especially with high traffic.

**Example Flow:**
```
Client Request + Token → Server → Database Query → Token Verification → Response
```

---

## JWT (JSON Web Token)

### Overview

JSON Web Token (JWT) is a stateless token format that is **self-contained**. Unlike stateful tokens, a JWT contains all the information needed for the server to verify its authenticity without additional database lookups.

### JWT Structure

A JWT consists of three parts separated by dots:

```
xxxxxx.yyyyyy.zzzzzz
header.payload.signature
```

### Part 1: Header

The header is a JSON object encoded in Base64URL that contains metadata about the token:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Key Information:**
- **alg:** Specifies the algorithm used to sign the token (e.g., HS256, RS256)
- **typ:** Specifies the token type (always "JWT" for JSON Web Tokens)

### Part 2: Payload

The payload is a JSON object encoded in Base64URL that contains the actual data (claims) stored in the token.

```json
{
  "userId": "2l34jlwj2423j4ljsd",
  "username": "john242",
  "role": "user"
}
```

**Important Note:** The payload is **encoded, not encrypted**. Anyone can decode it and read the data. Therefore, **never store sensitive information** (passwords, credit card numbers, etc.) in a JWT payload.

### Part 3: Signature

The signature is the most critical part of a JWT. It is created by signing the encoded header and payload with a secret key known only to the server:

```
SIGNATURE = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

---

## JWT Security

### Why JWT Is Secure (Despite Readable Payload)

Although the header and payload are encoded and readable, the JWT is tamper-proof because of the signature.

### How the Signature Provides Security

1. **Creation:** When a JWT is issued, a unique signature is generated using:
   - The encoded header
   - The encoded payload
   - A secret key stored only on the server

2. **Tamper Detection:** If an attacker modifies any part of the token:
   - The header and payload will change
   - A new signature would need to be generated
   - Without access to the secret key, the attacker cannot generate a valid signature
   - The server will reject the modified token

### Example: Attempted Token Tampering

**Original Token Payload:**
```json
{
  "username": "john242",
  "role": "user"
}
```

**Attacker's Attempt (modifying role to admin):**
```json
{
  "username": "john242",
  "role": "admin"
}
```

**What Happens:**
- The original token was signed with: `HMACSHA256(header.payload, secret_key) = Signature_A`
- If the attacker changes the payload, the new signature would be: `HMACSHA256(header.modified_payload, secret_key) = Signature_B`
- But the token still contains `Signature_A`
- Server verifies: `Signature_A ≠ Signature_B` → **Verification fails** → Token is rejected

### Why the Server Doesn't Need Original Data

The JWT is **self-contained and verifiable** because:
- The signature is mathematically tied to the header and payload
- To verify, the server only needs the token itself and the secret key
- The server doesn't need to retrieve the original data used to create the token
- This eliminates the need for database lookups on every request

---

## JWT Verification Process

### How JWT Verification Works

1. **Token Reception:** Server receives a JWT from the client
2. **Decoding:** The server decodes the header and payload
3. **Signature Recreation:** The server recreates the signature by signing the decoded header and payload with its secret key
4. **Comparison:** The server compares the recreated signature with the signature in the token
5. **Validation Result:**
   - **Match:** Token is valid and authentic
   - **No Match:** Token has been tampered with or is invalid → Reject the token

### Verification Pseudocode

```
JWT = "header.payload.signature"

// Step 1: Split the token
parts = JWT.split(".")
header = parts[0]
payload = parts[1]
receivedSignature = parts[2]

// Step 2: Recreate the signature
recreatedSignature = HMACSHA256(header + "." + payload, secret_key)

// Step 3: Compare
if (recreatedSignature === receivedSignature) {
  // Token is valid
  return true
} else {
  // Token has been tampered with
  return false
}
```

### Key Points

- The server does **not** need to store or look up the token in a database
- The verification process is **fast** because it only involves cryptographic operations
- The token's authenticity is verified using **mathematics**, not database queries
- This makes JWT **stateless** and **scalable** for distributed systems

---

## Summary

| Aspect | Stateful Tokens | JWT |
|--------|---|---|
| **Storage** | Stored in database | Self-contained, no server storage needed |
| **Verification** | Database lookup required | Cryptographic signature verification |
| **Performance** | Slower (DB round trip) | Faster (no DB lookup) |
| **Scalability** | Limited by database performance | Highly scalable |
| **Data Exposure** | Server-side only | Payload is readable (not encrypted) |
| **Tamper-proof** | If modified, DB won't have entry | Signature verification prevents tampering |

---

## Key Takeaways

✓ Authentication verifies user identity through tokens
✓ Stateful tokens require database storage and lookups
✓ JWT is self-contained and doesn't require server-side storage
✓ JWT payload is readable but signature is tamper-proof
✓ JWT signature is created with header + payload + secret key
✓ Modifying any part of JWT will invalidate the signature
✓ Server verifies JWT by recreating the signature using the secret key
