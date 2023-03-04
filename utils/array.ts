export const intersectionBy = (arr: any[], ...args: any[]) => {
  let iteratee = args.pop()
  if (typeof iteratee === 'string') {
    const prop = iteratee
    iteratee = (item: any) => item[prop]
  }

  return arr.filter(item1 =>
    args.every(arr2 => arr2.find((item2: any) => iteratee(item1) === iteratee(item2)))
  )
}