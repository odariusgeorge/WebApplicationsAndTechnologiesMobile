import { NgModule } from '@angular/core';
import { PostListComponent } from '../post-create/post-list/post-list.component';
import { PostListSellingComponent } from '../post-create/post-list-selling/post-list-selling.component';
import { PostListBuyingComponent } from '../post-create/post-list-buying/post-list-buying.component';
import { PostListExpiredComponent } from '../post-create/post-list-expired/post-list-expired.component';
import { PostCreateComponent } from '../post-create/post-create/post-create.component';
import { PostBuyComponent} from '../post-create/post-buy/post-buy.component';
import { PostListWonComponent } from './post-list-won/post-list-won.component';
import { PostListBoughtComponent } from './post-list-bought/post-list-bought.component';
import { PostListSoldComponent } from './post-list-sold/post-list-sold.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JsonFilterByPipe } from '../../helpers/json-filter-by.pipe'
import { FilterPipe } from '../../helpers/filter.pipe';
import { FilterPipeNumberLow } from '../../helpers/filter.pipe';
import { FilterPipeNumberHigh } from '../../helpers/filter.pipe';
import { PostMessagesComponent } from './post-messages/post-messages.component';
import { PostBidComponent } from './post-bid/post-bid.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent,
    PostListSellingComponent,
    PostListBuyingComponent,
    PostListExpiredComponent,
    PostListWonComponent,
    PostMessagesComponent,
    PostBuyComponent,
    PostBidComponent,
    PostListBoughtComponent,
    PostListSoldComponent,
    JsonFilterByPipe,
    FilterPipe,
    FilterPipeNumberLow,
    FilterPipeNumberHigh
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PostsModule {}
