export * from './file.repository';
import { IFileRepository } from '../IRepositories';
import { FileRepository } from '../repositories';


class DBContext {
    private static instance: DBContext;
    private fileRepository: IFileRepository;

    constructor() {
        this.fileRepository = new FileRepository();
    }

    public static getInstance() {
        if (!DBContext.instance) {
            DBContext.instance = new DBContext();
        }
        return DBContext.instance;
    }

    public getFileRepository() {
        return this.fileRepository;
    }
}

export const dbContext = DBContext.getInstance();

