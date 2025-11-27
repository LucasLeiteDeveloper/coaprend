import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../authService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  //the API url prepared to the content
  private readonly apiUrl = `${environment.apiUrl}/content`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ){ }

  // gets the header of authentication
  private getAuthHeaders(): HttpHeaders{
    const idToken = localStorage.getItem("firebaseToken");

    if(!idToken){ // if the idToken isn't valid
      this.authService.showToast("Sessão expirada, faça login novamente!");
      throw new Error("Usuário não autenticado!");
    }

    return new HttpHeaders().set("Authorization", `Bearer ${idToken}`);
  }

  
  // METHODS FOR CLASSES
  async createClass(data: { title: string, decription?: string, icon?: string, tags?: string[] }): Promise<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<any>(`${this.apiUrl}/class`, data, { headers }).toPromise();
  }
  async enterClass(code: string): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/class/enter`, { code }, { headers }).toPromise();
  }
  async getClassDetails(classId: string): Promise<any>{
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/class/${classId}`, { headers }).toPromise()
  }
  async getUserClasses(): Promise<any[] | undefined> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[] | undefined>(`${this.apiUrl}/classes/my`, {headers}).toPromise();
  }
  async updateClass(classId: string, data: any): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/class/${classId}`, data, { headers }).toPromise();
  }
  async deleteClass(classId: string): Promise<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/class/${classId}`, { headers }).toPromise();
  }


  // methods for posts
  async getPosts(classId: string): Promise<any[] | undefined> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`${this.apiUrl}/class/${classId}/posts`, { headers }).toPromise();
  }
  async createPost(data: { title: string, classId: string, texts: string[] }): Promise<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.apiUrl}/posts`, data, { headers }).toPromise();
  }
  async updatePost(postId: string, data: any){
    return this.http.patch(`${this.apiUrl}/posts/${postId}`, data, { headers: this.getAuthHeaders() });
  }
  deletePost(postId: string){
    return this.http.delete(`${this.apiUrl}/posts/${postId}`, { headers: this.getAuthHeaders() }).toPromise();
  }

  //tasks methods
  async getTasks(classId: string): Promise<any[] | undefined> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`${this.apiUrl}/classs/${classId}/tasks`, { headers }).toPromise();
  }
  async createTask(data: { title: string, classId: string, last_date: string }): Promise<any>{
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.apiUrl}/tasks`, data, { headers }).toPromise();
  }
  async updateTask(taskId: string, data: any) {
    return this.http.patch(`${this.apiUrl}/tasks/${taskId}`, data, { headers: this.getAuthHeaders() });
  }
  deleteTask(taskId: string){
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getAuthHeaders() }).toPromise();
  }


  // SEARCH
  searchPost(query: string){
    return this.http.get(`${this.apiUrl}/posts/search?q=${query}`, { headers: this.getAuthHeaders() }).toPromise();
  }
  searchByTag(tag: string){
    // calls /api/content/posts/tags/search?tag=value
    return this.http.get<any[]>(`${this.apiUrl}/posts/tags/search?tag=${tag}`, { headers: this.getAuthHeaders() }).toPromise();
  }

  // NOTIFICATIONS
  getNotifications(){
    return this.http.get<any[]>(`${this.apiUrl}/notifications`, { headers: this.getAuthHeaders() }).toPromise();
  }
  markNotificationRead(id: string){
    return this.http.patch(`${this.apiUrl}/notifications/${id}/read`, { headers: this.getAuthHeaders()}).toPromise();
  }
}
