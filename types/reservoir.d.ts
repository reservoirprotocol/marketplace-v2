import {useCollectionActivity} from "@nftearth/reservoir-kit-ui";

type ArrayItemTypes<T extends any[]> = T extends (infer U)[] ? U : never

type ActivityTypes = Exclude<
  NonNullable<
    NonNullable<
      Exclude<Parameters<typeof useCollectionActivity>['0'], boolean>
      >['types']
    >,
  string
  >