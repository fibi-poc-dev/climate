/******************************************************************************************************
 * ESG section interface containing all ESG-related data
******************************************************************************************************/
export interface Esg {
    esgMainReport: EsgMainReport;
    heatMap: HeatMap;
    blackCredit: BlackCredit;
    greenCredit: GreenCredit;
    icaap: Icaap;
    highCreditRisk: HighCreditRisk;
}



/******************************************************************************************************
 * High Credit Risk section interface
 ******************************************************************************************************/
export interface HighCreditRisk {
    highCreditRiskRows: HighCreditRiskRow[];
}

export interface HighCreditRiskRow {
    dataCorrectnessDate: string;
    redCluster: number;
    redClusterDescription: string;
    descriptionInCreditReport: string;
    rootRisk: number;
    companysNumber: number;
    residualRisk: number;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
    totalColletral: number;
    totalSolo: number;
}



/******************************************************************************************************
 * ICAAP section interface
 ******************************************************************************************************/
export interface Icaap {
    icaapRows: IcaapRow[];
}

export interface IcaapRow {
    dataCorrectnessDate: string;
    minRiskRate: number;
    maxRiskRate: number;
    rootCreditBalanceSheetRisk: number;
    rootCreditOffBalanceSheetRisk: number;
    rootTotalCreditRiskRate: number;
    residualCreditBalanceSheetRisk: number;
    residualCreditOffBalanceSheetRisk: number;
    residualTotalCreditRiskRate: number;
}




/******************************************************************************************************
 * Green Credit section interface
 ******************************************************************************************************/
export interface GreenCredit {
    greenCreditRows: GreenCreditRow[];
    totalGreenCredit: TotalGreenCredit;
}

export interface GreenCreditRow {
    dataCorrectnessDate: string;
    greenCluster: number;
    greenClusterDescription: string;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number | null;
}

export interface TotalGreenCredit {
    dataCorrectnessDate: string;
    greenCluster: number | null;
    greenClusterDescription: string | null;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
}



/******************************************************************************************************
 * Black Credit section interface
 ******************************************************************************************************/
export interface BlackCredit {
    blackCreditRows: BlackCreditRow[];
    totalRiskWeightedAssetsPercentage: RiskWeightedAssetsPercentage;
    totalCommericialRiskWeightedAssetsPercentage: RiskWeightedAssetsPercentage;
    totalBlackCredit: RiskWeightedAssetsPercentage;
}

export interface BlackCreditRow {
    dataCorrectnessDate: string;
    blackCluster: number;
    blackClusterDescription: string;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
}

export interface RiskWeightedAssetsPercentage {
    dataCorrectnessDate: string | null;
    blackCluster: number | null;
    blackClusterDescription: string | null;
    creditBalanceSheetRisk: number;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
}



/******************************************************************************************************
 * Heat Map section interface
 ******************************************************************************************************/
export interface HeatMap {
    heatMapRows: HeatMapRow[];
    totalHeatMap: TotalHeatMap;
}

export interface HeatMapRow {
    dataCorrectnessDate: string;
    redCluster: number;
    redClusterDescription: string;
    rootPhysicalRisk: number;
    rootTransferRisk: number;
    rootRiskLevelWeight: number;
    residualRiskAverage: number;
    qualityManagement: number | null;
    creditBalanceSheetRisk: number | null;
    creditOffBalanceSheetRisk: number;
    totalCreditRisk: number;
    totalCreditRiskRate: number;
}

export interface TotalHeatMap {
    dataCorrectnessDate: string | null;
    redCluster: number | null;
    redClusterDescription: string | null;
    rootPhysicalRisk: number | null;
    rootTransferRisk: number | null;
    rootRiskLevelWeight: number | null;
    residualRiskAverage: number | null;
    qualityManagement: number | null;
    creditBalanceSheetRisk: number | null;
    creditOffBalanceSheetRisk: number | null;
    totalCreditRisk: number | null;
    totalCreditRiskRate: number;
}









/******************************************************************************************************
 * EsgMainReport section interface
 ******************************************************************************************************/
export interface EsgMainReport {
    esgMainReportRows: EsgMainReportRow[];
    totalCommercialCredit: EsgMainReportRow[];
    totalFilterCommercialCredit: EsgMainReportRow[];
    totalPublicCredit: EsgMainReportRow[];
}


export interface EsgMainReportRow {
    dataCorrectnessDate: string;
    sourceData: number;
    typeRow: number;
    bank: number | null;
    branch: number | null;
    account: number | null;
    accountName: string | null;
    customerRating: number | null;
    currentCreditAuthority: number | null;
    handlingUnitCode: string | null;
    regualatedSectorCode: number | null;
    regualatedSectorDescription: string | null;
    branchClassificationCode: number | null;
    branchClassificatonDescription: string | null;
    subClassification: number | null;
    creditReportDescription: string | null;
    creditRedCluster: number | null;
    rootPhysicalRisk: number | null;
    rootTransferRisk: number | null;
    rootPhysicalRiskScale: number | null;
    rootTransferRiskScale: number | null;
    rootRiskLevelWeight: number | null;
    residualRisk: number | null;
    residualRiskDate: string | null;
    qualityManagement: number | null;
    blackCluster: number | null;
    greenCluster: number | null;
    climateColor: number | null;
    totalCollateral: number | null;
    totalSolo: number | null;
    creditBalanceSheetRisk: number | null;
    creditOffBalanceSheetRisk: number | null;
    totalCreditRisk: number | null;
    statusRow: number;
}