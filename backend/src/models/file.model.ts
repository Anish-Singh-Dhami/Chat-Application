import { timeStamp } from "console";
import { model, Schema } from "mongoose";

enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  OTHER = "other",
}

interface IFile {
  name: string;
  size: number;
  type: FileType;
  url: string;
}

const FileSchema = new Schema<IFile>({
    name: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(FileType),
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const File = model<IFile>("File", FileSchema);

export { FileType, IFile, File };
