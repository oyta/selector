export const otSelectCss = `

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
        min-height: 40px;
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

      .optionsWrapper {
        grid-template-rows: 1fr;
        display: grid;
        margin: 4px;
        margin-left: 20px
        padding-left: 15px;
        transition: grid-template-rows 0.5s ease-out;
      }
      .optionsWrapper:has(.hidden) {
        grid-template-rows: 0fr;
      }
      .options {
        overflow: hidden;
      }

      .selected>input {
        height: 100%;
        border: none;
        font-size: 1rem;
      }

      .collapseToggle {
        display: inline-block;
        transform: rotate(180deg);
        transition:  transform 0.5s;
        float: right;
        margin: 6px;
        color: #ccc;
      }
      .collapseToggle.active {
          transform: rotate(0deg);
          transition: transform 0.5s;
      }
      </style>
  `;
