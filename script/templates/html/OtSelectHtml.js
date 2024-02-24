export const otSelectHtml = `
  <div class="container">
    <div class="inputContainer">
      <div class="selected">
        <input type="text" class="search"></input>
      </div>
      <div class="optionsToggle">
          <span class="collapseToggle">&#9650;</span>
      </div>
    </div>
    <div class="options hidden">
        <slot></slot>
    </div>
  </div>
  `;
