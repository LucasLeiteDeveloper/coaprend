import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post'; // caminho do seu service
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: false,
})
export class PostsPage implements OnInit {
  posts: any[] = [];
  public postExample: {} = {
    title: 'Post de teste',
    author: 'Usuário de teste',
    items: [{ content: 'Conteudo de teste' }],
  };

  promptValue: string = '';
  isLoading: boolean = false;
  showResult: boolean = false;
  resultText: SafeHtml = '';

  constructor(private postService: PostService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAll().subscribe({
      next: (res) => {
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

    if (!this.promptValue.trim()) {
      alert('Por favor, digite um prompt!');
      return;
    }

    this.isLoading = true;
    this.showResult = false;

    try {
      const response = await fetch('http://localhost:8000/api/gemini/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: this.promptValue }),
      });

      console.log('Status da resposta:', response.status);
      const text = await response.text();
      console.log('Resposta bruta:', text);

      const data = JSON.parse(text);
      console.log('Resposta parseada:', data);

      if (data.success && data.quiz?.quiz) {
        const quizArray = data.quiz.quiz;
        let html = `<h2>Questionário Gerado</h2>`;

        quizArray.forEach((q: any) => {
          html += `
            <div class="quiz-item">
              <p><strong>${q.id}. ${q.question}</strong></p>
              <ul>
                <li><b>A)</b> ${q.options.A}</li>
                <li><b>B)</b> ${q.options.B}</li>
                <li><b>C)</b> ${q.options.C}</li>
                <li><b>D)</b> ${q.options.D}</li>
              </ul>
              <p><em>Correta: ${q.correct}</em></p>
              <hr>
            </div>
          `;
        });

        this.resultText = this.sanitizer.bypassSecurityTrustHtml(html);
      } else {
        this.resultText = this.sanitizer.bypassSecurityTrustHtml(
          `<p><b>Erro:</b> ${data.error || 'Não foi possível gerar o questionário.'}</p>`
        );
      }

      this.showResult = true;
    } catch (error: any) {
      console.error('Erro na requisição:', error);
      this.resultText = this.sanitizer.bypassSecurityTrustHtml(
        `<p><b>Erro:</b> ${error.message}</p>`
      );
      this.showResult = true;
    } finally {
      this.isLoading = false;
    }
  }
}
