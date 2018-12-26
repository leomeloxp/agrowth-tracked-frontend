import gql from 'graphql-tag';

export const WORKSPACE_META_INFO = gql`
  query WORKSPACE_META_INFO {
    getWorkspaceMetaInfo {
      counts {
        users
        produce
        suppliers
      }
    }
  }
`;

export interface IGetWorkspaceMetaInfo {
  counts: {
    users: number;
    produce: number;
    suppliers: number;
  };
}
