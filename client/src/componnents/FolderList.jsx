import { Box, Card, CardContent, Hidden, IconButton, List, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import NewFolder from './NewFolder';
import { Block } from '@mui/icons-material';
import { deleteFolder } from '../utils/folderUtils';


export default function FolderList({ folders, onDeleteFolder }) {
    const { folderId } = useParams();
    console.log({ folderId });
    const [activeFolderId, setActiveFolderId] = useState(folderId);

    const handleDeleteFolder = async (id) => {
        try {
            const result = await deleteFolder(id);

            if (result.success) {
                // Update the UI to reflect the deletion
                onDeleteFolder(id);
                // Optionally, you can update the active folder ID or perform other actions
            } else {
                console.error('Failed to delete folder.');
                // Handle the failure to delete the folder, e.g., show an error message
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            // Handle the error as needed
        }
    }
    return (
        <List
            sx={{
                width: '100%',
                bgcolor: '#fff',
                height: '100%',
                padding: '10px',
                textAlign: 'left',
                overflowY: 'auto',
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
            {folders.map(({ id, name }) => {
                return (
                    <Link
                        key={id}
                        to={`folders/${id}`}
                        style={{
                            textDecoration: 'none',
                        }}
                        onClick={() => setActiveFolderId(id)}
                    >
                        <Card
                            sx={{
                                mb: '5px',
                                backgroundColor:
                                    id === activeFolderId ? '#DCDCDC' : null,
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}
                        >
                            <CardContent
                                sx={{
                                    '&:last-child': { pb: '10px' },
                                    padding: '10px',

                                }}
                            >
                                <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>{name}</Typography>

                            </CardContent>
                            <IconButton
                                sx={{
                                    visibility: id === activeFolderId ? 'visible' : 'hidden'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(id);
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Link>
                );
            })}
        </List >
    );
}
