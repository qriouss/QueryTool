import { Component, OnInit } from '@angular/core';
import { SqlQueryEditorService } from '../sql-query-editor/sql-query-editor.service';

@Component({
  selector: 'app-sql-library',
  templateUrl: './sql-library.component.html',
  styleUrls: ['./sql-library.component.css']
})
export class SqlLibraryComponent implements OnInit {

  public sqlQueryObjectList: any[] = [];
  
  showNoRecordsFoundMessage: boolean;

  constructor(private sqlQueryEditorService: SqlQueryEditorService) { }

  ngOnInit(): void {
    this.showNoRecordsFoundMessage = false;
    this.sqlQueryObjectList = this.sqlQueryEditorService.getSqlQuery();
    if (this.sqlQueryObjectList && this.sqlQueryObjectList.length) {
      this.showNoRecordsFoundMessage = false;
    } else {
      this.showNoRecordsFoundMessage = true;
    }
  }

}
