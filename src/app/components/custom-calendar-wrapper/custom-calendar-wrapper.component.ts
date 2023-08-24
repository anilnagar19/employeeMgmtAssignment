import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
    Renderer2,
    Output,
    EventEmitter,
    Input,
    OnInit,
} from '@angular/core';
import * as moment from 'moment';

import { EmployeeService } from '../../services/employee.service';

@Component({
    selector: 'app-custom-calendar-wrapper',
    templateUrl: './custom-calendar-wrapper.component.html',
    styleUrls: ['./custom-calendar-wrapper.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class CustomCalendarWrapperComponent implements OnInit {
    @Input() dateType: string;
    @Input() selectedFromDate: string;
    @Output() getFromToDate = new EventEmitter<string>();

    @ViewChild('currentMonthElement', { static: true })
    currentMonthElement: ElementRef;

    @ViewChild('goToPreviousMonthBtn', { static: true })
    goToPreviousMonthBtn: ElementRef;

    @ViewChild('calendarDaysElement', { static: true })
    calendarDaysElement: ElementRef;

    nextDay: any;
    dayOfWeek: any;
    currentMonth: any;
    calendarDays: any;
    selectedDate: any;
    nextDayOfWeek: any;

    date: any = new Date();
    today: any = new Date();
    isPreviousMonthButtonDisabled = false;

    constructor(
        private renderer: Renderer2,
        private employeeService: EmployeeService
    ) {}

    ngOnInit(): void {
        this.currentMonth = this.currentMonthElement.nativeElement;
        this.calendarDays = this.calendarDaysElement.nativeElement;

        this.currentMonth.textContent = this.date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });

        this.resetCalendarToCurrentMonth();
    }

    renderCalendar() {
        const totalMonthDay = new Date(
            this.date.getFullYear(),
            this.date.getMonth() + 1,
            0
        ).getDate();

        const startWeekDay = new Date(
            this.date.getFullYear(),
            this.date.getMonth(),
            0
        ).getDay();

        this.calendarDays.innerHTML = '';

        let totalCalendarDay = 5 * 7;

        for (let i = 0; i < totalCalendarDay; i++) {
            let day = i - startWeekDay;

            if (i <= startWeekDay) {
                // adding previous month days
                const div = this.renderer.createElement('div');
                this.renderer.addClass(div, 'month-day');
                this.renderer.addClass(div, 'prev-month');
                this.renderer.appendChild(this.calendarDays, div);
            } else if (i <= startWeekDay + totalMonthDay) {
                // adding this month days
                this.date.setDate(day);
                this.date.setHours(0, 0, 0, 0);

                let dayClass =
                    this.date.getTime() === this.today.getTime()
                        ? 'current-day'
                        : 'month-day';

                const div = this.renderer.createElement('div');
                div.textContent = day;
                this.renderer.addClass(div, dayClass);
                this.renderer.addClass(div, 'current-month');
                this.renderer.setAttribute(div, 'id', 'current-month-' + day);

                if (this.selectedFromDate && this.selectedFromDate.length) {
                    let selectedFromDateTimeStamp = new Date(
                        this.selectedFromDate
                    ).getTime();

                    if (
                        this.date.getTime() < selectedFromDateTimeStamp &&
                        this.dateType === 'toDate'
                    ) {
                        this.renderer.addClass(div, 'prev-date');
                    }
                }
                this.renderer.appendChild(this.calendarDays, div);
                const formattedDate = this.getFormattedDateFromMonth(
                    this.currentMonth.textContent
                );

                this.date = new Date(formattedDate);

                this.date.setMonth(this.date.getMonth());

                let month = this.date.toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                });

                this.renderer.listen(div, 'click', () => {
                    if (!div.classList.contains('prev-date')) {
                        this.handleItemClick(div, day, month);
                    }
                });
            } else {
                // adding next month days
                const div = this.renderer.createElement('div');
                this.renderer.addClass(div, 'month-day'); // Add base class
                this.renderer.addClass(div, 'next-month'); // Add base class
                this.renderer.appendChild(this.calendarDays, div);
            }
        }
    }

    getFormattedDateFromMonth(monthName: any) {
        const inputMonth = moment().month(monthName); // Set the month using the month name
        const formattedDate = inputMonth
            .startOf('month')
            .format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        return formattedDate;
    }

    handleItemClick(div: any, selectedDay: any, month: any) {
        const allDivs = this.calendarDays.querySelectorAll('div');

        allDivs.forEach((element: any) => {
            this.renderer.removeClass(element, 'selected');
        });

        this.renderer.addClass(div, 'selected');
        let selectedDate = selectedDay + ' ' + month;
        const date = new Date(selectedDate);
        this.showSelectedDate(date);
    }

    goToPreviousAndNextMonth(month: string) {
        this.date = new Date(
            this.getFormattedDateFromMonth(this.currentMonth.textContent)
        );
        this.date.setMonth(this.date.getMonth() + (month === 'prev' ? -1 : 1));

        this.currentMonth.textContent = this.date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });

        let currentMonthText = new Date(
            this.getFormattedDateFromMonth(this.currentMonth.textContent)
        ).getMonth();

        let fromDateMonthText = new Date(
            this.getFormattedDateFromMonth(
                this.employeeService.employee().fromDate
            )
        ).getMonth();

        this.renderCalendar();

        if (
            currentMonthText === fromDateMonthText &&
            this.dateType === 'toDate'
        ) {
            this.isPreviousMonthButtonDisabled = true;
        } else {
            this.isPreviousMonthButtonDisabled = false;
        }
    }

    selectNoDate() {
        this.selectedDate = 'No Date';
        const allDivs = this.calendarDays.querySelectorAll('.selected');
        allDivs.forEach((element: any) => {
            element.classList.remove('selected');
        });
    }

    highLightDate(futureDate: any) {
        const allDivs = this.calendarDays.querySelectorAll('.selected');
        allDivs.forEach((element: any) => {
            element.classList.remove('selected');
        });

        let dayId;
        if (this.today.getMonth() !== futureDate.getMonth()) {
            dayId = 'next-month-' + futureDate.getDate();
        } else {
            dayId = 'current-month-' + futureDate.getDate();
        }

        const targetDivs: any = document.querySelectorAll(`div#${dayId}`);

        if (targetDivs.length) {
            targetDivs[0].classList.add('selected');
        } else {
            let dayId = 'current-month-' + futureDate.getDate();

            const targetDivs: any = document.querySelectorAll(
                `div#${dayId}`
            )[0];
            targetDivs.classList.add('selected');
        }
    }

    saveDate() {
        let empData = this.employeeService.employee();
        empData[this.dateType] = this.selectedDate;
        this.employeeService.setEmployeeData(empData);
        this.closeModel();
    }

    closeModel() {
        this.getFromToDate.emit();
    }

    selectAfterWeekDay() {
        const futureDate = new Date(this.today);
        futureDate.setDate(this.today.getDate() + 8);

        console.log(futureDate.getMonth(), this.today.getMonth());

        if (futureDate.getMonth() !== this.today.getMonth()) {
            this.goToPreviousAndNextMonth('next');
        }

        this.highLightDate(futureDate);
        this.showSelectedDate(futureDate);
    }

    goToToday() {
        const today = new Date();
        if (
            today.getTime() <= new Date(this.selectedFromDate).getTime() &&
            this.dateType === 'toDate'
        ) {
            this.selectedDate = 'No Date';
        } else {
            this.showSelectedDate(today);
            this.highLightDate(today);
        }
    }

    getToNextMonday() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ...)

        // Calculate the difference in days between the current day and Monday (1)
        const daysUntilMonday = (8 - dayOfWeek) % 7;

        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilMonday);
        this.highLightDate(nextMonday);
        this.selectedDate = nextMonday.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
        this.showSelectedDate(nextMonday);
    }

    goToNextTuesday() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Get the current day of the week (0 = Sunday, 1 = Monday, ...)

        // Calculate the difference in days between the current day and Monday (1)
        const daysUntilMonday = (8 - dayOfWeek) % 7;

        const nextTuesday = new Date(today);
        nextTuesday.setDate(today.getDate() + daysUntilMonday + 1);
        this.highLightDate(nextTuesday);

        this.showSelectedDate(nextTuesday);
    }

    resetCalendarToCurrentMonth() {
        this.date = new Date();
        this.today = new Date();

        this.currentMonth.textContent = this.date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });

        this.today.setHours(0, 0, 0, 0);

        const daysOfWeek = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];

        this.dayOfWeek = daysOfWeek[this.today.getDay()];
        this.nextDay = daysOfWeek[this.today.getDay() + 1];
        this.renderCalendar();

        if (this.dateType === 'toDate') {
            this.selectNoDate();

            let currentMonthText = new Date(
                this.getFormattedDateFromMonth(this.currentMonth.textContent)
            ).getMonth();
            let fromDateMonthText = new Date(
                this.getFormattedDateFromMonth(
                    this.employeeService.employee().fromDate
                )
            ).getMonth();
            if (currentMonthText === fromDateMonthText) {
                this.isPreviousMonthButtonDisabled = true;
            }
        } else {
            this.goToToday();
        }
    }

    goToDateFromToday(goTo: any) {
        this.resetCalendarToCurrentMonth();

        if (goTo === 'nextMon') {
            this.getToNextMonday();
        } else if (goTo === 'nextTue') {
            this.goToNextTuesday();
        } else if (goTo === 'afterWeek') {
            this.selectAfterWeekDay();
        } else if (goTo === 'today') {
            this.goToToday();
        }
    }

    showSelectedDate(dateToShow?: any) {
        this.selectedDate =
            dateToShow &&
            dateToShow.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            });
    }
}
