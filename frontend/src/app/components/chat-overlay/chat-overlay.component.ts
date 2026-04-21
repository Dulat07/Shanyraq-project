import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-overlay.component.html',
  styleUrls: ['./chat-overlay.component.css']
})
export class ChatOverlayComponent {
  messageText = '';
  state$ = this.chatService.state$;
  messages$ = this.chatService.messages$;

  constructor(public chatService: ChatService) {}

  close() {
    this.chatService.close();
  }

  sendMessage() {
    this.chatService.sendMessage(this.messageText);
    this.messageText = '';
  }
}
