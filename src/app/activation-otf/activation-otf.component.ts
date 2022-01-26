import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivationOtfService} from "../core/services/activation-otf/activation-otf.service";
import {
    ActivationOTF,
    Area,
    Distributor,
    GetSlabParams,
    HandleSameForAllParams,
    Region,
    RemoveSlabParams
} from "../core/interfaces";
import {DatePipe} from '@angular/common'
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../core/services/error-handler.service";
import {environment} from "../../environments/environment";
import {MessageService} from "primeng/api";
import {ModalManager} from "ngb-modal";
import {NavigationExtras, Router} from "@angular/router";
import {catchError, map} from "rxjs/operators";

const API_URL = environment.apiUrl;

interface Data {
    name: string
    code: string,
}

@Component({
    selector: 'app-activation-otf',
    templateUrl: './activation-otf.component.html',
    styleUrls: ['./activation-otf.component.css']
})
export class ActivationOtfComponent implements OnInit {

    @ViewChild('myModal') myModal: any;
    private modalRef: any;

    searchString: any;
    description: any | undefined;
    pageNo: any;
    totalRecords: number = 0;
    public activationOTFS: ActivationOTF[] = [];
    form: any;
    activationStartDate: any;
    activationNewStartDate: any;
    activationEndDate: any;

    simCommissionTypes: any = [{name: 'Accounting', code: 'A'}, {name: 'Marketing', code: 'M'}, {
        name: 'Production', code: 'P'
    }];
    selectedSimCommissionType: any;

    liftingFrom: Date | undefined;
    liftingTo: Date | undefined;
    liftingPoints: any[] = [{name: 'DSR', code: 'DSR'}, {name: 'DISTRIBUTOR', code: 'D'}, {
        name: 'RETAILER', code: 'R'
    }];
    selectedLiftingPoint: any;

    paymentTypes: any = [{name: 'Easy Load', code: 'EL'}, {name: 'Robi Cash', code: 'RC'},
        {name: 'MFS', code: 'MFS'}];
    selectedPaymentType: any;

    brands: any = ['ROBI', 'AIRTEL', 'BOTH'];
    selectedBrand: any;

    productTypes: any = [];
    selectedProductType: any;

    simTypes: any = ['POSTPAID', 'PREPAID', 'BOTH'];
    selectedSimType: any;

    materials: any;
    selectedMaterials: any;

    channels: any;

    chanelPartners: any = [{name: 'DSR', code: 'DSR'}, {name: 'DISTRIBUTOR', code: 'D'}, {
        name: 'RETAILER', code: 'R'
    }];
    selectedChanelPartner: any;

    booleanData: any = [{name: 'True', code: true}, {name: 'False', code: false}];
    // retailerCategory: any;
    selectedFile: any;
    private result: any;
    activeIndex: number = 0;
    fromDate: any;
    toDate: any;
    sameForAllSp: boolean = false;

    isSameForAllRegularCommission: boolean = false;
    isSameForAllNid: boolean = false;
    isSameForAllSpecialCommission: boolean = false;

    isRetailerCategorySelected: boolean = false;
    isPeakHourDefinitionSelected: boolean = false;
    regions: any;
    selectedRegion: Region[] | undefined;

    areas: any;

    distributors: any;
    selectedDistributor: Distributor[] | undefined;
    readyMaterialCodeList: any;

    specialDate: any = 1;
    specialDateStart: any = '2022-01-01';
    specialDateEnd: any = '2022-01-31';

    retailerCategories: any[] = [];
    operators: any[] = ['robi', 'airtel', 'gp', 'teletalk', 'banglalink'];
    commissionStructureTypes = {
        regularCommissionStructure: 'regularCommissionStructure',
        sameNIDCommissionStructure: 'sameNIDCommissionStructure',
        specialDateCommissionStructure: 'specialDateCommissionStructure'
    };
    commissionStructureNames = {
        regularCommissionStructure: 'Regular Commission Structure',
        sameNIDCommissionStructure: 'Same NID Commission Structure',
        specialDateCommissionStructure: 'Special Date Commission Structure'
    };
    peakHourStyle = "width: " + 80 * this.retailerCategories.length + "px";
    id: any;
    action: string | any;
    isDetailsReq: boolean = false;

    constructor(
        private router: Router,
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private messageService: MessageService,
        private errorHandlerService: ErrorHandlerService,
        private readonly activationOtfService: ActivationOtfService,
    ) {
    }

    setSession(key: string, value: any): void {
        localStorage.setItem(key, value);
    }

    ngOnInit() {
        let session = JSON.parse(this.getSession('sessionData'));
        if (session) {
            this.id = session.otfId;
            this.action = session.action;
            this.isDetailsReq = true;
            this.getActivationOtfDetails(this.id);
        }
        this.clearSession();
        this.getSetupFormDetails();
        this.form = this.formBuilder.group({
            id: [null],
            description: [null],
            region: [null],
            area: [null],
            distributor: [null],
            activationStartDate: [null, [Validators.required, this.ValidateDateBeforeToday]],
            activationEndDate: [null, [Validators.required, this.ValidateDateBeforeStartDate]],
            simCommissionType: [null, Validators.required],
            liftingFrom: [null, [Validators.required, this.validateLiftingDateDateBeforeStartDate]],
            liftingTo: [null, Validators.required],
            liftingPoint: [null, Validators.required],
            robiMasterEl: [null, Validators.required],
            robiMasterElPin: [null, Validators.required],
            airtelMasterEl: [null, Validators.required],
            airtelMasterElPin: [null, Validators.required],
            paymentType: [null, Validators.required],
            channelPartner: [null, Validators.required],
            channel: [null, Validators.required],
            maxOtf: [null, Validators.required],
            maxNid: [null, Validators.required],
            nidWithinDays: [null, Validators.required],
            retailerCategory: [null],
            peakHour: [null],
            peakHourStart: [null],
            peakHourEnd: [null],
            regularCommissionStructure: this.formBuilder.group({
                robi: this.formBuilder.array([]),
                airtel: this.formBuilder.array([]),
                gp: this.formBuilder.array([]),
                teletalk: this.formBuilder.array([]),
                banglalink: this.formBuilder.array([]),
            }),
            sameNIDCommissionStructure: this.formBuilder.group({
                robi: this.formBuilder.array([]),
                airtel: this.formBuilder.array([]),
                gp: this.formBuilder.array([]),
                teletalk: this.formBuilder.array([]),
                banglalink: this.formBuilder.array([]),
            }),
            specialDateCommissionStructure: this.formBuilder.group({
                robi: this.formBuilder.array([]),
                airtel: this.formBuilder.array([]),
                gp: this.formBuilder.array([]),
                teletalk: this.formBuilder.array([]),
                banglalink: this.formBuilder.array([]),
            })

        });
        if (this.isDetailsReq && session.action == 'details') {
            this.form.disable();
        }
    }

    getSetupFormDetails() {
        this.activationOtfService.getSetupFormDetails().subscribe((data) => {
            this.regions = data.data.regions;
            this.retailerCategories = data.data.retailerCategories;
            this.channels = data.data.channels;
            this.productTypes = data.data.productTypes;
            // todo: do it properly
            this.peakHourStyle = "width: " + 80 * this.retailerCategories.length + "px";
        });
    }

    getActivationOtfDetails(id: number) {
        this.activationOtfService.getActivationOtfDetailsById(id).subscribe((data) => {
            const result = data.data;
            this.areas = this.mapToObject(result.areas);
            this.distributors = this.mapToObject(result.distributors);
            this.form.patchValue({
                id: result.id,
                region: result.regions,
                area: result.areas,
                distributor: result.distributors,
                channel: result.channels,
                description: result.description,
                activationStartDate: new Date(result.activationStartDate),
                activationEndDate: new Date(result.activationEndDate),
                simCommissionType: this.simCommissionTypes.find((item: any) => item.name == result.simCommissionType),
                liftingFrom: new Date(result.liftingFrom),
                liftingTo: new Date(result.liftingTo),
                liftingPoint: this.liftingPoints.find((item: any) => item.name == result.liftingPoint),
                robiMasterEl: result.robiMasterEl,
                robiMasterElPin: result.robiMasterElPin,
                airtelMasterEl: result.airtelMasterEl,
                airtelMasterElPin: result.airtelMasterElPin,
                paymentType: this.paymentTypes.find((item: any) => item.name == result.paymentType),
                channelPartner: this.chanelPartners.find((item: any) => item.name == result.channelPartner),
                maxOtf: result.maxOtf,
                maxNid: result.maxNid,
                nidWithinDays: result.nidWithinDays,
                retailerCategory: result.retailerCategory,
                peakHour: result.peakHour,
                peakHourStart: result.peakHourStart,
                peakHourEnd: result.peakHourEnd,
            });
            // todo: try to use form control only instead of separate variable
            this.selectedBrand = result.brand
            this.selectedSimType = result.simType
            this.selectedProductType = result.productTypes
            this.selectedMaterials = result.materialCodes;
            this.isRetailerCategorySelected = result.retailerCategory;
            this.isPeakHourDefinitionSelected = result.peakHour;
            this.loadMaterialData();
        });
    }

    onSubmit() {
        if (this.form.valid) {
            const formData = new FormData();
            formData.append('setupDescription', this.form.get('description').value);
            formData.append('activationStartDate', this.convertDate(this.form.get('activationStartDate').value));
            formData.append('activationEndDate', this.convertDate(this.form.get('activationEndDate').value));
            formData.append('channels', this.form.get('channel').value);
            formData.append('brand', this.selectedBrand);
            formData.append('simType', this.selectedSimType);
            formData.append('productTypes', this.selectedProductType);
            formData.append('materialCodes', this.selectedMaterials);
            formData.append('simCommissionType', this.form.get('simCommissionType').value.name);
            formData.append('liftingFrom', this.convertDate(this.form.get('liftingFrom').value));
            formData.append('liftingTo', this.convertDate(this.form.get('liftingTo').value));
            formData.append('liftingPoint', this.form.get('liftingPoint').value.name);
            formData.append('robiMasterEl', this.form.get('robiMasterEl').value);
            formData.append('robiMasterElPin', this.form.get('robiMasterElPin').value);
            formData.append('airtelMasterEl', this.form.get('airtelMasterEl').value);
            formData.append('airtelMasterElPin', this.form.get('airtelMasterElPin').value);
            formData.append('paymentType', this.form.get('paymentType').value.name);
            formData.append('regions', this.form.get('region').value);
            formData.append('areas', this.form.get('area').value);
            formData.append('distributors', this.form.get('distributor').value);
            formData.append('channelPartner', this.form.get('channelPartner').value.name);
            formData.append('maxOtf', this.form.get('maxOtf').value);
            formData.append('maxNid', this.form.get('maxNid').value);
            formData.append('nidWithinDays', this.form.get('nidWithinDays').value);
            formData.append('retailerCategory', this.form.get('retailerCategory').value);
            formData.append('peakHour', this.form.get('peakHour').value);
            formData.append('peakHourStart', this.form.get('peakHourStart').value);
            formData.append('peakHourEnd', this.form.get('peakHourEnd').value);
            formData.append('regularCommissionStructure', this.prepareCommissionStructureFormData(this.form.get('regularCommissionStructure'), "regularCommissionStructure"));
            formData.append('sameNidCommissionStructure', this.prepareCommissionStructureFormData(this.form.get('sameNIDCommissionStructure'), "sameNIDCommissionStructure"));
            formData.append('dateWiseCommissionStructure', this.prepareCommissionStructureFormData(this.form.get('specialDateCommissionStructure'), "specialDateCommissionStructure"));
            formData.append('specialDate', this.specialDate);
            formData.append('specialDateStart', this.specialDateEnd);
            formData.append('specialDateEnd', this.specialDateEnd);

            this.http.post<any>(API_URL + 'activation-otf', formData).subscribe(data => {
                this.result = data;
                console.log(data);
                this.setSession("isOtfCreated", 'data');
                this.router.navigate(['/']);
            });

        } else {
            console.log("****************************************************");
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Form validation failed'
            });
            this.validateAllFormFields(this.form);
        }
    }

    getSession(key: string): any {
        if (typeof window !== 'undefined') {
            //let retrievedObject = sessionStorage.getItem(key) as string;
            let retrievedObject = localStorage.getItem(key) as any;
            return retrievedObject;
        }
    }

    clearSession(): void {
        localStorage.clear();
    }

    getRetailerCategoryGroup(): FormGroup {
        let retailerCategoryGroup = this.formBuilder.group({})
        for (let category of this.retailerCategories) {
            retailerCategoryGroup.addControl(category, new FormControl(''))
        }

        return retailerCategoryGroup;
    }

    getPeakHourAmountGroup(): FormGroup {
        return this.formBuilder.group({
            peak: [''],
            offPeak: [''],
        })
    }

    getPeakHourRetailerCategoryGroup(): FormGroup {
        return this.formBuilder.group({
            peak: this.getRetailerCategoryGroup(),
            offPeak: this.getRetailerCategoryGroup(),
        })
    }

    newSlab(): FormGroup {
        return this.formBuilder.group({
            slab: [''],
            from: [''],
            to: [''],
            commission: this.formBuilder.group({
                amount: [''],
                retailerCategory: this.getRetailerCategoryGroup(),
                peakHourAmount: this.getPeakHourAmountGroup(),
                peakHourRetailerCategory: this.getPeakHourRetailerCategoryGroup(),
            })
        })
    }

    addSlab(params: GetSlabParams) {
        this.getSlabs({
            commissionStructureType: params.commissionStructureType,
            operator: params.operator
        }).push(this.newSlab());
    }

    removeSlab(params: RemoveSlabParams) {
        this.getSlabs({
            commissionStructureType: params.commissionStructureType,
            operator: params.operator
        }).removeAt(params.index);
    }

    getSlabs(params: GetSlabParams): FormArray {
        return this.form.get(params.commissionStructureType).get(params.operator) as FormArray;
    }

    getCommissionStructure(commissionStructureType: string): FormGroup {
        return this.form.get(commissionStructureType) as FormGroup;
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    reset() {
        this.form.reset();
        this.messageService.add({
            key: 'toast-key', severity: 'warn', summary: 'From Cleared',
            detail: 'Form cleared successfully!'
        });
    }

    mapToObject(data: any): any {
        return Object.keys(data).map((key) => {
            return {
                name: data[key],
                code: data[key]
            }
        });
    }

    convertDate(date: Date | undefined): string {
        let data = this.datePipe.transform(date, 'yyyy-MM-dd') + "";
        return data;
    }

    handleDropdownChange(event: any, field: string) {
        console.log(event)
        if (field == 'simCommissionType') {
            this.selectedSimCommissionType = this.convertDate(event);
            console.log(this.selectedSimCommissionType);
            // this.form.get('simCommissionType').setValue(event.value.name);

        } else if (field == 'liftingPoint') {
            this.selectedLiftingPoint = this.convertDate(event);
            // this.form.get('liftingPoint').setValue(event.value.name);

        } else if (field == 'paymentType') {
            this.selectedPaymentType = this.convertDate(event);
            // this.form.get('paymentType').setValue(event.value.name);

        } else if (field == 'channelPartner') {
            this.selectedChanelPartner = this.convertDate(event);
            // this.form.get('channelPartner').setValue(event.value.value);
        }
    }

    convertObject(event: any): any {
        const data: any = {};
        data['name'] = event.value.name;
        data['code'] = event.value.code;
        return data;
    }

    onFileSelect(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.form.get('file').setValue(file);
            this.selectedFile = file;
        }
    }

    prepareCommissionStructureFormData(commissionStructure: FormGroup,
                                       commissionStructureType: String): string {
        if (this.isRetailerCategorySelected && this.isPeakHourDefinitionSelected) {
            // @ts-ignore
            for (let operator in commissionStructure.controls) {
                // @ts-ignore
                let commissions = commissionStructure.get(operator).controls;
                // @ts-ignore
                for (let commission of commissions) {
                    // @ts-ignore
                    for (let control in commission.get("commission").controls) {
                        if (control == "peakHourRetailerCategory")
                            continue;

                        commission.get("commission").removeControl(control);
                    }
                }
            }
        } else if (!this.isRetailerCategorySelected && this.isPeakHourDefinitionSelected) {
            // @ts-ignore
            for (let operator in commissionStructure.controls) {
                // @ts-ignore
                let commissions = commissionStructure.get(operator).controls;
                // @ts-ignore
                for (let commission of commissions) {
                    // @ts-ignore
                    for (let control in commission.get("commission").controls) {
                        if (control == "peakHourAmount")
                            continue;

                        commission.get("commission").removeControl(control);
                    }
                }
            }
        } else if (this.isRetailerCategorySelected && !this.isPeakHourDefinitionSelected) {
            // @ts-ignore
            for (let operator in commissionStructure.controls) {
                // @ts-ignore
                let commissions = commissionStructure.get(operator).controls;
                // @ts-ignore
                for (let commission of commissions) {
                    // @ts-ignore
                    for (let control in commission.get("commission").controls) {
                        if (control == "retailerCategory")
                            continue;

                        commission.get("commission").removeControl(control);
                    }
                }
            }
        } else if (!this.isRetailerCategorySelected && !this.isPeakHourDefinitionSelected) {
            // @ts-ignore
            for (let operator in commissionStructure.controls) {
                // @ts-ignore
                let commissions = commissionStructure.get(operator).controls;
                // @ts-ignore
                for (let commission of commissions) {
                    // @ts-ignore
                    for (let control in commission.get("commission").controls) {
                        if (control == "amount")
                            continue;

                        commission.get("commission").removeControl(control);
                    }
                }
            }
        }

        let structure = commissionStructure.value;

        if (commissionStructureType == "regularCommissionStructure" && this.isSameForAllRegularCommission) {
            structure.airtel = structure.robi;
            structure.teletalk = structure.robi;
            structure.gp = structure.robi;
            structure.banglalink = structure.robi;
        } else if (commissionStructureType == "sameNidCommissionStructure" && this.isSameForAllNid) {
            structure.airtel = structure.robi;
            structure.teletalk = structure.robi;
            structure.gp = structure.robi;
            structure.banglalink = structure.robi;
        } else if (commissionStructureType == "specialDateCommissionStructure" && this.isSameForAllSpecialCommission) {
            structure.airtel = structure.robi;
            structure.teletalk = structure.robi;
            structure.gp = structure.robi;
            structure.banglalink = structure.robi;
        }

        return JSON.stringify(structure);
    }

    handleSameForAll(params: HandleSameForAllParams) {
        if (params.commissionStructureType == "regularCommissionStructure") {
            this.isSameForAllRegularCommission = params.event.checked;
        } else if (params.commissionStructureType == "sameNIDCommissionStructure") {
            this.isSameForAllNid = params.event.checked;
        } else if (params.commissionStructureType == "specialDateCommissionStructure") {
            this.isSameForAllSpecialCommission = params.event.checked;
        }
    }

    handleRetailerCategory() {
        this.isRetailerCategorySelected = this.form.get('retailerCategory').value;
    }

    handlePeakHourDefinition() {
        this.isPeakHourDefinitionSelected = this.form.get('peakHour').value;

        this.form.controls.peakHourStart.setValidators(this.isPeakHourDefinitionSelected ? [Validators.required] : null);
        this.form.controls.peakHourStart.updateValueAndValidity();
        this.form.controls.peakHourEnd.setValidators(this.isPeakHourDefinitionSelected ? [Validators.required] : null);
        this.form.controls.peakHourEnd.updateValueAndValidity();
    }

    openModal() {
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'mymodal',
            hideCloseButton: false,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: true,
            backdropClass: "modal-backdrop"
        })
    }

    closeModal() {
        this.modalService.close(this.modalRef);
        //or this.modalRef.close();
    }

    handleRegion(regionCodes: any) {
        this.activationOtfService.getAreaListByRegion({regionCodes: regionCodes}).subscribe((data) => {
            this.areas = data.data;
            let areaCodes = this.areas.map((a: { code: any; }) => a.code);

            let newSelectedValues = this.preserveSelectedValue(areaCodes, this.form.get('area').value);
            if(newSelectedValues) {
                this.form.get('area').setValue(newSelectedValues)
                this.handleArea(newSelectedValues)
            }
        });
    }

    handleArea(areaCodes: any) {
        this.activationOtfService.getDistributorListByArea({areaCodes: areaCodes}).subscribe((data) => {
            this.distributors = data.data;
            let distributorCodes = this.distributors.map((d: { code: any; }) => d.code);

            let newSelectedValues = this.preserveSelectedValue(distributorCodes, this.form.get('distributor').value);
            if(newSelectedValues) {
                this.form.get('distributor').setValue(newSelectedValues)
            }
        });
    }

    preserveSelectedValue(currentFormControlValues: any, previouslySelectedValues: any) : any {
        if (!previouslySelectedValues) {
            return null;
        }

        for (let i = previouslySelectedValues.length - 1; i >= 0; i--) {
            if (!currentFormControlValues.includes(previouslySelectedValues[i])) {
                previouslySelectedValues.splice(i, 1);
            }
        }

        return previouslySelectedValues;
    }

    onBack() {
        this.router.navigate(['/']);
    }

    ValidateDateBeforeToday(control: AbstractControl): { [key: string]: any } | null {
        let today = new Date();

        if (control.value && new Date(control.value.getUTCFullYear(), control.value.getUTCMonth(), control.value.getUTCDate()) < new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())) {
            return {'dateBeforeToday': true};
        }
        return null;
    }

    ValidateDateBeforeStartDate(control: AbstractControl): { [key: string]: any } | null {
        if (!control || !control.parent)
            return null;

        let activationStartDateControl = control.parent.get('activationStartDate');
        if (!activationStartDateControl)
            return null;

        let activationStartDate = activationStartDateControl.value;

        if (control.value && new Date(control.value.getUTCFullYear(), control.value.getUTCMonth(), control.value.getUTCDate()) < new Date(activationStartDate.getUTCFullYear(), activationStartDate.getUTCMonth(), activationStartDate.getUTCDate())) {
            return {'dateBeforeActivationStartDate': true};
        }
        return null;
    }

    validateLiftingDateDateBeforeStartDate(control: AbstractControl): { [key: string]: any } | null {
        if (!control || !control.parent)
            return null;

        let activationStartDateControl = control.parent.get('activationStartDate');
        if (!activationStartDateControl)
            return null;

        let activationStartDate = activationStartDateControl.value;

        if (control.value && new Date(control.value.getUTCFullYear(), control.value.getUTCMonth(), control.value.getUTCDate()) > new Date(activationStartDate.getUTCFullYear(), activationStartDate.getUTCMonth(), activationStartDate.getUTCDate())) {
            return {'dateAfterActivationStartDate': true};
        }
        return null;
    }

    loadMaterialData(selectedMaterial: any = null) {
        this.activationOtfService.getMaterialList(this.selectedProductType, this.selectedBrand, this.selectedSimType).subscribe((data) => {
            this.materials = data.data.map((x: { code: any }) => x.code);
            if(selectedMaterial != null)
                this.selectedMaterials = selectedMaterial;
        });
    }
}
