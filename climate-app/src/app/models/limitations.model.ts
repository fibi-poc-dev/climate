export interface Limitations {
    limitationsReport: LimitationsReport;
}

export interface LimitationsReport {
    limitationsReportRows: LimitationsReportRow[];
}

export interface LimitationsReportRow {
    dataCorrectnessDate: string;
    massadCode: number;
    detailLevelCode: number;
    limitationCode: number;
    borrowerCharacteristics: string;
    limitationDescription: string;
    creditRiskAmount: number;
    creditRiskPercentage: number;
    limitationComplianceFlag: boolean;
}


