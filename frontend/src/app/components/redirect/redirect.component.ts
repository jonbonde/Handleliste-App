import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent {
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/frontpage']);
  }
}
