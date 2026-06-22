// ─────────────────────────────────────────────────────────────────────────
// Wraps an async route function so that if it throws or rejects, the error
// is caught and handed to Express's error-handling middleware (in index.js)
// instead of crashing the entire server process.
//
// Without this, one bad request (e.g. a database column that doesn't
// exist) could take the whole site down for every visitor — not just
// show an error to the person who triggered it.
//
// Usage: router.post("/", asyncHandler(async (req, res) => { ... }));
// ─────────────────────────────────────────────────────────────────────────
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}