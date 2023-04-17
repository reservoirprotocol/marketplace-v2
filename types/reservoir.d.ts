type ArrayItemTypes<T extends any[]> = T extends (infer U)[] ? U : never

declare module JSX {
  interface IntrinsicElements {
    'model-viewer': any
  }
}