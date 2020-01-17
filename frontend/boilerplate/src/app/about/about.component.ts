import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

 aboutUser: String = 'Ken Sodetz is an engineer from Chicago, IL. '
  + 'He graduated from Purdue University with his bachelors in Computer Science in 2020.';

  constructor() { }

  ngOnInit() {
  }

}
