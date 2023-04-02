async function loadTemplate(templateName) {
    const response = await fetch(`/views/shared/templates/${templateName}.html`);
    return await response.text();
  }
  
  async function includeTemplates() {
    const navbarContainer = document.getElementById("navbar-container");
    if (navbarContainer) {
      navbarContainer.innerHTML = await loadTemplate("navbar");
    }
  }
  
  includeTemplates();
  