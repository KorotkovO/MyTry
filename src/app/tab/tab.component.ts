import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';



interface Mydata {
  name: string;
  file: string;
  listened: number;
  company: string;
  action: string;
}



@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {



  selectedValue = null;

  filterCompany = [
    { text: 'VS', value: 'VS' },
    { text: 'CP', value: 'CP' }
  ];

  filterfn = (list: string[], item: Mydata) => list.some(company => item.company.indexOf(company) !== -1);


  listOfColumn = [
    {
      title: 'Name',
      compare: (a: Mydata, b: Mydata) => a.name.localeCompare(b.name),
      priority: 2
    },
    {
      title: 'File',
      compare: null,
      priority: false
    },
    {
      title: 'Listened',
      compare: (a: Mydata, b: Mydata) => a.listened - b.listened,
      priority: 1
    }
  ];


  // mydata = [
  //   {name: "Tim", file: "tim", listened: 10, company: "VS"},
  //   {name: "Ann", file: "ann", listened: 10, company: "VS"},
  //   {name: "Ror", file: "ror", listened: 20, company: "VS"},
  //   {name: "Tim", file: "kolea", listened: 5, company: "CP"}
  // ];


  mydata = [];
    

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.http.get<Mydata[]>("http://localhost:8080/api/" + "candy").subscribe(data => this.mydata = data);
    
  }






  addCandy(){
    console.log("got it");

    this.mydata = [
      ...this.mydata,
      {name: "Ror", file: "ron", listened: 7, company: "VS"}
    ];
    // this.mydata.push(
    //   {name: "Ror", file: "ron", listened: 7, company: "VS"}
    // )
    const body = {name: "Ror", file: "ron", listened: 0, company: "VS"};
    let d: Mydata;

    this.http.post<Mydata>("http://localhost:8080/api/candy/add/candy", body).subscribe(data => d = data );
    // Не готово!!!

    console.log(d);

    this.mydata = [
      ...this.mydata,
      d
    ];

  }










}
