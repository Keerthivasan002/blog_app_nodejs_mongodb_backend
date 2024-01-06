import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//register
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.send({ status: 0, response: "All fields are mandatory" });
        }

        const validUser = await userModel.findOne({ email });
        if (validUser) {
            return res.send({ status: 0, response: "Already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        return res.send({ status: 1, response: "User registered successfully" })
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
};//try catch is mainly used for error handling
//login
//check pass ad id
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send({ status: 0, response: "All fields are mandatory" });
        }
        const User = await userModel.findOne({ email: email });
        if (User == null) {

            return res.send({ status: 0, response: "No user found" })
        }
        if (await bcrypt.compare(password, User.password) === true) {
            const accessToken = jwt.sign({
                User: {
                    username: User.username,
                    email: User.email,
                    id: User._id,
                },
            },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "2h" }
            );
            return res.send({ status: 1, response: "Login successfull", accessToken, username: User.username });
        }
        else {

            return res.send({ status: 0, response: "Wrong credentials" });
        }

        return res.send({ status: 0, response: "Something went wrong" });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
};

export const profile = async (req, res) => {
    try {
        const User = await userModel.findOne({ email: req.user.email });
        if (!User) {
            return res.send({ status: 0, response: "No user found" })
        }
        return res.send({ status: 1, response: JSON.stringify(User) });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
};