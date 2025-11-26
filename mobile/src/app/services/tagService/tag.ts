import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagClickedSource = new Subject<void>();

  constructor(private api: ApiService) {}

  // Observable que os componentes podem assinar para receber notificações.
  tagClicked$ = this.tagClickedSource.asObservable();

  /**
   * Método que a Página Principal chama para notificar a subpágina.
   */
  notifyTagClicked(): void {
    this.tagClickedSource.next();
  }

  // -------------------------------------------------------------
  // 🔵 Buscar tags de uma sala
  // GET /classes/:id/tags
  // -------------------------------------------------------------
  getTagsByClass(classId: number): Observable<any[]> {
    return this.api.get(`classes/${classId}/tags`);
  }

  // -------------------------------------------------------------
  // 🟢 Criar nova tag na sala
  // POST /classes/:id/tags
  // -------------------------------------------------------------
  createTag(
    classId: number,
    payload: { name: string; color: string }
  ): Observable<any> {
    return this.api.post(`classes/${classId}/tags`, payload);
  }

  // -------------------------------------------------------------
  // 🟡 Editar tag
  // PUT /classes/:id/tags/:tagId
  // -------------------------------------------------------------
  updateTag(
    classId: number,
    tagId: number,
    payload: { name?: string; color?: string }
  ): Observable<any> {
    return this.api.put(`classes/${classId}/tags/${tagId}`, payload);
  }

  // -------------------------------------------------------------
  // 🔴 Excluir tag
  // DELETE /classes/:id/tags/:tagId
  // -------------------------------------------------------------
  deleteTag(classId: number, tagId: number): Observable<any> {
    return this.api.delete(`classes/${classId}/tags/${tagId}`);
  }

  // -------------------------------------------------------------
  // 🔥 NOVO — Remover TODAS as tags da sala
  // DELETE /classes/:id/tags
  // -------------------------------------------------------------
  clearAllTags(classId: number): Observable<any> {
    return this.api.delete(`classes/${classId}/tags`);
  }

  // -------------------------------------------------------------
  // 🔄 NOVO — Reordenar tags (drag & drop)
  // POST /classes/:id/tags/reorder
  // body: [ID das tags na nova ordem]
  // -------------------------------------------------------------
  reorderTags(classId: number, orderedTagIds: number[]): Observable<any> {
    return this.api.post(`classes/${classId}/tags/reorder`, { order: orderedTagIds });
  }

  // -------------------------------------------------------------
  // ⚡ NOVO — Atualizar várias tags de uma vez (batch)
  // PUT /classes/:id/tags
  // body: array de objetos de tag
  // -------------------------------------------------------------
  updateManyTags(classId: number, tags: any[]): Observable<any> {
    return this.api.put(`classes/${classId}/tags`, { tags });
  }
}
