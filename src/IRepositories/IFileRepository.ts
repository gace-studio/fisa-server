import { IFile, IFileModel } from '../models';
import { IError, IResponse, ISearch } from '../shared';

export interface IFileRepository {
    /**
     * import file, folder
     */
    insert(file: IFile): Promise<IFile | IError>;

    update(file: IFile): Promise<IFile | IError>;
    /**
     * delete file, folder
     */
    delete(id: String): Promise<IResponse | IError>;
    getIndexNext(parentId?: string): Promise<string | IError>;
    getAllFiles(search: ISearch): Promise <IFile[] | IError>;
    saveFile(nFile: IFileModel): Promise <IFile | IError>;
    findOne(id: string): Promise <IFile | IError>;
    getParents(id: string): Promise<IFile[] | IError>;
}
