import { Blog } from "../models/blog.model.js";
import { ApiError } from "../utilis/ApiError.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js";

const getAllBlogs = asyncHandler(async (req, res, next) => {
    
    try {
        const blogs = await Blog.find({}).populate('author', 'fullName');
        if (!blogs) {
            throw new ApiError(404, "Blog not found");
        }
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                blogs,
                "Blogs fetched successfully"
            ));

    } catch (error) {
        throw new ApiError(500, `something went wrong in getting all blogs ${error.message}`);

    }
});

const createBlog = asyncHandler(async (req, res, next) => {
  const { title, body, author, authorType } = req.body;
        if ([title, body, author, authorType]
          .some((field) => field?.trim() === "")
      ) {
          throw new ApiError (400, 'All fields are required')
      }

    const imageLocalPath = req.files?.image?.[0]?.path
    if (!imageLocalPath) {
        throw new ApiError(400, "Blog image required")
    }

    const blogImage = await uploadOnCloudinary(imageLocalPath)
    if (!blogImage) {
        throw new ApiError(400, "Blog image not found");
    }

    let newAuthor;

    if (authorType === 'doctor') {
      newAuthor = await Doctor.findOne({fullName : author});
    } else if (authorType === 'admin') {
      newAuthor = await Admin.findOne({fullName : author});
    } else if (authorType === 'patient') {
      newAuthor = await Patient.findOne({fullName : author});
    }

    if (!newAuthor) {
      throw new ApiError(404, `${authorType} not found`);
    }
        const blog = await Blog.create({
            title,
            body,
            author: newAuthor._id,
            authorType,
            image: blogImage.url
        });
        return res.status(200)
       .json(
        new ApiResponse(
            200,
            blog,
            "Blog created successfully"
        ))
});
        

const getCurrentBlog = asyncHandler(async (req, res, next) => {
    try {
        const {id} = req.params;
        let blog = await Blog.findById(id);
        if (!blog) {
            throw new ApiError(404, "Blog not found")
        }

        blog = await Blog.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
          useFindAndModify: false
        })
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                blog,
                "Blog fetched successfully"
            )
        ) 
    } catch (error) {
        throw new ApiError(500, `something went wrong in fetching current blog ${error}`);
    }
});


const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;


  let blog = await Blog.findById(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  blog = await Blog.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true, // Return the modified document rather than the original
      runValidators: true,
      useFindAndModify: false
    }
  );

  // Log updated blog

  if (!blog) {
    throw new ApiError(404, "Blog not found after update");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      blog,
      "Blog updated successfully"
    )
  );
});

  
  const deleteBlog = asyncHandler(async (req, res, next) => {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      if (!blog) {
        throw new ApiError(404, "Blog not found");
      }
      return res.status(200).json(
        new ApiResponse(200, blog, "Blog deleted successfully")
      );
    } catch (error) {
      throw new ApiError(500, `Something went wrong in deleting blog: ${error}`);
    }
  });

export { getAllBlogs, createBlog, getCurrentBlog, updateBlog, deleteBlog };