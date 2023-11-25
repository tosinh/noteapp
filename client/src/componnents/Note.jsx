import React, { useEffect, useState } from 'react'
import { convertToRaw, ContentState, EditorState, convertFromHTML } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { useLoaderData } from 'react-router-dom'

export default function Note() {
    // const { note } = useLoaderData();
    const note = {
        id: '1',
        content: '123'
    }

    const [editorState, setEditorState] = useState(() => {
        return EditorState.createEmpty()
    })

    const [rawHTML, setRawHTMl] = useState(note.content)

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(note.content);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(state));
    }, [note.id]);

    useEffect(() => {
        setRawHTMl(note.content)
    }, [note.content])
    const handleOnChange = (e) => {
        setEditorState(e)
        setRawHTMl(draftToHtml(convertToRaw(e.getCurrentContent())))
    }

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={handleOnChange}
            placeholder='Viết gì bạn muốn'>
        </Editor>
    )
}
