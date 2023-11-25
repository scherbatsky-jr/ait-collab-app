import { Component,  ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { SchoolService } from '../_services/school.service';
import { ToastrService } from 'ngx-toastr';

import { months } from '../_constants/months';
import { programs } from '../_constants/programs';

import {
  AcademicInfo,
  DropdownOption,
  School,
  UserInfo
} from '../_interfaces/types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  imageUrl: string | ArrayBuffer = '';
  profileImage!: File;

  profileSection: string = 'user-info-tab'
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  disableSubmit: boolean = false;
  schools: Array<School> = [];
  months: Array<String> = months;
  programs: Array<String> = programs;
  selectedFile: File | null = null;

  schoolDropDownOptions: Array<DropdownOption> = []
  fieldOfStudiesOptions: Array<DropdownOption> = []

  yearDropdownOptions = [
    2023,
    2022,
    2021,
    2020,
    2019
  ]

  loading: boolean = false;

  userInfo: UserInfo = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    gender: '',
    nationality: '',
    mentor: false,
    dateOfBirth: null
  }

  academicInfo: AcademicInfo = {
    intakeYear: '',
    intakeMonth: '',
    school: '',
    program: '',
    fieldOfStudy: '',
  }

  currentPassword = ''
  newPassword = ''
  confirmPassword = ''

  constructor (
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private schoolService: SchoolService,
    private toastService: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.profileSection = fragment;
      }
    });
  }

  ngOnInit() {
    this.loading = true
    const user = this.authService.getUser() as UserInfo
    
    this.schoolService.fetchSchools()
      .then(() => {
        this.userInfo = user
        this.academicInfo = user.academicInfo ? user.academicInfo : this.academicInfo;
        this.schools = this.schoolService.getSchools() as Array<School>;

        this.makeSchoolOptions();
        this.makeFieldOptions();

        this.loading = false
      });
  }

  onCheckMentor() {
    this.userInfo.mentor = !this.userInfo.mentor
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = file
      this.readImage(file);
    }
  }

  readImage(file: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  makeFieldOptions() {
    if (this.academicInfo.school) {
      const school = this.schools.find(school => school.code === this.academicInfo.school)
      
      if (school) {
          this.fieldOfStudiesOptions = school.fieldOfStudies.map(field => {
            return {
              label: field.name,
              value: field.code
            } as DropdownOption
          })
        }
    }
  }

  makeSchoolOptions() {
    this.schoolDropDownOptions = this.schools.map(school => {
      return {
        label: school.name,
        value: school.code
      }
    })
  }

  yearOptions(): Array<DropdownOption> {
    const currentYear = new Date().getFullYear();
    const startYear = 1970;
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push({
        label: year.toString(),
        value: year
      });
    }

    return years;
  }

  getTabPaneClass(tab: string): Array<string> {
    const cls = ['tab-pane']
    
    if (tab == this.profileSection) {
      cls.push('active')
    }

    return cls
  }

  onSchoolChange() {
    this.makeFieldOptions();
  }

  saveAcademicInfo(academicForm: NgForm) {
    if (academicForm.valid) {
      this.userInfo.academicInfo = this.academicInfo;

      this.updateUser();
    }
  }

  saveUserInfo(userInfoForm: NgForm) {
    if (userInfoForm.valid) {
      this.updateUser();
    }
  }

  updateUser() {
    this.disableSubmit = true
    this.userService.updateUser(this.userInfo)
      .then((responnse) => {
        this.showSuccessMessage = true;

        this.userInfo = responnse.data

        this.toastService.success("Profile updated succesfully.")

        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000)
      })
      .catch((error) => {
        this.showErrorMessage = true;

        this.toastService.error('Something went wrong. Plese try again')

        setTimeout(() => {
          this.showErrorMessage = false
        }, 3000)
      })
      .finally(() => {
        this.disableSubmit = false;
      })
  }

  uploadPhoto() {
    if (this.profileImage) {
      this.userService.uploadPhoto(this.profileImage)
    }
  }

  changePassword() {
    this. disableSubmit = true
    this.userService.updatePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    })
      .then((responnse) => {
        this.showSuccessMessage = true;

        this.userInfo = responnse.data

        this.toastService.success("Password updated succesfully.")

        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000)
      })
      .catch((error) => {
        this.showErrorMessage = true;

        this.toastService.error('Something went wrong. Plese try again')

        setTimeout(() => {
          this.showErrorMessage = false
        }, 3000)
      })
      .finally(() => {
        this.disableSubmit = false;
      })
  }
}
