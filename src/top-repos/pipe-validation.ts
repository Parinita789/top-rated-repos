import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as moment from 'moment'
import { validate } from 'class-validator';
import { INVALID_DATE_FORMAT } from './constants/error-message.constant';

@Injectable()
export class GetQueryPipe implements PipeTransform {
  async transform(value: any): Promise<any> {
    // Check date format
    const parsedDate = moment(value.date, 'YYYY-MM-DD', true);
    if (!parsedDate.isValid()) {
      throw new BadRequestException(INVALID_DATE_FORMAT);
    }
    value.date = parsedDate.format('YYYY-MM-DD');
    const errors = await validate(value, { skipMissingProperties: false });
   
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}