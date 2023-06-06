const bcrypt = require('bcrypt')

export async function hashPass(password: string) {
    return await bcrypt.hash(password, 10).then(function (hash: string) {
        return hash
    })
}

export async function checkPass(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword).then(function(result: boolean) {
        return result
    })
}