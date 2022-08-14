import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PolicyHomeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type PolicyCarMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FilesMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FileTypeMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ClientMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class PolicyHome {
  readonly id: string;
  readonly street_number?: string | null;
  readonly street_name?: string | null;
  readonly unit_number?: string | null;
  readonly postal_code?: string | null;
  readonly client_id?: string | null;
  readonly broker_id?: string | null;
  readonly policy_value?: number | null;
  readonly renewal_date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PolicyHome, PolicyHomeMetaData>);
  static copyOf(source: PolicyHome, mutator: (draft: MutableModel<PolicyHome, PolicyHomeMetaData>) => MutableModel<PolicyHome, PolicyHomeMetaData> | void): PolicyHome;
}

export declare class PolicyCar {
  readonly id: string;
  readonly client_id?: string | null;
  readonly vehicle_make?: string | null;
  readonly vehicle_model?: string | null;
  readonly vehicle_year?: string | null;
  readonly wheel_drive?: string | null;
  readonly registered_owner?: string | null;
  readonly broker_id?: string | null;
  readonly vehicle_VIN?: string | null;
  readonly policy_value?: number | null;
  readonly renewal_date?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<PolicyCar, PolicyCarMetaData>);
  static copyOf(source: PolicyCar, mutator: (draft: MutableModel<PolicyCar, PolicyCarMetaData>) => MutableModel<PolicyCar, PolicyCarMetaData> | void): PolicyCar;
}

export declare class Files {
  readonly id: string;
  readonly client_id?: string | null;
  readonly file_type_i?: string | null;
  readonly file_name?: string | null;
  readonly file_url?: string | null;
  readonly file_extension?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Files, FilesMetaData>);
  static copyOf(source: Files, mutator: (draft: MutableModel<Files, FilesMetaData>) => MutableModel<Files, FilesMetaData> | void): Files;
}

export declare class FileType {
  readonly id: string;
  readonly file_type_name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<FileType, FileTypeMetaData>);
  static copyOf(source: FileType, mutator: (draft: MutableModel<FileType, FileTypeMetaData>) => MutableModel<FileType, FileTypeMetaData> | void): FileType;
}

export declare class Client {
  readonly id: string;
  readonly broker_id?: string | null;
  readonly name: string;
  readonly driver_licence?: string | null;
  readonly address?: string | null;
  readonly city?: string | null;
  readonly unit?: string | null;
  readonly postal_code?: string | null;
  readonly email?: string | null;
  readonly phone_number?: string | null;
  readonly prior_insurance?: string | null;
  readonly minor_tickets?: string | null;
  readonly major_suspensions?: string | null;
  readonly criminal_violations?: string | null;
  readonly current_policy_date?: string | null;
  readonly notes?: (string | null)[] | null;
  readonly quote_completed?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Client, ClientMetaData>);
  static copyOf(source: Client, mutator: (draft: MutableModel<Client, ClientMetaData>) => MutableModel<Client, ClientMetaData> | void): Client;
}