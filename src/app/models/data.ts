export class ManagerData {
  public students: Array<string>;
  public tas: Array<string>;

  constructor(manager){
    this.students = manager.students;
    this.tas = manager.tas;
  }
}

export class TaStudent {
  public uid: string;
  public comments: string;

  constructor( student ) {
    this.uid = student.uid,
    this.comments = student.comments
  }
}

export class TaData {
  public manager: string
  public students: Array<TaStudent>

  constructor(ta){
    this.manager = ta.manager,
    this.students = ta.students
  }
}
