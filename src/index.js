import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

import './styles/index.css';

class HealthcareComponent extends HTMLElement {
  static get observedAttributes() {
    return ['startdate', 'enddate', 'maxentries', 'targetsteps'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`The attribute ${name} was updated.`);
    this.render();
  }

  render() {
    createRoot(this).render(
      <App
        route={this.getAttribute('route')}
        startDate={this.getAttribute('startdate')}
        endDate={this.getAttribute('enddate')}
        maxEntries={this.getAttribute('maxentries')}
        targetSteps={this.getAttribute('targetsteps')}
      />
    );
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}
const ELEMENT_ID = 'healthcare-component';

if (!customElements.get(ELEMENT_ID)) {
  customElements.define(ELEMENT_ID, HealthcareComponent);
}
