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

  tagClicked$ = this.tagClickedSource.asObservable();

  notifyTagClicked(): void {
    this.tagClickedSource.next();
  }

  getTagsByClass(classId: string): Observable<any[]> {
    return this.api.get(`classes/${classId}/tags`);
  }

  createTag(
    classId: string,
    payload: { name: string; color: string }
  ): Observable<any> {
    return this.api.post(`classes/${classId}/tags`, payload);
  }

  updateTag(
    classId: string,
    tagId: string,
    payload: { name?: string; color?: string }
  ): Observable<any> {
    return this.api.put(`classes/${classId}/tags/${tagId}`, payload);
  }

  deleteTag(classId: string, tagId: string): Observable<any> {
    return this.api.delete(`classes/${classId}/tags/${tagId}`);
  }

  clearAllTags(classId: string): Observable<any> {
    return this.api.delete(`classes/${classId}/tags`);
  }

  reorderTags(classId: string, orderedTagIds: string[]): Observable<any> {
    return this.api.post(`classes/${classId}/tags/reorder`, { order: orderedTagIds });
  }

  updateManyTags(classId: string, tags: any[]): Observable<any> {
    return this.api.put(`classes/${classId}/tags`, { tags });
  }
}
