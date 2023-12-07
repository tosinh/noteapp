import { NoteAddOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, IconButton, List, Tooltip, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useParams, useLoaderData, useSubmit, useNavigate } from 'react-router-dom';
import moment from 'moment'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export default function NoteList() {
    const { noteId, folderId } = useParams();
    const [activeNoteId, setActiveNoteId] = useState(noteId);
    const { folder } = useLoaderData();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteNoteId, setDeleteNoteId] = useState(null);
    const submit = useSubmit();
    const navigate = useNavigate();

    console.log('[NoteLIST]', { folder });

    useEffect(() => {
        if (noteId) {
            setActiveNoteId(noteId);
            return;
        }

        if (folder?.notes?.[0]) {
            navigate(`note/${folder.notes[0].id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [noteId, folder.notes]);

    const handleAddNewNote = () => {
        submit(
            {
                content: '',
                folderId,
            },
            { method: 'post', action: `/folders/${folderId}` }
        );
    };

    const handleDeleteNote = (noteId) => {
        setDeleteNoteId(noteId);
        setOpenDeleteDialog(true);
    };
    const handleCancelDelete = () => {
        // Close the delete confirmation dialog without performing the delete action
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = () => {
        submit(
            null,
            { method: 'delete', action: `/notes/${deleteNoteId}` } // Corrected action to delete a note
        );

        // Close the delete confirmation dialog
        setOpenDeleteDialog(false);
    };



    // const folder = { notes: [{ id: '1', content: '<p>This is a new note</p>' }] }
    return (
        <Grid container height='100%'>
            <Grid
                item
                xs={4}
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: '#fffs',
                    height: '100%',
                    overflowY: 'auto',
                    padding: '10px',
                    textAlign: 'left',
                }}
            >
                <List
                    subheader={
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold' }}>Notes</Typography>
                            <Tooltip title='Add Note' onClick={handleAddNewNote}>
                                <IconButton size='small'>
                                    <NoteAddOutlined />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    }
                >
                    {folder.notes.map(({ id, content, updatedAt }) => {
                        return (
                            <Link
                                key={id}
                                to={`note/${id}`}
                                style={{ textDecoration: 'none' }}
                                onClick={() => setActiveNoteId(id)}
                            >
                                <Card
                                    sx={{
                                        mb: '5px',
                                        backgroundColor:
                                            id === activeNoteId ? '#DCDCDC' : null,
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <CardContent
                                        sx={{ '&:last-child': { pb: '10px' }, padding: '10px' }}
                                    >
                                        <div
                                            style={{ fontSize: 14, fontWeight: 'bold' }}
                                            dangerouslySetInnerHTML={{
                                                __html: `${content.substring(0, 30) || 'Empty'}`,
                                            }}
                                        />
                                        <Typography sx={{ fontSize: '10px' }}>
                                            {moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                                        </Typography>
                                    </CardContent>
                                    <IconButton
                                        sx={{
                                            visibility: id === activeNoteId ? 'visible' : 'hidden'
                                        }}
                                        onClick={() => handleDeleteNote(id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Card>
                            </Link>
                        );
                    })}
                </List>
            </Grid>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this note?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid item xs={8}>
                <Outlet />
            </Grid>
        </Grid>
    );
}
