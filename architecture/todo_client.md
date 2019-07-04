# To-Do list for the client

*Mostly for me, but add things here if you want*

## Mechanics

## Features

## Implementation

- Add an early onUpdate function for local physics / prediction based calculations

## Optimization

- Component type lookup is O(n)

## Refactoring

- Component names are currently accessed both by `Type.name` (property of Function / name of the class) and `Component.name` (instance member). Fix ambiguity
- Clean up `main.ts`
- Possibly separate `Game` class into `class Engine` (handles internals) and `class SiBR extends Engine` (actual implementation)

## Minor things

- Make all debug `[SiBR]` labels the same color and keep varied text color
