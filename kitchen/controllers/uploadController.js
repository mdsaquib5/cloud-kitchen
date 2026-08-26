import { PutObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "../utils/r2Client.js";

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image provided" });
        }

        const file = req.file;
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;

        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await r2Client.send(new PutObjectCommand(uploadParams));

        const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        
        res.status(200).json({
            success: true,
            imageUrl: publicUrl,
            message: "Image uploaded successfully"
        });
    } catch (error) {
        next(error);
    }
};
