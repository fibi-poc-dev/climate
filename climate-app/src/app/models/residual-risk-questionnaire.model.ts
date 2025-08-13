export interface ResidualRiskQuestionnaire {
    residualRiskPopulation: ResidualRiskPopulation;
}

export interface ResidualRiskPopulation {
    residualRiskPopulationRows: ResidualRiskPopulationRow[];
}

export interface ResidualRiskPopulationRow {
    dataCorrectnessDate: string;
    typeRow: number;
    bank: number;
    branch: number;
    account: number;
    accountName: string;
    branchClassificationCode: number;
    branchClassificatonDescription: string;
    creditRedCluster: number;
    creditRedClusterDescription: string;
    residualRisk: number;
    rootRisk: number;
    questionnaireFillDate: string;
    residualRiskDate: string;
    handlingUnitCode: string;
    customerExcel: string;
    officerExcel: string;
}



