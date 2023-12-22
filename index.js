import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userLogin } from "./routes/users.js"
import { createNote, getNotes, getSingleNote, deleteSingleNote, updateNote, searchNote} from "./routes/notes.js"
import { createTask, getTasks, updateTask, deleteTask } from "./routes/tasks.js"
import { addFile, getFiles, deleteFile } from "./routes/files.js"

const app = express()
app.use(cors({
    origin: ['http://localhost:1234/', 'https://65856caf3098fab4bad5c02f--calm-cucurucho-4441a9.netlify.app'],                 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'XMLHttpRequest'],
  }));

app.use(cookieParser()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('uploads'))

const port = process.env.PORT || 3300
app.get('/', (req, res)=>{
    res.send('hello world')
})

app.post('/googleauth', userLogin)
app.post('/createnote', createNote)
app.get('/getnotes', getNotes)
app.get('/notes/:id', getSingleNote)
app.delete('/notes/deletenote/:id', deleteSingleNote)
app.post('/notes/updatenote/:id', updateNote)
app.get('/search', searchNote)

app.post('/createtask', createTask)
app.post('/updatetask/:id', updateTask)
app.get('/gettasks/', getTasks)
app.delete('/deletetask/:id', deleteTask)

app.post('/uploadfile', addFile)
app.get('/getfiles', getFiles)
app.delete('/deletefiles/:id', deleteFile)

app.listen(port)