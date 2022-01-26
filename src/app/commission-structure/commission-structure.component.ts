import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AddSlabParams, HandleSameForAllParams, RemoveSlabParams} from "../core/interfaces";

@Component({
    selector: 'app-commission-structure',
    templateUrl: './commission-structure.component.html',
    styleUrls: ['./commission-structure.component.css']
})
export class CommissionStructureComponent implements OnInit {
    @Input() commissionStructure: FormGroup = this.formBuilder.group({});
    @Input() commissionStructureType: String = "";
    @Input() commissionStructureName: String = "";
    @Input() peakHourStyle: String | undefined;
    @Input() operators: any[] | undefined;
    @Input() isRetailerCategorySelected: boolean = false;
    @Input() isPeakHourDefinitionSelected: boolean = false;
    @Input() isSameForAll: boolean = false;
    @Input() retailerCategory: any[] | undefined;
    @Output() invokeAddSlab = new EventEmitter<AddSlabParams>();
    @Output() invokeRemoveSlab = new EventEmitter<RemoveSlabParams>();
    @Output() invokeHandleSameForAll = new EventEmitter<HandleSameForAllParams>();

    constructor(
        private formBuilder: FormBuilder,
    ) {
    }

    ngOnInit(): void {
    }

    getRegular(operator: string): FormArray {
        return this.commissionStructure.get(operator) as FormArray;
    }

    handleSameForAll(event: any) {
        this.invokeHandleSameForAll.emit({event: event, commissionStructureType: this.commissionStructureType})
    }

    addSlab(operator: string) {
        this.invokeAddSlab.emit({commissionStructureType: this.commissionStructureType, operator: operator})
    }

    removeSlab(i: number, operator: string) {
        this.invokeRemoveSlab.emit({index: i, operator: operator, commissionStructureType: this.commissionStructureType})
    }
}
