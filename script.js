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

window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loading-screen').style.top = '-105%'; // Change this line
  }, 2000); //  2 seconds
});

// window.addEventListener('load', function() {
//   // Prevent scrolling
//   document.body.style.overflow = 'hidden';

//   setTimeout(function() {
//     document.getElementById('loading-screen').style.top = '-105%';

//     // Allow scrolling
//     document.body.style.overflow = 'auto';
//   }, 1000); // 2000 milliseconds = 2 seconds
// });

document.addEventListener("DOMContentLoaded", function() {
  var images = [
    'assets/png/ernest-karchmit-UAbg0py6GYQ-unsplash.jpg',
    'assets/png/il_thumbnail.png',
    'assets/png/deluge_thumbnail.jpg',
    'assets/png/EW_snapshot2.png',
    'assets/png/cdi_thumbnail.png',
    'assets/png/maniac_thumbnail.png',
    'assets/png/this_could_be_us-JzK_remix.png',
    'assets/png/you_and_me_thumbnail.png',
    'assets/png/graphisme_popup.png',
    'assets/categories/design_graphique/partie-echec/j12.png',
    'assets/png/cielo_thumbnail.png',
    'assets/png/storm_thumbnail.png',
    'assets/png/anomalie_thumbnail.png',
    'assets/png/edria_night_exterior.png'
  ];

  for (var i = 0; i < images.length; i++) {
    var img = new Image();
    img.src = images[i];
  }
});

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

const colors = ['#D52323', '#B3BDE9', '#5BBF67', '#F6A2A2', '#593C8F', 'purple', 'pink', '#242038', '#FDF28C', '#86B9E9', 'teal', '#CACFD6'];

const menuColor = document.querySelectorAll('.menu-item');

const projectName = document.querySelectorAll("h1");

// projectName.forEach((menuItem) => {
//   let colorIndex = Number(menuItem.id - 1);
//   //menuItem.addEventListener('mouseover', changeBackgroundColor(colorIndex));
//   menuItem.addEventListener("mouseenter", function () {
//     const color = colors[colorIndex];
//     document.body.style.backgroundColor = color;
//   });

//   menuItem.addEventListener("mouseout", function (colorIndex) {
//     document.body.style.backgroundColor = '';
//   });
// });


/*--------------------------------------------------------------------------------------
Get Mouse
--------------------------------------------------------------------------------------*/
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, dir: '' };
const getMouse = (e) => {
  mouse = {
    x: e.clientX || e.pageX || e.touches[0].pageX || 0,
    y: e.clientY || e.pageX || e.touches[0].pageY || 0,
    dir: (getMouse.x > e.clientX) ? 'left' : 'right'
  }
};
['mousemove', 'touchstart', 'touchmove'].forEach(e => {
  window.addEventListener(e, getMouse);
});


/*--------------------
Mouse Follow
--------------------*/
class MouseFollow {
  constructor (options) {
    Object.assign(this, options);
    
    this.pos = {
      x: 0,
      y: 0
    }
  }
  
  follow() {
    this.distX = mouse.x - this.pos.x;
    this.distY = mouse.y - this.pos.y;
    
    this.velX = Math.abs(this.distX / 8);
    this.velY = Math.abs(this.distY / 8);
    
    this.pos.x += this.distX / (10 + (this.ind * gooey));
    this.pos.y += this.distY / (10 + (this.ind * gooey));
    
    this.scaleX = map(this.velX, 0, 100, 1, 2);
    this.scaleY = map(this.velY, 0, 100, 1, 2);

    this.el.style.transform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px) scale(' + Math.max(this.scaleX, this.scaleY) + ')';
  }
}


/*--------------------
Map
--------------------*/
function map (num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


/*--------------------
Init
--------------------*/
const gooey = .8;
const blobs = Array.from(document.querySelectorAll('#cursorID .blob'));
const blobFollows = blobs.map((e, i) => new MouseFollow({ el: e, ind: i }));


/*--------------------
Render
--------------------*/
const render = () => {
  requestAnimationFrame(render);
  blobFollows.forEach(e => e.follow());
}
render();
