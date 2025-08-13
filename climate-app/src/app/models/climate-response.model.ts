import { CarbonFootprint } from "./carbon-footprint.model";
import { Esg } from "./esg.model";
import { Limitations } from "./limitations.model";
import { NewGreenCredit } from "./new-green-credit.model";
import { ResidualRiskQuestionnaire } from "./residual-risk-questionnaire.model";


/******************************************************************************************************
 * Main Climate Response interface
 * Root interface for the entire climate reporting response
 ******************************************************************************************************/
export interface ClimateResponse {
  month: number;
  year: number;
  esg: Esg;
  carbonFootprint: CarbonFootprint;
  newGreenCredit: NewGreenCredit;
  limitations: Limitations;
  residualRiskQuestionnaire: ResidualRiskQuestionnaire;
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


