import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SharedService {

  savedConnections: any[] = [];
  currentConnection: any;

  constructor(private http: HttpClient) {
  }

  public getJSON(fileName: string): Observable<any> {
    return this.http.get("./assets/data/" + fileName, { responseType: 'blob' });
  }

  getSavedConnections() {
    return this.savedConnections;
  }

  setSavedConnections(savedConnections: any) {
    this.savedConnections = savedConnections;
  }

  addSavedConnections(newConnection: any) {
    this.savedConnections.push(newConnection);
  }

  getCurrentConnection() {
    return this.currentConnection;
  }

  setCurrentConnection(currentConnection: any) {
    this.currentConnection = currentConnection;
  }
}
