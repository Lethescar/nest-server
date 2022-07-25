interface FileItem {
  uid: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
}

export interface FileInfo {
  file: FileItem;
  fileList: FileItem[];
}
