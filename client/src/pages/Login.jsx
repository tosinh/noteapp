import React, { useContext } from 'react'
import { Typography, Button, Container, Grid, Paper } from '@mui/material'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { AuthContext } from '../context/AuthProvider'
import { useNavigate, Navigate } from 'react-router-dom'
import { graphQLRequest } from '../utils/request'

export default function Login() {
    const auth = getAuth()
    // const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()

        const { user: { uid, displayName } } = await signInWithPopup(auth, provider)
        const { data } = await graphQLRequest({
            query: `mutation register($uid: String!, $name: String!) {
            register(uid: $uid, name: $name) {
                uid
                name
            }
        }`,
            variables: {
                uid,
                name: displayName,
            },
        })
        console.log('register', { data })
    }

    if (localStorage.getItem('accessToken')) {
        return <Navigate to="/" />
    }
    return (
        <>
            <Container component="main" maxWidth="xs">
                <Paper elevation={3} style={{ padding: '20px', textAlign: 'center', marginTop: '64px' }}>
                    <Typography variant='h4' gutterBottom>
                        Welcome to the Note App
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={handleLoginWithGoogle}
                        style={{ marginTop: '20px', padding: '10px 20px' }}
                    >
                        Login with Google
                    </Button>
                </Paper>
            </Container>
        </>
    )
}