// Utility functions

export function formatDate(dateString, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  try {
    return new Date(dateString).toLocaleDateString("en-US", { ...defaultOptions, ...options });
  } catch (e) {
    return dateString;
  }
}

export function formatCurrentDate(options) {
  return new Date().toLocaleDateString("en-US", options);
}

export function isValidGrade(val, validGrades) {
  if (!val) return true;
  const upperVal = val.toUpperCase();
  return validGrades.includes(upperVal);
}

export function computeSemGrade(midterm, final) {
  const mid = parseFloat(midterm);
  const fin = parseFloat(final);
  if (!isNaN(mid) && !isNaN(fin)) {
    return ((mid + fin) / 2).toFixed(2);
  }
  return "";
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

export function generateId(prefix = "ID") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}

export function sortBy(array, key, ascending = true) {
  return [...array].sort((a, b) => {
    let aVal = a[key];
    let bVal = b[key];
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (ascending) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}