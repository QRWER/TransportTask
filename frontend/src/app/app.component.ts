import { Component } from "@angular/core";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
                            <label>Поставщики</label><br>
                            <input type="number" class="matrix-input" step="1" min="2" name="rows" [(ngModel)]="rows" (ngModelChange)="onRowChange()">
                        </div>
                        <div class="control-row">
                            <label>Потребители</label><br>
                            <input type="number" class="matrix-input" step="1" min="2" name="columns" [(ngModel)]="columns" (ngModelChange)="onColumnChange()">
                        </div>
                    </div>
                    <form [formGroup]="formGroup" novalidate (ngSubmit)="submit()">
                        <div class="matrix">
                            <div class="input-val">
                                <label>Матрица стоимости</label>
                                @for (row of matrixControls; track row; let i = $index) {
                                    <div class="matrix-row">
                                        @for (column of row.controls; track $index) {
                                            <input type="number" [formControl]="column" placeholder="C{{i+1}},{{$index+1}}" class="cell"/>
                                        }
                                    </div>
                                }
                            </div>
                            <div class="input-val">
                                <label>Возможности</label>
                                <div class="flex-center">
                                    @for (row of suppliesControls; track $index) {
                                        <input type="number" [formControl]="row" placeholder="A{{$index+1}}" class="cell"/>
                                    }
                                </div>
                            </div>
                            <div class="input-val">
                                <label>Нужды</label>
                                <div class="flex-center">
                                    @for (row of needsControls; track $index) {
                                        <input type="number" [formControl]="row" placeholder="B{{$index+1}}" class="cell"/>
                                    }
                                </div>
                            </div>
                            <button class="submit-btn">Решить</button>
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
                <h3 style="text-align: center">История задач</h3>
                <div>
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
                                    <td>[{{row.matrix}}]</td>
                                    <td>[{{row.supplies}}]</td>
                                    <td>[{{row.needs}}]</td>
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

        for(let i = 0; i<this.rows; i++){supplies.push(new FormControl(""))}

        for (let i = 0; i < this.rows; i++) {
            needs.push(new FormControl(""));
            matrix.push(new FormArray([]))
            for (let j = 0; j < this.columns; j++) {
                (matrix.at(i) as FormArray).push(new FormControl(""))
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
        let supplies = this.formGroup.get("supplies") as FormArray
        let matrix = this.formGroup.get("matrix") as FormArray;
        if(matrix.length<this.rows){
            for (let i = matrix.length; i < this.rows; i++) {
                matrix.push(new FormArray([]))
                supplies.push(new FormControl(""))
                for (let j = 0; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl(""))
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
        let needs = this.formGroup.get("needs") as FormArray
        let matrix = this.formGroup.get("matrix") as FormArray;
        if((matrix.at(0) as FormArray).length<this.columns){
            for(let i = needs.length; i<this.columns; i++){needs.push(new FormControl(""))}
            for (let i = 0; i < this.rows; i++) {
                for (let j = (matrix.at(i) as FormArray).length; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl(""))
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
            supplies.push(new FormControl(data.supplies[i]));
            matrix.push(new FormArray([]));
            for(let j = 0; j<data.matrix[i].length; j++)
                (matrix.at(i) as FormArray).push(new FormControl(data.matrix[i][j]));
        }
        for(let i = 0; i<data.needs.length; i++){
            needs.push(new FormControl(data.needs[i]));
        }
    }

    submit() {
        this.history.pop();
        this.history.unshift(this.formGroup.value);
        this.httpService.postSolve(this.formGroup.value).subscribe({
            next:(data: Solution) => {this.response = data; console.log(this.response)},
            error: error => console.log(error)
        });
        console.log(this.history);
    }
}