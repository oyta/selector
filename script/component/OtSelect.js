export { OtOption } from "./OtOption.js";
import { otSelectCss } from "../templates/css/OtSelectCss.js";
import { otSelectHtml } from "../templates/html/OtSelectHtml.js";

const containerTemplate = document.createElement("template");
containerTemplate.innerHTML = `${otSelectCss} ${otSelectHtml}`;

// TODO [ ] Søkefelt mogleg ved bruk av search-atttributt
// TODO [ ] Single eller multi select
// TODO [ ] Input-feltet skal ikkje ligga åleina på ny linja. Kan evt leggjast på ved fokus og elles fjerna.
export class OtSelect extends HTMLElement {
  static formAssociated = true;
  _internals;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
    this.value_ = "";
    this._internals.setFormValue(this.value_);
  }
  get value() {
    return this.value_;
  }
  set value(v) {
    this.value_ = v;
  }
  get form() {
    return this._internals.form;
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
  }
  clear() {
    this.getSelectedContainer().innerHTML = "";
  }
  getContainer() {
    return this.shadowRoot.querySelector(".container");
  }
  getSelectedContainer() {
    return this.shadowRoot.querySelector(".selected");
  }
  getOptionsContainer() {
    return this.shadowRoot.querySelector(".options");
  }
  getAllOptions() {
    return this.querySelectorAll("ot-option");
  }
  connectedCallback() {
    const container = document.importNode(containerTemplate.content, true);
    this.shadowRoot?.appendChild(container);
    const containerElement = this.getContainer();
    containerElement?.addEventListener("click", this.clickHandler.bind(this));
    containerElement?.addEventListener("focus", this.onFocus.bind(this));
    containerElement?.addEventListener("blur", this.onBlur.bind(this));
    const searchInput = this.shadowRoot?.querySelector("input.search");
    searchInput.addEventListener("change", this.onInputChange.bind(this));

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
  onFocus(event) {
    this.getOptionsContainer().style.display = "block";
    console.log("focus");
  }
  onBlur(event) {
    this.getOptionsContainer().style.display = "none";
    console.log("blur");
  }
  onInputChange(event) {
    console.log("Input changed!");
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

  toggleCollapse() {
    if (this.getOptionsContainer().classList.contains("hidden")) {
      this.expandOptions();
    } else {
      this.getOptionsContainer().classList.add("hidden");
      this.shadowRoot
        .querySelector(".collapseToggle")
        .classList.remove("active");
    }
  }

  expandOptions() {
    this.getOptionsContainer().classList.remove("hidden");
    this.shadowRoot.querySelector(".collapseToggle").classList.add("active");
  }
}
