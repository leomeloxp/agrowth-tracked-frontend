import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const CURRENT_USER = gql`
  query CURRENT_USER {
    getCurrentUser {
      id
      created
      updated
      name
      email
      sessions {
        name
        id
      }
    }
  }
`;

export const EDIT_CURRENT_USER = gql`
  mutation EDIT_CURRENT_USER($data: UpdateUserInput) {
    editCurrentUser(data: $data) {
      id
      created
      updated
      name
      email
      sessions {
        name
        id
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SIGN_IN($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      name
    }
  }
`;

export const SIGN_UP = gql`
  mutation SIGN_UP($data: SignUpUserInput!) {
    signUp(data: $data) {
      id
      name
    }
  }
`;

export const SIGN_OUT = gql`
  mutation SIGN_OUT {
    signOut {
      message
    }
  }
`;

export interface IUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface ICurrentUser extends DocumentNode {
  getCurrentUser?: IUser;
}

export interface IUpdateUserInput {
  email: string;
  name: string;
  password?: string;
  passwordConfirm?: string;
}
