import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Avatar, Menu, MenuItem, Typography, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

export default function UserMenu() {
    const { user: { displayName, photoURL, auth } } = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    // console.log({user})

    const handleLogout = () => {
        auth.signOut()

    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handelClick = (e) => {
        setAnchorEl(e.currentTarget)
    }
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handelClick}>
                <Typography variant="body1" sx={{ marginLeft: '8px', fontWeight: 'bold' }}>{displayName}</Typography>
                <Avatar alt='avatar' src={photoURL} sx={{ width: 32, height: 32, marginLeft: '5px' }} />
            </Box>
            {/* <IconButton onClick={handelClick} size="large" sx={{ color: 'white' }}>
                <Avatar alt='avatar' src={photoURL} sx={{ width: 32, height: 32 }} />
            </IconButton> */}
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleLogout}>
                    <ExitToAppIcon sx={{ marginRight: '8px' }} />
                    Log Out
                </MenuItem>
            </Menu>
        </>
    )
}
