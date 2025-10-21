import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post'; // caminho do seu service

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
export class PostPage implements OnInit {
  posts: any[] = [];
  public postExample: {} = {
    title: 'Post de teste',
    author: 'Usuário de teste',
    items: [{ content: 'Conteudo de teste' }],
  };
  promptValue: string = '';
  isLoading: boolean = false;
  showResult: boolean = false;
  resultText: string = '';

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAll().subscribe({
      next: (res) => {
        // Converte 'options' se vier como JSON no backend
        this.posts = res.map((p: any) => ({
          ...p,
          options: p.options ? JSON.parse(p.options) : [],
        }));
        console.log('Posts carregados:', this.posts);
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      },
    });
  }

  async generateContent() {
    console.log('1. Iniciando requisição');
    console.log('2. Prompt digitado:', this.promptValue);

    if (!this.promptValue || this.promptValue.trim() === '') {
      alert('Por favor, digite um prompt!');
      console.log('3. Erro: Prompt vazio');
      return;
    }

    this.isLoading = true;
    this.showResult = false;

    try {
      console.log('4. Enviando fetch para:', 'http://localhost/apiGenQuestion/index.php');
      console.log(
        '5. Dados enviados:',
        JSON.stringify({ prompt: this.promptValue })
      );

      const response = await fetch('http://localhost/apiGenQuestion/index.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: this.promptValue }),
      });

      console.log('6. Status da resposta:', response.status);
      console.log('7. Headers da resposta:', response.headers);

      if (!response.ok) {
        throw new Error('HTTP status: ' + response.status);
      }

      const responseText = await response.text();
      console.log('8. Resposta bruta (texto):', responseText);

      const data: GeminiResponse = JSON.parse(responseText);
      console.log('9. Resposta parseada (JSON):', data);

      if (data.success && data.text) {
        this.resultText = data.text;
        this.showResult = true;
        console.log('10. Sucesso! Texto exibido');
      } else {
        alert('Erro do backend: ' + data.error);
        console.log('11. Erro do backend:', data.error);
      }
    } catch (error: any) {
      alert('Erro ao conectar com a API: ' + error.message);
      console.error('12. Erro na requisição:', error);
      console.error('13. Stack trace:', error.stack);
    } finally {
      this.isLoading = false;
      console.log('14. Requisição finalizada');
    }
  }
}
interface GeminiResponse {
  success: boolean;
  text?: string;
  error?: string;
  details?: string;
  response?: any;
}
