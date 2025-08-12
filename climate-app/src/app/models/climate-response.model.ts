/**
 * High Credit Risk Row interface
 */
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

/**
 * High Credit Risk section interface
 */
export interface HighCreditRisk {
  highCreditRiskRows: HighCreditRiskRow[];
}

/**
 * Climate Response model interfaces
 * Based on the ESG climate reporting system response structure
 */

/**
 * Base ESG Main Report Row interface
 */
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

/**
 * ESG Main Report section interface
 */
export interface EsgMainReport {
  esgMainReportRows: EsgMainReportRow[];
  totalCommercialCredit: EsgMainReportRow[];
  totalPublicCredit: EsgMainReportRow[];
}

/**
 * Heat Map Row interface
 */
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

/**
 * Total Heat Map interface
 */
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

/**
 * Heat Map section interface
 */
export interface HeatMap {
  heatMapRows: HeatMapRow[];
  totalHeatMap: TotalHeatMap;
}

/**
 * Black Credit Row interface
 */
export interface BlackCreditRow {
  dataCorrectnessDate: string;
  blackCluster: number;
  blackClusterDescription: string;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalCreditRisk: number;
}

/**
 * Risk Weighted Assets Percentage interface
 */
export interface RiskWeightedAssetsPercentage {
  dataCorrectnessDate: string | null;
  blackCluster: number | null;
  blackClusterDescription: string | null;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalCreditRisk: number;
}

/**
 * Black Credit section interface
 */
export interface BlackCredit {
  blackCreditRows: BlackCreditRow[];
  totalRiskWeightedAssetsPercentage: RiskWeightedAssetsPercentage;
  totalCommericialRiskWeightedAssetsPercentage: RiskWeightedAssetsPercentage;
  totalBlackCredit: RiskWeightedAssetsPercentage;
}

/**
 * Green Credit Row interface
 */
export interface GreenCreditRow {
  dataCorrectnessDate: string;
  greenCluster: number;
  greenClusterDescription: string;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalCreditRisk: number | null;
}

/**
 * Total Green Credit interface
 */
export interface TotalGreenCredit {
  dataCorrectnessDate: string;
  greenCluster: number | null;
  greenClusterDescription: string | null;
  creditBalanceSheetRisk: number;
  creditOffBalanceSheetRisk: number;
  totalCreditRisk: number;
}

/**
 * Green Credit section interface
 */
export interface GreenCredit {
  greenCreditRows: GreenCreditRow[];
  totalGreenCredit: TotalGreenCredit;
}

/**
 * ICAAP Row interface
 */
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

/**
 * ICAAP section interface
 */
export interface Icaap {
  icaapRows: IcaapRow[];
}

/**
 * ESG section interface containing all ESG-related data
 */
export interface Esg {
  esgMainReport: EsgMainReport;
  heatMap: HeatMap;
  blackCredit: BlackCredit;
  greenCredit: GreenCredit;
  icaap: Icaap;
  highCreditRisk: HighCreditRisk;
}

/**
 * Main Climate Response interface
 * Root interface for the entire climate reporting response

 */
export interface ClimateResponse {
  esg: Esg;
  newGreenCredit: NewGreenCredit;
}

/**
 * Climate Color enum for better type safety
 */
export enum ClimateColor {
  GREEN = 1,
  YELLOW = 2,
  RED = 3
}

/**
 * Climate Color mapping helper
 */
export const ClimateColorMap = {
  [ClimateColor.GREEN]: 'green',
  [ClimateColor.YELLOW]: 'yellow',
  [ClimateColor.RED]: 'red'
} as const;

/**
 * Customer Rating enum for better type safety
 */
export enum CustomerRating {
  AAA = 1,
  AA = 2,
  A = 3,
  BBB = 4,
  BB = 5,
  B = 6,
  CCC = 7
}

/**
 * Customer Rating mapping helper
 */
export const CustomerRatingMap = {
  [CustomerRating.AAA]: 'AAA',
  [CustomerRating.AA]: 'AA',
  [CustomerRating.A]: 'A',
  [CustomerRating.BBB]: 'BBB',
  [CustomerRating.BB]: 'BB',
  [CustomerRating.B]: 'B',
  [CustomerRating.CCC]: 'CCC'
} as const;

/**
 * Type Row enum for different row types
 */
export enum TypeRow {
  TOTAL = 0,
  ACCOUNT = 1,
  LOAN = 2,
}

/**
 * Source Data enum for different data sources
 */
export enum SourceData {
  ORIGINAL = 1,
  COPY = 2,
  USER_ADDED = 3
}

/**
 * Helper function to get climate color string from number
 */
export function getClimateColorString(climateColor: number | null): string {
  if (climateColor === null) return 'unknown';
  return ClimateColorMap[climateColor as ClimateColor] || 'unknown';
}

/**
 * Helper function to get customer rating string from number
 */
export function getCustomerRatingString(customerRating: number | null): string {
  if (customerRating === null) return 'N/A';
  return CustomerRatingMap[customerRating as CustomerRating] || 'Unknown';
}

/**
 * New Green Credit Row interface
 */
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

/**
 * New Green Credit Report interface
 */
export interface NewGreenCreditReport {
  newGreenCreditReportRows: NewGreenCreditRow[];
}

/**
 * New Green Credit interface
 */
export interface NewGreenCredit {
  newGreenCreditReport: NewGreenCreditReport;
}
