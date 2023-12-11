import { graphQLRequest } from './request'

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
      folder(folderId: $folderId) {
        id
        name
        notes {
          id
          content
          updatedAt
        }
      }
    }`;

  const data = await graphQLRequest({
    query,
    variables: {
      folderId,
    },
  });
  return data;
};

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Note($noteId: String!) {
      note(noteId: $noteId) {
        content
        id
      }
    }`;

  const data = await graphQLRequest({
    query,
    variables: {
      noteId,
    },
  });
  return data;
};

export const addNewNote = async ({ params, request }) => {
  const newNote = await request.formData();
  const formDataObj = {};
  newNote.forEach((value, key) => (formDataObj[key] = value));

  console.log({ newNote, formDataObj });
  const query = `mutation Mutation($content: String!, $folderId: ID!) {
      addNote(content: $content, folderId: $folderId) {
        id
        content
      }
    }`;

  const { addNote } = await graphQLRequest({
    query,
    variables: formDataObj
  })

  console.log({ addNote })

  return addNote;
}



export const updateNote = async ({ params, request }) => {
  const updatedNote = await request.formData();
  const formDataObj = {};
  updatedNote.forEach((value, key) => (formDataObj[key] = value));

  console.log({ updatedNote, formDataObj });
  const query = `mutation Mutation($id: String!, $content: String!) {
      updateNote(id: $id, content: $content) {
        id
        content
      }
    }`;

  const { updateNote } = await graphQLRequest({
    query,
    variables: formDataObj
  })

  console.log({ updateNote })

  return updateNote;
}
export const deleteNote = async ({ params: { noteId } }) => {
  const query = `
  mutation DeleteNote($noteId: ID!) {
    deleteNote(noteId: $noteId) {
      id
      content
    }
  }
`;

  // Replace 'yourNoteId' with the actual ID of the note you want to delete
  const variables = { noteId: 'yourNoteId' };

  const { deleteNote } = await graphQLRequest({
    query: deleteNoteMutation,
    variables,
  });

  console.log('Deleted note:', deleteNote);
};