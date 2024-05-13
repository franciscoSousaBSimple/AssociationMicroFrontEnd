import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AssociationServiceService } from '../services/association-service.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IAssociation } from '../model/IAssociation';
import { AddAssociationComponent } from '../add-association/add-association.component';
import { NgToastService } from 'ng-angular-popup';
import { ColaboratorServiceService } from '../services/colaborator-service.service';
import { IColaborator } from '../model/IColaborator';
import { ProjectServiceService } from '../services/project-service.service';
import { IProject } from '../model/IProject';

@Component({
  selector: 'app-association',
  standalone: true,
  imports: [AssociationComponent, HttpClientModule, CommonModule, FormsModule, AddAssociationComponent],
  templateUrl: './association.component.html',
  styleUrl: './association.component.css'
})
export class AssociationComponent implements OnInit {
  associationsLista: IAssociation[] = [];
  filteredAssociations: IAssociation[] = [];
  searchQuery: string = ''; // Definindo a propriedade 'searchQuery'
  showCreateAssociation: boolean = false;
  showEditAssociation: boolean = false;
  addAssociation: boolean = false;
  getAssociation: boolean = false;
  pollingInterval: any;
  pollingCount: number = 0;
  maxPollingCount: number = 3;
  successMessageVisible: boolean = false;
  colaboratorsIdLista: number[] = [];
  colaboratorsLista: IColaborator[] = [];
  colaboradoresAssocLista: IColaborator[] = [];
  projectsLista: IProject[] = [];
  projectsAssocLista: IProject[] = [];
  @Output() fecharAssociationEvent = new EventEmitter<void>();

  constructor(private associationService: AssociationServiceService, private projectService: ProjectServiceService, private colabService: ColaboratorServiceService, private router: Router, private location: Location, private toast: NgToastService) { }

  ngOnInit(): void {
    this.getAssociations();
    this.getColabs();
    this.getProjects();
  }

  onAssociationAdded(): void {
    this.pollingInterval = setInterval(() => {
      if (this.pollingCount >= this.maxPollingCount) {
        this.pollingCount = 0;
        clearInterval(this.pollingInterval);
        return;
      }
      this.pollingCount++;
      this.refreshAssociations();
    }, 5000);
  }

  refreshAssociations(): void {
    let previousCount = this.associationsLista.length;
    this.associationService.getAssociations().subscribe((holidays) => {
      this.associationsLista = holidays;
      this.filteredAssociations = holidays;
      const currentCount = this.associationsLista.length;
      if (currentCount > previousCount) {
        this.toast.success({
          detail: 'New Association added!',
          summary: 'Success',
          duration: 5000,
        });
        previousCount = currentCount;
        this.pollingCount = this.maxPollingCount;
      }
    });
    this.showCreateAssociation = false;
  }

  getColaboratorName(colaboratorId: number): string {
    const colaborator = this.colaboradoresAssocLista.find(colab => colab.id === colaboratorId);
    return colaborator ? colaborator.name : 'Nome não encontrado'; // Retorna o nome do colaborador se encontrado, senão retorna uma mensagem padrão
  }

  getProjectName(projectId: number): string {
    const project = this.projectsAssocLista.find(proj => proj.id === projectId);
    return project ? project.name : 'Nome não encontrado'; // Retorna o nome do colaborador se encontrado, senão retorna uma mensagem padrão
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe((list: IProject[]) => {
      this.projectsLista = list;
      this.projectsAssocLista = [];
      this.projectsLista.forEach(proj => {
        this.projectsAssocLista.push(proj)
      });
    });
  }

  getColabs(): void {
    this.colabService.getColabs().subscribe((list: IColaborator[]) => {
      this.colaboratorsLista = list;
      this.colaboradoresAssocLista = [];

      // Percorre a lista de associações
      this.colaboratorsLista.forEach(colaborator => {
        // Busca o colaborador na lista de colaboradores usando o ID da associação
        // const colaborator = this.colaboratorsLista.find(colab => colab.id === association.colaboratorId);
        // if (colaborator && !this.colaboradoresAssocLista.some(colab => colab.id === colaborator.id)) {
        // Se encontrado e não estiver na lista, adiciona à lista de colaboradores associados
        this.colaboradoresAssocLista.push(colaborator);
      });
    });
  }

  editAssociation(): void {
    this.showEditAssociation = !this.showEditAssociation;
  }

  fecharComponente(): void {
    this.fecharAssociationEvent.emit();
  }

  getAssociations(): void {
    this.associationService
      .getAssociations()
      .subscribe((list: IAssociation[]) => {
        this.associationsLista = list;
        this.filteredAssociations = this.associationsLista;
      });
  }

  listAssociations(): void {
    this.getAssociation = true;
  }

  toggleCreateAssociation(): void {
    this.showCreateAssociation = !this.showCreateAssociation;
  }

  createProject(): void {
    this.addAssociation = true;
  }

  goBack(): void {
    this.location.back();
  }

  search(): void {
    if (this.searchQuery.trim() === '') {
        this.filteredAssociations = this.associationsLista;
    } else {
        this.filteredAssociations = this.associationsLista.filter(
            (assoc) => {
                const startDateIncluded = assoc.startDate && assoc.startDate.includes(this.searchQuery);
                const endDateIncluded = assoc.endDate && assoc.endDate.includes(this.searchQuery);
                return startDateIncluded || endDateIncluded ||
                    this.isSearchQueryInDate(assoc.startDate, this.searchQuery) ||
                    this.isSearchQueryInDate(assoc.endDate, this.searchQuery) ||
                    this.isSearchQueryInColaboratorName(assoc.colaboratorId, this.searchQuery) ||
                    this.isSearchQueryInProjectName(assoc.projectId, this.searchQuery);
            }
        );
    }
}



  isSearchQueryInProjectName(projectId: number, searchQuery: string): boolean {
    const project = this.projectsAssocLista.find(proj => proj.id === projectId);
    return project ? project.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
  }

  isSearchQueryInColaboratorName(colaboratorId: number, searchQuery: string): boolean {
    const colaborator = this.colaboradoresAssocLista.find(colab => colab.id === colaboratorId);
    return colaborator ? colaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
  }

  isSearchQueryInDate(dateString: string, searchQuery: string): boolean {
    // Formate a data para torná-la mais flexível na pesquisa
    const formattedDate = this.formatDateForSearch(dateString);
    // Verifique se a pesquisa está presente na data formatada
    return formattedDate.includes(searchQuery);
  }

  formatDateForSearch(dateString: string): string {
    // Verifique se a string da data é definida
    if (!dateString) {
        return '';
    }
    return dateString.replace(/-/g, '');
}

}
