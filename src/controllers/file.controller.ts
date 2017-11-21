import { IError } from './../shared/common';
import { IFile } from './../models/file.model';
import * as express from 'express';
import { fileService } from '../services';
import CONSTANT from '../constant';
import { ISearch } from '../shared';
import * as path from 'path';

/**
   * @api {delete} /api/file/delete/:id Delete File/Folder
   * @apiDescription API Delete File/Folder
   * @apiVersion 0.0.1
   * @apiName delete
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/delete/58e4db20a4fb9639605ae80f
   *
   *
   *
   * @apiParam (FormData-RequestBody) {String} id Id of current folder/file
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} message success
   *
   * @apiSuccessExample {json} Success-Response:
   *    {
   *      "message": "Success"
   *    }
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function deleteFile(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.params.id) {
        fileService.delete(req.params.id)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                next(error);
            });
    } else {
        next({
            statusCode: 400,
            message: CONSTANT.API_MESSAGE.ERROR.FIND
        });
    }
}

/**
   * @api {get} /api/file/parent/:id Get list parent of File/Folder
   * @apiDescription API List parent of File/Folder
   * @apiVersion 0.0.1
   * @apiName parent
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/parent/58e4db20a4fb9639605ae80f
   *
   *
   *
   * @apiParam (FormData-RequestBody) {String} id Id of current folder
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} _id Id
   * @apiSuccess (Response Body 200) {String} name File name
   * @apiSuccess (Response Body 200) {String} index Index of folder
   *
   * @apiSuccessExample {json} Success-Response:
   * [
   *    {
   *      "index": "0001",
   *      "name": "Folder One",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    },
   *    {
   *      "index": "0001.0002",
   *      "name": "Folder 2",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    },
   *    {
   *      "index": "0001.0002.0003",
   *      "name": "Folder 3",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    },
   *    {
   *      "index": "0001.0002.0003.0004",
   *      "name": "Folder 4",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    }
   *  ]
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function parent(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.params.id) {
        fileService.getParent(req.params.id)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                next(error);
            });
    } else {
        next({
            statusCode: 400,
            message: CONSTANT.API_MESSAGE.ERROR.FIND
        });
    }
}

/**
   * @api {post} /api/file/find Search files and folders
   * @apiDescription API Search files and folders
   * @apiVersion 0.0.1
   * @apiName find
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/find
   *
   *
   * @apiParamExample {json} Params-Example
   *  {
   *      "search": "this is text for searching",
   *      "parentId": "58e4db20a4fb9639605ae80f"
   *  }
   *
   *
   * @apiParam (FormData-RequestBody) {String} search Text for searching
   * @apiParam (FormData-RequestBody) {String} parentId Id of parent folder, leave this empty if search in root folder
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} _id Id
   * @apiSuccess (Response Body 200) {String} name File name
   * @apiSuccess (Response Body 200) {String} format Format file
   * @apiSuccess (Response Body 200) {String} path Path
   * @apiSuccess (Response Body 200) {String} index Index of file
   * @apiSuccess (Response Body 200) {Boolean} isFile Is file or folder
   * @apiSuccess (Response Body 200) {Boolean} deleted Is deleted
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    [
   *      "__v": 0,
   *      "index": "1.1",
   *      "isFile": true,
   *      "deleted": false,
   *      "format": "docx",
   *      "path": "0912331414.docx",
   *      "name": "Lease Agreement",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    ]
   *  }
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function search(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.body) {
        fileService.getAllFiles(<ISearch>req.body)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                next(error);
            });
    } else {
        next({
            statusCode: 400,
            message: CONSTANT.API_MESSAGE.ERROR.FIND
        });
    }
}

/**
   * @api {put} /api/file/update/:id Update File/Folder
   * @apiDescription API File/Folder
   * @apiVersion 0.0.1
   * @apiName update
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/update/58e4db20a4fb9639605ae80f
   *
   *
   * @apiParamExample {json} Params-Example
   *  {
   *      "name": "Folder One"
   *  }
   *
   *
   * @apiParam (FormData-RequestBody) {String} name Folder name
   * @apiParam (FormData-RequestBody) {String} id Id of file/folder
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} _id Id
   * @apiSuccess (Response Body 200) {String} name File name
   * @apiSuccess (Response Body 200) {String} format empty
   * @apiSuccess (Response Body 200) {String} path empty
   * @apiSuccess (Response Body 200) {String} index Index of folder
   * @apiSuccess (Response Body 200) {Boolean} isFile always false
   * @apiSuccess (Response Body 200) {Boolean} deleted Is deleted
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "data": {
   *      "__v": 0,
   *      "index": "1.1",
   *      "isFile": false,
   *      "deleted": false,
   *      "format": "",
   *      "path": "",
   *      "name": "Folder One",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    }
   *  }
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function update(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.body && req.body.name) {
        fileService.update(req.body, req.params.id)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                next(error);
            });
    } else {
        next({
            statusCode: 400,
            message: CONSTANT.API_MESSAGE.ERROR.INSERT
        });
    }
}

/**
   * @api {post} /api/file/folder Create folder
   * @apiDescription API Create folder
   * @apiVersion 0.0.1
   * @apiName folder
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/folder
   *
   *
   * @apiParamExample {json} Params-Example
   *  {
   *      "parentId": "58e4db20a4fb9639605ae80f",
   *      "name": "Folder One"
   *  }
   *
   *
   * @apiParam (FormData-RequestBody) {String} name Folder name
   * @apiParam (FormData-RequestBody) {String} parentId Id of parent folder, leave this empty if create to root folder
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} _id Id
   * @apiSuccess (Response Body 200) {String} name File name
   * @apiSuccess (Response Body 200) {String} format empty
   * @apiSuccess (Response Body 200) {String} path empty
   * @apiSuccess (Response Body 200) {String} index Index of folder
   * @apiSuccess (Response Body 200) {Boolean} isFile always false
   * @apiSuccess (Response Body 200) {Boolean} deleted Is deleted
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "data": {
   *      "__v": 0,
   *      "index": "1.1",
   *      "isFile": false,
   *      "deleted": false,
   *      "format": "",
   *      "path": "",
   *      "name": "Folder One",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    }
   *  }
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function createFolder(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.body.parentId === 'root') req.body.parentId = '';
    if (req.body && req.body.name) {
        console.log(req.body)
        fileService.createFolder(req.body, req.body.parentId)
            .then(response => {
                res.send(response);
            })
            .catch(error => {
                next(error);
            });
    } else {
        next({
            statusCode: 400,
            message: CONSTANT.API_MESSAGE.ERROR.INSERT
        });
    }
}


/**
   * @api {post} /api/file/upload Upload file
   * @apiDescription API Upload file
   * @apiVersion 0.0.1
   * @apiName uploadFile
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/upload
   *
   *
   * @apiParamExample {json} Params-Example
   *  {
   *      "parentId": "58e4db20a4fb9639605ae80f"
   *  }
   *
   *
   * @apiParam (FormData-RequestBody) {File} file File upload
   * @apiParam (FormData-RequestBody) {String} parentId Id of parent folder, leave this empty if upload to root folder
   *
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Header 200) {String} Content-Type="application/json" Content Type
   * @apiSuccess (Response Body 200) {String} _id Id
   * @apiSuccess (Response Body 200) {String} name File name
   * @apiSuccess (Response Body 200) {String} format Format file
   * @apiSuccess (Response Body 200) {String} path Path
   * @apiSuccess (Response Body 200) {String} index Index of file
   * @apiSuccess (Response Body 200) {Boolean} isFile Is file or folder
   * @apiSuccess (Response Body 200) {Boolean} deleted Is deleted
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "data": {
   *      "__v": 0,
   *      "index": "1.1",
   *      "isFile": true,
   *      "deleted": false,
   *      "format": "docx",
   *      "path": "0912331414.docx",
   *      "name": "Lease Agreement",
   *      "_id": "58dc83e40f3d4f1b73e80a71"
   *    }
   *  }
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FOLDER_NOT_FOUND"
   * }
   */
function uploadFile(req, res: express.Response, next: express.NextFunction): void {
    if (!req.files.file) {
        next({
            statusCode: 400,
            message: 'No files were uploaded.'
        });
    }
    let request = {
        files: req.files.file,
        parentId: req.body.parentId && req.body.parentId.length > 10 ? req.body.parentId : null
    };
    fileService.upload(request)
        .then((resp: IFile) => {
            res.send(resp);
        })
        .catch(err => {
            next(err);
        });
}

/**
   * @api {get} /api/file/download/:id Download file
   * @apiDescription API Download file
   * @apiVersion 0.0.1
   * @apiName download
   * @apiGroup File
   * @apiPermission No Permission
   *
   * @apiExample {curl} Example usage:
   *      curl -i http://localhost:3001/api/file/download/58e4db20a4fb9639605ae80f
   *
   *
   * @apiError (Response Body 404) {String} message Error message
   * @apiErrorExample {json} Error-404-Response:
   * {
   *      "message": "FILE_NOT_FOUND"
   * }
   */
function downloadFile(req, res: express.Response, next: express.NextFunction): void {
    fileService.getFile(req.params.id)
        .then((responsedFile: IFile) => {
            const pathFile = path.join(__dirname, '..', 'public/') + responsedFile.path;
            if (responsedFile.name) {
                res.download(pathFile, responsedFile.name + '.' + responsedFile.format);
            } else {
                res.download(pathFile);
            }
        }).catch(function (err) {
            next(err);
        });
}

export const fileController = {
    search: search,
    createFolder: createFolder,
    upload: uploadFile,
    download: downloadFile,
    update: update,
    parent: parent,
    delete: deleteFile
};
