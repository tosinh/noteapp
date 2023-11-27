import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import AuthProvider from "../context/AuthProvider";
import ProtectedRouter from "./ProtectedRouter";
import NoteList from '../componnents/NoteList'
import Note from "../componnents/Note";
import { foldersLoader } from '../utils/folderUtils'
import { addNewNote, noteLoader, notesLoader } from '../utils/noteUtils'

const AuthLayout = () => {
    return <AuthProvider><Outlet /></AuthProvider>
}
export default createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <Login />,
                path: '/login'
            },
            {
                element: <ProtectedRouter />,
                children: [
                    {
                        element: <Home />,
                        path: '/',
                        loader: foldersLoader,
                        children: [
                            {
                                element: <NoteList />,
                                path: `folders/:folderId`,
                                action: addNewNote,
                                loader: notesLoader,
                                children: [
                                    {
                                        element: <Note />,
                                        path: `note/:noteId`,
                                        loader: noteLoader,
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
])