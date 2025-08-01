import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  chatForm: FormGroup;
  messages = signal<{ question: string, response: string }[]>(this.loadMessages());
  error = signal<string>('');
  loading = signal<boolean>(false);

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.chatForm = this.fb.group({
      question: ['', Validators.required],
      theme: ['general']
    });
  }

  private loadMessages(): { question: string, response: string }[] {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]');
  }

  private saveMessages(messages: { question: string, response: string }[]) {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 0);
    }
  }

  onSubmit() {
    if (this.chatForm.valid) {
      this.loading.set(true); // Mostrar el spinner
      const { question, theme } = this.chatForm.value;
      const fullQuestion = theme !== 'general' ? `[${theme}] ${question}` : question;
      const token = localStorage.getItem('token') || '';
      this.apiService.chat(fullQuestion, token).subscribe({
        next: (response) => {
          const newMessages = [...this.messages(), { question, response: response.response }];
          this.messages.set(newMessages);
          this.saveMessages(newMessages);
          this.chatForm.reset({ theme });
          this.scrollToBottom();
          this.loading.set(false); // Ocultar el spinner
        },
        error: (err) => {
          this.error.set('Error al obtener respuesta');
          console.error('Chat error:', err);
          this.loading.set(false); // Ocultar el spinner en caso de error
        }
      });
    }
  }
  clearHistory() {
    this.messages.set([]);
    this.saveMessages([]);
  }
}