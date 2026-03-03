import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

interface IUploadServiceProps {
  file: Express.Multer.File;
}

export class UploadService {

  uploadFile({ file }: IUploadServiceProps) {
    
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto", // detecta imagem ou vídeo automaticamente
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
