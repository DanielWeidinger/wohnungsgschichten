import { LionCollapsible } from '@lion/collapsible';
import { css, customElement, property, html, LitElement } from '@lion/core';
import { Flat } from '../../../lib/dist';

@customElement('flat-entry')
export class FlatEntry extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          margin-top: 10px;
          background-color: hotpink;
        }
        lion-collapsible {
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
      `,
    ];
  }
  opened = true;

  @property()
  flat?: Flat;

  render() {
    return html`
      <h5>${this.flat?.heading}</h5>
      <lion-collapsible>
        <button slot="invoker">Details</button>
        <div slot="content">kek</div>
      </lion-collapsible>
    `;
  }
}
