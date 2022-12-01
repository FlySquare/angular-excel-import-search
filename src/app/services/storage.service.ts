import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  addToLocalStorage(data: any){
    localStorage.setItem('excel', JSON.stringify(data));
  }

  getFromLocalStorage(){
    return JSON.parse(localStorage.getItem('excel') ?? '{}');
  }

  deleteLocalStorage(){
    localStorage.clear();
  }
}
