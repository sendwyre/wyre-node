export interface IRates {
  [symbolPair: string]: number
}

export interface IRatesPriced {
  [symbolPair: string]: {
    [symbol: string]: number
  }
}