export class Student {
  public id: number;
  public name: string;
  public manager: string;
  public ta: Array<string>
  public comments: Array<string>

  constructor(student){
    this.id = student.id;
    this.name = student.name;
    this.manager = '';
    this.ta = student.ta;
    this.comments = student.comments;
  }
}
