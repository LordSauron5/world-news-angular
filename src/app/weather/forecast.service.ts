import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of, throwError } from 'rxjs';
import { 
  map, 
  switchMap, 
  pluck, 
  mergeMap, 
  filter, 
  toArray, 
  share,
  tap,
  catchError,
  retry
} from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast'
  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService  
  ) {}

  getForecast() {
    return this.getCurrentLocation()
    .pipe(
      map(coords => {
        return new HttpParams()
        .set('lat', String(coords.latitude))
        .set('lon', String(coords.longitude))
        .set('units', 'metric')
        .set('appid', '6ba84a5e7948a236b22abc5f3619d592')
      }),
      switchMap(params => this.http.get<OpenWeatherResponse>(this.url, { params })),
      pluck('list'),
      mergeMap(value => of(...value)), // ...value essentially takes all the values of the array and emits it to the observable like next(10)
      filter((value, index) => index % 8 === 0),
      map(value => {
        return {
          dateString: value.dt_txt,
          temp: value.main.temp
        }
      }),
      toArray(),
      share()
    );
  }

  getCurrentLocation() {
    return new Observable<GeolocationCoordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position.coords);
          observer.complete();
        },
        (err) =>  observer.error(err)
      );
    }).pipe(
      retry(1), 
      tap(
        () => {
        this.notificationsService.addSuccess("Got your location");
      }, 
      catchError((err) => {
        // #1 - Handle the error
        this.notificationsService.addError("Failed to get your location");

        // #2 - Return a new observable
         return throwError(err);

         /*
         "return throwError(err)" IS THE EXACT SAME AS:
         return new Observable(observer => ) {
           observer.error(err);
         }
         */
      })
      )
    );
  }
}
