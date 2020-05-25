import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../../providers/auth-service/auth-service';
import { OtpPage } from '../otp/otp';
import { AccountPage } from '../account/account';

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage {

  

  passwordForm: any;
    shouldHeight = document.body.clientHeight + 'px';
    confirm_pass = "";
    passwordData = { password: '' };
    isPasswordViewed: boolean = false;
    passwordIcon = "eye-off";
    passwordType = "password";
    keyBoardShow = false;

    constructor(public navCtrl: NavController, private keyboard: Keyboard, public alertCtrl: AlertController, public navParams: NavParams, private _formBuilder: FormBuilder, public authService: AuthService) {
        this.passwordForm = this._formBuilder.group({
            Password: ["", [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
            confirm_pass: ["", [Validators.required, this.equalto('Password')]]
        });
    }

    passwordViewSwitch() {
        this.isPasswordViewed = !this.isPasswordViewed;
        if (this.isPasswordViewed) {
            this.passwordIcon = "eye";
            this.passwordType = "text";
        }
        else {
            this.passwordIcon = "eye-off";
            this.passwordType = "password";
        }
    }

    equalto(field_name): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let input = control.value;
            let isValid = control.root.value[field_name] == input;
            if (!isValid)
                return { 'equalTo': { isValid } };
            else
                return null;
        };
    }

    

    updatepassword() {
        if (this.passwordForm.invalid) {
            return;
        }
        let formData = new FormData();
        formData.append('phone', this.navParams.get('phone'));
        formData.append('password', this.passwordData.password);
        this.authService.updatepassword(formData).then((result) => {
            if (result['status']) {
                this.showAlert("Your Password updated successfully");
            }
        });
    }

    otp() {
        this.navCtrl.push(OtpPage)
    }

    ionViewWillEnter() {
        this.keyboard.onKeyboardShow().subscribe(res => {
            this.keyBoardShow = true;
        });

        this.keyboard.onKeyboardHide().subscribe(res => {
            this.keyBoardShow = false;
        });
    }
    showAlert(msg) {
        let alert = this.alertCtrl.create({
            title: 'Success!',
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present();
    }

    goBack(){
        this.navCtrl.setRoot(AccountPage,{},{ animate: true, direction: 'back' });
    }

}
