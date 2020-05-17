import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return items; }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (item && item[fieldName]) {
        return item[fieldName].toLowerCase().includes(searchText);
      }
      return false;
    });
   }

}


@Pipe({
  name: 'filterNumberLow'
})
export class FilterPipeNumberLow implements PipeTransform {

  transform(items: any[], searchText: number, fieldName: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return items; }

    return items.filter(item => {
      if (item && item[fieldName] >= searchText ) {
        return item[fieldName];
      }
      return false;
    });
   }

}

@Pipe({
  name: 'filterNumberHigh'
})
export class FilterPipeNumberHigh implements PipeTransform {

  transform(items: any[], searchText: number, fieldName: string): any[] {

    if (!items) { return []; }

    if (!searchText) { return items; }

    return items.filter(item => {
      if (item && item[fieldName] <= searchText ) {
        return item[fieldName];
      }
      return false;
    });
   }

}
