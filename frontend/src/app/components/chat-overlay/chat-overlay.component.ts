import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatState } from '../../services/chat.service';

@Component({
  selector: 'app-chat-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.css']
})
export class ChatOverlayComponent {
  messageText = '';
  state: ChatState = {
    isOpen: false,
    user: null
  };
  isVisible = false;
  isClosing = false;
  messages$ = this.chatService.messages$;

  constructor(public chatService: ChatService) {
    this.chatService.state$.subscribe(state => {
      this.state = state;

      if (state.isOpen) {
        this.isVisible = true;
        this.isClosing = false;
        return;
      }

      if (this.isVisible) {
        this.isClosing = true;
        setTimeout(() => {
          this.isVisible = false;
          this.isClosing = false;
        }, 180);
      }
    });
  }

  close() {
    this.chatService.close();
  }

  sendMessage() {
    this.chatService.sendMessage(this.messageText);
    this.messageText = '';
  }
}
