import { DocumentNode } from 'graphql';
// import gql from 'graphql-tag';

export interface ILocation {
  created: Date | number;
  updated: Date | number;
  id: string;
  name: string;
  address: string;
  notes: string;
  coordinates: [number, number];
}

export interface ILocationListQuery extends DocumentNode {
  supplierList: ILocation[];
}
