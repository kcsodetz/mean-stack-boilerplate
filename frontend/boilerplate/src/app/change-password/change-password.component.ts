import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, public authservice: AuthService) { }
  response = 'NULL';
  changePasswordForm: FormGroup;
  submitted_password = false;

  // Prevent paste
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }
  // Prevent copy
  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }
  // Prevent cut
  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validator: this.checkPasswords });
  }

  get form_password() { return this.changePasswordForm.controls; }
  get response_msg() { return this.response; }

  // custom validator for checking passwords
  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmitPassword(form: NgForm) {
    this.submitted_password = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    this.authservice.changePassword(form.value.password).then((res) => {
      this.response = 'complete_password';
    }).catch((error) => {
      console.log(error);
      this.response = 'fatal_error';
    });
  }
}
