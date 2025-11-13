import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post'; // caminho do seu service
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ContentService } from 'src/app/services/contentService/content-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: false,
})
export class PostPage implements OnInit {
  posts: any[] | undefined = [];
  private roomId: string | null;

  promptValue: string = '';
  isLoading: boolean = false;
  showResult: boolean = false;
  resultText: SafeHtml = '';

  constructor(
    private route: ActivatedRoute,
    private contentService: ContentService,
    private sanitizer: DomSanitizer) {
      //pgets the room id
      this.roomId = this.route.snapshot.paramMap.get('roomId');

      if(!this.roomId) console.error("ID da sala não encontrado na URL!")
    }

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    if(!this.roomId) return;

    this.isLoading = true;
    try {
      this.posts = await this.contentService.getPosts(this.roomId);
      console.log("Posts carregados: ", this.posts);
    } catch(error){
      console.error("Erro ao carregar posts", error);
    } finally{
      this.isLoading = false;
    }
  }

  // create a new post
  async submitNewPost(title: string, content: string[]){
    if(!this.roomId) return;

    this.isLoading = true;
    try {
      await this.contentService.createPost({
        title: title,
        roomId: this.roomId,
        texts: content
      });

      // clean all places and load the posts
      this.promptValue = '';
      this.showResult = false;
      this.loadPosts();
    } catch(error){
      console.error("Erro ao salvar post: ", error);
    } finally{
      this.isLoading = false;
    }
  }

  async generateContent() {

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
