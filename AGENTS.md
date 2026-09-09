<!-- agents-md ceiling: 52 lines -->
# AGENTS.md — mgr-swagger-express

A published npm library: decorator-style Swagger annotations for an Express project.
[`README.md`](README.md) is the user-facing API documentation — prop shapes, the decorators,
the worked example. It is the contract; a behaviour change owes it an edit.

## Commands, all run 2026-09-09

```sh
npm install          # rc=0
npm run lint         # tslint over src/**/*.ts — rc=0
npm run build        # tsc -> dist/ — rc=0
```

**That is the whole gate: there is no test suite and no CI.** `.github/` does not exist,
`npm test` is not defined, and `git push` runs nothing. A change is verified by building
it, reading it, and exercising it against a real Express app — say which in the PR.

`prepare` runs `npm run build` and `prebuild` runs `npm run lint && rm -rf dist`, so
`npm install` in a consumer's tree builds this package and a lint error blocks publication.
That chain is the closest thing here to enforcement; do not break it for convenience.

## Layout

| path | what it is |
|---|---|
| `src/**/*.ts` | the library — the only thing `tslint` and `tsc` look at |
| `dist/` | build output, gitignored, produced by `prebuild`+`build` |
| `example/` | a runnable Express app using the published API |
| `docs/` | the generated documentation |
| `tslint.json`, `tsconfig.json` | the linter and compiler config |

## Conventions that differ from the defaults

- **It is `tslint`, not ESLint.** TSLint is deprecated upstream; this repo has not migrated,
  and the lint step is load-bearing because it gates `prebuild`. Migrating is a real change
  with a real reason, not a tidy-up.
- **`SET_EXPRESS_APP(app)` must be called before any resource module is imported**, because
  the decorators register against the app at import time. That ordering constraint is the
  library's single sharpest edge — it is stated in the README, it has no compile-time guard,
  and a consumer who gets it wrong sees an empty spec rather than an error.
- **The public surface is what `index.ts` exports and what the README documents.** Anything
  else is internal, whatever its visibility.
- **This package is published to npm.** A rename, a signature change or a dropped export is
  a breaking release, not a refactor.

**Nothing about who may merge, how agents are spawned, or how the maintainer's
machine handles secrets belongs in this file, and none of it is stated here.**
Those are properties of a working environment, not of this project; if you are
contributing, your own conventions apply and nothing in this repo depends on
the maintainer's.
