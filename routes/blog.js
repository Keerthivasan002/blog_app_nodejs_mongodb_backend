import express from"express";

import { NewBlog, GetBlogs, updateBlog, deleteBlog, getOne, newComment, GetMyBlogs, deleteComment } from "../Controls/Blogs.js";
import { validateToken } from "../middleware/validateToken.js";


const BlogRoutes = express.Router()

BlogRoutes.use(validateToken);

BlogRoutes.post('/create', NewBlog);
BlogRoutes.get('/getblogs', GetBlogs);
BlogRoutes.get('/getMyblogs', GetMyBlogs);
BlogRoutes.post("/addComment",newComment)
BlogRoutes.delete("/deleteComment", deleteComment)
BlogRoutes.post('/getone', getOne);
BlogRoutes.post('/update', updateBlog);
BlogRoutes.delete('/delete', deleteBlog);




export default BlogRoutes