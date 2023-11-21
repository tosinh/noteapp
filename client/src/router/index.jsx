import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import AuthProvider from "../context/AuthProvider";
import ProtectedRouter from "./ProtectedRouter";

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
                        path: '/'
                    }
                ]
            }
            // {
            //     element: <Home />,
            //     path: '/'
            // }
        ]
    }
])