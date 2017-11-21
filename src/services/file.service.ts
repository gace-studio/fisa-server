import { FileModel, IFileModel } from './../models/file.model';
import { IFileService } from '../IServices';
import { IFile } from '../models';
import { IResponse, IError, ISearch, getMetaData } from '../shared';
import { dbContext } from '../repositories';
import CONSTANT from '../constant';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export class FileService implements IFileService {
    private static instance: FileService;

    public static getInstance() {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }
        return FileService.instance;
    }

    getAllFiles(search: ISearch): Promise<IFile[] | IError> {
        return dbContext.getFileRepository()
            .getAllFiles(search)
            .then((files: IFile[]) => {
                return Promise.resolve(files);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    update(fileFolder: IFile, id: string): Promise<IFile | IError> {
        let folder = <IFile>{
            name: fileFolder.name,
            id: id
        };
        return dbContext.getFileRepository()
            .update(folder)
            .then((file: IFile) => {
                delete file.content;
                return Promise.resolve(file);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    createFolder(file: IFile, parentId?: string): Promise<IFile | IError> {
        let folder = <IFile>{
            name: file.name,
            isFile: false,
            format: "",
            content: "",
            path: ""
        };
        return dbContext.getFileRepository()
            .getIndexNext(parentId)
            .then((nextIndex: string) => {
                return new Promise((res, rej) => {
                    folder.index = nextIndex;
                    dbContext.getFileRepository()
                        .insert(folder)
                        .then((newFoler: IFile) => {
                            res(newFoler);
                        })
                        .catch((err) => {
                            rej({
                                message: err.message
                            });
                        });
                });
            })
            .then((file: IFile) => {
                return Promise.resolve(file);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    upload(request: object): Promise<IFile | IError> {
        return saveFileToServer(request).then((req: object) => {
            var publicFolderPath = path.join(__dirname, '..', 'public/');
            var fileName = req['path'];

            return getMetaData(publicFolderPath + fileName).then((meta: any) => {
                return saveNewFile();

                function saveNewFile() {
                    return dbContext.getFileRepository()
                        .getIndexNext(request['parentId'])
                        .then((newIndex: string) => {
                            let newFile = standardizeFileData(request);
                            newFile.index = newIndex;
                            newFile.content = meta.text;
                            return dbContext.getFileRepository()
                                .saveFile(newFile)
                                .then((file: IFileModel) => {
                                    return Promise.resolve(file);
                                })
                                .catch(err => {
                                    console.log(err)
                                    return Promise.reject(err);
                                })
                        });
                }
            });
        });

        function standardizeFileData(request: any): IFileModel {
            let newFile = new FileModel();
            newFile.name = request.files.name.replace(/\.[^/.]+$/, '');
            newFile.format = request.format;
            newFile.path = request.path;
            newFile.isFile = true;
            return newFile;
        }

        function saveFileToServer(request) {
            return new Promise((resolve, reject) => {
                var publicFolderPath = path.join(__dirname, '..', 'public/');
                if (!fs.existsSync(publicFolderPath)) {
                    fs.mkdirSync(publicFolderPath);
                }
                let file = request.files;
                let uuidFileName = uuid();
                let extFile = getFormatFormFileName(file.name);
                let savePath = uuidFileName + '.' + extFile['0'].toLowerCase();
                let filePath = publicFolderPath + savePath;

                file.mv(filePath, function (err, data) {
                    if (err) {
                        console.log(err)
                        return reject(err);
                    }
                    request.path = savePath;
                    request.format = extFile;
                    resolve(request);
                });
            });
        }

        function getFormatFormFileName(fileName) {
            return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
        }
    }

    getFile(id: string): Promise<IFile | IError> {
        return dbContext.getFileRepository()
            .findOne(id)
            .then((responsedFile: IFile) => {
                return Promise.resolve(responsedFile);
            })
            .catch(err => {
                return Promise.reject(err);
            })
    }

    getParent(id: string): Promise<IFile[] | IError> {
        return dbContext.getFileRepository()
            .getParents(id)
            .then((responsedFiles: IFile[]) => {
                return Promise.resolve(responsedFiles);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    delete(id: string): Promise<IResponse | IError> {
        return dbContext.getFileRepository()
            .delete(id)
            .then((response: IResponse) => {
                return Promise.resolve(response);
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }
}


export const fileService = FileService.getInstance();