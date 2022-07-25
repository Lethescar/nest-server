import { defHttp } from '/@/utils/http/axios';

export function upload(data) {
  return defHttp.post({
    url: '/file/upload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: data,
  });
}

export function localUpload(data) {
  return defHttp.post({
    url: '/file/localUpload',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: data,
  });
}

export function downloadById(data) {
  return defHttp.get({
    url: '/file/download',
    params: data,
  });
}
