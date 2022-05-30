import { gql } from '@apollo/client/core';
import { css, html } from '@apollo-elements/lit-apollo';
import { customElement, state } from 'lit/decorators.js';
import { LitElement, TemplateResult } from 'lit';
import { Flat } from '../../../lib/src/index';
import { ApolloQueryController } from '@apollo-elements/core';

const query = gql`
  query {
    latestFlats {
      id
      heading
    }
  }
`;

@customElement('main-page')
export class MainPage extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          justify-content: center;

          margin: 3%;
        }
      `,
    ];
  }

  query = new ApolloQueryController(this, query);

  @state()
  entries: Flat[] = [];

  render(): TemplateResult {
    const result = this.query.data as any;
    const flats = result?.latestFlats as Flat[];
    return html`
      <h1>Wohnungsgschichten</h1>
      <div>
        ${flats?.map((e: any) => html`<flat-entry .flat=${e}></flat-entry>`)}
      </div>
    `;
  }
}
