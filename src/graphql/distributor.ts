import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export interface IDistributor {
  active: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  surname: string;
  nickname: string;
  idNumber: string;
  idType: string;
  phoneNumber: string;
  email: string;
  comments: string;
}

export interface IDistributorListQuery extends DocumentNode {
  distributorList: IDistributor[];
}

export const ADD_DISTRIBUTOR = gql`
  mutation ADD_DISTRIBUTOR($data: DistributorUpdateInput!) {
    createDistributor(data: $data) {
      id
      name
      surname
      nickname
      idNumber
      idType
      phoneNumber
      email
    }
  }
`;

export const UPDATE_DISTRIBUTOR = gql`
  mutation UPDATE_DISTRIBUTOR($id: ID!, $data: DistributorUpdateInput!) {
    updateDistributor(id: $id, data: $data) {
      active
      id
      name
      surname
      nickname
      idNumber
      idType
      phoneNumber
      email
    }
  }
`;

export const ARCHIVE_DISTRIBUTOR = gql`
  mutation ARCHIVE_DISTRIBUTOR($id: ID!) {
    archiveDistributor(id: $id) {
      message
    }
  }
`;
export const LIST_DISTRIBUTOR: IDistributorListQuery = gql`
  query LIST_DISTRIBUTOR {
    distributorList {
      active
      id
      name
      surname
      nickname
      idNumber
      idType
      phoneNumber
      email
    }
  }
`;
