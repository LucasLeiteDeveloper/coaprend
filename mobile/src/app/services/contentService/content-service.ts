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

  // method for rooms
  async createRoom(data: { title: string, description: string }): Promise<any>{
    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.apiUrl}/room`, data, { headers }).toPromise();
  }
  updateRoom(roomId: string, data: any){
    return this.http.patch(`${this.apiUrl}/room/${roomId}`, data, { headers: this.getAuthHeaders() });
  }
  deleteRoom(roomId: string){
    return this.http.delete(`${this.apiUrl}/room/${roomId}`, { headers: this.getAuthHeaders() }).toPromise();
  }

  // methods for posts
  async getPosts(roomId: string): Promise<any[] | undefined> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`${this.apiUrl}/rooms/${roomId}/posts`, { headers }).toPromise();
  }
  async createPost(data: { title: string, roomId: string, texts: string[] }): Promise<any> {
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
  async getTasks(roomId: string): Promise<any[] | undefined> {
    const headers = this.getAuthHeaders();

    return this.http.get<any[]>(`${this.apiUrl}/rooms/${roomId}/tasks`, { headers }).toPromise();
  }
  async createTask(data: { title: string, roomId: string, last_date: string }): Promise<any>{
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
