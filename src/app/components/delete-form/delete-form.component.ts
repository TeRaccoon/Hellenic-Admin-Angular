import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss']
})
export class DeleteFormComponent {
  formVisible = 'hidden';
  ids: string[] = [];

  constructor(private dataService: DataService, private formService: FormService) {  }

  ngOnInit() {
    this.formService.getDeleteFormVisibility().subscribe((visible) => {
      this.formVisible = visible ? 'visible' : 'hidden';
      this.ids = this.formService.getDeleteFormIds();
    });
  }

  hide() {
    this.formService.hideDeleteForm();
  }
}
