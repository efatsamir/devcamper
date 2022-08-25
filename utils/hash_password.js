import  bcrypt  from 'bcryptjs';
import config from './../config/config.js';
const { SALT_ROUNDS } = config;



const hash_password = async (password) => {

  // const salt = SALT_ROUNDS;
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  return hashed_password;

}

export default hash_password;