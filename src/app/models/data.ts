export class ManagerData {
  public tas: Array<string>;
  public students: Array<string>;

  constructor(manager){
    this.tas = manager.tas,
    this.students = manager.students;
  }
}

export class TaData {
  public manager: string
  public students: Array<object>

  constructor(ta){
    this.manager = ta.manager,
    this.students = ta.students
  }
}
