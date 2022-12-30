function clearSelect(selectID) {
    const select = document.getElementById(selectID);
    const length = select.options.length;

    for (i = length-1; i>= 1; i--) {
        select.options[i].remove()
    }
}