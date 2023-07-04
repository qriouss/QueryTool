import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { SharedService } from '../shared.service';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tables-and-views',
  templateUrl: './tables-and-views.component.html',
  styleUrls: ['./tables-and-views.component.css']
})
export class TablesAndViewsComponent implements OnInit {

  tablesAndViewsList: any[] = [];
  selectedParent: string;
  isTablesExpanded: boolean;
  isViewsExpanded: boolean;
  showDetails: boolean;
  selectedTableOrView: any;
  dataList: any[] = [];
  masterDataObject: any = {};
  generalInformationList: any [] = [];

  constructor(private sharedService: SharedService,
    private httpClient: HttpClient) { }

  ngOnInit(): void {

    // this.getDummyDataForDisplay();

    this.getDataFromJSONFile();

    // this.selectedTableViewEntity = ((this.tablesAndViewsList && this.tablesAndViewsList.length && this.tablesAndViewsList[0] && this.tablesAndViewsList[0]["name"]) ? (this.tablesAndViewsList[0]["name"]) : "")

  }

  getDummyDataForDisplay() {
    let tableAndViewObject: any = {};
    let tables: any[] = [];
    let views: any[] = [];

    let tableObject1: any = {};
    tableObject1["id"] = 1;
    tableObject1["name"] = "GL_ACCESS_SETS";
    tableObject1["description"] = "GL_ACCESS_SETS contains the definition of each data access set defined in the Data Access Set page. Each row includes the name, description, chart of accounts structure, calendar and period type information for the data access set. There is a one to many relationship between the data access set information stored in this table and the data access set details information stored in the GL_ACCESS_SET_NORM_ASSIGN table.";
    tables.push(tableObject1);

    let tableObject2: any = {};
    tableObject2["id"] = 2;
    tableObject2["name"] = "GL_ACCESS_SET_ASSIGNMENTS";
    tableObject2["description"] = "GL_ACCESS_SET_ASSIGNMENTS contains the access privilege information for each data access set. Each row includes the data access set, ledger, segment value, and the corresponding access privilege information. This table stores the flattened information from the GL_ACCESS_SET_NORM_ASSIGN table. Each ledger set or parent segment value stored in the GL_ACCESS_SET_NORM_ASSIGN table will be expanded into ledger or detail segment values before it is stored in this table.";
    tables.push(tableObject2);

    let viewObject1: any = {};
    viewObject1["id"] = 1;
    viewObject1["name"] = "GL_ACCOUNT_ALIASES_VL";
    views.push(viewObject1);

    let viewObject2: any = {};
    viewObject2["id"] = 2;
    viewObject2["name"] = "GL_ALC_LEDGER_RSHIPS_V";
    views.push(viewObject2);

    tableAndViewObject["name"] = "General Ledger";
    tableAndViewObject["tables"] = tables;
    tableAndViewObject["views"] = views;
    this.tablesAndViewsList.push(tableAndViewObject);
    this.selectedParent = ((this.tablesAndViewsList && this.tablesAndViewsList.length && this.tablesAndViewsList[0] && this.tablesAndViewsList[0]["name"]) ? (this.tablesAndViewsList[0]["name"]) : "")
  }

  showHideEntities(entityName: string, isExpanded: boolean) {
    if (entityName === "tables") {
      this.isTablesExpanded = isExpanded;
    } else if (entityName === "views") {
      this.isViewsExpanded = isExpanded;
    }
  }

  getSelectedTableOrViewObjectList(entityName: string): any[] {
    this.generalInformationList = [];
    if (this.masterDataObject && this.masterDataObject['parent'] && this.masterDataObject['parent'].length) {
      for (let parent of this.masterDataObject['parent']) {
        if (parent["Name"] === this.selectedParent) {
          if (parent && parent['generalInformation'] && parent['generalInformation'].length) {
            for (let generalInformation of parent['generalInformation']) {
              if (generalInformation["Type"] === entityName) {
                this.generalInformationList.push(generalInformation);
              }
            }
          }
        }
      }
    }
    return this.generalInformationList;
  }

  getEntityDetails(entityType: string, entityName: string) {
    this.showDetails = true;

    if (this.masterDataObject && this.masterDataObject['parent'] && this.masterDataObject['parent'].length) {
      for (let parent of this.masterDataObject['parent']) {
        if (parent["Name"] === this.selectedParent) {
          if (parent && parent['generalInformation'] && parent['generalInformation'].length) {
            for (let generalInformation of parent['generalInformation']) {
              if (generalInformation["Name"] === entityName) {
                this.selectedTableOrView = generalInformation;
              }
            }
          }
        }
      }
    }

    this.selectedTableOrView['entityType'] = entityType;

    /* if (this.generalInformationList && this.generalInformationList && this.generalInformationList.length) {
      for (let generalInformation of this.generalInformationList) {
        if (generalInformation["Name"] === entityName) {
          this.selectedTableOrView = generalInformation;
        }
      }
    } */

    /* for (let tableObject of this.tablesAndViewsList) {
      if (tableObject["name"] === this.selectedParent) {
        for (let tableOrView of tableObject[entityType]) {
          if (tableOrView["name"] === entityName) {
            this.selectedTableOrView = tableOrView;
          }
        }
      }
    } */
  }

  getDataFromJSONFile2() {
    let fileName: string = "tables-views-list.json";
    this.sharedService.getJSON(fileName).subscribe(data => {
      // console.log(data);
      this.tablesAndViewsList = data;
      this.selectedParent = ((this.tablesAndViewsList && this.tablesAndViewsList.length && this.tablesAndViewsList[0] && this.tablesAndViewsList[0]["name"]) ? (this.tablesAndViewsList[0]["name"]) : "")
    });
  }

  getDataFromJSONFile() {
    let fileName: string = "data.xlsx";
    this.sharedService.getJSON(fileName).subscribe(data => {
      const reader: FileReader = new FileReader();

      let dataJsonGeneralInformation;
      let dataJsonDetails;
      let dataJsonPrimaryKey;
      let dataJsonColumns;
      let dataJsonForeignKeys;
      let dataJsonIndexes;
      let dataJsonParent;
      let dataJsonQuery;

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsGeneralInformation: string = wb.SheetNames[0];
        const worksheetGeneralInformation: XLSX.WorkSheet = wb.Sheets[wsGeneralInformation];

        const wsDetails: string = wb.SheetNames[1];
        const worksheetDetails: XLSX.WorkSheet = wb.Sheets[wsDetails];

        const wsPrimaryKey: string = wb.SheetNames[2];
        const worksheetPrimaryKey: XLSX.WorkSheet = wb.Sheets[wsPrimaryKey];

        const wsColumns: string = wb.SheetNames[3];
        const worksheetColumns: XLSX.WorkSheet = wb.Sheets[wsColumns];

        const wsForeignKeys: string = wb.SheetNames[4];
        const worksheetForeignKeys: XLSX.WorkSheet = wb.Sheets[wsForeignKeys];

        const wsIndexes: string = wb.SheetNames[5];
        const worksheetIndexes: XLSX.WorkSheet = wb.Sheets[wsIndexes];

        const wsQuery: string = wb.SheetNames[6];
        const worksheetQuery: XLSX.WorkSheet = wb.Sheets[wsQuery];

        const wsParent: string = wb.SheetNames[7];
        const worksheetParent: XLSX.WorkSheet = wb.Sheets[wsParent];

        dataJsonGeneralInformation = XLSX.utils.sheet_to_json(worksheetGeneralInformation);
        dataJsonDetails = XLSX.utils.sheet_to_json(worksheetDetails);
        dataJsonPrimaryKey = XLSX.utils.sheet_to_json(worksheetPrimaryKey);
        dataJsonColumns = XLSX.utils.sheet_to_json(worksheetColumns);
        dataJsonForeignKeys = XLSX.utils.sheet_to_json(worksheetForeignKeys);
        dataJsonIndexes = XLSX.utils.sheet_to_json(worksheetIndexes);
        dataJsonQuery = XLSX.utils.sheet_to_json(worksheetQuery);
        dataJsonParent = XLSX.utils.sheet_to_json(worksheetParent);

        /* console.log(dataJsonGeneralInformation);
        console.log(dataJsonDetails);
        console.log(dataJsonPrimaryKey);
        console.log(dataJsonColumns);
        console.log(dataJsonForeignKeys);
        console.log(dataJsonIndexes); */

        this.dataList = [];

        this.masterDataObject = {};
        this.masterDataObject["parent"] = dataJsonParent;

        if (this.masterDataObject["parent"] && this.masterDataObject["parent"].length) {
          for (let data of this.masterDataObject["parent"]) {
            data['generalInformation'] = this.getCorrespondingEntityDetailsByParentName(dataJsonGeneralInformation, data['Name']);
            if (data['generalInformation'] && data['generalInformation'].length) {
              for (let generalInformation of data['generalInformation']) {
                generalInformation['details'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonDetails, generalInformation['Name']);
                generalInformation['primaryKeys'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonPrimaryKey, generalInformation['Name']);
                generalInformation['columns'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonColumns, generalInformation['Name']);
                generalInformation['foreignKeys'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonForeignKeys, generalInformation['Name']);
                generalInformation['indexes'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonIndexes, generalInformation['Name']);
                generalInformation['query'] = this.getCorrespondingEntityDetailsByEntityName(dataJsonQuery, generalInformation['Name']);
              }
            }
          }
        }

        console.log("data list :: " + this.masterDataObject);
        console.log("data list string :: " + JSON.stringify(this.masterDataObject));

        this.selectedParent = ((this.masterDataObject && this.masterDataObject["parent"] && this.masterDataObject["parent"].length && this.masterDataObject["parent"][0] && this.masterDataObject["parent"][0]["Name"]) ? (this.masterDataObject["parent"][0]["Name"]) : "")

      };
      reader.readAsBinaryString(data);
    });
  }

  getCorrespondingEntityDetailsByParentName(data: any[], parentName: string): any[] {
    let details: any[] = [];
    if (data && data.length) {
      for (let dataObject of data) {
        if (dataObject && parentName && dataObject['Parent'] === parentName) {
          details.push(dataObject);
        }
      }
    }
    return details;
  }

  getCorrespondingEntityDetailsByEntityName(data: any[], entityName: string): any[] {
    let details: any[] = [];
    if (data && data.length) {
      for (let dataObject of data) {
        if (dataObject && entityName && dataObject['Name'] === entityName) {
          details.push(dataObject);
        }
      }
    }
    return details;
  }

  getDataFromJSONFile1() {
    // You can change the file path in the assets folder
    let url = "/assets/data/test.xlsx";
    let req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "arraybuffer";
    req.onload = (e) => {
      let data = new Uint8Array(req.response);
      let workbook = XLSX.read(data, { type: "array" });
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // TO export the excel file
      this.saveAsExcelFile(excelBuffer, 'X');
    };
    req.send();
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName);
  }

  // getDataFromJSONFile() {
  //   let fileName: string = "test.csv";
  //   this.sharedService.getJSON(fileName)
  //       .subscribe((data: any) => {

  //         console.log(data);
  //         return;

  //         const reader: FileReader = new FileReader();

  //         let dataJson1;
  //         let dataJson2;

  //         reader.onload = (e: any) => {
  //           const bstr: string = e.target.result;
  //           const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //           /* grab first sheet */
  //           const wsname1: string = wb.SheetNames[1];
  //           const ws1: XLSX.WorkSheet = wb.Sheets[wsname1];

  //           /* grab second sheet */
  //           const wsname2: string = wb.SheetNames[2];
  //           const ws2: XLSX.WorkSheet = wb.Sheets[wsname2];

  //           /* save data */
  //           dataJson1 = XLSX.utils.sheet_to_json(ws1);
  //           dataJson2 = XLSX.utils.sheet_to_json(ws2);
  //           console.log(dataJson1);

  //         };
  //         reader.readAsBinaryString(data);
  //         console.log(data);
  //       });

  // }

}
