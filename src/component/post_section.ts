import { html, LitElement } from "lit";
import { Task } from "@lit/task";
import { customElement, } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";


@customElement("post-section")
export class PostSection extends LitElement {
  public jump(url: URL) {
    // console.log("jump to", decodeURIComponent(url.href));
    // 用户看到的链接是/blog/xxx，实际上应该去/raw/xxx请求数据
    if (url.pathname.startsWith("/blog")) {
      const realUrl = new URL(url);
      realUrl.pathname = realUrl.pathname.replace("/blog", "/raw");
      return this.fetchTask.run([realUrl]);
    } else {
      throw new Error(`Invalid URL: ${url.href}`);
    }
  }

  private fetchTask = new Task<readonly [URL], string>(this, {
    task: async ([url], { signal }) => {
      const response = await fetch(url, { signal });
      const text = await response.text();
      if (text.startsWith("<!")) { // TODO: 也许有更好的方式判断
        console.log('url:');
        console.log(url.href);
        throw new Error("Not a post page.");
      }
      return text;
    },
    onError: (error) => { console.error(error); },
  });

  render() {
    return this.fetchTask.render({
      initial: () => html`
        <p>初始化中......</p>
      `,
      pending: () => html`
        <p>加载中......</p>
      `,
      error: (e) => html`
        <p>无效链接。</p>
        <hr />
        <p>${e}</p>
      `,
      complete: unsafeHTML,
    });
  }

  override createRenderRoot() { return this; }
}

declare global {
  interface HTMLElementTagNameMap {
    "post-section": PostSection;
  }
}
