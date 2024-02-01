export const otSelectHtml = `
  <div class="selectContainer">
    <div class="selected">
      <input type="text" class="search"></input>
      <span class="collapseToggle active">&#9650;</span>
    </div>
    <div class="optionsWrapper">
      <div class="options">
        <slot></slot>
      </div>
    </div>
  </div>
  <input id="msFormIds" type="text" value="" />
  `;
