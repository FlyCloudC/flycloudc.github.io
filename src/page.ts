// lib
import { LitElement, PropertyValues, html } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { ContextProvider } from '@lit/context';

// context
import { appContext } from './context';

// components
import "./component/theme_switch"
import './component/post_link_card';
import './component/post_section';
import { type PostSection } from './component/post_section';

function getTitle(url: URL) {
  const filenameWithExt = decodeURIComponent(url.pathname.split(/[/\\]/).pop()!);
  const lastDotIndex = filenameWithExt.lastIndexOf('.');
  const filename = (lastDotIndex <= 0)
    ? filenameWithExt
    : filenameWithExt.slice(0, lastDotIndex);
  const filenameDecoding = decodeURIComponent(filename);
  return `${filenameDecoding} | FLYC Blog`;
}

const homePathName = '/blog/主页.html';

// main
import './global.css'
import './page.css'
import './page_header.css'
import './page_main_aside.css'
@customElement('root-app')
export class RootApp extends LitElement {
  public contextProvide = new ContextProvider(this, {
    context: appContext,
    initialValue: this,
  });

  @query('post-section')
  private postSection!: PostSection;

  public async jump(url: URL, replace: boolean = false) {
    await this.postSection.jump(url);
    document.title = getTitle(url);
    if (replace) {
      history.replaceState(url.href, '', url.href);
    } else {
      history.pushState(url.href, '', url.href);
    }
  }

  override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    window.addEventListener('popstate', (event: PopStateEvent) => {
      this.jump(new URL(event.state), true);
    });
    const url = new URL(window.location.href);
    if (url.pathname === '/')
      url.pathname = homePathName;
    this.jump(url, true);
  }

  public jumpToHome() {
    this.jump(new URL(homePathName, window.location.href));
  }

  // -------------------------------------------------------------
  override render() {
    return html`
      <header>
        <a class="title" @click=${this.jumpToHome}>FLYC Blog</a>
        <a @click=${this.jumpToHome}>Home</a>
        <theme-switch></theme-switch>
      </header>
      <main>
        <aside>
          <figure>
            <img class="avatar" src="/assets/avatar.jpg" alt="头像">
            <figcaption>FlyCloudC<span>Learning Abstraction</span></figcaption>
          </figure>
          <div>
            <a href="https://github.com/FlyCloudC">
              <img src="/assets/svg/brand-github.svg" alt="github"/>
            </a>
            <a href="https://www.zhihu.com/people/flycpiao-yun">
              <img src="/assets/svg/brand-zhihu.svg" alt="zhihu"/>
            </a>
          </div>
        </aside>
        <post-section></post-section>
      </main>
      <footer>
        &copy; 2025 FlyCloudC 
        | Powered by 
        <a href="https://vite.dev/">Vite</a> 
        & 
        <a href="https://lit.dev/">Lit</a>
      </footer>
    `;
  }

  override createRenderRoot() { return this; }
}

declare global {
  interface HTMLElementTagNameMap {
    'root-app': RootApp
  }
}
