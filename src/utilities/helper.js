import bcrypt, { hash } from 'bcrypt';
const saltRounds = 10;

const hashUserPassWord = async (passWord) => {
    const hash = await bcrypt.hash(passWord, saltRounds)
        .catch((err) => Error(`Error hash is :: ${err}`));
    return hash;
}

const compareHashPassWord = async (passWord, hash) => {
    const comper = await bcrypt.compare(passWord??'', hash??'null');
    if (comper){
        return true;
    }
    return false;
}

const helperMehtod = { hashUserPassWord, compareHashPassWord }

export default helperMehtod;