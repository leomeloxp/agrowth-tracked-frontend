import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { ILocation } from './location';

export interface ISupplier {
  active: boolean;
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  surname: string;
  nickname: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  comments: string;
  locations: [ILocation];
}

export interface ISupplierListQuery extends DocumentNode {
  supplierList: ISupplier[];
}

export const ADD_SUPPLIER = gql`
  mutation ADD_SUPPLIER($data: SupplierUpdateInput!) {
    createSupplier(data: $data) {
      id
      name
      surname
      idNumber
      nickname
      phoneNumber
      email
      # locations {
      #   name
      #   address
      #   notes
      #   coordinates
      # }
    }
  }
`;

export const ADD_LOCATION_ON_SUPPLIER = gql`
  mutation ADD_LOCATION_ON_SUPPLIER($id: ID!, $data: LocationUpdateInput!) {
    createLocationForSupplier(id: $id, data: $data) {
      id
      name
      address
      notes
      coordinates
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  mutation UPDATE_SUPPLIER($id: ID!, $data: SupplierUpdateInput!) {
    updateSupplier(id: $id, data: $data) {
      id
      name
      surname
      idNumber
      nickname
      phoneNumber
      email
      # locations {
      #   name
      #   address
      #   notes
      #   coordinates
      # }
    }
  }
`;

export const ARCHIVE_SUPPLIER = gql`
  mutation ARCHIVE_SUPPLIER($id: ID!) {
    archiveSupplier(id: $id) {
      message
    }
  }
`;

export const GET_SUPPLIER: ISupplierListQuery = gql`
  query GET_SUPPLIER($id: ID!) {
    getSupplier(id: $id) {
      # active
      # id
      # name
      # surname
      # idNumber
      # nickname
      # phoneNumber
      # email
      locations {
        id
        name
        address
        notes
        coordinates
      }
    }
  }
`;

export const LIST_SUPPLIER: ISupplierListQuery = gql`
  query LIST_SUPPLIER {
    supplierList {
      active
      id
      name
      surname
      idNumber
      nickname
      phoneNumber
      email
      locations {
        name
        address
        notes
        coordinates
      }
    }
  }
`;
