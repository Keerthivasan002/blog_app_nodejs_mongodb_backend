import schema from "../models/Blog.js"
import fs from 'fs'


import { fileURLToPath } from 'url';

import path from 'path'
import userModel from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


export const NewBlog = async (req, res) => {
    try {
        let { title, description, image } = req.body, getBlog, getPath, data, extension, ext;
        if (!title || !description || !image) {
            return res.send({ status: 0, response: "All fields are mandatory" });
        }
        getBlog = await schema.create({
            title: title,
            description: description,
            user_id: req.user.id
        });
        getPath = path.join(__dirname, `../files/${getBlog._id}.${image.extension}`)
        data = image.data.split(",")[1]
        fs.writeFileSync(getPath, data, "base64")
        await schema.findByIdAndUpdate({ _id: getBlog._id }, { image: getPath })
        return res.send({ status: 1, response: "Blog created" })
    } catch (error) {
        res.send({ status: 0, response: error.message })

        return
    }
};


export const GetBlogs = async (req, res) => {
    try {
        const Blogs = await schema.find();
        return res.send({ status: 1, response: JSON.stringify(Blogs) });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
};

export const GetMyBlogs = async (req, res) => {
    try {
        const Blogs = await schema.find({ user_id: req.user.id });
        return res.send({ status: 0, response: JSON.stringify(Blogs) });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}

export const getOne = async (req, res) => {
    try {
        const { id } = req.body;
        const oneBlog = await schema.findById({ _id: id });
        if (oneBlog) {
            const getUserInfo = await userModel.findById({ _id: oneBlog.user_id }, { _id: 0 })
            if (getUserInfo) {
                const data = { ...oneBlog._doc, ...getUserInfo._doc }
                return res.send({ status: 1, response: JSON.stringify(data) })
            }
        }
        return res.send({ status: 0, response: "Invalid request" })
    } catch (error) {
        return res.send({ status: 0, response: error.message })

    }
};


export const deleteComment = async (req, res) => {
    try {
        let { blogId, id } = req.body, getBlog;
        getBlog = await schema.findById({ _id: blogId })
        if (!getBlog) {
            return res.send({ status: 0, response: "No blog found" })
        }
        if (getBlog.user_id.toString() !== req.user.id) {

            return res.send({ status: 0, response: "You can only delete your blog comments" })
        }
        await schema.findByIdAndUpdate({ _id: getBlog._id }, {
            $pull: {
                comments: { _id: id }
            }
        })
        return res.send({ status: 1, response: "Comment deleted" })
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}

export const newComment = async (req, res) => {
    try {
        let { id, comment } = req.body, getBlog;
        getBlog = await schema.findById({ _id: id })
        if (!getBlog) {
            return res.send({ status: 0, response: "No blog found" })
        }
        await schema.findByIdAndUpdate({ _id: getBlog._id }, {
            $push: {
                comments: [{ userCommented: req.user.id, comment: comment }]
            }
        })
        return res.send({ status: 1, response: "Comment added" })
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }
}


export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.body;
        await schema.deleteOne({ _id: id });
        return res.send({ status: 1, response: "Blog deleted" });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }

}


export const updateBlog = async (req, res) => {
    try {
        const { id, title, description } = req.body;
        const updatedBlog = await schema.findByIdAndUpdate(
            { _id: id },
            { title: title, description: description },
            { new: true }
        );
        if (updatedBlog) {

            return res.send({ status: 1, response: "Updated successfully" })
        }
        return res.send({ status: 0, response: "Something went wrong" });
    } catch (error) {
        return res.send({ status: 0, response: error.message })
    }

}
