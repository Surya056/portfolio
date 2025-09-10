import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

type Project = { title: string; tech: string[]; description: string; link?: string; repo?: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private http = inject(HttpClient);
  projects: Project[] = [];
  currentYear = new Date().getFullYear();
  menuOpen = false;

  ngOnInit() {
    this.http.get<Project[]>('./assets/projects.json').subscribe(d => this.projects = d);
    this.setupObserver();
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  setupObserver() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) { return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('reveal-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    setTimeout(() => { document.querySelectorAll('.reveal').forEach(el => obs.observe(el)); }, 0);
  }

  scrollTo(evt: Event, id: string) {
    evt.preventDefault();
    if (typeof window === 'undefined') return;
    const header = document.querySelector('.header') as HTMLElement | null;
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = header ? header.offsetHeight : 0;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - headerH - 12;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
