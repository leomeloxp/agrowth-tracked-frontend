import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { IDistributor } from './distributor';
import { ILocation } from './location';
import { IProduce } from './produce';
import { ISupplier } from './supplier';

export interface IHarvest {
  active: boolean;
  id: string;
  category: string;
  classification: string;
  createdAt: string;
  updatedAt: string;
  emissionDate: string;
  expirationRange: string;
  distributor: IDistributor;
  location: ILocation;
  produce: IProduce;
  quantity: number;
  supplier: ISupplier;
  uuid: string;
  weightOrCount: number;
  weightOrCountUnit: string;
  // comments: string;
}

export interface IHarvestListQuery extends DocumentNode {
  harvestList: IHarvest[];
}

export const ADD_HARVEST = gql`
  mutation ADD_HARVEST(
    $distributorId: ID!
    $locationId: ID!
    $produceId: ID!
    $supplierId: ID!
    $data: HarvestUpdateInput!
  ) {
    createHarvest(
      distributorId: $distributorId
      locationId: $locationId
      produceId: $produceId
      supplierId: $supplierId
      data: $data
    ) {
      id
      category
      classification
      quantity
      emissionDate
      expirationRange
      weightOrCount
      weightOrCountUnit
    }
  }
`;

export const LIST_HARVEST: IHarvestListQuery = gql`
  query LIST_HARVEST {
    harvestList {
      id
      active
      category
      classification
      quantity
      emissionDate
      expirationRange
      distributor {
        name
        surname
        nickname
        idNumber
      }
      location {
        name
        address
        coordinates
      }
      produce {
        name
        variety
      }
      supplier {
        name
        nickname
        idNumber
        surname
      }
      uuid
      weightOrCount
      weightOrCountUnit
    }
  }
`;
