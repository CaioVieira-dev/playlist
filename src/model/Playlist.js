const Database = require('../db/config')

//playlist: ["bGwL06dBWlA", "oiIzKjDQACY", "UWkXo5XMTP4"]

module.exports = {
    //Create
    async create(newVideo) {
        const db = await Database();

        db.run(`INSERT INTO playlist (
            title,
            link
            ) VALUES (
                "${newVideo.title}",
                "${newVideo.link}"
            )`);

        await db.close();

    },
    //Read
    async get() {
        const db = await Database();

        const data = await db.all(`SELECT * FROM playlist`);

        await db.close();

        return data;
    },
    //Update
    async update(newData, id) {
        const db = await Database();

        await db.run(`UPDATE playlist SET
            title = "${newData.title}",
            link = "${newData.link}"
            WHERE id = ${id}
        `);

        await db.close();
    },
    //Delete
    async delete(id) {
        const db = await Database();

        await db.run(`DELETE FROM playlist WHERE id = ${id}`);

        await db.close();
    }

}