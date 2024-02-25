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
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this.updateValue();
  }
  addOptionListeners() {
    this.options.forEach((e) => {
      e.addEventListener("selected", this.optionSelected.bind(this));
      e.addEventListener("deselected", this.optionDeselected.bind(this));
    });
  }
  optionSelected(event) {
    if (this.getAttribute("multiple") === null) {
      this.clear([event.target]);
    }

    if (this.getAttribute("search") !== null) {
      this.searchInputElement.value = "";
      this.updateFilter();
    }

    this.updateValue();
    this.render();
  }
  optionDeselected(event) {
    this.updateValue();
    this.render();
  }
  clear(exceptionList) {
    this.options.forEach((e) => {
      if (!exceptionList.includes(e)) {
        e.isSelected = false;
        e.isActive = false;
      }
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

    if (this.getAttribute("search") === null) {
      this.containerElement.setAttribute("tabindex", "0");
      this.searchInputElement.classList.add("hidden");
      this.addEventListeners([
        [this.containerElement, "blur", this.blurHandler],
        [this.containerElement, "focus", this.focusHandler],
      ]);
    } else {
      this.addEventListeners([
        [this.searchInputElement, "input", this.onSearchChange],
        [this.searchInputElement, "blur", this.blurHandler],
        [this.searchInputElement, "focus", this.focusHandler],
      ]);
    }
    this.addEventListeners([
      [this.containerElement, "click", this.clickHandler],
      [this.containerElement, "keydown", this.keyDownHandler],
    ]);
    this.addOptionListeners();
    this.render();
  }
  addEventListeners(listenerList) {
    for (const listener of listenerList) {
      listener[0].addEventListener(listener[1], listener[2].bind(this));
    }
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

  keyDownHandler(event) {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.keyCode === 40) {
      // Arrow down
      const options = this.availableOptions([...this.options]);
      const nextOption = this.next([...options].filter((x) => !x.isSelected));
      if (nextOption === null) {
        return;
      }
      this.scrollToOption(nextOption);
      nextOption.isActive = true;
    } else if (event.keyCode === 38) {
      // Arrow up
      const options = this.availableOptions([...this.options].reverse());
      const nextOption = this.next([...options].filter((x) => !x.isSelected));
      if (nextOption === null) {
        return;
      }
      this.scrollToOption(nextOption);
      nextOption.isActive = true;
    } else if (event.keyCode === 8) {
      // Backspace
      const formId = [
        ...this.selectedContainerElement.querySelectorAll(".option"),
      ].reverse()[0].dataset.formId;
      [...this.options][formId - 1].isSelected = false;
    } else if (event.keyCode === 13 || event.keyCode == 32) {
      // Enter
      const option = [...this.options].filter((x) => x.isActive)[0];
      if (typeof option === "undefined" || option === null) {
        return;
      }
      option.isActive = false;
      option.isSelected = true;
    } else if (event.keyCode === 27) {
      // ESC
      this.blur();
    } else if (event.keyCode == 34) {
      // End
    } else if (event.keyCode == 33) {
      // Home
    }
  }
  clickHandler(event) {
    const closestOption = event.target.closest(".option");
    if (closestOption !== null) {
      this.onRemove(closestOption);
    }
  }
  blurHandler(event) {
    if (!event.target.contains(event.relatedTarget)) {
      this.collapseOptions();
    }
  }
  focusHandler(event) {
    this.expandOptions();
  }
  onRemove(element) {
    this.options.forEach((e, i) => {
      if (e.formValue === element.dataset.formId) {
        e.isSelected = false;
        return;
      }
    });
  }
  availableOptions(options) {
    let currentIndex = -1;
    options.forEach((e, i) => {
      if (e.isActive) {
        e.isActive = false;
        currentIndex = i;
      }
    });
    return [...options].slice(currentIndex + 1);
  }
  next(elements) {
    if (typeof elements === "undefined" || elements === null) {
      return null;
    }
    if (elements.length === 0) {
      return null;
    }
    return elements[0];
  }
  scrollToOption(option) {
    const topPos = option.offsetTop - this.optionsContainerElement.offsetTop;
    this.optionsContainerElement.scrollTop = topPos;
  }
  expandOptions() {
    this.optionsContainerElement.classList.remove("hidden");
    this.shadowRoot.querySelector(".collapseToggle").classList.add("active");
  }
  collapseOptions() {
    this.optionsContainerElement.classList.add("hidden");
    this.shadowRoot.querySelector(".collapseToggle").classList.remove("active");
  }
  focusThis() {
    if (this.getAttribute("search") === null) {
      this.focus();
    } else {
      this.searchInputElement.classList.remove("hidden");
      this.searchInputElement.focus();
    }
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
