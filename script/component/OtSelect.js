export { OtOption } from "./OtOption.js";
import { otSelectCss } from "../templates/css/OtSelectCss.js";
import { otSelectHtml } from "../templates/html/OtSelectHtml.js";

const containerTemplate = document.createElement("template");
containerTemplate.innerHTML = `${otSelectCss} ${otSelectHtml}`;

export class OtSelect extends HTMLElement {
  static formAssociated = true;
  _internals;

  constructor() {
    super();
    this._value = "";
    this._internals = this.attachInternals();
    this._internals.setFormValue(this._value);
    this.attachShadow({ mode: "open" });
    this.updateValue();
    this.addListeners();
  }
  addListeners() {
    this.options.forEach((e) =>
      e.addEventListener("selected", this.optionSelected.bind(this)),
    );
  }
  optionSelected(event) {
    if (this.getAttribute("multiple") === null) {
      this.clear();
      event.target.isSelected = true;
    }

    if (this.getAttribute("search") !== null) {
      this.searchInputElement.value = "";
      this.updateFilter();
    }
  }
  clear() {
    this.options.forEach((e) => {
      e.isSelected = false;
      e.render();
    });
  }
  render() {
    const alreadyAdded = [
      ...this.selectedContainerElement.querySelectorAll(".option"),
    ];
    this.options.forEach((e, i) => {
      const addedOption = alreadyAdded.filter(
        (x) => x.dataset.formId === e.formValue,
      );
      if (e.isSelected && addedOption.length === 0) {
        this.selectedContainerElement.insertBefore(
          e.getHTMLElement(false, true),
          this.searchInputElement,
        );
      } else if (!e.isSelected && addedOption.length === 1) {
        addedOption[0].remove();
      }
    });
  }
  connectedCallback() {
    const container = document.importNode(containerTemplate.content, true);
    this.shadowRoot?.appendChild(container);
    this.containerElement?.addEventListener(
      "click",
      this.clickHandler.bind(this),
    );
    this.searchInputElement.addEventListener(
      "input",
      this.onSearchChange.bind(this),
    );

    this.render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("Attribute changed", name, oldValue, newValue);
  }
  onSearchChange(event) {
    this.updateFilter();
  }
  updateFilter() {
    if (this.getAttribute("search") === null) {
      return;
    }

    this.options.forEach((e, i) => {
      e.filter = this.searchInputElement.value;
      e.render();
      return;
    });
  }
  clickHandler(event) {
    const closestOption = event.target.closest(".option");
    const closestToggle = event.target.closest(".collapseToggle");
    if (closestOption !== null) {
      this.onRemove(closestOption);
    } else if (closestToggle !== null) {
      this.toggleCollapse();
    } else {
      this.expandOptions();
      this.focusSearhInput();
    }

    this.updateValue();
    this.render();
  }
  onRemove(element) {
    this.options.forEach((e, i) => {
      if (e.formValue === element.dataset.formId) {
        e.isSelected = false;
        e.render();
        return;
      }
    });
  }
  toggleCollapse() {
    if (this.optionsContainerElement.classList.contains("hidden")) {
      this.expandOptions();
      this.focusSearhInput();
    } else {
      if (this.getAttribute("search") !== null) {
        this.searchInputElement.classList.add("hidden");
      }
      this.optionsContainerElement.classList.add("hidden");
      this.shadowRoot
        .querySelector(".collapseToggle")
        .classList.remove("active");
    }
  }
  expandOptions() {
    this.optionsContainerElement.classList.remove("hidden");
    this.shadowRoot.querySelector(".collapseToggle").classList.add("active");
  }
  focusSearhInput() {
    if (this.getAttribute("search") === null) {
      return;
    }
    this.searchInputElement.classList.remove("hidden");
    this.searchInputElement.focus();
  }
  hideSearchInput() {
    if (this.getAttribute("search") === null) {
      return;
    }
    this.searchInputElement.value = "";
    this.searchInputElement.classList.add("hidden");
  }
  updateValue() {
    if (this.getAttribute("multiple") === null) {
      const selected = [...this.options].filter((x) => x.isSelected);
      const currentValue = selected.length === 0 ? "" : selected[0].formValue;
      this._internals.setFormValue(currentValue);
      return;
    }

    const name = this.getAttribute("name");
    const entries = new FormData();
    let index = 0;
    this.options.forEach((e, i) => {
      if (e.isSelected) {
        entries.append(`${name}-${index++}`, e.formValue);
      }
    });
    this._internals.setFormValue(entries);
  }
  static get observedAttributes() {
    // TODO fjern evt ta i bruk med noko vetigt
    return ["demo"];
  }
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = v;
  }
  get form() {
    return this._internals.form;
  }
  get containerElement() {
    return this.shadowRoot.querySelector(".container");
  }
  get selectedContainerElement() {
    return this.shadowRoot.querySelector(".selected");
  }
  get optionsContainerElement() {
    return this.shadowRoot.querySelector(".options");
  }
  get options() {
    return this.querySelectorAll("ot-option");
  }
  get searchInputElement() {
    return this.shadowRoot.querySelector(".search");
  }
}
