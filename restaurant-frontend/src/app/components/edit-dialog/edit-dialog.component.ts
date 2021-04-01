import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  @ViewChild('commentBox') commentBox: HTMLTextAreaElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<EditDialogComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.owner_comments) {
      this.data.owner_comments = '';
    }
  }

  captureRating(rating: number): void {
    this.data.user_rating = rating;
    this.commentBox['nativeElement'].focus();
  }

}
