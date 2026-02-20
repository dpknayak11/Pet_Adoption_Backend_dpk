// import cloudinary sdk
const cloudinary = require("cloudinary").v2;

// buffer ko stream me convert karne ke liye
const streamifier = require("streamifier");

// cloudinary config using .env values
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// main upload controller
const uploadImage = async (req, res) => {
  try {

    // check file exist or not
    if (!req.files?.length)
      return res.status(400).json({ error: true, message: "No file uploaded" });

    // get first file
    const file = req.files[0];

    // upload file buffer to cloudinary
    const result = await new Promise((resolve, reject) => {

      // create upload stream
      const stream = cloudinary.uploader.upload_stream(

        // set resource type (pdf = raw, else image)
        { resource_type: file.mimetype === "application/pdf" ? "raw" : "image" },

        // callback after upload
        (err, result) => (err ? reject(err) : resolve(result))
      );

      // convert buffer to stream and send to cloudinary
      streamifier.createReadStream(file.buffer).pipe(stream);
    });

    // send success response
    return res.status(200).json({
      error: false,
      imageUrl: result.secure_url,
    });

  } catch (err) {
    // handle error
    return res.status(500).json({ error: true, message: err.message });
  }
};

// export controller
module.exports = { uploadImage };
