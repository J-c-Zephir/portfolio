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


/*--------------------------------------------------------------------------------------
Make it so when you click on an image, it opens a modal with the image
--------------------------------------------------------------------------------------*/
// Get the modal
var modal = document.getElementById("imageModal");

// Get the image and insert it inside the modal
var modalImg = document.getElementById("img01");
var images = document.querySelectorAll('.showcase__graphisme img, .vid__pictures');
images.forEach(img => {
    img.onclick = function(){
        modal.style.display = "block"; // Show the modal
        setTimeout(() => {
            modal.classList.add("open"); // Add the open class for animation
        }, 10); // Small delay to allow display change before animation
        modalImg.src = this.src; // Set the image source

        // Wait for the image to load, then adjust its size
        modalImg.onload = function() {
            const imgAspectRatio = modalImg.naturalWidth / modalImg.naturalHeight;
            const maxWidth = window.innerWidth * 0.7; // 70% of screen width
            const maxHeight = window.innerHeight * 0.9; // 90% of screen height

            if (imgAspectRatio > 1) {
                // Landscape image
                modalImg.style.width = `${maxWidth}px`;
                modalImg.style.height = "auto";
            } else {
                // Portrait or square image
                modalImg.style.height = `${maxHeight}px`;
                modalImg.style.width = "auto";
            }
        };
    }
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.classList.remove("open"); // Remove the open class for fade-out
    setTimeout(() => {
        modal.style.display = "none"; // Hide the modal after animation
    }, 300); // Match the duration of the CSS transition
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.remove("open"); // Remove the open class for fade-out
        setTimeout(() => {
            modal.style.display = "none"; // Hide the modal after animation
        }, 300); // Match the duration of the CSS transition
    }
}


/*--------------------------------------------------------------------------------------
Fetch Instagram Images
--------------------------------------------------------------------------------------*/


// Fetch images from Instagram (using a proxy or third-party service)
// async function fetchInstagramImages() {
//   const instagramUsername = "real_jc_art";
//   const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Use a proxy to avoid CORS issues
//   const instagramUrl = `https://www.instagram.com/${instagramUsername}/?__a=1`;

//   try {
//       const response = await fetch(proxyUrl + instagramUrl);
//       const data = await response.json();
//       const images = data.graphql.user.edge_owner_to_timeline_media.edges;

//       const grid = document.querySelector(".grid");
//       images.forEach((image) => {
//           const imgUrl = image.node.display_url;
//           const imgElement = document.createElement("img");
//           imgElement.src = imgUrl;
//           imgElement.alt = "Instagram Image";
//           grid.appendChild(imgElement);
//       });

//       // Add click event listeners to all images
//       const gridImages = document.querySelectorAll(".grid img");
//       gridImages.forEach((img) => {
//           img.addEventListener("click", () => openModal(img.src));
//       });
//   } catch (error) {
//       console.error("Error fetching Instagram images:", error);
//   }
// }

// Open modal with clicked image
function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("img01");
  modal.style.display = "block";
  modalImg.src = src;
  setTimeout(() => {
      modal.classList.add("open");
  }, 10);
}

// Close modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("open");
  setTimeout(() => {
      modal.style.display = "none";
  }, 300);
}

// Event listeners for closing the modal
document.querySelector(".close").addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("imageModal")) {
      closeModal();
  }
});

// Fetch Instagram images when the page loads
// fetchInstagramImages();




// Call the function when the page loads
window.addEventListener('load', resizeTextBasedOnLength);

// Call the function when the window is resized
window.addEventListener('resize', resizeTextBasedOnLength);


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
