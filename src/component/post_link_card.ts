import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { consume } from '@lit/context';

import { AppContext, appContext } from '../context';

@customElement('post-link')
export class PostLinkCard extends LitElement {
  @consume({ context: appContext })
  private app?: AppContext;

  @property() href!: string;

  @property({ attribute: 'post-title' }) post_title?: string;

  @property({
    type: Object,
    attribute: 'date',
    converter: (attr: string | null) => attr === null ? undefined : new Date(attr)
  })
  _date?: Date;

  isExternalLink() {
    return this.href?.startsWith('http') ?? false;
  }

  onclick = () => {
    if (this.isExternalLink()) {
      window.open(this.href);
    } else {
      this.app?.jump(new URL(this.href, location.href));
    }
  }

  render() {
    const title = this.isExternalLink()
      ? html`${this.post_title} <img src="/assets/svg/external-link.svg">`
      : this.href.replace('.html', '');

    const date = this._date
      ? html`<footer>${this._date.toLocaleDateString()}</footer>`
      : null;

    return html`
      <div>
        <h3>${title}</h3>
        <summary><slot></slot></summary>
        ${date}
      </div>
    `;
  }

  static styles = css`
    :host>div {
      margin: 1rem 0;
      display: block;
      padding: 0.2em 1em;
      background-color: var(--background-color-card);
      transition: var(--transition-color);
      cursor: pointer;

      border: var(--dashed-border);

      >h3 {
        margin: 0.5em 0;
        transition: var(--transition-color);

        img {
          width: 0.8em;
          height: 0.8em;
          filter: var(--svg-filter);
        }
      }

      >summary {
        margin: 0.5em 0;
      }

      >footer {
        padding-top: 0.2em;
        
        border-top: 1px solid var(--border-color);

        font-size: 0.8em;
        font-style: italic;
        color: var(--text-color-annotation);
      }

      &:hover {
        summary {
          color: inherit;
        }

        h3 {
          text-decoration: underline;
          color: var(--secondary-color);
        }
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'post-link': PostLinkCard
  }
}
