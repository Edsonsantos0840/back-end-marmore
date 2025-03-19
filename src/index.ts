import color  from "colors"
import server from "./server"
import 'dotenv/config'
const port  = process.env.PORT || 4000

server.listen(port, () => console.log(color.blue.bold.italic(`Servidor rodando na porta ${port}`)))