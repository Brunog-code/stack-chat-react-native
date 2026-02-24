import jwt from "jsonwebtoken";

interface IGenerateTokenprops {
  id: string;
  name: string;
  email: string;
}

export const generateToken = ({ email, id, name }: IGenerateTokenprops) => {
  const SECRET_KEY = process.env.JWT_SECRET as string;

  return jwt.sign(
    {
      name,
      email,
    },
    SECRET_KEY,
    { subject: id, expiresIn: "30d" },
  );
};
