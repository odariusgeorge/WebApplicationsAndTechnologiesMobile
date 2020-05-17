import {Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Validators } from '@angular/forms';
import { mimeType} from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}
  private mode = 'create';
  private postId: string;
  public post: Post;
  public isLoading = false;
  form: FormGroup;
  imagePreview: string;

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      author: new FormControl(null, {validators: [Validators.required]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      course: new FormControl(null, {validators: [Validators.required]}),
      university: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      startingPrice: new FormControl(null, {validators: [Validators.required]}),
      minimumAllowedPrice: new FormControl(null, {validators: [Validators.required]}),
      date: new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            course: postData.course,
            university: postData.university,
            author: postData.author,
            messages: postData.messages,
            startingPrice: postData.startingPrice,
            minimumAllowedPrice: postData.minimumAllowedPrice,
            winner: postData.winner,
            date: postData.date,
            bought: postData.bought,
            bidders: postData.bidders
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
            course: this.post.course,
            university: this.post.university,
            author: this.post.author,
            startingPrice: this.post.startingPrice,
            minimumAllowedPrice: this.post.minimumAllowedPrice,
            date: this.post.date
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
        this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if(this.form.invalid || this.form.value.startingPrice <= 0 || this.form.value.minimumAllowedPrice <= 0) {
      window.alert("Introduce all the fields and the image! Prices should be bigger than 0!");
      return;
    }
    this.isLoading = true;
    if(this.mode == "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.course,
        this.form.value.university,
        this.form.value.author,
        this.form.value.startingPrice,
        this.form.value.minimumAllowedPrice,
        this.form.value.date
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.course,
        this.form.value.university,
        this.form.value.author,
        this.post.messages,
        this.post.startingPrice,
        this.post.minimumAllowedPrice,
        this.post.winner,
        this.post.date,
        this.post.bidders
        );
    }
    this.form.reset();
    }
}
