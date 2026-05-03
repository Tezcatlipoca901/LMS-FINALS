// DOM manipulation helpers

export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

export function createElement(tag, className, attributes = {}, children = []) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

export function toggleClass(element, className, force) {
  if (element) {
    if (force !== undefined) {
      element.classList.toggle(className, force);
    } else {
      element.classList.toggle(className);
    }
  }
}

export function addClass(element, className) {
  if (element) element.classList.add(className);
}

export function removeClass(element, className) {
  if (element) element.classList.remove(className);
}

export function setText(element, text) {
  if (element) element.textContent = text;
}

export function setHTML(element, html) {
  if (element) element.innerHTML = html;
}

export function showElement(element, display = 'block') {
  if (element) element.style.display = display;
}

export function hideElement(element) {
  if (element) element.style.display = 'none';
}

export function scrollToElement(element, behavior = 'smooth') {
  if (element) element.scrollIntoView({ behavior });
}