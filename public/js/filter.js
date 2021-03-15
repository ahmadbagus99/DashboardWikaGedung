const filterButton = document.querySelector('#filter');
const divisiFilter = document.querySelector('#divisi-filter');
const selectDivisi = document.getElementById("divisi-filter");
const selectCafeWege = document.getElementById("cafewege-filter");

Pusher.logToConsole = true;

const pusher = new Pusher('b520b5ff2c37e46950a6', {
    cluster: 'ap1'
});
const channel = pusher.subscribe('my-channel');

window.onload = async () => {
    filterButton.addEventListener('click', onClickFilter);
};

document.addEventListener('DOMContentLoaded', function() {
    channel.bind('my-event', function(data) {
        alert(JSON.stringify(data));
    });
});

function onClickFilter() {
    console.log(divisiFilter.value);
}
