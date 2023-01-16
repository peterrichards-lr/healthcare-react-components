import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';

import './styles/index.css';

class HealthcareReactComponents extends HTMLElement {
  connectedCallback() {
    createRoot(this).render(<App
      route={this.getAttribute('route')}
      startDate={this.getAttribute('startdate')}
      endDate={this.getAttribute('enddate')}
      maxEntries={this.getAttribute('maxentries')}
      targetSteps={this.getAttribute('targetsteps')} />);
  }
}
const ELEMENT_ID = 'healthcare-react-components';

if (!customElements.get(ELEMENT_ID)) {
  customElements.define(ELEMENT_ID, HealthcareReactComponents);
}
