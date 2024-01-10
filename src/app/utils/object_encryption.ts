import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import environment from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ObjectEncryption {
  constructor() { }
  private secretKey = environment.app_key;
  
  set(value: any){
    var key = CryptoJS.enc.Utf8.parse(this.secretKey);
    var iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(value), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return btoa(encrypted.toString());
  }

  get(value:any){
    var key = CryptoJS.enc.Utf8.parse(this.secretKey);
    var iv = CryptoJS.enc.Utf8.parse(this.secretKey);
    var decrypted = CryptoJS.AES.decrypt(atob(value), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
}
