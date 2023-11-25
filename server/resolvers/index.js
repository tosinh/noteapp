import fakeData from "../fakeData/index.js";
import { FolderModel } from "../models/index.js"

export const resolvers = {
    Query: {
        folders: async () => {
            const folders = await FolderModel.find();
            return folders
        },
        folder: (parent, args) => {
            const folderId = args.folderId
            console.log({ folderId })
            return fakeData.folders.find((folder) => folder.id === folderId)
        },
        note: (parent, args) => {
            const noteId = args.noteId
            return fakeData.notes.find((note) => note.id === noteId)
        }
    },

    Folder: {
        author: (parent, args) => {
            // console.log({ parent, args })
            const authorId = parent.authorId
            return fakeData.authors.find((author) => author.id === authorId)
            // return { id: '1', name: 'sinh' }
        },
        notes: (parent, args) => {
            console.log({ parent })
            return fakeData.notes.filter((note) => note.folderId === parent.id)
        }
    },
    Mutation: {
        createFolder: async (parent, args) => {
            const newFolder = new FolderModel(...args, authorId);
            console.log({ newFolder });
            await newFolder.save();
            return newFolder;
        },
    }
}