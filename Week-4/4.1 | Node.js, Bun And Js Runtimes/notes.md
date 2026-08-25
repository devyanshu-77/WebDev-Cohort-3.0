# Node.js & npm: Core Concepts

## 1. What is Node.js?

**Node.js** is a **runtime environment**, (The environment where JavaScript code is executed). It allows JavaScript to run outside the browser, including on the server side.

* **JavaScript Engine:** Node.js uses the **V8 engine**, the same engine used by Google Chrome.
* V8 is responsible for parsing and executing JavaScript code.

---

## 2. What is npm?

**npm (Node Package Manager)** is a tool for managing packages and dependencies in Node.js projects.

### Project Initialization

```bash
npm init
```

Creates a `package.json` interactively by asking for project details.

```bash
npm init -y
```

Creates `package.json` with default values without asking questions.

### Package Management

npm allows you to **install, remove, update, and manage** packages used by your project.

---

## 3. Internal vs. External Packages

### Internal / Built-in Packages

These are **core Node.js modules** that come with Node.js and require no separate installation.

Examples:

* `fs` → File System
* `os` → Operating System utilities
* `path` → File and directory path utilities

### External Packages

These are packages created and maintained by other developers to solve specific problems. They must be installed using npm.

Examples:

* `chalk` → Styling terminal output
* `express` → Building web servers
* `bcrypt` → Password hashing

---

## 4. package.json

`package.json` is the **heart of a Node.js project**. It is normally created using `npm init`.

### Purpose

It contains:

* Project metadata such as name, version, author, and description
* The project's dependencies
* npm scripts such as `start`, `dev`, and `build`

### node_modules

When you install a package, npm downloads it and its dependencies into:

```text
node_modules/
```

This folder can become very large because packages may have many sub-dependencies.

**Do not commit `node_modules` to GitHub.** It is normally added to `.gitignore`.

Instead, share `package.json` (and `package-lock.json`) so others can recreate the dependencies with:

```bash
npm install
```

### Scripts

The `scripts` section lets you create shortcuts for common commands.

For example:

```json
"scripts": {
  "dev": "node app.js"
}
```

You can then run:

```bash
npm run dev
```

---

## 5. package-lock.json

`package-lock.json` is automatically generated when npm installs dependencies.

### Purpose

It records the **exact versions** of the project's dependencies and sub-dependencies.

This ensures that:

* Everyone installs the same dependency versions.
* Deployments use the same versions.
* Unexpected bugs caused by different dependency versions are reduced.

---

## 6. Semantic Versioning (SemVer)

**Semantic Versioning (SemVer)** is a standard way of versioning software packages.

### Format

```text
MAJOR.MINOR.PATCH
```

Example:

```text
2.3.1
```

### Version Numbers

* **MAJOR** → Incompatible/breaking API changes
* **MINOR** → New backward-compatible features
* **PATCH** → Backward-compatible bug fixes

So:

```text
2.3.1
│ │ │
│ │ └── PATCH
│ └──── MINOR
└────── MAJOR
```

### SemVer in npm

`package.json` can use symbols such as `^` and `~` to control acceptable versions.

```json
"express": "^4.18.2"
```

Allows compatible `4.x.x` updates, including minor and patch versions, but not `5.0.0`.

```json
"express": "~4.18.2"
```

Allows patch-level updates such as `4.18.x`, but not newer minor versions.

This gives projects a balance between receiving updates and avoiding unexpected breaking changes.

---

## Quick Summary

| Concept               | Meaning                                              |
| --------------------- | ---------------------------------------------------- |
| **Node.js**           | Runtime for executing JavaScript outside the browser |
| **V8**                | JavaScript engine used by Node.js                    |
| **npm**               | Package and dependency manager                       |
| **Built-in packages** | Modules included with Node.js                        |
| **External packages** | Third-party packages installed with npm              |
| **package.json**      | Project metadata, dependencies, and scripts          |
| **node_modules**      | Installed packages and their dependencies            |
| **package-lock.json** | Locks exact dependency versions                      |
| **SemVer**            | `MAJOR.MINOR.PATCH` versioning system                |
| **`^`**               | Allows compatible minor + patch updates              |
| **`~`**               | Allows patch updates                                 |
