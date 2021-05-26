const Database = require("./config")

const initDb = {
    async init() {   //sempre que for usar await, ele tem que estar dentro de uma 
        //função async (assincrona)
        const db = await Database()  //iniciar a conexão com o banco de dados
        //a cont db pega or resultado da inicialização(a conexão)
        //await para fazer o codigo esperar o banco de dados terminar de abrir
        //antes de continuar o codigo para nao bugar o resto do codigo
        await db.exec(`CREATE TABLE playlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    link TEXT
        )`)

        await db.run(`INSERT INTO playlist (
    title,
    link
    ) VALUES (
    "【東方Eurobeat ENG SUBS】Our Desires【A-ONE】",
    'https://www.youtube.com/watch?v=bGwL06dBWlA'
        )`)
        await db.run(`INSERT INTO playlist (
            title,
            link
            ) VALUES (
            "【東方Eurobeat ENG SUBS】On The Moon【A-ONE】",
            'https://www.youtube.com/watch?v=hAy-1NraoR4'
                )`)
        await db.run(`INSERT INTO playlist (
                    title,
                    link
                    ) VALUES (
                    "【東方Eurobeat ENG SUB】Don't Break Me Down (REVIVAL MIX ver.)【A-ONE】",
                    'https://www.youtube.com/watch?v=HkATSm-PV0o'
                        )`)
        await db.close()    //terminar connexão

    }

}

initDb.init()