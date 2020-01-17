import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-signup',
    templateUrl: 'signup.component.html'

})

export class SignUpComponent implements OnInit {
    @ViewChild('alert') alert: ElementRef;
    signUpForm: FormGroup;
    submitted = false;
    loading: boolean;
    response = 'NULL';

    constructor(public authService: AuthService, private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.signUpForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        }, { validator: this.checkPasswords });
    }

    private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.confirmPassword.value;

        return pass === confirmPass ? null : { notSame: true };
    }

    get form() { return this.signUpForm.controls; }

    get response_msg() { return this.response; }

    closeAlert() {
        this.alert.nativeElement.classList.remove('show');
    }

    signUp(form: NgForm) {
        this.submitted = true;
        if (this.signUpForm.invalid) {
            return;
        }
        this.loading = true;
        this.authService.registerUser(form.value.email, form.value.username, form.value.password).then((res) => {
            this.loading = false;
            this.response = 'complete';
        }).catch((err) => {
            this.loading = false;
            console.log(err);
            if (err.error.message === 'User already exists') {
                this.response = 'duplicate';
            } else {
                this.response = 'fatalError';
            }
        });
    }
}
