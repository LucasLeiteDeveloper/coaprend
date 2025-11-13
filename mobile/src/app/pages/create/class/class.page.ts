import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authService/auth-service';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  isLoading: boolean = false;

  //form variables
  title: string = '';
  description: string = '';

  constructor(
    private contentService: ContentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  async submitCreateRoom(){
    if( this.title.trim().length < 3 ){
      this.authService.showToast("O título da sala é obrigatório!");
      return;
    }

    this.isLoading = true;
    try {
      const response = await this.contentService.createRoom({
        title: this.title,
        description: this.description
      });

      const newRoomId = response.roomId;

      this.authService.showToast("Classe criada com sucesso!");
      this.router.navigate(['/class', newRoomId, 'posts'])
    } catch(error){
      console.error("Erro ao criar a sala", error);
      this.authService.showToast("Erro ao criar a sala! Tente novamente mais tarde")
    } finally{
      this.isLoading = false;
    }
  }
}
