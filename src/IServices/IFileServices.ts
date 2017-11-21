import { IFile } from '../models';
import { IError, IResponse, ISearch } from '../shared';

export interface IFileService {
    // find(query: ISearch): Promise<IFile[] | IError>;
    createFolder(file: IFile, parentId?: string): Promise<IFile | IError>;
    getAllFiles(search: ISearch): Promise<IFile[] | IError>;
    upload(request: object): Promise<IFile | IError>;
    getFile(id: string): Promise<IFile | IError>;
    update(file: IFile, id: string): Promise<IFile | IError>;
    getParent(id: string): Promise<IFile[] | IError>;
    delete(id: String): Promise<IResponse | IError>;
}
