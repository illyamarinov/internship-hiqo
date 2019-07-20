const createElement = (elemTag, elemClass = '', attributesList = []) => {
  const element = document.createElement(elemTag);
  if (elemClass !== 0) {
    element.className = elemClass;
  }

  if (Object.keys(attributesList).length !== 0) {
    for (let key in attributesList) {
      element.setAttribute(key, attributesList[key]);
    }
  }
  return element;
};

const addElement = (parent, childs = []) => {
  if (childs.length !== 0) {
    childs.forEach((element) => {
      parent.appendChild(element);
    });
  }
}

const createContext = () => {
  
}

export { createElement, addElement, createContext };
