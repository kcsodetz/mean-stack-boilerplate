import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroup } from "@angular/forms";
import { HttpClientModule, HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { SignUpComponent } from './signup.component';

describe('SignupComponent', () => {
    let component: SignUpComponent;
    let fixture: ComponentFixture<SignUpComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, FormsModule],
            declarations: [SignUpComponent]
        });
        fixture = TestBed.createComponent(SignUpComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    // it('should create', () => {
    //     expect(component).toBeTruthy();
    // });
    it('form invalid when empty', () => {
        expect(component.form.valid).toBeFalsy();
    });
});
