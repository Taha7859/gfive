import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value;
    console.log("Token from cookie:", token);

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    if (!decoded || typeof decoded.id !== "string") return null;

    return decoded.id;
  } catch (err) {
    console.error("getDataFromToken error:", err);
    return null;
  }
};
