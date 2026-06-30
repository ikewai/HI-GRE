import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, merge, of } from 'rxjs';
import { Cover } from './cover';
import { map, retry, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class DBConnectService {

  static readonly TOKEN_FILE = "/assets/APIToken.txt"
  static readonly API_URL = "https://api.hcdp.ikewai.org/higre/query"
  static readonly MAX_URI = 2000;
  static readonly MAX_POINTS = 500;

  tokenReader: FileReader;

  oAuthAccessToken = "token";

  constructor(private http: HttpClient) {
    this.http.get(DBConnectService.TOKEN_FILE, { responseType: "text" }).subscribe(data => {
      this.oAuthAccessToken = data;
    });
  }

  spatialQueryLength(geometry: any): number {
    let query = `{"$and":[{"name":"Landuse"},{"value.name":"dataset02172019"},{"value.loc": {"$geoWithin": {"$geometry":${JSON.stringify(geometry)}}}}]}`;
    let url = `${DBConnectService.API_URL}?q=${encodeURI(query)}&limit=${DBConnectService.MAX_POINTS}&offset=0`;
    return url.length;
  }

  debugQuery() {
    console.log("called debug query");
    let sampleQuery = `{"$and":[{"name":"Landuse"},{"value.name":"dataset02172019"},{"value.loc": {"$geoWithin": {"$geometry":{"type":"Polygon","coordinates":[[[-158.068537,21.465326],[-158.068537,21.54625],[-157.926289,21.54625],[-157.926289,21.465326],[-158.068537,21.465326]]]}}}}]}`;    let url = `${DBConnectService.API_URL}?q=${encodeURI(sampleQuery)}&limit=${DBConnectService.MAX_POINTS}&offset=0`;
    let head = new HttpHeaders()
    .set("Authorization", "Bearer " + this.oAuthAccessToken)
    .set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    this.http.get<Cover[]>(url, options)
    .pipe(
      retry(3),
      map((data: Cover[]) => {
        data.forEach((record) => {
          this.sanityCheck(record);
        });
        console.log("debug query complete");
      })
    ).subscribe();
  }

  sanityCheck(record: any) {
    let base = record.value;
    let scenarios = ["recharge_scenario0", "recharge_scenario1"];
    let dne = [1, 3, 19];
    let large = [13, 25]

    scenarios.forEach((scenario) => {
      base[scenario].forEach((value, i) => {
        if(value == null && !dne.includes(i)) {
          console.log("Null value found:\n"
          + "Scenario: " + scenario + "\n"
          + "Land Cover Index: " + i.toString() + "\n"
          + "Cell Index: {" + base.x.toString() + "," + base.y.toString() + "}");
        }
        if(value > 400 && !large.includes(i)) {
          console.log("Large value found:\n"
          + "Scenario: " + scenario + "\n"
          + "Land Cover Index: " + i.toString() + "\n"
          + "Cell Index: (" + base.x.toString() + "," + base.y.toString() + ")");
        }
      });
    });
  }

  spatialSearch(geometry: any, offset: number = 0, resultSet = []): Observable<Cover[]> {
    let query = `{"$and":[{"name":"Landuse"},{"value.name":"dataset02172019"},{"value.loc": {"$geoWithin": {"$geometry":${JSON.stringify(geometry)}}}}]}`;
    let url = `${DBConnectService.API_URL}?q=${encodeURI(query)}&limit=${DBConnectService.MAX_POINTS}&offset=${offset.toString()}`;
    // console.log(query);
    // console.log(url);
    let head = new HttpHeaders()
    .set("Authorization", "Bearer " + this.oAuthAccessToken)
    .set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    let response = this.http.get<Cover[]>(url, options)
    .pipe(
      retry(3),
      mergeMap((data: Cover[]) => {
        let result = resultSet.concat(data);
        //console.log(localResult);
        if(data.length >= DBConnectService.MAX_POINTS) {
          //console.log("next");
          return this.spatialSearch(geometry, offset + DBConnectService.MAX_POINTS, result);
        }
        else {
          //console.log("done");
          return of(result);
        }
      }),
      catchError((e) => {
        console.error(e);
        return Observable.throw(new Error(e.message));
      })
    );

    return response;
  }


  indexSearch(indexes: {x: number, y: number}[]): Observable<Cover[]> {
    //this will use the 0 indexed feature from the leaflet map, which should be a GeoJSON polygon, for the spatial search boundry

    //build query
    let indexQueryParts = [];
    for(let index of indexes) {
      indexQueryParts.push(`{"value.x":${index.x},"value.y":${index.y}}`);
    }
    let indexQueryJoined = indexQueryParts.join(",");
    let query = `{"$and":[{"name":"Landuse","value.name":"dataset02172019","$or":[${indexQueryJoined}]}]}`;

    let url = `${DBConnectService.API_URL}?q=${encodeURI(query)}&limit=${DBConnectService.MAX_POINTS}&offset=0`;
    let head = new HttpHeaders()
    .set("Authorization", "Bearer " + this.oAuthAccessToken)
    .set("Content-Type", "application/x-www-form-urlencoded");
    let options = {
      headers: head
    };

    let response = this.http.get<Cover[]>(url, options)
    .pipe(
      retry(3),
      map((data) => {
        return data;
      }),
      catchError((e) => {
        return Observable.throw(new Error(e.message));
      })
    );

    return response;
  }
}
