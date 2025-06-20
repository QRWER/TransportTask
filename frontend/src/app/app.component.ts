import { Component } from "@angular/core";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: "purchase-app",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    template: `
        <h1> Транспортная задача </h1>
        <div>
            <label>Rows</label><br>
            <input type="number" step="1" min="2" name="rows" [(ngModel)]="rows" (ngModelChange)="onRowChange()"><br>
            <label>Columns</label><br>
            <input type="number" step="1" min="2" name="columns" [(ngModel)]="columns" (ngModelChange)="onColumnChange()"><br>
        </div><br>
        <form [formGroup]="formGroup" novalidate (ngSubmit)="submit()">
            @for(row of formControls; track $index){
                <div>
                    @for(column of row.controls; track $index){
                        <input [formControl]="column"/>
                    }
                </div>
            }
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
            supplies: new FormControl(""),
            needs: new FormControl("")
        })
        let matrix = this.formGroup.get("matrix") as FormArray;
        for (let i = 0; i < this.rows; i++) {
            matrix.push(new FormArray([]))
            for (let j = 0; j < this.columns; j++) {
                (matrix.at(i) as FormArray).push(new FormControl(""))
            }
        }
    }

    get formControls(): FormArray[] {
        return (this.formGroup.get("matrix") as FormArray).controls as FormArray[];
    }

    onRowChange(){
        console.log("row: " + this.rows);
        let matrix = this.formGroup.get("matrix") as FormArray;
        if(matrix.length<this.rows){
            for (let i = matrix.length; i < this.rows; i++) {
                matrix.push(new FormArray([]))
                for (let j = 0; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl(""))
                }
            }
        }
        else if(matrix.length>this.rows){
            for (let i = matrix.length; i >= this.rows; i--) {
                matrix.removeAt(i);
            }
        }
    }

    onColumnChange() {
        console.log("column: " + this.columns);
        let matrix = this.formGroup.get("matrix") as FormArray;
        if((matrix.at(0) as FormArray).length<this.columns){
            for (let i = 0; i < this.rows; i++) {
                for (let j = (matrix.at(i) as FormArray).length; j < this.columns; j++) {
                    (matrix.at(i) as FormArray).push(new FormControl(""))
                }
            }
        }
        else if((matrix.at(0) as FormArray).length>this.columns){
            for (let i = 0; i<matrix.length ; i++) {
                for (let j = (matrix.at(i) as FormArray).length; j>=this.columns; j--){
                    (matrix.at(i) as FormArray).removeAt(j);
                }
            }
        }
    }

    submit() {

    }
}