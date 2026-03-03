import multer from "multer";
import path from "path";

export default {
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 30 * 1024 * 1024, // 30MB
    },

    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        const allowedMimes = [
            "video/mp4",
            "video/webm",
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        const allowedExts = [
            ".mp4",
            ".webm",
            ".jpeg",
            ".jpg",
            ".png",
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    `Formato inválido (${file.mimetype}). Envie apenas MP4, WebM, JPG ou PNG.`
                ),
                false
            );
        }
    },
};