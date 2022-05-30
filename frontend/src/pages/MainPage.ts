import { css, html, LitElement, customElement, state } from '@lion/core';
import { Flat } from '../../../lib/src/index';
import { Repository } from '../Repository';

@customElement('main-page')
export class MainPage extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          justify-content: center;

          margin: 3%;
        }
      `,
    ];
  }

  private repo: Repository = new Repository('');
  constructor() {
    super();
    this.repo.init().then(() => {
      this.repo.getAll();
    });
  }
  @state()
  entries: Flat[] = [];

  render() {
    return html`
      <div>${this.entries.map(e => html`<flat-entry></flat-entry>`)}</div>
    `;
  }
}
