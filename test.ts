function repeatDetector(password: string) {
    for(let i = 1; i < password.length; i++){
        if (password[i] != password[i - 1]) {
            return false
        }
    }
    return true
}
let a = '1111111112'

console.log(repeatDetector(a))