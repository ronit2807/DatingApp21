import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_model/Member';
import { Message } from '../_model/Message';
import { PaginatedResult } from '../_model/Pagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
  constructor(private http:HttpClient) { }

  getMessages(pageNumber: number,pageSize: number,container){
    let params = new HttpParams();
    params = params.append("container",container);
    params = params.append("pageNumber",pageNumber.toString());
    params = params.append("pageSize",pageSize.toString());

    return this.http.get<Message[]>(this.baseUrl+'messages',{observe: 'response',params})
      .pipe(map(response =>{
        this.paginatedResult.result = response.body;
        if(response.headers.get('Pagination')){
          this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return this.paginatedResult;
      }))
  }

  getMessageThread(username: string){
    
    return this.http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  }

  sendMessage(username: string,content: string){
    return this.http.post<Message>(this.baseUrl+'messages',{Content: content,RecipientUsername: username})
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl+'messages/'+id);
  }
}
