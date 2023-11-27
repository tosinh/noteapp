import { Box, Card, CardContent, List, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import NewFolder from './NewFolder';


export default function FolderList({ folders }) {
    const { folderId } = useParams()

    console.log({ folderId })
    // const { folderId } = useParams()

    // console.log({ folderId })
    const [activeFolderTd, setActiveFolderId] = useState(folderId)


    useEffect(() => {
        setActiveFolderId(folderId);
    }, [folderId])

    return (
        <List sx={{
            width: '100%',
            bgcolor: '#fff',
            height: '100%',
            padding: '10px',
            textAlign: 'left',
            overflowY: 'auto'
        }}
            subheader={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 'bold', color: '#000' }}>
                        Folders
                    </Typography>
                    <NewFolder />

                </Box>
            }
        >
            {folders && folders.map(({ id, name }) => {
                return (
                    <Link
                        key={id}
                        to={`folders/${id}`}
                        style={{ textDecoration: 'none', }}
                        onClick={() => setActiveFolderId(id)}
                    >
                        <Card sx={{ mb: '5px', backgroundColor: id === activeFolderTd ? 'rgb(255 211 140)' : null }}>
                            <CardContent sx={{ '&:last-child': { pb: '10px' }, padding: '10px' }}>
                                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </List>
    );
}
