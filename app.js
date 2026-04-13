// Preload all images to avoid loading delays
const assetPaths = [
    './assets/colombo.jpg',
    './assets/kandy.jpg',
    './assets/galle.jpg',
    './assets/haputhale.jpg',
    './assets/ella.jpg',
    './assets/Sigiriya.jpg',
    './assets/yala.jpg'
];

assetPaths.forEach(path => {
    const img = new Image();
    img.src = path;
});

//step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carosel');
let SliderDom = carouselDom.querySelector('.carosel .list');
let thumbnailBorderDom = document.querySelector('.carosel .thumbnail');
let timeDom = document.querySelector('.carosel .time');

// Initial setup: move first thumbnail to end so second item is the first thumbnail
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

let timeRunning = 1000;
let runTimeOut;

nextDom.onclick = function () {
    showSlider('next');
}

prevDom.onclick = function () {
    showSlider('prev');
}

function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.carosel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carosel .thumbnail .item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);
}

// Click thumbnail to go to that image
function initThumbnailClicks() {
    let thumbnailItems = thumbnailBorderDom.querySelectorAll('.item');
    thumbnailItems.forEach((item, index) => {
        item.onclick = function () {
            // If we click a thumbnail, we want that image to become the main one.
            // In our logic, the first thumbnail in the DOM is the "next" item.
            // So if we click the i-th thumbnail (0-indexed), we need i+1 'next' transitions.

            let count = index + 1;
            // For a better user experience without a ton of sequential animations, 
            // we can just reorder the DOM instantly for jumps > 1
            if (count === 1) {
                showSlider('next');
            } else {
                // For direct jumps, we instantly reorder and then maybe trigger one animation
                // or just reorder. Let's try performing the moves.
                for (let i = 0; i < count; i++) {
                    let currentSliderItems = SliderDom.querySelectorAll('.carosel .list .item');
                    let currentThumbnailItems = thumbnailBorderDom.querySelectorAll('.item');
                    SliderDom.appendChild(currentSliderItems[0]);
                    thumbnailBorderDom.appendChild(currentThumbnailItems[0]);
                }
                // Trigger a 'next' class briefly to show content animation
                carouselDom.classList.add('next');
                clearTimeout(runTimeOut);
                runTimeOut = setTimeout(() => {
                    carouselDom.classList.remove('next');
                }, timeRunning);
            }
        }
    });
}

// Initial call
initThumbnailClicks();

// Re-initialize clicks after every slider move since DOM elements change
// Actually, it's better to use event delegation or re-bind.
// Let's modify showSlider to re-bind or just use the same items if possible.
// Wait, appending/prepending keeps the same elements but changes order.
// Since we bind to the elements themselves, we don't necessarily need to re-bind 
// unless we create new elements. But we are moving them.

// To be safe, let's use a simpler approach: event delegation
thumbnailBorderDom.onclick = function (e) {
    let item = e.target.closest('.item');
    if (!item) return;

    let items = Array.from(thumbnailBorderDom.querySelectorAll('.item'));
    let index = items.indexOf(item);

    let count = index + 1;
    if (count === 1) {
        showSlider('next');
    } else {
        for (let i = 0; i < count; i++) {
            let currentSliderItems = SliderDom.querySelectorAll('.carosel .list .item');
            let currentThumbnailItems = thumbnailBorderDom.querySelectorAll('.item');
            SliderDom.appendChild(currentSliderItems[0]);
            thumbnailBorderDom.appendChild(currentThumbnailItems[0]);
        }
        carouselDom.classList.add('next');
        clearTimeout(runTimeOut);
        runTimeOut = setTimeout(() => {
            carouselDom.classList.remove('next');
        }, timeRunning);
    }
}
