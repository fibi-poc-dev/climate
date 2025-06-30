/**
 * ESG Main Report model interface
 * Contains banking and climate-related information for ESG reporting
 */
export interface EsgMainReport {
  /** Bank identifier */
  bank: number;
  
  /** Branch identifier */
  branch: number;
  
  /** Account number */
  account: number;
  
  /** Account holder name */
  accountName: string;
  
  /** Customer rating (e.g., AAA, BBB, etc.) */
  customerRating: string;
  
  /** Climate count */
  climateCount: number;
  
  /** Branch classification code */
  branchClassification: number;
  
  /** Human-readable description of branch classification */
  branchClassificationDescription: string;
  
  /** Climate color indicator (e.g., green, yellow, red) */
  climateColor: string;
}
