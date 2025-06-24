import { Component } from "@angular/core";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "./http.service";
import {Solution} from "./Solution";

@Component({
    selector: "purchase-app",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    providers: [HttpService],
    styleUrls: ["app.component.css"],
    template: `
        <h1 class="title"> Транспортная задача </h1>
        <div class="container">
            <div class="left-panel">
                <div class="left-content">
                    <div class="controls">
                        <div class="control-row">
                            <label>Поставщики</label>
                            <input type="number" class="matrix-input" step="1" min="2" max="10" name="rows" (input)="onIntegerInputRow($event)" [(ngModel)]="rows" (ngModelChange)="onRowChange()">
                        </div>
                        <div class="control-row">
                            <label>Потребители</label>
                            <input type="number" class="matrix-input" step="1" min="2" max="10" name="columns" (input)="onIntegerInputCol($event)" [(ngModel)]="columns" (ngModelChange)="onColumnChange()">
                        </div>
                    </div>
                    <form [formGroup]="formGroup" novalidate (ngSubmit)="submit()">
                        <div class="matrix">
                            <div class="input-val">
                                <label>Матрица стоимости</label>
                                @for (row of matrixControls; track row; let i = $index) {
                                    <div class="matrix-row">
                                        @for (column of row.controls; track $index) {
                                            <input type="number" (input)="onIntegerInput($event)" [formControl]="column" placeholder="C{{i+1}},{{$index+1}} " class="cell"/>
                                        }
                                    </div>
                                }
                            </div>
                            <div class="input-val">
                                <label>Возможности</label>
                                <div class="flex-center">
                                    @for (row of suppliesControls; track $index) {
                                        <input type="number" (input)="onIntegerInput($event)" [formControl]="row" placeholder="A{{$index+1}}" class="cell"/>
                                    }
                                </div>
                            </div>
                            <div class="input-val">
                                <label>Нужды</label>
                                <div class="flex-center">
                                    @for (row of needsControls; track $index) {
                                        <input type="number" (input)="onIntegerInput($event)" [formControl]="row" placeholder="B{{$index+1}}" class="cell"/>
                                    }
                                </div>
                            </div>
                            <div class="submit-wrapper">
                                <button class="submit-btn">Решить</button>
                                @if(showNotification){
                                    <div class="notification"> {{notificationMessage}} </div>
                                }
                            </div>
                        </div>
                    </form>
                    @if (response) {
                        <div class="solution">
                            <p>Минимальные затраты на перевозки: {{ response.cost }} у.е.</p>
                            <table class="result-table">
                                @for (row of response.solution; track $index) {
                                    <tr>
                                        @for (col of row; track $index) {
                                            <td>{{ col }}</td>
                                        }
                                    </tr>
                                }
                            </table>
                        </div>
                    }
                </div>
            </div>
            <div class="right-panel">
                <div class="history-wrapper">
                    <h3>История задач</h3>
                    <table class="history-table">
                        <thead>
                            <tr class="no-point">
                                <th>Матрица стоимости</th>
                                <th>Возможности</th>
                                <th>Нужды</th>
                            </tr>
                        </thead>
                        <tbody>
                            @for (row of history; track $index){
                                <tr (click)="historyClick(row)" class="history-row">
                                    
                                    <td>
                                        @if(row.matrix.length > 3 || row.matrix[0].length > 3){
                                        {{row.matrix[0]}},...
                                    } @else {
                                        {{row.matrix}}
                                    }</td>
                                    <td>{{row.supplies}}</td>
                                    <td>{{row.needs}}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
})
export class AppComponent {
    rows = 2;
    columns = 2;
    formGroup: FormGroup;
    response: Solution;
    history: any[];
    showNotification: boolean = false;
    notificationMessage: string = '';

    constructor(private httpService: HttpService) {}

    ngOnInit() {
        this.formGroup = new FormGroup({
            matrix: new FormArray([]),
            supplies: new FormArray([]),
            needs: new FormArray([])
        })

        let matrix = this.formGroup.get("matrix") as FormArray;
        let supplies = this.formGroup.get("supplies") as FormArray;
        let needs = this.formGroup.get("needs") as FormArray

        for(let i = 0; i<this.rows; i++){supplies.push(new FormControl("", [Validators.required, Validators.min(1)]))}

        for (let i = 0; i < this.rows; i++) {
            needs.push(new FormControl("", [Validators.required, Validators.min(1)]));
            matrix.push(new FormArray([]))
            for (let j = 0; j < this.columns; j++) {
                (matrix.at(i) as FormArray).push(new FormControl("", [Validators.required, Validators.min(1)]))
            }
        }

        this.httpService.getAllMatrix().subscribe({
            next:(data: Solution[]) => {this.history = data; console.log(this.history)},
            error: error => console.log(error)
        });
    }

    get matrixControls(): FormArray[] {
        return (this.formGroup.get("matrix") as FormArray).controls as FormArray[];
    }

    get suppliesControls(): FormArray[] {
        return (this.formGroup.get("supplies") as FormArray).controls as FormArray[];
    }

    get needsControls(): FormArray[] {
        return (this.formGroup.get("needs") as FormArray).controls as FormArray[];
    }

    onRowChange(){
        if(this.rows>10 || this.rows<2) return;
        let supplies = this.formGroup.get("supplies") as FormArray
        let matrix = this.formGroup.get("matrix") as FormArray;
        if(matrix.length<this.rows){
            for (let i = matrix.length; i < this.rows; i++) {
                matrix.push(new FormArray([]))
                supplies.push(new FormControl("", [Validators.required, Validators.min(1)]))
                for (let j = 0; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl("", [Validators.required, Validators.min(1)]))
                }
            }
        }
        else if(matrix.length>this.rows){
            for (let i = matrix.length; i >= this.rows; i--) {
                matrix.removeAt(i);
                supplies.removeAt(i)
            }
        }
    }

    onColumnChange() {
        if(this.columns>10 || this.columns<2) return;
        let needs = this.formGroup.get("needs") as FormArray
        let matrix = this.formGroup.get("matrix") as FormArray;
        if((matrix.at(0) as FormArray).length<this.columns){
            for(let i = needs.length; i<this.columns; i++){needs.push(new FormControl("", [Validators.required, Validators.min(1)]))}
            for (let i = 0; i < this.rows; i++) {
                for (let j = (matrix.at(i) as FormArray).length; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl("", [Validators.required, Validators.min(1)]))
                }
            }
        }
        else if((matrix.at(0) as FormArray).length>this.columns){
            for(let i = needs.length; i>=this.columns; i--){needs.removeAt(i);}
            for (let i = 0; i<matrix.length ; i++) {
                for (let j = (matrix.at(i) as FormArray).length; j>=this.columns; j--){
                    (matrix.at(i) as FormArray).removeAt(j);
                }
            }
        }
    }

    historyClick(data){
        this.rows = data.matrix.length;
        this.columns = data.matrix[0].length;
        let matrix = this.formGroup.get("matrix") as FormArray;
        let needs = this.formGroup.get("needs") as FormArray
        let supplies = this.formGroup.get("supplies") as FormArray
        matrix.clear();
        needs.clear();
        supplies.clear();
        this.httpService.getSolution(data.id).subscribe({
            next:(data: Solution) => {this.response = data;},
            error: error => console.log(error)
        });
        for(let i = 0; i<data.matrix.length; i++){
            supplies.push(new FormControl(data.supplies[i], [Validators.required, Validators.min(1)]));
            matrix.push(new FormArray([]));
            for(let j = 0; j<data.matrix[i].length; j++)
                (matrix.at(i) as FormArray).push(new FormControl(data.matrix[i][j], [Validators.required, Validators.min(1)]));
        }
        for(let i = 0; i<data.needs.length; i++){
            needs.push(new FormControl(data.needs[i], [Validators.required, Validators.min(1)]));
        }
    }

    onIntegerInput(event: Event) {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, '');
    }

    onIntegerInputRow(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = parseInt(input.value);

        if (isNaN(value)) {
            this.rows = null;
        } else if (value < 2) {
            this.rows = 2;
            input.value = '2';
            this.onRowChange();
        } else if (value > 10) {
            this.rows = 10;
            input.value = '10';
            this.onRowChange();
        } else {
            this.rows = value;
            this.onRowChange();
        }
    }

    onIntegerInputCol(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = parseInt(input.value);

        if (isNaN(value)) {
            this.columns = null;
        } else if (value < 2) {
            this.columns = 2;
            input.value = '2';
            this.onColumnChange();
        } else if (value > 10) {
            this.columns = 10;
            input.value = '10';
            this.onColumnChange();
        } else {
            this.columns = value;
            this.onColumnChange();
        }
    }

    submit() {
        if(this.formGroup.controls["matrix"].invalid){
            this.showNotificationFor("Матрица стоимости заполнена неверно");
        }
        else if(this.formGroup.controls["supplies"].invalid){
            this.showNotificationFor("Поля 'Возможности' заполнены неверно");
        }
        else if(this.formGroup.controls["needs"].invalid){
            this.showNotificationFor("Поля 'Нужды' заполнены неверно");
        }
        else {
            if(this.history.length == 10) {
                this.history.pop();
            }
            this.history.unshift(this.formGroup.value);
            this.httpService.postSolve(this.formGroup.value).subscribe({
                next: (data: Solution) => {
                    this.response = data;
                    console.log(this.response)
                },
                error: error => console.log(error)
            });
            console.log(this.history);
        }
    }

    // Показываем уведомление на 3 секунды
    showNotificationFor(message: string) {
        this.notificationMessage = message;
        this.showNotification = true;

        setTimeout(() => {
            this.showNotification = false;
        }, 3000);
    }


}