export { OtOption } from "./OtOption.js";

const containerTemplate = document.createElement("template");
containerTemplate.innerHTML = `
<style>
:host  {
      background-color: transparent;
      display: block;
      padding: 30px;
      max-width: 700px;
    }

    .selectContainer {
      border: solid 1px gray;
      border-radius: 5px;
      background-color: white;
      text-align: left;
      padding: 10px;
    }
    .selected {
      width: 100%;
      border: solid 1px #eaeaea;
      border-radius: 5px;
      height: 40px;
    }
    .selected>.option{
      border: solid 1px #e3e3e3;
      border-radius: 5px;
      display: inline-block;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 3px;
      padding-bottom: 3px;
      margin: 4px;
      background-color: #f3f3f3;
      cursor: pointer;

      &:hover {
        background-color: pink;
      }

      & > span {
        padding-left: 10px;
        font-weight: bold;
        font-family: monospace;
        font-size: 0.8em;
      }
    }

    .options {
      display: block;
      margin: 4px;
      margin-left: 20px
      padding-left: 15px;
    }

    .selected>input {
      height: 100%;
      border: none;
      font-size: 1rem;
    }
    </style>
    <div class="selectContainer"><div class="selected"><input type="text" class="search"></input></div><div class="options"><slot></slot></div></div>
    <input id="msFormIds" type="text" value="" />`;

// TODO dispatch ein event som andre script kan lytta på
// TODO focus() og blur() for å visa og skjula valg
// TODO label
// TODO Søkefelt viss > 10 valg?
export class OtSelect extends HTMLElement {
  getValuesString() {
    let returnString = "";
    this.getAllOptions().forEach((e, i) => {
      returnString += e.isSelected ? e.formValue + "," : "";
    });
    if (returnString.length > 0) {
      returnString = returnString.slice(0, -1);
    }
    return returnString;
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  render() {
    const alreadyAdded = [
      ...this.getSelectedContainer().querySelectorAll(".option"),
    ];
    this.getAllOptions().forEach((e, i) => {
      const addedOption = alreadyAdded.filter(
        (x) => x.dataset.formId === e.formValue,
      );
      if (e.isSelected && addedOption.length === 0) {
        this.getSelectedContainer().prepend(e.getHTMLElement(false, true));
      } else if (!e.isSelected && addedOption.length === 1) {
        addedOption[0].remove();
      }
    });
    this.getInputElement().value = this.getValuesString();
  }
  clear() {
    this.getSelectedContainer().innerHTML = "";
  }
  getContainer() {
    return this.shadowRoot.querySelector(".selectContainer");
  }
  getSelectedContainer() {
    return this.shadowRoot.querySelector(".selected");
  }
  getOptionsContainer() {
    return this.shadowRoot.querySelector(".options");
  }
  getInputElement() {
    const id = this.getAttribute("inputId") ?? "msFormIds";
    return this.shadowRoot.querySelector(`#${id}`);
  }
  getAllOptions() {
    return this.querySelectorAll("ot-option");
  }
  connectedCallback() {
    const container = document.importNode(containerTemplate.content, true);
    this.shadowRoot?.appendChild(container);
    const containerElement = this.shadowRoot?.querySelector(".selectContainer");
    containerElement?.addEventListener("click", this.clickHandler.bind(this));
    const inputElement = this.shadowRoot?.getElementById("msFormIds");
    if (typeof inputElement !== "undefined" && inputElement !== null) {
      inputElement.id = this.getAttribute("inputId") ?? "msFormIds";
      inputElement.addEventListener("change", () =>
        this.dispatchEvent(new Event("customevent")),
      );
    }
    const searchInput = this.shadowRoot?.querySelector("input.search");
    searchInput.addEventListener("focus", this.onFocus.bind(this));
    searchInput.addEventListener("blur", this.onBlur.bind(this));
    this.render();
  }
  static get observedAttributes() {
    return ["demo"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed", name, oldValue, newValue);
  }
  disconnectedCallback() {
    console.log("My custom element removed from DOM!");
  }
  onFocus() {
    this.getOptionsContainer().style.display = "block";
  }
  onBlur() {
    this.getOptionsContainer().style.display = "none";
  }
  clickHandler(event) {
    const closest = event.target.closest(".option");
    if (closest !== null) {
      this.onRemove(closest);
    }
    this.render();
  }
  onRemove(element) {
    this.getAllOptions().forEach((e, i) => {
      if (e.formValue === element.dataset.formId) {
        e.isSelected = false;
        e.render();
        return;
      }
    });
  }
}
