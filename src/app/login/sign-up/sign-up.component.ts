import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { LoggedUserService } from '../../services/logged-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  submitted = false;
  form: FormGroup;

  constructor(private loginService: LoggedUserService, private router: Router, @Inject(FormBuilder) fb: FormBuilder) {
    this.form = fb.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      passwords: fb.group({
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        repeat: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, {validator: this.areEqual}),
      name: ['', Validators.compose([Validators.required])],
      role: ['', Validators.required]
    });
  }

  roles = ['Manager', 'Teaching Assistant (TA)']

  areEqual: ValidatorFn = (g: FormGroup) => {
    return (g.get('password').value === g.get('repeat').value)  ? null : {mismatch: true};
  };

  ngOnInit() {
  }

  onSubmit = () => {
    this.submitted = true;
    this.loginService.signup(this.form.value.username, this.form.value.passwords.password, this.form.value.name, this.form.value.role)
      .then(() => {
        this.form.reset();
        this.router.navigate(['/'])
      }).catch((err) => {console.log(err);});
  };
}
