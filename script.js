// const compagnie = document.querySelectorAll('.clients');
// const vanish = document.querySelector('.sidebar')


// // GSAP BREAKS MY HOVER ON INDEX
// gsap.registerPlugin(ScrollTrigger);

// gsap.to('.sidebar', {
//   scrollTrigger: {
//     markers: false,
//     // start: 'bottom 50%',
//     // toggleActions: 'restart complete reverse reset',
//     trigger: '.incitator',
//   },
//   opacity: '0',
//   duration: 1,
// });

// gsap.to('.side', {
//     scrollTrigger: {
//       markers: false,
//     //   start: 'bottom 50%',
//     //   toggleActions: 'restart complete reverse reset',
//       trigger: '.incitator',
//     },
//     opacity: '0',
//     duration: 1,
//   });




// var menus = document.querySelector(".menu__index");
// var img = document.querySelector(".il__txt");

// function toggleImg() {
//   menus.addEventListener('click', function() {
//   img.classList.toggle('img-toggled');
//     (this).classList.toggle('img-toggle-active');
//   });
// }
// toggleImg();

// const colorArr = ["black", "red", "blue", "yellow", "orange", "lightblue", "green", "purple"];


//GOOD CODE------------------------------------------------------------------------------------------------
const body = document.querySelector("body");
const menuItems = document.querySelectorAll(".menu-hover-image .menu-item");
const cursor = document.querySelector(".menu-hover-image .cursor");
const getXY = function (e) {
    return [
        e.clientX,
        e.clientY
    ];
};

menuItems.forEach(function (menuItem) {
    // use mouseenter and mouseleave to toggle cursor since they won't bubble!
    menuItem.addEventListener("mouseenter", function (e) {
        var _a = getXY(e), x = _a[0], y = _a[1];
        cursor.animate([
            {
                opacity: 0,
                transform: "translate(".concat(x, "px, ").concat(y, "px) scale(0)")
            },
            {
                opacity: 1,
                transform: "translate(".concat(x, "px, ").concat(y, "px) scale(1)")
            }
        ], { duration: 300, fill: "forwards" });
        menuItem.addEventListener("mouseleave", function (e) {
            var _a = getXY(e), x = _a[0], y = _a[1];
            cursor.animate([
                {
                    opacity: 1,
                    transform: "translate(".concat(x, "px, ").concat(y, "px) scale(1)")
                },
                {
                    opacity: 0,
                    transform: "translate(".concat(x, "px, ").concat(y, "px) scale(0)")
                }
            ], { duration: 300, fill: "forwards" });
        });
    });
    // move the cursor when mouse moves.
    menuItem.addEventListener("mousemove", function (e) {
        var _a = getXY(e), x = _a[0], y = _a[1];
        cursor.animate([
            {
                transform: "translate(".concat(x, "px, ").concat(y, "px)")
            },
            {
                transform: "translate(".concat(x, "px, ").concat(y, "px)")
            }
        ], { duration: 500, delay: 50, fill: "forwards" });
    });
});

// Background Color change on hover

const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray', 'brown', 'black', 'teal'];

const menuColor = document.querySelectorAll('.menu-item');

function changeBackgroundColor() {
    const colorIndex = this.id - 1;
    const color = colors[colorIndex];
    document.body.style.backgroundColor = color;
};

function resetBackgroundColor() {
    document.body.style.backgroundColor = '';
};

menuItems.forEach((menuItem) => {
    menuColor.addEventListener('mouseover', changeBackgroundColor);
    menuColor.addEventListener('mouseout', resetBackgroundColor);
});



// ------------------------------------CHAT GPT------------------------------------------------------

