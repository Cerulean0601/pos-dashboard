// export const config = {
//   runtime: 'nodejs', // this is a pre-requisite
// };
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Vercel!' });
}
