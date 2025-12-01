import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
  
@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  standalone: true,
})
export class InputModalComponent  implements OnInit {
  @Input() inputType: string = "text";
  @Input() title: string = "";
  @Input() tags: string[] = []; // all tags
  @Input() selectedTags: string[] = []; // tags selected
  public inputValue: string = ""; 

  //control the selection of tag
  tagSelections: {tag: string, selected: boolean}[] = [];

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    if(this.inputType === 'tags' && this.tags){
      // prepares the tags already selected
      this.tagSelections = this.tags.map(tag => ({
        tag,
        selected: this.selectedTags ? this.selectedTags.includes(tag) : false
      }))
    }
  }

  // toggle the tag selection
  toggleTag(tag: string){
    const tagIndex = this.tagSelections.findIndex(t => t.tag === tag);

    if(tagIndex > -1) this.tagSelections[tagIndex].selected = !this.tagSelections[tagIndex].selected;
  }
  // return all selected tags
  getSelectedTags(){
    let tags: string[] = [];

    this.tagSelections.forEach( tagSelection => {
      if(tagSelection.selected) tags.push(tagSelection.tag);
    } );

    return tags;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.inputType === "tags") {
      const selectedTags = this.getSelectedTags();

      return this.modalCtrl.dismiss(selectedTags, 'confirm');
    } else {
      return this.modalCtrl.dismiss(this.inputValue, 'confirm');
    }
  }
}
