export const GET_VIRTUALSHELVES = 'GET_VIRTUALSHELVES'
export const ADD_VIRTUALSHELF = 'ADD_VIRTUALSHELF'
export const UPDATE_VIRTUALSHELF = 'UPDATE_VIRTUALSHELF'
export const DELETE_VIRTUALSHELF = 'DELETE_VIRTUALSHELF'

export function getVirtualshelves() {
    return {
        type: GET_VIRTUALSHELVES,
        payload: async() => {
            const response = await fetch(`/virtualshelves`)
            const data = response.json()
            return data
        }
    }
}

export function addVirtualshelf(virtualshelf) {
    return {
        type: ADD_VIRTUALSHELF,
        payload: async() => {
            let response = await fetch(`/virtualshelves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(virtualshelf)
            })
            response = await fetch(`/virtualshelves`)
            let data = response.json()
            return data
        }
    }
}

export function updateVirtualshelf(virtualshelfId, virtualshelf) {
    return {
        type: UPDATE_VIRTUALSHELF,
        payload: async() => {
            await fetch(`/virtualshelves/${virtualshelfId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(virtualshelf)
            })
            let response = await fetch(`/virtualshelves`)
            let json = response.json()
            return json
        }
    }
}

export function deleteVirtualshelf(virtualshelfId) {
    return {
        type: DELETE_VIRTUALSHELF,
        payload: async() => {
            await fetch(`/virtualshelves/${virtualshelfId}`, {
                method: 'DELETE'
            })
            let response = await fetch(`/virtualshelves`)
            let json = response.json()
            return json
        }
    }
}