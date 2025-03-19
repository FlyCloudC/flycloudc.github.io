import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('theme-switch')
export class ThemeSwitch extends LitElement {
  @property({ type: Boolean }) isLight =
    document.documentElement.getAttribute('data-theme') === 'light';

  public toggleTheme() {
    this.isLight = !this.isLight;
    if (this.isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  override render() {
    return html`
      <button @click=${this.toggleTheme}>
        <img
          src=${this.isLight ? '/assets/svg/sun.svg' : '/assets/svg/moon.svg'}
          alt="Toggle theme">
      </button>
    `;
  }

  static styles = css`
    button {
      padding: 0.5rem 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      background-color: var(--background-color-card);
      cursor: pointer;
      transition: var(--transition-color), transform ease-in-out 0.2s;

      &:hover{
        transform: scale(0.95);
      }
    }

    img {
      display: block;
      width: 1.5em;
      height: 1.5em;
      filter: var(--svg-filter);
    }
  `;
}
