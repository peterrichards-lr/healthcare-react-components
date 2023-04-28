import StrictMode from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

import './styles/index.css';

class HealthcareComponent extends HTMLElement {
  static get observedAttributes() {
    return ['startdate', 'enddate', 'maxentries', 'targetsteps'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.debug(`The attribute ${name} was updated.`);
    switch (name) {
      case 'startdate':
      case 'enddate':
      case 'maxentries':
      case 'targetsteps':
        if (!newValue || newValue === oldValue) return;
        this.render();
        return;
      default:
        return;
    }
  }

  render() {
    createRoot(this).render(
      <StrictMode>
        <App
          route={this.getAttribute('route')}
          startDate={this.getAttribute('startdate')}
          endDate={this.getAttribute('enddate')}
          maxEntries={this.getAttribute('maxentries')}
          targetSteps={this.getAttribute('targetsteps')}
        />
      </StrictMode>
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
