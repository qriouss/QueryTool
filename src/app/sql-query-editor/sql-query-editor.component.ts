import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { ExcelService } from '../services/excel.service';
import { SharedService } from '../shared.service';
import { SqlQueryEditorService } from './sql-query-editor.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sql-query-editor',
  templateUrl: './sql-query-editor.component.html',
  styleUrls: ['./sql-query-editor.component.css']
})
export class SqlQueryEditorComponent implements OnInit {

  isQueryExecuted: boolean;
  isConnected: boolean;
  userSelectedFilter: any[];
  filtersValue: any[];
  filters: any;
  // resData: any;
  columnNames: string[];
  rowData: any[];
  query: string = '';
  // @Input() public connectionObject : any;
  connectionObject: any;
  // page = 1;
  collectionSize = 0;
  premiumData: any[] = [];
  paginateData: any[] = [];

  itemsPerPage: number;
  totalItems: any;
  previousPage: any;
  page = 1;
  pageSize = 50;
  pageSizeList: any[] = [50, 100, 200, 1000, 5000, 10000, 50000, 75000];
  fetchCount: number = 50;
  timeRequiredToExecuteQuery: number;
  startDateTime: Date;
  endDateTime: Date;
  saveButtonClicked: boolean;
  timeLeft: number = 5;
  interval;
  showNoRecordsFoundMessage: boolean;
  loadingData: boolean;
  errorMessage: any;
  errorMessageCode: string;
  highlightTexts = ["SELECT", "FROM", "WHERE", "IN"];
  txt =
    "This demo shows how to highlight bits of text within a textarea. Alright, that's a lie. You can't actually render markup inside a textarea. However, you can fake it by carefully positioning a div behind the textarea and adding your highlight markup there. JavaScript takes care of syncing the content and scroll position from the textarea to the div, so everything lines up nicely. Hit the toggle button to peek behind the curtain. And feel free to edit this text. All capitalized words will be highlighted.";
  oracleSQLReservedKeywords: any[] = [];
 
  constructor(
    private dialog: MatDialog,
    private sqlQueryEditorService: SqlQueryEditorService,
    private excelService: ExcelService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.sqlQueryEditorService.connectionObject.subscribe(connectionObject => this.connectionObject = connectionObject);

    this.getDataFromExcelFile();
  }

  // async execute() {
  //   this.isQueryExecuted = true;

  //   let query: string;
  //   var resData: any;
  //   /* this.sqlQueryEditorService.signin(query)
  //     .subscribe(
  //       response => {
  //         console.log(response);
  //       }); */

  //       resData = await this.sqlQueryEditorService.signin(query);

  // }

  async execute() {

    this.loadingData = true;

    // console.log(this.connectionObject);

    this.rowData = [];
    this.showNoRecordsFoundMessage = false;
    this.errorMessageCode = undefined;
    this.errorMessage = undefined;

    var resData: any;
    this.isQueryExecuted = true;
    this.userSelectedFilter = [];
    this.filtersValue = [];
    // let connectionUrl: string = 'https://fa-epvg-test-saasfaprod1.fa.ocs.oraclecloud.com:443/xmlpserver/services/v2/ReportService';
    // let userName: string = 'Trainee User Functional';
    // let password: string = 'Welcome@123';
    // let query: string = this.getQueryForExecution();
    try {

      let urlEndpart: string = ':443/xmlpserver/services/v2/ReportService';

      let connectionObject: any = this.sharedService.getCurrentConnection();

      console.log("connectionObject------------------" + JSON.stringify(connectionObject));

      // Uncomment when testing is complete
      var requestBody = {
        "connectionUrl": (connectionObject["connectionUrl"] + urlEndpart),
        "userName": connectionObject["userName"],
        "password": connectionObject["password"],
        "query": this.getQueryForExecution(connectionObject["userName"])
      }

      /* var requestBody = {
        "connectionUrl": 'https://fa-epvg-test-saasfaprod1.fa.ocs.oraclecloud.com:443/xmlpserver/services/v2/ReportService',
        "userName": 'Trainee User Functional',
        "password": 'Welcome@123',
        "query": this.getQueryForExecution()
        // "query": 'c2VsZWN0IHBhcnR5X2lkLCBwYXJ0eV9udW1iZXIgZnJvbSBoel9wYXJ0aWVzIHdoZXJlIHJvd251bSA8PSA1'
        // "query": 'U0VMRUNUICoKRlJPTSBwb3pfc3VwcGxpZXJzCldIRVJFIHJvd251bSA8PTc1MDAw'
      } */

      // return;

      this.startDateTime = new Date();

      resData = await this.sqlQueryEditorService.executeQuery(requestBody);

      this.endDateTime = new Date();

      if (resData && resData.status === 200 && resData['data'] && resData['data'].length && resData['data'][0] && (typeof (resData['data'][0]) === 'object')) {
        this.columnNames = Object.keys(resData['data'][0]);
        this.rowData = [];
        for (let res of resData['data']) {
          let rowObject: any = {};
          for (let column of this.columnNames) {
            rowObject[column] = res[column];
          }
          this.rowData.push(rowObject);
        }
        this.loadingData = false;
      } else if (resData && resData.status === 500) {
          this.loadingData = false;
          this.errorMessageCode = ((resData['error'] && resData['error'].length && resData['error'][0] && resData['error'][0]['errorMessage']) ? (resData['error'][0]['errorMessage']) : "Failed to execute query");
      } else {
        // this.errorMessage = ((resData && resData['error'] && resData['error']['message']) ? resData['error']['message'] : "");
        this.showNoRecordsFoundMessage = true;
      }

      this.getTimeRequiredToExecuteQuery();

      // console.log(this.rowData[0])

    } catch (error) {
      this.loadingData = false;
      console.log(error);
      this.errorMessage = ((error && error['message']) ? error['message'] : "");
      return error;
    }
  }

  connect() {
    // this.isConnected = true;
    this.showDialog(null, null, null, null);
  }

  getIsConnected() {
    return (this.connectionObject && this.connectionObject['isConnected']);
  }

  showDialog(headerTitle: string, message: string, isSuccess: boolean, headerNumber: string) {
    const dialogRef = this.dialog.open(DialogBodyComponent, {
      data: {
        header: headerTitle,
        message: message ? message : ' ',
        buttonText: {
          ok: 'Ok'
        },
        isSuccess: isSuccess,
        headerNumber: headerNumber
      },
      height: 'auto',
      width: '45%',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.sqlQueryEditorService.setIsConnectionEstablished(true);
      }
    });
  }

  downloadDataInCSVFile() {
    let modifiedData: any = this.getModifiedDataForFileDownload(this.rowData);
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(modifiedData[0]);
    const csv = modifiedData.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'queryCSVResponse.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  getModifiedDataForFileDownload(data: any) {
    let modifiedData: any = [];
    if (data && data.length) {
      let keys = Object.keys(data[0]);
      for (let record of data) {
        let newRecordObject: any = {};
        for (let key of keys) {
          newRecordObject[key] = record[key][0];
        }
        modifiedData.push(newRecordObject);
      }
    }
    return modifiedData;
  }

  downloadDataInExcelFile() {
    this.excelService.exportAsExcelFile(this.getModifiedDataForFileDownload(this.rowData), "queryExcelResponse");
  }

  getPremiumData() {

    this.paginateData = this.rowData
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);

  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.execute();
    }
  }

  getQueryForExecution(userName: string): string {
    let queryToBeExecuted: string = "";
    if (this.query) {
      queryToBeExecuted = this.checkIfSecurityTablesPresentInSelectQuery(this.query, userName);
      let query = "SELECT temp.* FROM (" + queryToBeExecuted + ") temp where ROWNUM <= " + this.fetchCount;
      console.log(query);
      queryToBeExecuted = query ? (btoa(query)) : "";
    }
    return queryToBeExecuted;
  }

  getTimeRequiredToExecuteQuery() {
    this.timeRequiredToExecuteQuery = (this.endDateTime.getTime() - this.startDateTime.getTime()) / 1000;
  }

  save() {
    this.saveButtonClicked = true;
    this.sqlQueryEditorService.setsqlQuery(this.query, this.sqlQueryEditorService.getLoggedInUserName());
    this.startTimer();

    // setTimeout(this.resetSaveButtonFlag(), 3000);

  }

  resetSaveButtonFlag() {
    this.saveButtonClicked = false;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        this.saveButtonClicked = false;
      }
    }, 1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  checkIfSecurityTablesPresentInSelectQuery(query: string, userName: string): string {

    let queryToBeExecuted: string = query;

    // this.connectionObject = {};
    // this.connectionObject["userName"] = "Trainee User Functional";

    if (query) {
      if (query.toUpperCase().indexOf("GL_JE_HEADERS") > -1) {
        queryToBeExecuted = this.getTemporaryQuery(queryToBeExecuted, "GL_JE_HEADERS", userName);
      }
      if (query.toUpperCase().indexOf("GL_BALANCES") > -1) {
        queryToBeExecuted = this.getTemporaryQuery(queryToBeExecuted, "GL_BALANCES", userName);
      }
    }
    return queryToBeExecuted;
  }

  getTemporaryQuery(query: string, tableName: string, userName: string): string {
    let temporaryQuery: string = "(SELECT * FROM " + tableName + " e " +
      "WHERE EXISTS ( select c.ledger_id " +
      "from fun_user_role_data_asgnmnts a, per_users b ,gl_access_set_ledgers c " +
      "where a.user_guid = b.user_guid " +
      "and b.username = '" + userName + "' " +
      "and role_name like 'ORA_GL%' " +
      "and a.active_flag ! = 'N' " +
      "and a.access_Set_id = c.access_Set_id " +
      "and c.ledger_id = e.ledger_id " +
      ")) ";
    return query.replace(tableName, temporaryQuery);
  }

  checkTypedWordsInSQLEditor(eventObject: any) {
    // let test = this.query;
    // this.query = test.replace('select', '<span class="sql-reserved-key-word">SELECT</span>')

    let temporaryQuery: string = this.query;
    let oracleSQLReservedKeywordsObject: any = {};
    // console.log(this.query);
    // // return this.query.replace('select', '<span class="sql-reserved-key-word">SELECT</span>')

    // this.query = this.query.replace("select", "<mark>SELECT</mark>")

    // return temporaryQuery;

    console.log("key-------" + eventObject["keyCode"]);

    // if (eventObject && ((eventObject["keyCode"] === 32) || (eventObject["keyCode"] === 17))) {

    if (eventObject && ((eventObject["keyCode"] === 18) || (((eventObject.ctrlKey || eventObject.metaKey) && eventObject.keyCode == 86)))) {

      if (this.oracleSQLReservedKeywords && this.oracleSQLReservedKeywords.length) {
        for (let keyword of this.oracleSQLReservedKeywords) {
          oracleSQLReservedKeywordsObject[keyword] = "\\b" + keyword + "\\b";
          // temporaryQuery = temporaryQuery.replace(keyword, "<mark>" + keyword + "</mark>");
        }
      }

      // console.log("test-------" + this.replaceAllStringOccurences(temporaryQuery, oracleSQLReservedKeywordsObject));

      let htmlForQuery: string = this.replaceAllStringOccurences(temporaryQuery, oracleSQLReservedKeywordsObject);
      document.getElementById("sql-query-text").innerHTML = (htmlForQuery ? htmlForQuery.replace(/\\b/g, '') : htmlForQuery);

      // var txtarea = document.getElementById("sql-query-text");
      // var start = txtarea["selectionStart"];
      // var end = txtarea["selectionEnd"];
      // var sel = txtarea["value"].substring(start, end);
      // var finText = txtarea["value"].substring(0, start) + '[b]' + sel + '[/b]' + txtarea["value"].substring(end);
      // txtarea["value"] = finText;
      // txtarea.focus();
      // txtarea["selectionEnd"] = end + 7;
      // txtarea.focus();
      // txtarea["selectionEnd"] = 7;

      // var txtarea = document.getElementById("sql-query-text");
      /* var start = txtarea.selectionStart;
      var end = txtarea.selectionEnd;
      var sel = txtarea.value.substring(start, end);
      var finText = txtarea.value.substring(0, start) + '[b]' + sel + '[/b]' + txtarea.value.substring(end);
      txtarea.value = finText;
      txtarea.focus();
      txtarea.selectionEnd = end + 7; */

    }

    console.log("You have typed :: " + this.query + " ----" + eventObject);

  }

  getInnerHTML() {
    let temporaryQuery: string = "";
    console.log(this.query);
    // return this.query.replace('select', '<span class="sql-reserved-key-word">SELECT</span>')

    temporaryQuery = this.query.replace("select", "<mark>SELECT</mark>")

    // return temporaryQuery;
  }

  getDataFromExcelFile() {
    let fileName: string = "keywords.xlsx";
    this.oracleSQLReservedKeywords = [];
    this.sharedService.getJSON(fileName).subscribe(data => {
      const reader: FileReader = new FileReader();

      let dataKeywords;

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsKeywords: string = wb.SheetNames[0];
        const worksheetKeywords: XLSX.WorkSheet = wb.Sheets[wsKeywords];

        dataKeywords = XLSX.utils.sheet_to_json(worksheetKeywords);

        if (dataKeywords && dataKeywords.length) {
          for (let keyword of dataKeywords) {
            this.oracleSQLReservedKeywords.push(keyword["Key words"]);
          }
        }
      };
      reader.readAsBinaryString(data);
    });
  }

  replaceAllStringOccurences(stringToBeParsed: string, wordsToBeChecked: any): string{
    var regex = new RegExp(Object.values(wordsToBeChecked).join("|"),"gi");
    return stringToBeParsed.replace(regex, function(matched){
        return ("<mark> " + wordsToBeChecked[matched.toUpperCase()] + " </mark>");
    });
}
}
