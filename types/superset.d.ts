import { TypedFetch } from 'openapi-typescript-fetch'

type InferFetchedType<Type> = Type extends TypedFetch<infer X> ? X : never
