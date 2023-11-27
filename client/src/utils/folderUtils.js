import { graphQLRequest } from './request';

export const foldersLoader = async () => {
  try {
    const query = `query Folders {
      folders {
        id
        name
        createdAt
      }
    }`;

    const data = await graphQLRequest({ query });
    return data;
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw error; // Re-throw the error for further handling if needed
  }
};

export const addNewFolder = async (newFolder) => {
  const query = `mutation Mutation($name: String!) {
    addFolder(name: $name) {
      name
      author {
        name
      }
    }
  }`;

  const data = await graphQLRequest({
    query,
    variables: { name: newFolder.name },
  });

  return data;
};