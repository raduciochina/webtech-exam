export const GET_BOOKS = "GET_BOOKS";
export const ADD_BOOK = "ADD_BOOK";
export const UPDATE_BOOK = "UPDATE_BOOK";
export const DELETE_BOOK = "DELETE_BOOK";

export function getBooks(virtualshelfId) {
    return {
        type: GET_BOOKS,
        payload: async() => {
            const response = await fetch(`/virtualshelves/${virtualshelfId}/books`)
            const data = response.json()
            return data
        }
    }
}

export function addBook(virtualshelfId, book) {
    return {
        type: ADD_BOOK,
        payload: async() => {
            let response = await fetch(`/virtualshelves/${virtualshelfId}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            })
            response = await fetch(`/virtualshelves/${virtualshelfId}/books`)
            let data = response.json()
            return data
        }
    }
}

export function updateBook(virtualshelfId, bookId, book) {
    return {
        type: UPDATE_BOOK,
        payload: async() => {
            await fetch(`/virtualshelves/${virtualshelfId}/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            })
            let response = await fetch(`/virtualshelves/${virtualshelfId}/books`)
            let json = response.json()
            return json
        }
    }
}

export function deleteBook(virtualshelfId, bookId) {
    return {
        type: DELETE_BOOK,
        payload: async() => {
            await fetch(`/virtualshelves/${virtualshelfId}/books/${bookId}`, {
                method: 'DELETE'
            })
            let response = await fetch(`/virtualshelves/${virtualshelfId}/books`)
            let json = response.json()
            return json
        }
    }
}
