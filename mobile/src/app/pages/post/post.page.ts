import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false
})
export class PostPage implements OnInit {
  postId: number = 0;
  posts: any = "";
  post: any = null;

  isLoading: boolean = false;
  showResult: boolean = false;
  resultText: SafeHtml = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.postId = Number(params.get('id'));
    });
    this.loadPost();
  }

  loadPost() {
    this.http.get("assets/posts-data.json").subscribe({
      next: (data) => {
        this.posts = data;
        this.post = this.posts.find((post: any) => post.id == this.postId);
      },
      error: (err) => {
        console.error('Erro ao carregar os posts:', err);
      }
    });
    // this.postService.getAll().subscribe({
    //   next: (res) => {
    //     this.post = res.find((p: any) => p.id == this.postId);
    //   },
    //   error: (err) => console.error('Erro ao carregar post:', err)
    // });
  }

  async generateContent() {
    if (!this.post || !this.post.content) {
      alert('O post não possui conteúdo para gerar o questionário.');
      return;
    }

    const autoPrompt = `
      Gere um questionário baseado no seguinte conteúdo do post:
      "${this.post.content}"
    `;

    this.isLoading = true;
    this.showResult = false;

    try {
      const response = await fetch('http://localhost:8000/api/gemini/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: autoPrompt }),
      });

      const text = await response.text();
      const data = JSON.parse(text);

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
      this.resultText = this.sanitizer.bypassSecurityTrustHtml(
        `<p><b>Erro:</b> ${error.message}</p>`
      );
      this.showResult = true;
    } finally {
      this.isLoading = false;
    }
  }
}
