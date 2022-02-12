import { combineReducers } from 'redux'
import virtualshelf from './virtualshelf-reducer'
import book from './book-reducer'

export default combineReducers({
    virtualshelf,
    book
})