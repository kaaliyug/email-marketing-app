import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import { generateToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const registerUser = async ( data: RegisterInput ) => {
    const existingUser = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (existingUser) {
        throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    });

    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};

export const loginUser = async ( data: LoginInput ) => {
     const user = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

     const isPasswordCorrect = await bcrypt.compare(
        data.password,
        user.password
    );

     if (!isPasswordCorrect) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
       },
    };
};
