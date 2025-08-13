/******************************************************************************************************
 * New Green Credit interface
 ******************************************************************************************************/
export interface NewGreenCredit {
    newGreenCreditReport: NewGreenCreditReport;
}

export interface NewGreenCreditReport {
    newGreenCreditReportRows: NewGreenCreditRow[];
}

export interface NewGreenCreditRow {
    dataCorrectnessDate: string;
    typeRow: number;
    bank: number;
    branch: number;
    account: number;
    accountName: string;
    branchClassificationCode: number;
    branchClassificatonDescription: string;
    originationDate: string;
    displayReason: string;
    climateColor: number;
    climateColorDescription: string;
    greenCluster: number | null;
    greenClusterDescription: string | null;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalBalanceSheet: number;
    loanSystemUpdateFlag: number | null;
}
