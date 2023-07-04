import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';
import { SqlQueryEditorService } from '../sql-query-editor/sql-query-editor.service';
import { Router } from '@angular/router';
import { SharedService } from '../shared.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  connectionObject: any;
  // savedConnectionObject: any;
  loggedInUserName: string;
  connectedUser: string;
  selectedConnection: string;
  connectOptions: any [] = ["Add connection"];
  savedConnectOptions: any [] = [];
  connectionName: any;

  constructor(
    private dialog: MatDialog,
    private sqlQueryEditorService: SqlQueryEditorService,
    private router: Router,
    private sharedService: SharedService
    ) { }

  ngOnInit(): void {
    this.sqlQueryEditorService.connectionObject.subscribe(connectionObject => this.connectionObject = connectionObject);
    // this.sqlQueryEditorService.savedConnectionObject.subscribe(savedConnectionObject => this.savedConnectionObject = savedConnectionObject);
    this.loggedInUserName = this.sqlQueryEditorService.getLoggedInUserName();
    this.connectedUser = this.sqlQueryEditorService.getLoggedInUserName();
    this.getExistingConnections();
  }

  connect() {
    this.getExistingConnections();
    if (this.selectedConnection === "Add connection") {
      this.showDialog(null, null, null, null);
      this.selectedConnection = "";
    } else if (this.selectedConnection && this.selectedConnection["connectionName"]) {
      this.sharedService.setCurrentConnection(this.selectedConnection);
    }
  }

  getIsConnected() {
    // return (this.connectionObject && this.connectionObject['isConnected']);
    this.connectionName = (this.selectedConnection ? this.selectedConnection['connectionName'] : "");
    return (this.selectedConnection && this.selectedConnection['connectionName']);
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
      width: '35%',
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.sqlQueryEditorService.setIsConnectionEstablished(true);
      }
    });
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.resetConnectionObject();
  }

	resetConnectionObject(): void {
    this.connectionObject = {};
    this.connectionObject["isConnected"] = false;
    this.sqlQueryEditorService.changeConnectionObject(this.connectionObject);
	}

  getConnectedUser() {
    this.connectedUser = this.sqlQueryEditorService.getConnectedUser();
  }

  getExistingConnections() {
    let savedConnections = this.sharedService.getSavedConnections();
    if (savedConnections && savedConnections.length) {
      // let connections: any = ["Add connection"];
      // connections = connections.concat(savedConnections)
      this.savedConnectOptions = savedConnections;
    }
    console.log(JSON.stringify(this.savedConnectOptions));    
  }

}
