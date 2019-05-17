
class BaseRepository {
    async queryInsert(db, query, data) {
        // const result = new Promise((resolve, reject) => {
        //     // db.run(query, data, function callback(err) {
        //     //     if (err) reject(err)
        //     //     resolve(this)
        //     // })
        // })
        const result = await new Promise((resolve, reject) => {
            const stmt = db.prepare(query)
            stmt.run(data, function callback(err) {
                if (err) reject(err)
                resolve(this)
            })
            stmt.finalize()
        })
        return result
    }

    querySelect(db, query, condition) {
        const result = new Promise((resolve, reject) => {
            db.all(query, condition, function(err, rows) {
                if (err) reject(err)
                resolve(rows)
            })
        })
        return result
    }
}

module.exports = BaseRepository