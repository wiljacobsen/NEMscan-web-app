import { NextResponse } from "next/server";
import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name, company } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashSync(password, 10),
        name: name || null,
        company: company || null,
        role: "VIEWER",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
