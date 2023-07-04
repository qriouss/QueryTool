import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../shared.service';
import { SqlQueryEditorService } from '../sql-query-editor/sql-query-editor.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {

  // @Output() public connectionObject = new EventEmitter<any>();
  connectionUrl: string;
  connectionName: string;
  userName: string;
  password: string;
  connectionObject: any;

  constructor(private dialogRef: MatDialogRef < DialogBodyComponent >,
    private sqlQueryEditorService: SqlQueryEditorService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sqlQueryEditorService.connectionObject.subscribe(connectionObject=> this.connectionObject = connectionObject);
    // this.sqlQueryEditorService.savedConnectionObject.subscribe(savedConnectionObject=> this.savedConnectionObject = savedConnectionObject);
  }

	connect(): void {
		this.dialogRef.close(true);
    this.connectionObject = {};
    this.connectionObject["connectionUrl"] = this.connectionUrl;
    this.connectionObject["userName"] = this.userName;
    this.connectionObject["password"] = this.password;
    this.connectionObject["isConnected"] = true;
    // this.connectionObject.emit(this.connectionObject);
    this.sqlQueryEditorService.changeConnectionObject(this.connectionObject);
    this.sqlQueryEditorService.setConnectedUser(this.userName);
    this.sharedService.setCurrentConnection(this.connectionObject);
	}

	save(): void {
		this.dialogRef.close(true);
    let savedConnectionObject = {};
    savedConnectionObject["connectionName"] = this.connectionName;
    savedConnectionObject["connectionUrl"] = this.connectionUrl;
    savedConnectionObject["userName"] = this.userName;
    savedConnectionObject["password"] = this.password;
    this.sharedService.addSavedConnections(savedConnectionObject);
    // this.sqlQueryEditorService.setConnectedUser(this.userName);
	}

	closePopup(): void {
		this.dialogRef.close(true);
  }

}
