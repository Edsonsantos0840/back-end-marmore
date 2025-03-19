import bcypt from 'bcrypt'

export const hashPassword = async (password: string) => {
   const salt = await bcypt.genSalt(10)
   return await bcypt.hash(password, salt)
}

export const checkPassword = async (enterPassword: string, hash: string) => {
   return await bcypt.compare(enterPassword, hash)
   
}