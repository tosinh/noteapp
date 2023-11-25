export default {
    authors: [
        {
            id: 1,
            name: 'sinh'
        },
        {
            id: 2,
            name: 'sing'
        }
    ],
    folders: [
        {
            id: '1',
            name: 'Home',
            createdAt: '2023-11-17',
            authorId: 1,
        },
        {
            id: '2',
            name: 'Home',
            createdAt: '2023-11-17',
            authorId: 2,
        },
        {
            id: '3',
            name: 'Home',
            createdAt: '2023-11-17',
            authorId: 1,
        },
    ],
    notes: [
        {
            id: '1',
            content: '<p>Go to đi ngủ</p>',
            folderId: '1'
        },
        {
            id: '2',
            content: '<p>Go to đi nghỉ ngơi</p>',
            folderId: '2'
        },
        {
            id: '3',
            content: '<p>Go to đi về nhà</p>',
            folderId: '2'
        },
    ]
}