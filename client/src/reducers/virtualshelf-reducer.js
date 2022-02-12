const INITIAL_STATE = {
    virtualshelfList: [],
    error: null,
    fetching: false,
    fetched: false
}

export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'GET_VIRTUALSHELVES_PENDING':
        case 'ADD_VIRTUALSHELF_PENDING':
        case 'UPDATE_VIRTUALSHELF_PENDING':
        case 'DELETE_VIRTUALSHELF_PENDING':
            return {...state, error: null, fetching: true, fetched: false }
        case 'GET_VIRTUALSHELVES_FULFILLED':
        case 'ADD_VIRTUALSHELF_FULFILLED':
        case 'UPDATE_VIRTUALSHELF_FULFILLED':
        case 'DELETE_VIRTUALSHELF_FULFILLED':
            return {...state, virtualshelfList: action.payload.records, fetching: false, fetched: true }
        case 'GET_VIRTUALSHELVES_REJECTED':
        case 'ADD_VIRTUALSHELF_REJECTED':
        case 'UPDATE_VIRTUALSHELF_REJECTED':
        case 'DELETE_VIRTUALSHELF_REJECTED':
            return {...state, error: action.payload.records, fetching: false, fetched: false }
        default:
            return state
    }
}