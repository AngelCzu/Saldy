
import { OnInit, Component, EventEmitter, Output } from '@angular/core';
import { YearMonth } from 'src/app/domain/value-objects/year-month.vo';
import { DateRange } from 'src/app/domain/value-objects/date-range.vo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.scss'],
  standalone:true,
    imports: [
    CommonModule,   // 👈 necesario para *ngFor
    FormsModule     // 👈 necesario para ngModel
  ]
})
export class DateRangeSelectorComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  
  @Output() rangeSelected = new EventEmitter<DateRange>();

  fromYear = 2026;
  fromMonth = 1;

  toYear = 2026;
  toMonth = 1;

  apply() {
    const from = YearMonth.create(this.fromYear, this.fromMonth);
    const to = YearMonth.create(this.toYear, this.toMonth);

    const range = new DateRange(from, to);

    this.rangeSelected.emit(range);
  }

}
