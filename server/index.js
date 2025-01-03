const http = require('http')
const express = require('express')
const fs = require('fs/promises')
const { Server: SocketServer } = require('socket.io')
const path = require('path')
const cors = require('cors')
const chokidar = require('chokidar');

const pty = require('node-pty')

const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
    env: process.env
});

const app = express()
const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
})

app.use(cors())

io.attach(server);

chokidar.watch('./user').on('all', (event, path) => {
    io.emit('file:refresh', path)
});

ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})

// Sanitize file paths
function sanitizePath(userPath) {
  // Prevent directory traversal attacks
  const normalizedPath = path.normalize(userPath).replace(/^(\.\.(\/|\\|$))+/, '');
  return normalizedPath;
}

io.on('connection', (socket) => {
    console.log(`Socket connected`, socket.id)

    socket.emit('file:refresh')

    socket.on('file:change', async ({ path, content }) => {
        try {
            const sanitizedPath = sanitizePath(path);
            const filePath = path.join('./user', sanitizedPath);

            // Check if file path is within allowed directory
            if (!filePath.startsWith(path.resolve('./user'))) {
                throw new Error('Access denied');
            }

            await fs.writeFile(filePath, content);
        } catch (error) {
            console.error('Error writing file:', error);
        }
    })

    socket.on('terminal:write', (data) => {
        console.log('Term', data)
        ptyProcess.write(data);
    })
})

app.get('/files', async (req, res) => {
    const fileTree = await generateFileTree('./user');
    return res.json({ tree: fileTree })
})

app.get('/files/content', async (req, res) => {
    try {
        const sanitizedPath = sanitizePath(req.query.path);
        const filePath = path.join('./user', sanitizedPath);
        
        // Check if file exists and is within allowed directory
        if (!filePath.startsWith(path.resolve('./user'))) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const content = await fs.readFile(filePath, 'utf-8');
        return res.json({ content });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to read file' });
    }
})

server.listen(9000, () => console.log(`🐳 Docker server running on port 9000`))


app.get("/", (req, res) =>{
    res.json({
        message: "Hello from server"
    })
})

async function generateFileTree(directory) {
    const tree = {}

    async function buildTree(currentDir, currentTree) {
        const files = await fs.readdir(currentDir)

        for (const file of files) {
            const filePath = path.join(currentDir, file)
            const stat = await fs.stat(filePath)

            if (stat.isDirectory()) {
                currentTree[file] = {}
                await buildTree(filePath, currentTree[file])
            } else {
                currentTree[file] = null
            }
        }
    }

    await buildTree(directory, tree);
    return tree
}