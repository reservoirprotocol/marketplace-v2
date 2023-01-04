type ArrayItemTypes<T extends any[]> = T extends (infer U)[] ? U : never
