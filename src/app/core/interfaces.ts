export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T
}

export interface PaginatedData<T> {
    totalElements: number;
    next?: string;
    previous: string;
    content: T[];
}

export interface ActivationOTF {
    id?: number,
    description: string,
    activationStartDate: Date,
    activationEndDate: Date,
    simCommissionType: string,
    liftingFrom: Date,
    liftingTo: string,
    liftingPoint: string,
    robiMasterEl: string,
    robiMasterElPin: string,
    airtelMasterEl: string,
    airtelMasterElPin: string,
    paymentType: string,
    channelPartner: string,
    maxOtf: number,
    maxNid: number,
    nidWithinDays: number,
    retailerCategory: boolean,
    peakHour: boolean,
    brand: string,
    createdAt: Date,
    updatedAt?: Date
}

export interface SlabItem {
    slab: string;
    from: number;
    to: number;
    commission: number;
}

export interface NormalCommission {
    robi: SlabItem[];
    airtel: SlabItem[];
    gp: SlabItem[];
    banglalink: SlabItem[];
    teletalk: SlabItem[];

}

export interface PeakHourData {
    slab: string;
    from: number;
    to: number;
    peakHourCommission: number;
    offPeakHourCommission: number;
}

export interface PeakHourCommission {
    robi: PeakHourData[];
    airtel: PeakHourData[];
    gp: PeakHourData[];
    banglalink: PeakHourData[];
    teletalk: PeakHourData[];

}

export interface Report {
    setupId?: number;
    setupDescription?: string;
    eventId?: string;
    eventTime?: string;
    channel?: any;
    materialCode?: any;
    simCommissionType?: string;
    paymentType?: string;
    distributorCode?: any;
    dsrCode?: any;
    rdmsDsrId?: any;
    retailerCode?: any;
    receiverMsisdn?: string;
    channelPartner?: string;
    distributorLiftingTime?: string;
    dsrLiftingTime?: string;
    simSerial?: string;
    msisdn?: string;
    simType?: string;
    simBrand?: string;
    simProductType?: string;
    subscriberNid?: string;
    masterEl?: string;
    elStatus?: string;
    elTxnId?: string;
    commissionAmount?: string;
}

export interface Region {
    name: string;
    code: string;
}

export interface Area {
    id?: number;
    name: string;
    code: string;
}

export interface Distributor {
    id?: number;
    name: string;
    code: string;
}

export interface GetSlabParams {
    operator: String;
    commissionStructureType: String;
}

export interface AddSlabParams {
    operator: String;
    commissionStructureType: String;
}

export interface RemoveSlabParams {
    index: number;
    operator: String;
    commissionStructureType: String;
}

export interface HandleSameForAllParams {
    event: any;
    commissionStructureType: String;
}