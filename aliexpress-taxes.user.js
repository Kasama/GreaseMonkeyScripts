// ==UserScript==
// @name        Show values with taxes on Aliexpress
// @namespace   Violentmonkey Scripts
// @match       https://pt.aliexpress.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/12/2024, 12:20:11 PM
// ==/UserScript==

const alreadyProcessedTag = 'aliexpress-taxes-processed';

function getValues(total) {
  const taxes = 0.45;

  const newTotal = total * (1 + taxes);
  const taxesValue = total * taxes;

  return {
    startingValue: total,
    taxesValue: taxesValue,
    newTotal: newTotal,
  }
}

function updateProductCards() {
  const products = Array.from(document.querySelectorAll('div')).filter(div => {
    const spans = div.children;
    return !div.classList.contains(alreadyProcessedTag) && spans.length === 4 &&
      Array.from(spans).every(child =>
        child.tagName === 'SPAN' &&
        child.style.fontSize !== ''
      );
  });

  products.forEach(div => {
    const spans = Array.from(div.children);
    const currencySymbol = spans[0].textContent;
    const dollars = parseFloat(spans[1].textContent.replace('$', '')) || 0;
    const cents = parseFloat(spans[3].textContent) / 100 || 0;
    const values = getValues(dollars + cents);

    // Add 10% sibling div
    const newDiv = document.createElement('div');
    newDiv.style.paddingLeft = '3px';
    newDiv.innerHTML = `${currencySymbol}${values.startingValue.toFixed(2)}+${values.taxesValue.toFixed(2)}`;
    div.parentElement.appendChild(newDiv);

    const newValue = Math.floor(values.newTotal);
    const newCents = Math.ceil((values.newTotal - newValue) * 100);

    spans[1].textContent = `${newValue}`;
    spans[3].textContent = newCents.toString().padStart(2, '0');

    div.classList.add(alreadyProcessedTag);
  });
}

function updateCartProducts() {
  products = document.querySelectorAll(".cart-product-price")

  products.forEach(product => {
    if (product.classList.contains(alreadyProcessedTag)) {
      return;
    }

    product.style.display = 'flex';
    product.style.flexDirection = 'column';

    const priceDiv = product.querySelector(".cart-product-price-text")
    const price = parseFloat(priceDiv.textContent.replace('R$', '').replace(',', '.')) || 0;

    const values = getValues(price);

    const newPriceDiv = document.createElement('div');
    newPriceDiv.style.fontSize = '10px';
    newPriceDiv.innerHTML = `R$${values.startingValue.toFixed(2)}+${values.taxesValue.toFixed(2)}`;
    product.appendChild(newPriceDiv);

    priceDiv.textContent = `R$${values.newTotal.toFixed(2)}`;

    product.classList.add(alreadyProcessedTag);
  });
}

function updateProductPage() {
  if (window.location.href.indexOf("/item/") == -1) {
    return;
  }
  // price = document.querySelectorAll(".product-price-value")

  // price.forEach(price => {
  //   if (price.classList.contains(alreadyProcessedTag)) {
  //     return;
  //   }

  //   price.style.display = 'flex';
  //   price.style.flexDirection = 'column';

  //   const priceDiv = price.querySelector(".cart-product-price-text")
  //   const price = parseFloat(priceDiv.textContent.replace('R$', '').replace(',', '.')) || 0;

  //   const values = getValues(price);

  //   const newPriceDiv = document.createElement('div');
  //   newPriceDiv.style.fontSize = '10px';
  //   newPriceDiv.innerHTML = `R$${values.startingValue.toFixed(2)}+${values.taxesValue.toFixed(2)}`;
  //   price.appendChild(newPriceDiv);

  //   priceDiv.textContent = `R$${values.newTotal.toFixed(2)}`;

  //   price.classList.add(alreadyProcessedTag);
  // });
}

document.getValues = getValues;
document.updateProductCards = updateProductCards;
document.updateCartProducts = updateCartProducts;

window.addEventListener('load', () => {
  console.log("Loaded DOM")
  setInterval(() => {
    console.log("Updating products")
    updateProductCards();
    updateCartProducts();
  }, 2000)
});
