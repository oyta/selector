const optionTemplate = document.createElement("template");
optionTemplate.innerHTML = `<div class="option" data-value=""></div>`;

class NVOption extends HTMLElement {
  data: NVOptionData = {value: "", name: "", selected: false};
  
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }
  
  render() {
    const optionElement = this.shadowRoot.querySelector(".option");
    console.log(optionElement);
    optionElement.innerHTML = this.data.name;
    optionElement.setAttribute("value",this.data.value);
    if(this.data.selected) {
      optionElement.setAttribute("selected","");
    }
    else {
      optionElement.removeAttribute("selected");
    }
    
  }
    
  connectedCallback() {
    const isSelected = this.getAttribute("selected") !== null;
    this.data = {value: this.getAttribute("initialValue")??"", name: this.innerText, selected: isSelected };
    const option = document.importNode(optionTemplate.content, true);
    if(this.shadowRoot !== null) {
      this.shadowRoot.appendChild(option);
    }
    
    // const optionElement = this.shadowRoot.querySelector(".option");
    
    // optionElement.addEventListener("click", this.clickHandler.bind(this));
    
    this.render();
  }
  
  static get observedAttributes() {
    return ["selected"];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("MS Option selected Attribute changed", name, oldValue,newValue);
  }
  
  disconnectedCallback() {
  }
  
  onFocus() {
    // show options
  }
  
  onBlur() {
    // hide options
  } 
}

class NVOptionData {
  name: string = "";
  value: string = "";
  selected: boolean = false;
}

window.customElements.define("multiple-select", MultipleSelect);
window.customElements.define("ms-option", MSOption);