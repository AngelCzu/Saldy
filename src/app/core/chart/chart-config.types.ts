export interface LineChartData {
  labels: string[];
  expenses: number[];
  income?: number[];
}

export interface DoughnutChartData {
  labels: string[];
  values: number[];
  colors: string[];
}
