import fakeData from "../fakeData/index.js";
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js"

export const resolvers = {
    Query: {
        folders: async (parent, args, context) => {
            const folders = await FolderModel.find({
                authorId: context.uid,
            }).sort({
                updatedAt: 'desc',
            });
            console.log({ folders, context });
            return folders;
        },
        folder: async (parent, args) => {
            const folderId = args.folderId;
            console.log({ folderId });
            const foundFolder = await FolderModel.findById(folderId);
            return foundFolder;
        },
        note: async (parent, args) => {
            const noteId = args.noteId;
            const note = await NoteModel.findById(noteId);
            return note;
        },
    },

    Folder: {
        author: async (parent, args) => {
            const authorId = parent.authorId;
            const author = await AuthorModel.findOne({
                uid: authorId,
            });
            return author;
        },
        notes: async (parent, args) => {
            console.log({ parent });
            const notes = await NoteModel.find({
                folderId: parent.id,
            }).sort({
                updatedAt: 'desc',
            });
            console.log({ notes });
            return notes;
        },
    },
    Mutation: {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({ ...args, authorId: context.uid });
            console.log({ newFolder });
            pubsub.publish('FOLDER_CREATED', {
                folderCreated: {
                    message: 'Một thư mục mới đã được tạo',
                },
            });
            await newFolder.save();
            return newFolder;
        },
        register: async (parent, args) => {
            const foundUser = await AuthorModel.findOne({ uid: args.uid });

            if (!foundUser) {
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }

            return foundUser;
        },
    }
}
