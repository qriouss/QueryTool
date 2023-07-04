import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqlQueryEditorService {

  private isConnectionEstablished: boolean;
  private sqlQueryObjectList: any[] = [];
  private loggedInUserName: string;
  private connectedUser: string;

  private connectionObjectSource = new BehaviorSubject<string>('service');
  connectionObject = this.connectionObjectSource.asObservable();

  private savedConnectionObjectSource = new BehaviorSubject<string>('service');
  savedConnectionObject = this.savedConnectionObjectSource.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  getLoggedInUserName(): string {
    return this.loggedInUserName;
  }

  setLoggedInUserName(loggedInUserName: string) {
    this.loggedInUserName = loggedInUserName;
  }

  getConnectedUser(): string {
    return this.connectedUser;
  }

  setConnectedUser(connectedUser: string) {
    this.connectedUser = connectedUser;
  }

  changeConnectionObject(connectionObject: string) {
    this.connectionObjectSource.next(connectionObject)
  }

  changeSavedConnectionObject(savedConnectionObject: string) {
    this.savedConnectionObjectSource.next(savedConnectionObject)
  }

  public getIsConnectionEstablished(): boolean {
    return this.isConnectionEstablished;
  }
  public setIsConnectionEstablished(value: boolean) {
    this.isConnectionEstablished = value;
  }

  getLoginService(Username: string, Password: string, deviceIPAddress: string, browserName: string) {
    let url = 'https://fa-epvg-test-saasfaprod1.fa.ocs.oraclecloud.com:443/xmlpserver/services/v2/ReportService';
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      })
    };
    let postData = JSON.stringify({
      "UserID": Username,
      "Password": Password,
      "DeviceIP": deviceIPAddress,
      "BrowserName": browserName
    });
    return this.httpClient.post(url, postData, httpOptions).pipe();
  }

  // signin(query: string) {
  //   let url = 'https://fa-epvg-test-saasfaprod1.fa.ocs.oraclecloud.com:443/xmlpserver/services/v2/ReportService';
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'text/xml');
  //   /* headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
  //   headers.append('Access-Control-Allow-Credentials', 'true');
  //   headers.append('POST', 'OPTIONS'); */

  //   headers.append('Access-Control-Allow-Origin', '*');
  //   headers.append('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  //   headers.append('Access-Control-Allow-Methods', 'POST');

  //   headers = headers.append('Accept', 'text/xml');
  //   let body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v2="http://xmlns.oracle.com/oxp/service/v2"><soapenv:Header/><soapenv:Body><v2:runReport><v2:reportRequest><v2:attributeFormat>xml</v2:attributeFormat><v2:byPassCache>True</v2:byPassCache><v2:flattenXML>True</v2:flattenXML><v2:parameterNameValues><v2:listOfParamNameValues><v2:item><v2:name>P_QUERY</v2:name><v2:values><v2:item>U0VMRUNUICoKRlJPTSBwb3pfc3VwcGxpZXJzCldIRVJFIHJvd251bSA8PTc1MDAw</v2:item></v2:values></v2:item></v2:listOfParamNameValues></v2:parameterNameValues>                         <v2:reportAbsolutePath>Custom/XXAB Reports/Query/Base64QueryCloudReport.xdo</v2:reportAbsolutePath><v2:sizeOfDataChunkDownload>-1</v2:sizeOfDataChunkDownload></v2:reportRequest><v2:userID>Trainee User Functional</v2:userID><v2:password>Welcome@123</v2:password></v2:runReport></soapenv:Body></soapenv:Envelope>';

  //   return this.httpClient.post(url, body, { headers: headers, responseType: 'text' });
  // }

  async signin(query: string) {
    const url = 'http://localhost:3000' + `/migData/FilterValue/0`;
    let data = await this.httpClient.get(url).toPromise();
    return data;
  }

  async executeQuery(requestBody: any) {
    const url = 'http://localhost:3000' + `/migData/executeQuery`;
    let data = await this.httpClient.post(url, requestBody).toPromise();
    return data;
  }

  getSqlQuery(): any[] {
    return this.sqlQueryObjectList;
  }

  setsqlQuery(sqlQuery: string, userName: string) {
    let sqlQueryObject: any = {};
    sqlQueryObject["sqlQuery"] = sqlQuery;
    sqlQueryObject["userName"] = userName;
    this.sqlQueryObjectList.push(sqlQueryObject);
  }

}
