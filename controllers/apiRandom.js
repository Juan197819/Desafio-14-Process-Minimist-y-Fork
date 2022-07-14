import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiRandom = (req, res) => {
    const cant = req.query.cant
    const secun = fork(__dirname + '/childProcess.js')
    secun.send(`${cant}`)
    secun.on('message', objet=>{
        res.send(objet);
    })
}
export default apiRandom
