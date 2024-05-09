import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AssociationServiceService } from '../services/association-service.service';
import { AssociationComponent } from '../association/association.component';
import { AddAssociationComponent } from '../add-association/add-association.component';
import { NgToastModule } from 'ng-angular-popup';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AssociationComponent, HttpClientModule, CommonModule, FormsModule, RouterModule, AddAssociationComponent, NgToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  associacaoCarregada: boolean = false;
  associacaoCriada: boolean = false;

  title = 'AssociationApp';

  posts: any;

  constructor(private associationService: AssociationServiceService, private router: Router) { }

  loadAssociacoes() {
    this.associacaoCarregada = true;
  }
  addAssociacoes() {
    this.associacaoCriada = true;
  }

  fecharAssociacoes() {
    this.associacaoCarregada = false;
  }

}
