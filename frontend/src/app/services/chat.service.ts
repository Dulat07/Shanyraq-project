import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ChatUser {
  name: string;
  avatar: string;
}

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

export interface ChatState {
  isOpen: boolean;
  user: ChatUser | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stateSubject = new BehaviorSubject<ChatState>({
    isOpen: false,
    user: null
  });

  private messagesSubject = new BehaviorSubject<Message[]>([]);

  state$ = this.stateSubject.asObservable();
  messages$ = this.messagesSubject.asObservable();

  open(user: ChatUser) {
    this.stateSubject.next({
      isOpen: true,
      user
    });

    if (this.messagesSubject.value.length === 0) {
      this.messagesSubject.next([
        {
          id: Date.now(),
          text: 'Hi! Is this property still available?',
          sender: 'me',
          timestamp: new Date()
        },
        {
          id: Date.now() + 1,
          text: 'Hello! Yes, it is available. You can ask me anything about it.',
          sender: 'other',
          timestamp: new Date()
        }
      ]);
    }
  }

  close() {
    this.stateSubject.next({
      ...this.stateSubject.value,
      isOpen: false
    });
  }

  sendMessage(text: string) {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const message: Message = {
      id: Date.now(),
      text: trimmedText,
      sender: 'me',
      timestamp: new Date()
    };

    this.messagesSubject.next([...this.messagesSubject.value, message]);
  }
}
