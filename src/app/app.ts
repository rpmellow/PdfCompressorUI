import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
constructor(private http: HttpClient) {}

   title = 'PdfCompressor'
  selectedFileName: string | null = null;
  isLoading = false;
  uploadComplete = false;
  selectedFile: File | null = null;
  compressedBlob: Blob | null = null;
  errorMessage: string | null = null;

   triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;


    if (input.files && input.files.length > 0) {
      
      this.selectedFile = input.files[0];
      if (this.selectedFile.size > 20 * 1024 * 1024) { // 20MB in bytes
      alert('❌ File size too big. Please expect a delay in response.');
    }
      console.log('Selected file:', this.selectedFile.name);
      this.selectedFileName = this.selectedFile.name;
      this.uploadComplete = false;
      this.compressedBlob = null;
      this.errorMessage = null;
    }
     input.value = '';
  }

  

uploadFile(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.uploadComplete = false;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('https://pdfcompress-9d9m.onrender.com/compress', formData, {
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        this.compressedBlob = blob;
      this.isLoading = false;
      this.uploadComplete = true;
      this.errorMessage = null;
      },
      error: (err) => {
        this.isLoading = false;
      this.uploadComplete = false;
      this.errorMessage = '❌ Error Compressing PDF. Please try again.';
      }
    });
  }

  downloadCompressedPdf(): void {
    if (!this.compressedBlob || !this.selectedFile) return;

    const url = window.URL.createObjectURL(this.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed_' + this.selectedFile.name;
    a.click();
    window.URL.revokeObjectURL(url);
    this.selectedFile = null;
  this.selectedFileName = null;
  this.compressedBlob = null;
  this.uploadComplete = false;
  this.errorMessage = null;

  }

    

    

  }


  

