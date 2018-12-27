import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface IProduce {
  active: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  unit: string;
  comments: string;
  category: string;
  classification: string;
  variety: string;
  weightUnit: string;
}

export interface IProduceListQuery extends DocumentNode {
  produceList: IProduce[];
}

export const ADD_PRODUCE = gql`
  mutation ADD_PRODUCE($data: ProduceUpdateInput!) {
    createProduce(data: $data) {
      id
      name
      unit
      variety
      classification
      category
      weightUnit
    }
  }
`;

export const UPDATE_PRODUCE = gql`
  mutation UPDATE_PRODUCE($id: ID!, $data: ProduceUpdateInput!) {
    updateProduce(id: $id, data: $data) {
      active
      id
      name
      unit
      variety
      classification
      category
      weightUnit
    }
  }
`;

export const ARCHIVE_PRODUCE = gql`
  mutation ARCHIVE_PRODUCE($id: ID!) {
    archiveProduce(id: $id) {
      message
    }
  }
`;
export const LIST_PRODUCE: IProduceListQuery = gql`
  query LIST_PRODUCE {
    produceList {
      active
      id
      name
      unit
      variety
      classification
      category
      weightUnit
    }
  }
`;
