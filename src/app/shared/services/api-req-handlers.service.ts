import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Config} from '../utilities/config';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class ApiReqHandlersService extends Config {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * post
   * @param path
   * @param data
   * @returns Observable
   */
  public post(path: string, data?: any): Observable<any> {
    this.headers = {headers: this.setHeaders()};

    // const url = `${ApiReqHandlersService.BASE_URL}${path}`;
    const url = `${path}`;
    return this.http.post(url, data || {}, this.headers)
  }

  /**
   *
   * @param {string} path
   * @returns {Observable<any>}
   */
  public get(path: string): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    // const url = `${ApiReqHandlersService.BASE_URL}${path}`;
    const url = `${path}`;
    return this.http.get(url, this.headers);
  }

  /**
   *
   * @param {string} path
   * @param data?
   * @returns {Observable<any>}
   */
  public put(path: string, data?: any): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    // const url = `${ApiReqHandlersService.BASE_URL}${path}`;
    const url = `${path}`;
    return this.http.put(url, data, this.headers);
  }

  /**
   *
   * @param path
   * @param data
   */
  public delete(path: string, data?: any): Observable<any> {
    this.headers = {headers: this.setHeaders()};
    // const url = `${ApiReqHandlersService.BASE_URL}${path}`;
    const url = `${path}`;
    return this.http.delete(url, this.headers);
  }

  /**
   *
   * @param data
   * @param formFile
   * @param {string} urlLink
   * @param {string} file_key
   * @param method
   * @returns {Observable<any>}
   */
  public postFile(data: any, formFile, urlLink: string, file_key = 'file', method?): Observable<any> {
    const header = this.setHeaders();
    header.delete('Content-Type');
    this.headers = {headers: header};
    const path = $.param(data);
    const urlPath =

      Object.keys(data).length > 0 ? `${urlLink}?${path}` :
        urlLink;
    const formData = new FormData();
    let file = null;

    if (formFile && formFile.files[0]) {
      file = formFile.files[0];
      // console.log('Here is the form file ::', file);
      formData.append(file_key, file, file.name);
    }
    // formData.append("body", data);
    const url = `${ApiReqHandlersService.BASE_URL}${urlPath}`;
    return this.http.post(url, formData || {}, this.headers);
  }

  /**
   *
   * @param data
   * @param formFiles
   * @param urlLink
   * @param file_key
   */
  public postMultipleFile(data: any, formFiles, urlLink: string, file_key = 'file'): Observable<any> {
    const header = this.setHeaders();
    header.delete('Content-Type');
    this.headers = {headers: header};
    const path = $.param(data);
    const urlPath = (Object.keys(data).length > 0) ? `${urlLink}?${path}` : urlLink;
    const formData = new FormData();
    let file = null;

    for (let i = 0; i < formFiles.length; i++) {
      if (formFiles[i]) {
        file = formFiles[i];
        console.log('Here is the form file ::', file);
        formData.append(file_key, file, file.name);
      }
      formData.append('body', data);
    }
    const url = `${ApiReqHandlersService.BASE_URL}${urlPath}`;
    return this.http.post(url, formData || {}, this.headers);
  }
}

