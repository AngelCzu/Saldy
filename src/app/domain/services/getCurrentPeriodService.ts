import { Injectable } from "@angular/core";
import { TimeProvider } from "./time-provider";
import { YearMonth } from "../value-objects/year-month.vo";

@Injectable({ providedIn: 'root' })
export class CurrentPeriodService {

  constructor(private readonly timeProvider: TimeProvider) {}

  getCurrent(): YearMonth {
    return this.timeProvider.currentYearMonth();
  }
}