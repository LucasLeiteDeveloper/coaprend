import { Injectable } from '@angular/core';
import { ApiService } from '../apiService/api-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClassService {
  private CURRENT_CLASS_KEY = 'CURRENT_USER_CLASS';

  constructor(private api: ApiService) {}

  public readonly get = {
    byUserId: (id: string) => {
      return this.api.get('classes/my');
    },
  
    byClassId: (id: string): Observable<any> => {
      return this.api.get(`classes/${id}`);
    },
  
    currentClassId: () => {
      const data = localStorage.getItem(this.CURRENT_CLASS_KEY);
      return data ? JSON.parse(data) : null;
    },
  }

  public readonly update = {
    nameById: (id: string, name: string) => {
      return this.api.put(`classes/${id}/name`, { name });
    },
  
    imageById: (id: string, imageBase64: string): Observable<any> => {
      return this.api.put(`classes/${id}/image`, { image: imageBase64 });
    },

    currentClassId: (classObj: any) => {
      localStorage.setItem(this.CURRENT_CLASS_KEY, JSON.stringify(classObj));
    },

    inviteLinkById: (id: string): Observable<any> => {
      return this.api.post(`classes/${id}/regenerate-code`, {});
    }
  }

  public readonly delete = {
    byClassId: (id: string) => {
      return this.api.delete(`classes/${id}`);
    },

    currentClassId: () => {
      localStorage.removeItem(this.CURRENT_CLASS_KEY);
    }
  }

  public create(payload: any): Observable<any> {
    return this.api.post('classes', payload);
  }

  public joinByLink(code: string): Observable<any> {
    return this.api.post('classes/join', { code });
  }

  public leaveById(id: string): Observable<any> {
    return this.api.delete(`classes/${id}/leave`);
  }
}
