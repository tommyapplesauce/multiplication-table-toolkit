# Multiplication Table Toolkit — Pattern Playground

A standalone children's web app for exploring multiplication tables through visible digit patterns instead of first-step memorization.

## What it teaches

The app follows the toolkit loop:

1. **Observe** the table trail.
2. **Compress** the table into a repeating ones-digit cycle.
3. **Predict** the next ones digit and whether a wrap happens.
4. **Expand** the cycle into the full multiplication table.
5. **Validate** the answer with grouping and repeated addition.

The key child-facing rule is:

> When the ones digit loops back down, the tens digit steps up.

## Run locally

```bash
npm start
```

Then open <http://127.0.0.1:4173>.

Because the app is plain HTML, CSS, and JavaScript, it can also be opened directly from `index.html` in a browser.

## Test

```bash
npm test
```

The tests verify table accuracy, ones-digit cycles, wrap detection, and challenge predictions.
