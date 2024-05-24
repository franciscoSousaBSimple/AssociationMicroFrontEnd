import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IProject } from '../model/IProject';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  public urlGet = 'http://localhost:5186';
  //private urlPost = 'https://localhost:5188';
  constructor(private httpClient: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /** GET projects from the server */
  getProjects(): Observable<IProject[]> {
    return this.httpClient
      .get<IProject[]>(this.urlGet + '/api/Project')
      .pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      console.log("error: " + error.message)
      return error;
    });
  }
}
