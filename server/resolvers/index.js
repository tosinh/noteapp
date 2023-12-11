import fakeData from "../fakeData/index.js";
import { GraphQLScalarType } from 'graphql'
import { AuthorModel, NoteModel, FolderModel } from "../models/index.js"
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        parseValue(value) {
            return new Date(value);
        },
        serialize(value) {
            return value.toISOString();
        },
    }),
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
            // return fakeData.notes.find((note) => note.id === noteId);
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
            // return fakeData.notes.filter((note) => note.folderId === parent.id);
        },
    },
    Mutation: {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({ ...args, authorId: context.uid });
            console.log({ newFolder });
            pubsub.publish('FOLDER_CREATED', {
                folderCreated: {
                    message: 'A new folder created',
                },
            });
            await newFolder.save();
            return newFolder;
        },
        deleteFolder: async (parent, args) => {
            const folderId = args.id;

            try {
                const deletedFolder = await FolderModel.findByIdAndDelete(folderId);

                if (!deletedFolder) {
                    throw new Error('Folder not found or unable to delete.');
                }

                pubsub.publish('FOLDER_DELETED', {
                    folderDeleted: {
                        message: 'A folder was deleted',
                    },
                });

                return { success: true };
            } catch (error) {
                console.error('Error deleting folder:', error);
                throw error;
            }
        },
        deleteNote: async (_, { noteId }) => {
            try {
                // Find the note by ID
                const deletedNote = await Note.findByIdAndRemove(noteId);

                // Check if the note was found and deleted
                if (!deletedNote) {
                    throw new Error('Note not found or unable to delete');
                }

                return deletedNote;
            } catch (error) {
                console.error('Error deleting note:', error);
                throw error;
            }
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
        pushNotification: async (parent, args) => {
            const newNotification = new NotificationModel(args);

            pubsub.publish('PUSH_NOTIFICATION', {
                notification: {
                    message: args.content,
                },
            });

            await newNotification.save();
            return { message: 'SUCCESS' }
        },

    },
    Subscription: {
        folderCreated: {
            subscribe: () => pubsub.asyncIterator(['FOLDER_CREATED', 'NOTE_CREATED']),
        },
        notification: {
            subscribe: () => pubsub.asyncIterator(['PUSH_NOTIFICATION'])
        },
        folderDeleted: {
            subscribe: () => pubsub.asyncIterator(['FOLDER_DELETED']),
        },
        noteDeleted: {
            subscribe: () => pubsub.asyncIterator(['NOTE_DELETED']),
        },
    },
}
