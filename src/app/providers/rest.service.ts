import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getBaseURL(){
    return environment.baseUrl;
  }

  getRequest(url): Observable<any> {
    return this.http.get<any>(this.getBaseURL() + url)
      .pipe(
        tap(_ => this.log('url')),
        catchError(this.handleError('get', []))
      );
  }
  postRequest(data,url): Observable<any> {
    return this.http.post<any>(this.getBaseURL() + url, data)
      .pipe(
        tap(_ => this.log('url')),
        catchError(this.handleError('post', []))
      );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(message);
  }
}
