export type DataType =
  | "uuid"
  | "string"
  | "text"
  | "integer"
  | "float"
  | "boolean"
  | "timestamp"
  | "json"
  | "enum";

export interface ForeignKeyReference {
  targetEntity: string;
  targetTable: string;
  targetField: string;
  onDelete?: "CASCADE" | "SET NULL" | "RESTRICT";
}

export interface FieldDefinition {
  name: string;
  type: DataType;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isUnique: boolean;
  isNullable: boolean;
  defaultValue?: string;
  references?: ForeignKeyReference;
  description?: string;
}

export interface IndexDefinition {
  name: string;
  fields: string[];
  isUnique?: boolean;
}

export interface EntityDefinition {
  name: string; // PascalCase (e.g. Patient)
  tableName: string; // snake_case (e.g. patients)
  description: string;
  fields: FieldDefinition[];
  indexes: IndexDefinition[];
  seedRecords: Record<string, unknown>[];
}

export interface MockEndpoint {
  path: string;
  method: "GET" | "POST";
  entityName: string;
  summary: string;
  mockResponse: {
    status: number;
    statusText: string;
    count: number;
    latencyMs: number;
    timestamp: string;
    data: Record<string, unknown>[];
  };
}

export interface SchemaArchitecture {
  domainName: string;
  prompt: string;
  description: string;
  entities: EntityDefinition[];
  postgresDDL: string;
  prismaSchema: string;
  typescriptDefs: string;
  endpoints: MockEndpoint[];
  compiledAt: string;
  compilationTimeMs: number;
}
