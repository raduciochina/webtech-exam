const config = require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { DataTypes } = require('sequelize');
const Sequelize = require('sequelize')
const path = require('path')
const Op = Sequelize.Op
const cors = require('cors')
let sequelize

if (process.env.MODE === 'development') {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'database.db',
        define: {
            timestamps: false
        }
    })
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
}


// Entities

const VirtualShelf = sequelize.define('virtualshelf', {
    description:{
        type: DataTypes.STRING,     
        validate: {
            len: [3, 200]
        }
    },
    date:{
        type: DataTypes.DATEONLY,
        allowNull: false
    }
})

const Book = sequelize.define('book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate :{
            len: [5,200]
        }
    },
    genre: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["COMEDY","TRAGEDY","DRAMA","ACTION"]
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

VirtualShelf.hasMany(Book)


const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'build')))


app.get('/sync', async(req, res) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})



app.get('/virtualshelves', async(req, res) => {
    try {
        const query = {}
        let pageSize = 2
        const allowedFilters = ['description' ,'date']
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
        if (filterKeys.length > 0) {
            query.where = {}
            for (const key of filterKeys) {
                query.where[key] = {
                    [Op.like]: `%${req.query[key]}%`
                }
            }
        }

        const sortField = req.query.sortField
        let sortOrder = 'ASC'
        if (req.query.sortOrder && req.query.sortOrder === '-1') {
            sortOrder = 'DESC'
        }

        if (req.query.pageSize) {
            pageSize = parseInt(req.query.pageSize)
        }

        if (sortField) {
            query.order = [
                [sortField, sortOrder]
            ]
        }

        if (!isNaN(parseInt(req.query.page))) {
            query.limit = pageSize
            query.offset = pageSize * parseInt(req.query.page)
        }

        const records = await VirtualShelf.findAll(query)
        const count = await VirtualShelf.count()
        res.status(200).json({ records, count })
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.post('/virtualshelves', async(req, res) => {
    try {
        if (req.query.bulk && req.query.bulk === 'on') {
            await VirtualShelf.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        } else {
            await VirtualShelf.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/virtualshelves/:id', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualshelf) {
            res.status(200).json(virtualshelf)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/virtualshelves/:id', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.id)
        if (virtualshelf) {
            await virtualshelf.update(req.body, { fields: ['description', 'date'] })
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.delete('/virtualshelves/:id', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.id, { include: Book })
        if (virtualshelf) {
            await virtualshelf.destroy()
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})



app.get('/virtualshelves/:vid/books', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualshelf) {
            const books = await virtualshelf.getBooks()

            res.status(200).json(books)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/virtualshelves/:vid/books/:bid', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualshelf) {
            const books = await virtualshelf.getBooks({ where: { id: req.params.bid } })
            res.status(200).json(books.shift())
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.post('/virtualshelves/:vid/books', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualshelf) {
            const book = req.body
            book.virtualshelfId = virtualshelf.id
            console.warn(book)
            await Book.create(book)
            res.status(201).json({ message: 'created' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/virtualshelves/:vid/books/:bid', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualshelf) {
            const books = await virtualshelf.getBooks({ where: { id: req.params.bid } })
            const book = books.shift()
            if (book) {
                await book.update(req.body)
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(404).json({ message: 'not found' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.delete('/virtualshelves/:vid/books/:bid', async(req, res) => {
    try {
        const virtualshelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualshelf) {
            const books = await virtualshelf.getBooks({ where: { id: req.params.bid } })
            const book = books.shift()
            if (book) {
                await book.destroy(req.body)
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(404).json({ message: 'not found' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})




app.listen(process.env.PORT, async() => {
    await sequelize.sync({ alter: true })
})