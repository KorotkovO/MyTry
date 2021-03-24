import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';




interface Mydata {
  id: number,
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

  visible = false;
  visibletwo = false;
  selectedValue = null;
  searchValue = '';
  namecompare = (a: Mydata, b: Mydata) => a.name.localeCompare(b.name);
  namepriority = 2;


  filterCompany = [
    { text: 'VS', value: 'VS' },
    { text: 'CP', value: 'CP' }
  ];
  filterfn = (list: string[], item: Mydata) => list.some(company => item.company.indexOf(company) !== -1);

  listOfColumn = [
    // {
    //   title: 'Name',
    //   compare: (a: Mydata, b: Mydata) => a.name.localeCompare(b.name),
    //   priority: 2
    // },
    {
      title: 'File',
      compare: (a: Mydata, b: Mydata) => a.file.localeCompare(b.file),
      priority: false
    },
    {
      title: 'Listened',
      compare: (a: Mydata, b: Mydata) => a.listened - b.listened,
      priority: 1
    }
  ];

  isVisible = false;
  isVisibleTwo = false;
  newName: string = '';
  newFile: string = '';
  newCompany: string = '';
  newNameTwo: string = '';
  newFileTwo: string = '';
  newCompanyTwo: string = '';
  forEditId: number = null;
  forNoEditListened = null;



  mydata = [];
  listOfDisplayData = this.mydata;
    

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Mydata[]>("http://localhost:8080/api/candy").subscribe(data => {
      this.mydata = data;   
      this.listOfDisplayData = this.mydata;
    } );
  }

  
  addCandy( theName: string, theFile: string, theCompany: string){
    console.log("got it");
    const body = {name: theName, file: theFile, listened: 0, company: theCompany};
    this.http.post<Mydata>("http://localhost:8080/api/candy/add", body).subscribe((data: Mydata) => {
       this.mydata = [
        ...this.mydata,
        data ];
        this.listOfDisplayData = this.mydata;
        console.log(data);
        console.log(data.id);
      } );
      this.newName = '';
      this.newFile = '';
      this.newCompany = '';
      this.isVisible = false;
  }
  deleteCandy(id: number){
    console.log(id);
    const url: string = ("http://localhost:8080/api/candy/" + id);
    console.log(url);
    this.http.delete(url).subscribe((x: Mydata) => {
      this.http.get<Mydata[]>("http://localhost:8080/api/" + "candy").subscribe(data => {
        this.mydata = data;
        this.listOfDisplayData = this.mydata;
      });
    });
  }
  editCandy(id: number, theName: string, theFile: string, theListened: number, theCompany: string){
    const body = {name: theName, file:  theFile, listened: theListened, company: theCompany};
    this.http.put<Mydata>("http://localhost:8080/api/candy/" + id, body).subscribe((data: Mydata) => {
      this.mydata = [
        ...this.mydata,
        data ];
        console.log(data);
        console.log(data.id + " was changed!");
          this.http.get<Mydata[]>("http://localhost:8080/api/" + "candy").subscribe(data => {
          this.mydata = data;
          this.listOfDisplayData = this.mydata;
        });
      } );

    this.newNameTwo = '';
    this.newFileTwo = '';
    this.newCompanyTwo = '';
    this.forEditId = null;
    this.forNoEditListened = null; 
    this.isVisibleTwo = false;
  }


  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.mydata.filter((item: Mydata) => item.name.indexOf(this.searchValue) !== -1);
  }
  select(): void {
    this.visible = false;
    console.log(this.selectedValue);
    this.listOfDisplayData = this.mydata.filter((item: Mydata) => item.company.indexOf(this.selectedValue) !== -1);
  }
  reset(): void {
    this.selectedValue = null;
    this.http.get<Mydata[]>("http://localhost:8080/api/candy").subscribe(data => {
      this.mydata = data;   
      this.listOfDisplayData = this.mydata;
    } );
  }


  showModal(): void {
    this.isVisible = true;
  }
  showModalTwo(candy: Mydata): void {
    this.forEditId = candy.id;
    this.forNoEditListened = candy.listened;
    this.newNameTwo = candy.name;
    this.newFileTwo = candy.file;
    this.newCompanyTwo = candy.company;
    this.isVisibleTwo = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisibleTwo = false;
  }










}
