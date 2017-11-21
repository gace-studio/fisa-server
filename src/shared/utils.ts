import * as child from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
let tika = require('tika');

export function getMetaData(uri: string, options?: any) {
  options = options || [];
  return new Promise((resolve, reject) => {
    tika.text(uri, options, (e, content) => {
      if (e) {
        return reject(e);
      }
      var response = {
        text: content
      };
      tika.meta(uri, options, (err, res) => {
        if (err) {
          return reject(err);
        }
        response['meta'] = res;
        resolve(response);
      });
    });
  });
}