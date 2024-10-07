/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SECRET_KEY);

export async function encrypt(payload: {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function login(formData: FormData) {
  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  if (user.password === "asikbxkajsbnkasxa" && user.username === "ruby") {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const session = await encrypt(user);

    cookies().set("session", session, { expires, httpOnly: true });
  }
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
