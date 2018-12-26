import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { IDistributor } from './distributor';
import { ILocation } from './location';
import { IProduce } from './produce';
import { ISupplier } from './supplier';

export interface IHarvest {
  active: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  emissionDate: string;
  distributor: IDistributor;
  location: ILocation;
  produce: IProduce;
  quantity: number;
  supplier: ISupplier;
  uuid: string;
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
      # produceId
      # supplierId
      quantity
      emissionDate
      # distributor
    }
  }
`;

export const LIST_HARVEST: IHarvestListQuery = gql`
  query LIST_HARVEST {
    harvestList {
      id
      active
      quantity
      emissionDate
      distributor {
        name
        surname
        # company
      }
      location {
        name
        coordinates
      }
      produce {
        name
      }
      supplier {
        name
        idNumber
        surname
      }
      uuid
    }
  }
`;
