import { FieldPolicy, Reference } from "@apollo/client";
type KeyArgs = FieldPolicy<any>["keyArgs"];

export function offsetLimitPagination<T = Reference>(
  keyArgs: KeyArgs = false,
): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      const merged = existing ? existing.slice(0) : [];

      if (incoming) {
        if (args) {
          // Assume an offset of 0 if args.offset omitted.
          const { skip = 0 } = args;
          for (let i = 0; i < incoming.length; ++i) {
            merged[skip + i] = incoming[i];
          }
        } else {
          // It's unusual (probably a mistake) for a paginated field not
          // to receive any arguments, so you might prefer to throw an
          // exception here, instead of recovering by appending incoming
          // onto the existing array.
          merged.push.apply(merged, incoming as T[]);
        }
      }

      return merged;
    },
  };
}