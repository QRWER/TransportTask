import { Component } from "@angular/core";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: "purchase-app",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    template: `
        <h1> Транспортная задача </h1>
        <div>
            <label>Поставщики</label><br>
            <input type="number" step="1" min="2" name="rows" [(ngModel)]="rows" (ngModelChange)="onRowChange()"><br>
            <label>Потребители</label><br>
            <input type="number" step="1" min="2" name="columns" [(ngModel)]="columns"
                   (ngModelChange)="onColumnChange()"><br>
        </div><br>
        <form [formGroup]="formGroup" novalidate (ngSubmit)="submit()">
            <div>
                @for (row of matrixControls; track row; let i = $index) {
                    <div style="display: flex; gap: 10px; margin-bottom: 10px">
                        @for (column of row.controls; track $index) {
                            <input type="number" [formControl]="column" placeholder="C{{i+1}},{{$index+1}}"
                                   style="display: inline-block; width: 50px;"/>
                        }
                    </div>
                }
            </div>
            <div>
                <label>Возможности</label>
                <div style="display: flex; gap: 10px;">
                    @for (row of suppliesControls; track $index) {
                        <input type="number" [formControl]="row" placeholder="A{{$index+1}}" style="display: inline-block; width: 50px;"/>
                    }
                </div>
            </div>
            <div>
                <label>Нужды</label>
                <div style="display: flex; gap: 10px;">
                    @for (row of needsControls; track $index) {
                        <input type="number" [formControl]="row" placeholder="B{{$index+1}}" style="display: inline-block; width: 50px;"/>
                    }
                </div>
            </div>
            <br>
            <button (change)="submit()">Решить</button>
        </form>
    `
})
export class AppComponent {
    rows = 2;
    columns = 2;
    formGroup: FormGroup;

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

    submit() {
        const data = this.formGroup.value;
        console.log("Матрица:", data.matrix);
        console.log("Поставщики:", data.supplies);
        console.log("Нужды:", data.needs);
    }
}