import * as mongoose from 'mongoose';

export interface IFile {
    // Mongo id
    id?: string;
    // name, title
    name: string;
    // type: file or folder, true is file, false is folder
    isFile: boolean;
    // path of file, empty for folder
    path?: string;
    // file type of file, empty for folder
    format?: string;
    // for indexing
    index: string;
    // mark deleted of not
    deleted: boolean;
    // content of document
    content: string;
}

export interface IFileModel extends IFile, mongoose.Document {
    id?: string;
 }

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        path: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: '\n'
        },
        format: {
            type: String
        },
        index: {
            type: String,
            required: true
        },
        deleted: {
            type: Boolean,
            default: 0
        },
        isFile: {
            type: Boolean,
            default: 0
        }
    }
);

fileSchema.index({ content: 'text', name: 'text' });
fileSchema.virtual('id').get(() => this._id.toHexString());

export const FileModel = mongoose.model<IFileModel>('file', fileSchema);
