export class Student {
  public id: number;
  public name: string;
  public comments: Array<string>;
  public fields: Array<string>;
  public manager: string;
  public tas: Array<string>

  constructor(student){
    this.id = student.id;
    this.name = student.name;
    this.comments = student.comments;
    this.fields = student.fields;
    this.manager = student.manager;
    this.tas = student.tas;
  }
}
