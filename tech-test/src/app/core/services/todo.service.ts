import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TodoModel } from '../models/todo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public refreshTrigger$ = new Subject<void>();
  public search$ = new BehaviorSubject<string>('');
  public items$: Observable<TodoModel[]> = of([]);

  public readonly BASE_URI = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) {}

  public getTodos(params?: HttpParams): Observable<TodoModel[]> {
    return this.http.get<TodoModel[]>(this.BASE_URI, {params});
  }

  public updateTodo(id: number, payload: Omit<TodoModel, 'id' | 'created_at'>): Observable<TodoModel> {
    return this.http.patch<TodoModel>(`${this.BASE_URI}/${id}`, {
      ...payload,
      updated_at: new Date().toISOString(),
    });
  }

  public createTodo(payload: Omit<TodoModel, 'id' | 'created_at' | 'updated_at'>): Observable<TodoModel> {
    return this.http.post<TodoModel>(this.BASE_URI, {
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  public deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URI}/${id}`);
  }

}
