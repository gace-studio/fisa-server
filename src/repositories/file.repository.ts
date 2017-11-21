import { IFileRepository } from '../IRepositories';
import { IFile, IFileModel, FileModel } from '../models';
import { IError, IResponse, ISearch } from '../shared';

export class FileRepository implements IFileRepository {
    findOne(id: string): Promise<IFile | IError> {
        return FileModel
            .findOne({
                _id: id
            }).then((responsedFile: IFileModel) => {
                return Promise.resolve(responsedFile);
            }).catch(err => {
                return Promise.reject({
                    message: err.message
                });
            });
    }

    getParents(id: string): Promise<IFile[] | IError> {
        return FileModel
            .findOne({
                _id: id
            }).then((responsedFile: IFileModel) => {
                const index = responsedFile.index;
                const parentsIndex = this.getParentsIndex(index);
                if (parentsIndex.length === 0) {
                    return Promise.resolve([]);
                } else {
                    const query = this.buildQueryGetParents(parentsIndex);
                    return FileModel
                        .find(query, { name: 1, index: 1, _id: 1 })
                        .sort({ index: 1 })
                        .then((folders: IFileModel[]) => {
                            return Promise.resolve(folders.map(folder => folder.toObject() as IFile));
                        })
                        .catch((err) => {
                            return Promise.reject({
                                message: err.message
                            });
                        });
                }
            }).catch(err => {
                return Promise.reject({
                    message: err.message
                });
            });
    }

    buildQueryGetParents(indexs: string[]): object {
        let query = {
            $or: [],
            deleted: 0
        };
        for (let i = 0; i < indexs.length; i++) {
            query.$or.push({ index: indexs[i] });
        }
        return query;
    }

    getParentsIndex(index: string): string[] {
        let numberOfDot: number = this.countOccurence(index);
        let result: string[] = [index];
        if (numberOfDot == 0) {
            return result;
        } else {
            for (let i = 1; i <= numberOfDot; i++) {
                result.push(index.substr(0, (i === 1 ? 4 : (i * 4 + i - 1))));
            }
        }
        return result;
    }

    countOccurence(index: string): number {
        let count = 0;
        for (let i = 0; i < index.length; i++) {
            if (index[i] == ".") count++;
        }
        return count;
    }

    insert(file: IFile): Promise<IFile | IError> {
        const newFile = new FileModel(file);
        return newFile
            .save()
            .then((savedFile: IFileModel) => {
                return Promise.resolve(savedFile.toObject() as IFile)
            })
            .catch(err => Promise.reject({
                message: err.message
            }));
    }

    update(file: IFile): Promise<IFile | IError> {
        return FileModel
            .findOne({
                $and: [
                    { _id: file.id }
                ]
            }).then((responsedFile: IFileModel) => {
                if (responsedFile) {
                    responsedFile.name = file.name;
                    return responsedFile.save()
                        .then(fileUpdate => {
                            return Promise.resolve(responsedFile.toObject() as IFile);
                        })
                        .catch(err => {
                            return Promise.reject({
                                message: err.message
                            });
                        });
                } else {
                    return Promise.reject({
                        message: 'Does not exist.'
                    });
                }
            }).catch(err => {
                return Promise.reject({
                    message: err.message
                });
            });
    }

    delete(id: String): Promise<IResponse | IError> {
        return FileModel
            .findOne({ _id: id })
            .then((responsedFile: IFileModel) => {
                if (responsedFile) {
                    return FileModel.update({
                        index: {
                            $regex: `^` + (responsedFile && responsedFile.index ? responsedFile.index : ''),
                            $options: 'm'
                        }
                    }, { $set: { deleted: true } }, { multi: true })
                        .then(() => {
                            return Promise.resolve({
                                message: 'Deleted'
                            });
                        })
                        .catch(err => {
                            return Promise.reject({
                                message: err.message
                            });
                        });
                } else {
                    return Promise.reject({
                        message: 'Does not exist.'
                    });
                }
            }).catch(err => {
                return Promise.reject({
                    message: err.message
                });
            });
    }

    getAllFiles(search: ISearch): Promise<IFile[] | IError> {
        return FileModel
            .findOne({ _id: (search.parentId === 'root' || !search.parentId ? '5349b4ddd2781d08c09890f3' : search.parentId) })
            .then((responsedFile: IFileModel) => {
                let nextIndexLv = '9999';
                let maxLength = 5;
                let q = {};
                if (responsedFile && responsedFile.index) {
                    nextIndexLv = responsedFile.index + '.' + nextIndexLv;
                    maxLength = nextIndexLv.length + 1;
                }

                q = {
                    index: {
                        $regex: `^` + (responsedFile && responsedFile.index ? responsedFile.index : ''),
                        $options: 'm'
                    },
                    $text: { $search: search.search },
                    $where: 'this.index.length < ' + maxLength,
                    deleted: false
                };

                if (responsedFile && responsedFile._id) {
                    q['_id'] = { $ne: responsedFile._id };
                }

                if (!responsedFile) {
                    delete q['index'];
                }
                if (!search.search) {
                    delete q['$text'];
                }

                if (!search.parentId) {
                    q = {
                        $text: { $search: search.search },
                        deleted: false
                    };
                }
                return FileModel.find(q, { content: 0 })
                    .sort({
                        index: -1
                    })
                    .then((files: IFileModel[]) => {
                        return Promise.resolve(files);
                    })
                    .catch((err) => {
                        return Promise.reject({
                            message: err.message

                        });
                    });
            }).catch(err => {
                return Promise.reject({
                    message: err.message
                });
            });
    }

    getIndexNext(parentId?: string): Promise<string | IError> {
        return new Promise((resolve, reject) => {
            this.getParentFolder(parentId)
                .then((folder?: IFileModel) => {
                    return new Promise((res, rej) => {
                        let indexOfFolder = folder ? folder.index : null;
                        this.getMaxIndexFile(indexOfFolder).then((indexFile) => {
                            res(indexFile);
                        }).catch((err) => {
                            rej(err);
                        });
                    });
                }).then((maxIndex: string) => {
                    let indexElements = maxIndex.split('.');
                    let lastIndex = indexElements[indexElements.length - 1];
                    let numberIndex = parseInt(lastIndex);
                    numberIndex = numberIndex + 1;
                    let rsindex = numberIndex.toString();
                    let result = maxIndex.substring(0, maxIndex.length - 4) + rsindex.padStart(4, '0');

                    resolve(result);
                }).catch((err) => {
                    reject({
                        message: err.message
                    });
                });
        });
    }

    getParentFolder(parentId?: string): Promise<IFile | IError> {
        return new Promise((resolve, reject) => {
            if (!parentId) {
                return resolve(null);
            }
            FileModel.findOne({
                _id: parentId,
                deleted: false
            }, (err, parent) => {
                if (err) {
                    return reject({
                        message: err.message
                    });
                }
                resolve(parent ? parent.toObject() as IFile : null);
            });
        });
    }

    getMaxIndexFile(index?: string): Promise<string | IError> {
        return new Promise((resolve, reject) => {
            let maxLength = index ? index.length + 5 : 5;
            let q = {
                index: {
                    $regex: `^` + index,
                    $options: 'm'
                },
                $where: 'this.index.length < ' + (maxLength + 1),
                deleted: false
            };
            if (!index) {
                delete q.index;
            }

            FileModel.findOne(q)
                .sort({
                    index: -1
                }).exec((err: any, file?: IFile) => {
                    if (err) {
                        return reject({
                            message: err.message
                        });
                    }
                    //if exist max index
                    file = file ? file : null;
                    if (file && file.index) {
                        let length = index ? index.length : 0;
                        let numberSubstring = index ? 5 : 4;
                        let maxIndex = file.index;
                        maxIndex = maxIndex.length >= length + 4 ? maxIndex.substring(0, length + numberSubstring) : maxIndex;
                        if (maxIndex === index) {
                            return resolve(index + '.0000');
                        }
                        return resolve(maxIndex);
                    }
                    resolve(file ? file.index : '0000');
                });
        });
    }

    saveFile(nFile: IFileModel): Promise<IFile | IError> {
        return new Promise((resolve, reject) => {
            nFile.save(function (err, newFile) {
                if (err) {
                    return reject(err);
                }
                delete newFile.content;
                var rs = newFile ? newFile.toObject() : null;
                resolve(rs);
            });
        });
    }
}