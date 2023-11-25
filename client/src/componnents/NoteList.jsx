import { Box, Card, CardContent, Grid, List, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, Outlet, useParams, useLoaderData } from 'react-router-dom';

export default function NoteList() {
    const { noteId } = useParams()
    const [activeNoteId, setActiveNoteId] = useState(noteId)
    const { folder } = useLoaderData()

    console.log('[NoteList]', { folder })

    // const folder = { notes: [{ id: '1', content: '<p>This is a new note</p>' }] }
    return (
        <Grid container height={'100%'}>
            <Grid item xs={4} sx={{ width: '100%', maxWidth: 360, bgcolor: '#fff', height: '100%', overflowY: 'auto', padding: '10px', textAlign: 'left' }}>
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

                        </Box>
                    }
                >
                    {
                        folder.notes.map(({ id, content }) => {
                            return (<Link
                                key={id}
                                to={`note/$id`}
                                style={{
                                    textDecoration: 'none'
                                }}
                                onClick={() => setActiveNoteId(id)}>
                                <Card sx={{ mb: '5px', backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null }}>
                                    <CardContent sx={{ '&:last-child': { pb: '10px' }, padding: '10px' }}>
                                        <div style={{ fontSize: 14, fontWeight: 'bold' }}
                                            dangerouslySetInnerHTML={{ __html: `${content.substring(0, 30) || 'Empty'}` }}></div>
                                    </CardContent>
                                </Card>
                            </Link>)
                        })
                    }
                </List>
            </Grid>
            <Grid item xs={8}><Outlet /></Grid>
        </Grid>
    )
}
