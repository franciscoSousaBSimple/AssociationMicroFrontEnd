import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      loadChildren: () => import('../../association-main/association-main.module').then((m) => m.AssociationMainModule)
    }
  ];


