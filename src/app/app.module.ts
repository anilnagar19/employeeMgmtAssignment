import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { CustomCalendarWrapperComponent } from './components/custom-calendar-wrapper/custom-calendar-wrapper.component';
import { CalendarModelComponent } from './components/calendar-model/calendar-model.component';
@NgModule({
    declarations: [
        AppComponent,
        AddEmployeeComponent,
        EmployeeListComponent,
        CustomCalendarWrapperComponent,
        CalendarModelComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
        MatListModule,
        MatTableModule,
        FormsModule,
        MatDialogModule,
        MatToolbarModule,
        MatIconModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatTabsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
