import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';

@Component({
    selector: 'app-calendar-model',
    templateUrl: './calendar-model.component.html',
    styleUrls: ['./calendar-model.component.css'],
})
export class CalendarModelComponent {
    dateType: any;
    selectedFromDate: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<CalendarModelComponent>
    ) {
        this.dateType = data.dateType;
        this.selectedFromDate = data.selectedFromDate;
    }

    closeModel(e: any) {
        this.dialogRef.close(e);
    }
}
