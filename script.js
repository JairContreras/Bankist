'use strict';

///////////////////////////////////////
// Modal window

//Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

//Functions and events 
const openModal = function (ev) {
    ev.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};
//Event Listener to Open Modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

//Event Listener to Close Modal
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//Smooth scrolling
btnScrollTo.addEventListener('click', function (e) {
    const s1coords = section1.getBoundingClientRect();
    //const s2coords = btnScrollTo.getBoundingClientRect();
    //const s2coords = e.target.getBoundingClientRect();

    //Scrolling
    //window.scrollTo(s1coords.left + window.pageXOffset,
    //                s1coords.top + window.pageYOffset) ;

    //Scrolling-smoth
    //window.scrollTo({
    //    left: s1coords.left + window.pageXOffset,
    //    top: s1coords.top + window.pageYOffset,
    //    behavior: 'smooth'
    //});

    //Available en modern browers
    section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////
///Page Navigation with Event Delegation
// document.querySelectorAll('.nav__links').addEventListener('click',
//     function (e) {
//         e.preventDefault();
//         const id = this.getAttribute('href');
//         document.querySelector(id).scrollIntoView({behavior:'smooth'});
//     }
// );
//1. Add event listeenr to common parent element
document.querySelector('.nav__links').addEventListener('click',
    function (e) {
        // console.log(e.target) //where the event happened
        //Marching strategy
        if (e.target.classList.contains('nav__link')) {
            e.preventDefault();
            const id = e.target.getAttribute('href');
            document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
        }
    });
//2. Determine what element originated the event


///////////////////////////////////////////
/////Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container'); //?
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    const clicked = e.target.closest('.operations__tab');
    //console.log(clicked);
    if (!clicked) return; //ignore results

    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});
/////////////////////////////////////////////////
///Menu fade animation
const handleOver = function (e) {
    console.log(this);
    if (e.target.classList.contains('nav__link')) {
        const link = e.target; //in whichk link happened the event
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach(elem => {
            if (elem !== link) elem.style.opacity = this;
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1));

////////////////////////////
///Sticky navigation
const initialCoords = section1.getBoundingClientRect();
//console.log(initialCoords);

window.addEventListener('scroll', function () {
    if (window.scrollY > initialCoords.top) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
})

//Better way
// const obsCallback = function (entries, observer) {
//     entries.forEach(entry => {
//         console.log(entry)
//     });
// };
// const obsOptions = {
//     root: null, //entire viewport with null
//     threshold: [0,0.2], //less and more 10%
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
//Observer
/*
const header = document.querySelector('.header');
const stickyNav = function(entries){
    const [entry] = entries;
    console.log(entries);
    console.log(entry);
    nav.classList.add('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0,});
*/
/////////////////////
///revealing elements
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
})
allSections.forEach(
    (section) => {
        sectionObserver.observe(section)
        section.classList.add('section--hidden');
    }
);


////////////////////
//Lazy images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    //Replace src with data-src;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function (e) {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));
////////////////////////
//Slider

//elements
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const bntLeft = document.querySelector('.slider__btn--left');
    const bntRight = document.querySelector('.slider__btn--right');
    const slider = document.querySelector('.slider');
    let curSlide = 0;
    const maxSlide = slides.length;
    const dotContainer = document.querySelector('.dots');
    //functions
    const createDots = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML("afterbegin", `<button class="dots__dot" data-slice="${i}"></button>`);
        });
    }
    const activateDot = function (slide) {
        document.querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slice="${slide}"]`)
            .classList.add('dots__dot--active');

    }
    const goToSlide = function (slide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
        activateDot(slide);
    }
    const prevSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    }
    const nextSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    }

    const init = function () {
        createDots();
        goToSlide(0);
        activateDot(0);
    }

    init();


    //Event handlers
    bntRight.addEventListener('click', nextSlide);
    bntLeft.addEventListener('click', prevSlide);
    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots__dot')) {
            const slide = e.target.dataset.slice;
            goToSlide(slide);
            activateDot(slide);
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();

    })
}
slider();
/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


const h1 = document.querySelector('h1');
//remove an event listener
const alert1 = function (e) {
    alert('hi');
    h1.removeEventListener('click', alert1);

}
//add event listener
h1.addEventListener('click', alert1);

//old-school
h1.onmouseenter = function (e) {
    //  alert('greattt')
}

////////////////////////////////////////////////
///////////////Event propagation////////////////
////////////////////////////////////////////////
//Event bubbling

//rgb(255,255,255);
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

//generating a random color
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;


//Attaching events to navlinks to see bumbling
//we don't use capturing, just bumbling
document.querySelector('.nav__link').addEventListener('click', function (e) {
    //this.style.backgroundColor = randomColor();
    //console.log('Link ', e.target, e.currentTarget);
    //e.curretTarget === this  //true
    //e.stopPropagation();
});


document.querySelector('.nav__links').addEventListener('click', function (e) {
    //this.style.backgroundColor = randomColor();
    //console.log('Container ', e.target, e.currentTarget);

});


document.querySelector('.nav').addEventListener('click', function (e) {
    //this.style.backgroundColor = randomColor();
    //console.log('Nav ', e.target, e.currentTarget);

});

///////////////////////////////////////////////////////
////////////////Event delegation///////////////////////
///////////////////////////////////////////////////////













//Lectures
//////////////////
//Selecting elements

////
//document.querySelector('.header');
//const allSections = document.querySelectorAll('.section')

//document.getElementById('section---1');
//return html collection
//const allButons = document.getElementsByTagName('button');

//html collection
//document.getElementsByClassName('btn');

///Creating and inserting elements
///////////////////////////////////////////////////////////////////////
/////////////////////////Cookkie message///////////////////////////////
///////////////////////////////////////////////////////////////////////
/*
const message = document.createElement('div');
message.classList.add('cookie-message');
//message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML = 'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

const header = document.querySelector('.header');

//Inserting as the first child
header.prepend(message);
//Inserting as the last child
//header.append(message);
//header.append(message.cloneNode(true));

//header.before(message)
//header.after(message) inserting as siblings

//remove cookie message
document.querySelector('.btn--close-cookie')
    .addEventListener('click', function () {
        message.remove();
        //message.parentElement.removeChild(message);
    });
//console.log(message)

//////Styles, Attributes and Classes
//Styles in line;
message.style.backgroundColor = '#34383d';
message.style.width = '120%';

//Change style
document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
//Gettin' and settin'
const logo = document.querySelector('.nav__logo');
//console.log(logo.className);
logo.setAttribute('company', 'Banklist');
*/

document.addEventListener('DOMContentLoaded', function(e){
    
})