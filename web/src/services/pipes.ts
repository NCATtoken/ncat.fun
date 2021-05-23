import { Pipe, PipeTransform } from '@angular/core';
import * as marked from "marked";

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value && value.length > 0) {
      return marked(value);
    }
    return value;
  }
}


@Pipe({
  name: 'num'
})
export class NumPipe implements PipeTransform {

  transform(value: string | undefined): number {
    if (value == undefined) return 0;
    return parseFloat(value.replace(/,/g, ''));
  }

}

@Pipe({
  name: 'shortaddress'
})
export class ShortAddressPipe implements PipeTransform {

  transform(value: string | undefined): any {
    if (value == undefined || value.length < 10) return value;
    return value.substr(0, 6) + '...' + value.substr(-4);
  }
}

