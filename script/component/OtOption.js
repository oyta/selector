export const optionTemplate = document.createElement("template");
optionTemplate.innerHTML = `<style>
.option {
  display: block;
  margin-bottom: 5px;
  cursor: pointer;
  border-radius: 5px;
  border: solid 1px transparent;
  padding: 5px;
  padding-left: 20px;

  &:hover {
    background-color: pink;
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
      optionElement.innerHTML = `${this.isSelected ? "☑" : "☐"} `;
    } else {
      optionElement.innerHTML = ``;
    }
    optionElement.innerHTML += `${this.label}`;
    if (withCloseSymbol) {
      optionElement.innerHTML += ` <span style="color: red;">✖</span>`;
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
    optionElement.innerHTML = `${this.isSelected ? "☑" : "☐"} ${this.label}`;
    optionElement.style.display = this.isSelected ? "none" : "block";
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
