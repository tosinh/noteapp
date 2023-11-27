import React, { useEffect, useState, useMemo } from 'react'
import { convertToRaw, ContentState, EditorState, convertFromHTML } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { useLoaderData, useSubmit, useLocation } from 'react-router-dom'
import { debounce } from '@mui/material'

export default function Note() {
    const { note } = useLoaderData();
    const submit = useSubmit();
    const location = useLocation();
    const [editorState, setEditorState] = useState(() => {
        return EditorState.createEmpty();
    });

    const [rawHTML, setRawHTML] = useState(note.content);

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(note.content);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(state));
    }, [note.id]);

    console.log({ location })

    useEffect(() => {
        debouncedMemorized(rawHTML, note, location.pathname);
    }, [rawHTML, location.pathname]);

    const debouncedMemorized = useMemo(() => {
        return debounce((rawHTML, note, pathname) => {
            if (rawHTML === note.content) return;

            submit({ ...note, content: rawHTML }, {
                method: 'post',
                action: pathname
            })
        }, 1000);
    }, []);

    useEffect(() => {
        setRawHTML(note.content)
    }, [note.content])
    const handleOnChange = (e) => {
        setEditorState(e)
        setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
    }

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={handleOnChange}
            placeholder='Viết gì bạn muốn'>
        </Editor>
    )
}
