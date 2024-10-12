import { Injectable } from '@angular/core';

const HOST_NAME = 'http://localhost/';
const API_EXTENSION = 'API/';
const UPLOAD_EXTENSION = 'uploads/';
const DATA_PATH = API_EXTENSION + 'manage_data.php';
const MAIL_PATH = API_EXTENSION + 'mail.php';
const ADMIN_PATH = API_EXTENSION + 'admin_query_handler.php';
const PAYMENT_PATH = API_EXTENSION + 'payment.php';
const IMAGE_UPLOAD_PATH = API_EXTENSION + 'image_upload.php';
const DOCUMENT_UPLOAD_PATH = API_EXTENSION + 'document_upload.php';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor() {}

  getUrl(extension = 'api', full = true) {
    var url = full ? HOST_NAME : '';
    switch (extension) {
      case 'uploads':
        return (url += UPLOAD_EXTENSION);
      case 'data':
        return (url += DATA_PATH);
      case 'mail':
        return (url += MAIL_PATH);
      case 'admin':
        return (url += ADMIN_PATH);
      case 'payment':
        return (url += PAYMENT_PATH);
      case 'image-upload':
        return (url += IMAGE_UPLOAD_PATH);
      case 'document-upload':
        return (url += DOCUMENT_UPLOAD_PATH);
      default:
        return (url += API_EXTENSION);
    }
  }
}
