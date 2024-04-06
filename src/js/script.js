import getItemName from './modules/getItemName';

console.log('HELLO from script.js');

const headerBtnEl = document.querySelector('.header__btn');
headerBtnEl.addEventListener('click', function (e) {
  console.log(e);
  getItemName(e.target.innerText);
});
