import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const printFunc = `
    import _React from 'react';
    import _ReactDOM from 'react-dom';
    var print = (value) => {
      const root = document.querySelector('#root');

      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, root);
        } else {
          root.innerHTML = JSON.stringify(value);
        }
      } else {
        root.innerHTML = value;
      }
    };
  `;
    const printFuncNoop = "var print = () => {}";
    const cumulativeCode = [];

    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(printFunc);
        } else {
          cumulativeCode.push(printFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");
};
