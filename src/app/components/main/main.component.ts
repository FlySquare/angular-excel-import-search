import { Component, OnInit } from '@angular/core';
import * as XLSX from "xlsx";
import {StorageService} from "../../services/storage.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  excelDatas: any;
  excelTitles: any;
  selectedValues: any = [];
  selectedTotal = 0;
  inputText = '';
  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  download(){
    window.open('/angular-excel-import-search/assets/example.xlsx', '_blank');
  }

  searchData(){
    let data = this.storageService.getFromLocalStorage();
    data.splice(0, 1);
    let filteredData = data.filter((value: any) => {
      return value[1].toLowerCase().includes(this.inputText.toLowerCase());
    });
    this.excelDatas = filteredData;
  }

  selectedData(event: any){
    this.selectedTotal = 0;
    if ((document.getElementById(event[0]) as HTMLInputElement).checked){
      this.selectedValues.push(event);
    }else{
      this.selectedValues.splice(this.selectedValues.indexOf(event),1);
    }
    this.selectedValues.forEach((value: any) => {
      this.selectedTotal += value[3];
    });
  }

  fileExcelUpload(file: any){
    this.storageService.deleteLocalStorage();
    const target: DataTransfer = <DataTransfer>(file.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = <any>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      this.storageService.addToLocalStorage(data);
      this.excelDatas = data;
    };
    reader.readAsBinaryString(target.files[0]);
    file.target.value = '';
  }


  ngOnInit(): void {
    let data = this.storageService.getFromLocalStorage();
    this.excelTitles = [
      data[0][0],data[0][1],data[0][3]
    ];
    data.splice(0, 1);
    this.excelDatas = data;
    console.log(this.excelDatas);
  }

}
