export const otSelectCss = `

  <style>
  :host  {
        background-color: transparent;
        display: block;
        padding: 30px;
        max-width: 700px;
      }

      .container {
          display: grid;
          gap: 0;
          grid-template-columns: 20px 20px auto 20px;
          grid-template-rows: auto fit-content(8em);

          border: solid 1px gray;
          border-radius: 5px;
          background-color: white;

          text-align: left;
          font-size: 1em;
          font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;

          & .inputContainer {
              display: grid;
              grid-column: 1 / 5;
              grid-template-columns: subgrid;

              border: solid 1px #eaeaea;
              border-radius: 5px;

              padding: 0.4em 0.4em 0.2em 0.4em;

              & .selected {
                  display: block;
                  grid-column: 1 / 4;

                  & > * {
                      display: inline-block;
                  }

                  & input {
                      appearance: none;
                      border: none;
                      font-size: 1em;
                      font-family: inherit;

                      &:focus {
                          outline: none;
                      }

                      &.hidden {
                        display: none;
                      }
                  }

                  & .option {
                      border-radius: 5px;
                      box-shadow: rgba(34, 36, 38, 0.15) 0px 0px 0px 1px inset;

                      padding-left: 10px;
                      padding-right: 10px;
                      padding-top: 3px;
                      padding-bottom: 3px;
                      margin-top: 0.1em;
                      margin-bottom: 0.4em;
                      margin-right: 0.3em;

                      color: #444;
                      background-color: #eee;
                      cursor: pointer;
                      font-weight: 600;

                      &:hover {
                          background-color: pink;
                      }

                      & > span:nth-of-type(2) {
                          font-family: monospace;
                          font-size: 0.8em;
                          color: gray;
                      }
                  }
              }

              & .collapseToggle {
                  font-size: 0.7rem;
                  display: inline-block;
                  transform: rotate(180deg);
                  transition: transform 0.5s;
                  float: right;
                  margin: 6px;
                  color: #666;
              }

              & .collapseToggle.active {
                  transform: rotate(0deg);
                  transition: transform 0.5s;
              }
          }

          & .options {
              display: block;
              grid-row: 2;
              grid-column: 1 / 5;

              overflow-y: auto;
              overflow-x: hidden;

              transition: max-height 0.5s ease-out;
              max-height: 1000px;

              &.hidden {
                max-height: 0;
                transition: max-height 0.5s ease-out;
              }

              & .option {
                  display: grid;
                  grid-template-columns: subgrid;
                  grid-column: 1 / 5;

                  cursor: pointer;
                  padding-top: 0.5em;
                  padding-bottom: 0.5em;

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
          }
      }

      </style>
  `;
