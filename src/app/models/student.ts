export class Student {
  public uid: string;
  public comments: {field: string, ta: string, comment: string}[];
  public manager: string;
  public tas: Array<string>;

  constructor(student){
    this.uid = student.id;
    this.comments = student.comments;
    this.manager = student.manager;
    this.tas = student.tas;
  }
}
