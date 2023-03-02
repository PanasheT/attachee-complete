import * as moment from 'moment';
import { DailyLogEntity } from 'src/modules/daily-log/entities';

export interface DailyLogPdf {
  company: string;
  logDate: string;
  regNumber: string;
  checkIn: string;
  checkOut: string;
  description: string;
  notes: string;
  difficulties: string;
}

export function DailyLogPdfFactory(model: DailyLogEntity): DailyLogPdf {
  return {
    company: model.student?.company?.name,
    logDate: moment(model.checkIn).format('Do [of] MMMM, YYYY'),
    regNumber: model.student.regNumber,
    checkIn: moment(model.checkIn).format('hh:mm A'),
    checkOut: moment(model.checkOut).format('hh:mm A'),
    description: model.description,
    notes: model.comment,
    difficulties: model.difficulties,
  };
}
