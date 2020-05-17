import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'jsonFilterBy' })
@Injectable()
export class JsonFilterByPipe implements PipeTransform {

  transform(json: any[], args: any[]) : any[] {
    var searchText = args[0];
    var jsonKey = args[1];

    if(searchText == null || searchText == 'undefined') return json;
    if(jsonKey    == null || jsonKey    == 'undefined') return json;

    var returnObjects = json;
    json.forEach( function ( filterObjectEntery ) {

      if( filterObjectEntery.hasOwnProperty( jsonKey ) ) {

        if ( typeof filterObjectEntery[jsonKey] != "undefined" &&
        filterObjectEntery[jsonKey].toLowerCase().indexOf(searchText.toLowerCase()) > -1 ) {
        } else {
            returnObjects = returnObjects.filter(obj => obj !== filterObjectEntery);
        }
      } else {
      }

    })
    return returnObjects;
  }
}
