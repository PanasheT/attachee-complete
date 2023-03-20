import * as moment from 'moment';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { GitCommitPdf, GitCommitPdfFactory } from './git-commit-pdf';

export interface DailyLogPdf {
  company: string;
  logDate: string;
  regNumber: string;
  checkIn: string;
  checkOut: string;
  description: string;
  notes: string;
  difficulties: string;
  gitCommits: GitCommitPdf[];
}

export function DailyLogPdfFactory(model: DailyLogEntity): DailyLogPdf {
  return {
    company: model.student?.company?.name,
    logDate: moment(model.checkIn).format('Do [of] MMMM, YYYY'),
    regNumber: model.student.regNumber,
    checkIn: moment(model.checkIn).utcOffset(2).format('hh:mm A'),
    checkOut: moment(model.checkOut).utcOffset(2).format('hh:mm A'),
    description: model.description,
    notes: model.comment,
    difficulties: model.difficulties,
    gitCommits: model?.gitCommits
      ? model.gitCommits.map(GitCommitPdfFactory)
      : [],
  };
}
