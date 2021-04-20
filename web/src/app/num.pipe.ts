import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'num'
})
export class NumPipe implements PipeTransform {

  transform(value: string | undefined): number {
    if (value == undefined) return 0;
    return parseFloat(value.replace(/,/g, ''));
  }

}