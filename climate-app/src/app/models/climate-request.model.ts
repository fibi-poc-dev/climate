export interface ClimateRequest {
    month: number; // Month of the report
    year: number;  // Year of the report
    esgRequest: RequestSection; // ESG request parameters
    carbonFootprintRequest: RequestSection; // Carbon footprint request parameters
    withoutProjects: RequestSection; // Without projects request parameters
    projectInfrastructureFinancing: RequestSection; // Project infrastructure financing request parameters
    projectConstructionFinancing: RequestSection; // Project construction financing request parameters
}

export interface RequestSection {
    page: number; // Page number for pagination
    filter: Filter[]; // Array of filters to apply
}

export interface Filter {
    filterFieldName: string; // Name of the field to filter
    filterFieldValue: string; // Value to filter by
    filterType: string; // Type of the field (e.g., 'string', 'number', etc.)
    displayName: string; // Display name for the filter used for UI only
}
