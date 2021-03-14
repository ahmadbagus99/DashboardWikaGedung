const filterButton = document.querySelector('#filter');

window.onload = async () => {
    filterButton.addEventListener('click', onClickFilter);
};

function onClickFilter() {
    console.log('%c Filter Button is clicked...', 'color: blue');
}