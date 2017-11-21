import * as express from 'express';
import {fileController} from '../controllers';

export const fileRouter = express.Router();

fileRouter.post('/find', fileController.search);
fileRouter.post('/folder', fileController.createFolder);
fileRouter.post('/upload', fileController.upload);
fileRouter.get('/download/:id', fileController.download);
fileRouter.put('/update/:id', fileController.update);
fileRouter.get('/parent/:id', fileController.parent);
fileRouter.delete('/delete/:id', fileController.delete);
