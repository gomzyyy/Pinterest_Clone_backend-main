// import bcrypt from "bcryptjs";
// export const hashPassword = async (t) => {
//   try {
//     if (!t) return;
//     const a = await bcrypt.hash(t, process.env.SALT);
//   } catch (e) {
//     return e;
//   }
// };
// export const verifyPassword = async (t, s) => {
//   try {
//     if (!t || !s) return;
//     const a = await bcrypt.compare(t, s);
//     return a;
//   } catch (e) {
//     return e;
//   }
// };
