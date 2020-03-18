export class Student {
  public uid: number;
  public name: string;
  public comments: Array<string>;
  public fields: Array<string>;
  public manager: string;
  public tas: Array<string>

  constructor(student){
    this.uid = student.id;
    this.name = student.name;
    this.comments = student.comments;
    this.fields = student.fields;
    this.manager = student.manager;
    this.tas = student.tas;
  }
}
