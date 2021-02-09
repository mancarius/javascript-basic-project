function builder(dom, success) {
  document.body.append(dom)
}


function findSolution(target) {
  function find(current, html) {
    if (current === target) {
      builder(html, true);
    } else if (current > target) {
      builder(html, false);
    } else {
      let li = document.createElement('li').appendChild(document.createElement('ul'));
      html.lastChild.appendChild(el);
      return find(current * 2, html) ||
        find(current * 3, html) ||
        find(current * 4, html) ||
        find(current * 5, html);
    }
  }
  let html = document.createElement('ul');
  find(1, html);
}

export default findSolution;