import { css, LitElement, customElement, property, html } from '@lion/core';
import { Flat } from '../../../data/src/index';

@customElement('flat-entry')
export class FlatEntry extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          margin-top: 10px;
          background-color: hotpink;
        }
      `,
    ];
  }

  @property()
  flat?: Flat;

  render() {
    return html`<h1>${this.flat?.heading}</h1>`;
  }
}
