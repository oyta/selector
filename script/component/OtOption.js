export const optionTemplate = document.createElement("template");
optionTemplate.innerHTML = `<style>
  .option {
      display: grid;
      grid-template-columns: 20px 20px 1fr 20px;
      grid-template-rows: auto;

      cursor: pointer;
      padding-top: 0.5em;
      padding-bottom: 0.5em;

      &.hidden {
        display: none;
      }

      &:hover {
          background-color: #f3f3f3;
          border-radius: 0;
      }

      & :first-child {
          grid-column: 2 / 3;
      }

      & :nth-child(2) {
          grid-column: 3 / 5;
      }
  }

</style>
<div class="option" data-value=""></div>`;

export class OtOption extends HTMLElement {
  label;
  formValue;
  isSelected;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  getHTMLElement(withCheckmarkSymbol = true, withCloseSymbol = false) {
    const option = document.importNode(optionTemplate.content, true);
    const optionElement = option.querySelector(".option");
    if (withCheckmarkSymbol) {
      optionElement.innerHTML = `<span>${this.isSelected ? "☑" : "☐"}</span>`;
    } else {
      optionElement.innerHTML = ``;
    }
    optionElement.innerHTML += `<span>${this.label}</span>`;
    if (withCloseSymbol) {
      optionElement.innerHTML += ` <span>✖</span>`;
    }
    optionElement.dataset.formId = this.formValue;
    return optionElement;
  }
  connectedCallback() {
    const isSelected = this.getAttribute("selected") !== null;
    this.formValue = this.getAttribute("initialValue") ?? "";
    this.label = this.innerHTML;
    this.isSelected = isSelected;
    const option = document.importNode(optionTemplate.content, true);
    this.shadowRoot.appendChild(option);
    const optionElement = this.shadowRoot.querySelector(".option");
    optionElement.addEventListener("click", this.clickHandler.bind(this));
    this.render();
  }
  render() {
    const optionElement = this.shadowRoot.querySelector(".option");
    optionElement.innerHTML = `<span>${this.isSelected ? "☑" : "☐"}</span><span>${this.label}</span>`;
    if (this.isSelected) {
      optionElement.classList.add("hidden");
    } else {
      optionElement.classList.remove("hidden");
    }
  }
  clickHandler(event) {
    this.isSelected = !this.isSelected;
    this.render();
  }
  static get observedAttributes() {
    return ["isSelected"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      "Ot Option selected Attribute changed",
      name,
      oldValue,
      newValue,
    );
  }
  disconnectedCallback() {}
  onFocus() {
    // show options
  }
  onBlur() {
    // hide options
  }
}
