import { Photo } from './../../models/photo';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { environment } from 'src/environments/environment';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User;
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }
  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      autoUpload:false,
      maxFileSize: 10*1024*1024

    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){debugger
        const photo = JSON.parse(response);
        this.member.photos.push(photo);  
        this.uploader.clearQueue();
      }
    }
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(()=>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if(p.isMain) {
          p.isMain = false;
        }
        if(p.id == photo.id){
          p.isMain = true;
        }
      });
    })
  }
  deletePhoto(photoId:  number){
    this.memberService.deletePhoto(photoId).subscribe(()=>{
      this.member.photos = this.member.photos.filter(x => x.id != photoId);
    });
  }
}
