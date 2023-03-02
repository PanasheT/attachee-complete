export type PdfType =
  | 'studentDetails'
  | 'dailyLog'
  | 'projectLog'
  | 'projectDetails';

export type PdfUtility = {
  template: string;
  factory: (arg) => any;
};
