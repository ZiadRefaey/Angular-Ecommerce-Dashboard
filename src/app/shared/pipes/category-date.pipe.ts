import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryDate',
  standalone: false,
})
export class CategoryDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
}
