import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private api: ApiService) {}

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
  createTag(classId: number, payload: { name: string; color: string }): Observable<any> {
    return this.api.post(`classes/${classId}/tags`, payload);
  }

  // -------------------------------------------------------------
  // 🟡 Editar tag
  // PUT /classes/:id/tags/:tagId
  // -------------------------------------------------------------
  updateTag(classId: number, tagId: number, payload: any): Observable<any> {
    return this.api.put(`classes/${classId}/tags/${tagId}`, payload);
  }

  // -------------------------------------------------------------
  // 🔴 Excluir tag
  // DELETE /classes/:id/tags/:tagId
  // -------------------------------------------------------------
  deleteTag(classId: number, tagId: number): Observable<any> {
    return this.api.delete(`classes/${classId}/tags/${tagId}`);
  }
}
