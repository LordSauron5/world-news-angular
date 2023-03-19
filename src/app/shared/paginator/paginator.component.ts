import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
     
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input('numberOfPages') set _numberOfPages(numberOfPages: number) {
    this.numberOfPages = numberOfPages;
    this.setPageOptions();
  }
 
  @Output() pageChanged = new EventEmitter<number>();
 
  numberOfPages = 0;
  pageOptions = [] as number[];
  currentPage = 1;
 
  constructor() {}
 
  ngOnInit(): void {}
 
  onPageClick(page: number) {
    this.currentPage = page;
    this.setPageOptions();
    this.pageChanged.emit(this.currentPage);
  }
 
  setPageOptions() {
    this.pageOptions = [
      this.currentPage - 2,
      this.currentPage - 1,
      this.currentPage,
      this.currentPage + 1,
      this.currentPage + 2,
    ].filter(
      (pageNumber) => pageNumber >= 1 && pageNumber <= this.numberOfPages
    );
  }
}
