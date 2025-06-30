export interface ClimateRequest {
    month: number; // Month of the report
    year: number;  // Year of the report
    esgRequest: Filter; // ESG request parameters
    carbonFootprintRequest: Filter; // Carbon footprint request parameters
}

export interface Filter {
    page: number; // Page number for pagination
    filterFieldName: string; // Name of the field to filter
    filterFieldValue: string; // Value to filter by
    filterType: string; // Type of the field (e.g., 'string', 'number', etc.)
}
