import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { Observable } from "rxjs";



interface Mydata {
  id: number,
  name: string;
  file: string;
  listened: number;
  company: string;
  action: string;
}




@Injectable({ providedIn: "root" })
export class CandyService {
  randomUserUrl = "http://localhost:8080/api/candy";

  getUsers(pageIndex: number, pageSize: number, sortField: string | null, sortOrder: string | null, filters: Array<{ key: string; value: string[] }>): Observable< Mydata[] > {
    let params = new HttpParams()
      .append("page", `${pageIndex}`)
      .append("results", `${pageSize}`)
      .append("sortField", `${sortField}`)
      .append("sortOrder", `${sortOrder}`);
      filters.forEach(filter => {
        filter.value.forEach(value => {
          params = params.append(filter.key, value);
        });
      });
    return this.http.get< Mydata[] >(`${this.randomUserUrl}`, {params});

  }

  constructor(private http: HttpClient) {}
}







@Component({
  selector: 'app-candy',
  templateUrl: './candy.component.html',
  styleUrls: ['./candy.component.css']
})


export class CandyComponent implements OnInit {

  // total = 1;
  listOfCandy: Mydata[] = [];
  loading = true;
  pageSize = 7;
  pageIndex = 1;
  filterCompany = [
    { text: 'VS', value: 'VS' },
    { text: 'CP', value: 'CP' }
  ];

  
  searchValue = '';
  visible = false;


  //   list = [
  //   {name: "Tim", file: "tim", listened: 10, company: "VS"},
  //   {name: "Ann", file: "ann", listened: 10, company: "VS"},
  //   {name: "Ror", file: "ror", listened: 20, company: "VS"},
  //   {name: "Tim", file: "kolea", listened: 5, company: "CP"}
  // ];
  listOfDisplayData = [...this.listOfCandy];



  constructor(private serviceOfCandy: CandyService) { }

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize, null, null, []);
  }


  reset(): void {
    this.searchValue = '';
    this.search();
  }
  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfCandy.filter((item: Mydata) => item.name.indexOf(this.searchValue) !== -1);
  }



  
  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true; 
    this.serviceOfCandy
      .getUsers(pageIndex, pageSize, sortField, sortOrder, filter)
      .subscribe(data => {
        this.loading = false;
        this.listOfCandy = data;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, sort, filter} = params;
    const currentSort = sort.find(item => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }


}
