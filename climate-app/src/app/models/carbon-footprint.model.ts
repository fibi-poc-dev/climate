/******************************************************************************************************
 * Carbon Footprint section interface
******************************************************************************************************/
export interface CarbonFootprint {
    carbonFootprintMainReport: CarbonFootprintMainReport;
    projectConstructionFinancing: ProjectConstructionFinancing;
    projectInfrastructureFinancing: ProjectInfrastructureFinancing;
    withoutProjects: WithoutProjects
}

export interface CarbonFootprintMainReport {
    carbonFootprintMainReportRows: CarbonFootprintRow[];
}

export interface ProjectConstructionFinancing {
    projectConstructionFinancingRows: CarbonFootprintRow[];
}

export interface ProjectInfrastructureFinancing {
    projectInfrastructureFinancingRows: CarbonFootprintRow[];
}

export interface WithoutProjects {
    withoutProjectsRows: CarbonFootprintRow[];
}

export interface CarbonFootprintRow {
    dataCorrectnessDate: string;
    sourceData: number;
    bank: number;
    branch: number;
    account: number;
    accountName: string;
    branchClassificationCode: number;
    branchClassificatonDescription: string;
    creditReportDescription: string;
    currentCreditAuthority: number;
    handlingUnitCode: string;
    regualatedSectorDescription: string;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
    companyType: number;
    publicCompanyMarketValue: number;
    companyName: string;
    companyNumber: number;
    reportType: number;
    endDate: string;
    totalBalanceSheet: number;
    financialDebt: number;
    totalLeaseLiabilities: number;
    negativeEquity: number;
    cashAndCashEquivalents: number;
    revenueTurnover: number;
    capitalMarketFlag: number;
    totalProjectEquity: number;
    totalDebtAdditionalFinancier: number;
    totalBalanceSheetRiskDebt: number;
    ourFinancingShare: number;
    greenBuilding: number;
    projectStage: number;
    greenProject: number;
    greenCluster: number;
    remarks: string;
    officerName: string;
    statusRow: number;
}




