import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/postService/post';
import { PostInterface } from 'src/app/services/postService/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false
})
export class PostPage implements OnInit {
  private postId!: string;
  public post!: PostInterface;

  public isLoading: boolean = false;
  public showResult: boolean = false;
  public resultText: SafeHtml = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id')!;
    this.post = this.postService.get.byPostId(this.postId)!;
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
