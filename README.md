# reactosolid

Cross-framework starter (React+Mobx or Preact+Mobx or Solid.js). For now only SPA without SSR

### Running

```
pnpm run first-run
pnpm run build
```

### Changing mode

Edit `.env`: `FRAMEWORK_MODE=solid` or `FRAMEWORK_MODE=react` or `FRAMEWORK_MODE=preact`

On the next `pnpm run build` all files, types and build configs will be automatically changed to the chosen framework.

The exact adapters lay in `src/compSystem/transformers`