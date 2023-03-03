export type PdfType =
  | 'studentDetails'
  | 'dailyLog'
  | 'projectLog'
  | 'projectDetails';

export type PdfUtility = {
  templatePath: string;
  factory: (arg: any) => any;
};
