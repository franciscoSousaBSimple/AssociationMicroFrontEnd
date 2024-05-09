import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import { AssociationServiceService } from '../services/association-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IAssociation } from '../model/IAssociation';
import { NgToastService } from 'ng-angular-popup';
import { ColaboratorServiceService } from '../services/colaborator-service.service';
import { IColaborator } from '../model/IColaborator';
import { IProject } from '../model/IProject';

@Component({
  selector: 'app-add-association',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './add-association.component.html',
  styleUrl: './add-association.component.css'
})
export class AddAssociationComponent implements OnInit {
  @Output() associationAdded: EventEmitter<IAssociation> = new EventEmitter<IAssociation>();
  successMessageVisible: boolean = false;
  colaboratorsIdLista: number[] = [];
  colaboratorsLista: IColaborator[] = [];
  @Input() colaboradoresAssocLista: IColaborator[] = [];
  @Input()projectsAssocLista: IProject[] = [];
  associationsLista: IAssociation[] = [];

  showCreateAssociation: boolean = false;
  showAssociationNameError: boolean = false;

  constructor(private associationService: AssociationServiceService, private colabService: ColaboratorServiceService, private ro1uter: Router, private location: Location, private toast: NgToastService) { }


  validateAndAddAssociation(idcolab: string, idProject: string, startDate: string, endDate: string) {
    // Verifica se o campo de nome está vazio
    const colaboratorId = parseInt(idcolab);
    const projectId = parseInt(idProject);
    if (!idcolab || !idProject) {
      this.showAssociationNameError = true;
      return;
    }
    this.addAssociation(colaboratorId, projectId, startDate, endDate);
  }

  ngOnInit(): void {
  }

  addAssociation(colaboratorId: number, projectId: number, startDate1: string, endDate1: string): void {

    if (endDate1) {
      const endDateObj = new Date(endDate1);
      const startDateObj = new Date(startDate1);
      // Verificar se a data de início é anterior à data de término
      if (startDateObj > endDateObj) {
        alert('A data de término deve ser posterior à data de início.');
        return;
      }
    }

    const startDate: string = new Date(startDate1).toISOString().split('T')[0];
    const endDate: string = new Date(endDate1).toISOString().split('T')[0];

    this.associationService.addAssociation({ colaboratorId, projectId, startDate, endDate } as unknown as IAssociation)
      .subscribe((proj: IAssociation) => {
        this.associationAdded.emit(proj);
        this.successMessageVisible = true;
        this.toast.info({ detail: "Pendente das férias", summary: 'Para criar uma associação, não pode coincidir com ferias', duration: 4000 });
      }, (error) => {
        this.toast.info({ detail: "Período e/ou projeto incorreto(s)", summary: 'Erro ao adicionar associação', duration: 4000 });
      });
  }

  goBack(): void {
    this.showCreateAssociation = false;
    this.location.back()
  }

}
