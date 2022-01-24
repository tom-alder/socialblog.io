// NOTE: You get console 'Uncaught TypeError' if you render pages that dont use all of these js functions

import {
  initializeApp
} from 'firebase/app'
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  getDocs,
  limit,
  startAfter,
  startAt, 
  get,
  endBefore
} from 'firebase/firestore'



// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAduE2GkMxli8LVcVyp2oSWyqIueqfW-Us",
  authDomain: "linkedin-portfolio-v2.firebaseapp.com",
  projectId: "linkedin-portfolio-v2",
  storageBucket: "linkedin-portfolio-v2.appspot.com",
  messagingSenderId: "575135045635",
  appId: "1:575135045635:web:08e3811e7803e06e129636",
  measurementId: "G-ZDJ82ELVP8"
};



// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref - CHANGE THIS TO CHANGE THE FIRESTORE COLLECTION YOU PULL FROM
const colRef = collection(db, 'posts-g-sheets-valid')


// *--- QUERIES ---* //

// querying to sort by date
// NOTE This means you NEED a date datapoint in firebase
// var q = query(colRef, orderBy('date'))

// No filter
// var q;
// var q = query(colRef);
// var q = query(colRef, where("topic", "==", "test"))

// querying to filter for certain topics and sort by date
// var q = query(colRef, where("topic", "==", "test"), orderBy('date', 'desc'))
// var q = query(colRef, orderBy('numViews', 'desc'), limit(8))
var q = query(colRef, orderBy('numViews', 'desc'), limit(8))



// CLEAN CONSOLE LOG FOR THE VALUE OF Q:
onSnapshot(q, (snapshot) => {
  var consoleData = []
  snapshot.docs.forEach((doc) => {
    consoleData.push({
      ...doc.data(),
      id: doc.id
    })
  })
  console.log(consoleData)
})


// SEE MORE BUTTON TUTORIAL
const container = document.querySelector('.containerload');

// Store last document
let latestDoc = null;


const getNextReviews = async () => {
  // const ref = collection(db, 'posts-g-sheets-valid', orderBy('createdAt', 'desc'))
  // var load = query(colRef, orderBy('numViews', 'desc'), limit(4))
  var load = query(colRef, orderBy('numViews', 'asc'), startAfter(latestDoc || 0), limit(5), )
  // var load = query(colRef, orderBy('numViews', 'desc'), limit(8))
  const data = await getDocs(load);

  // Output docs
  let template = '';
  data.docs.forEach(doc => {
    const grabData = doc.data();
    template += `
    <div class="card">
      <h2>${grabData.summary}</h2>
      <p>Views ${grabData.numViews}</p>
      <p>Likes - ${grabData.numLikes}</p>
    </div>
    `
  });
  container.innerHTML += template; 

  // Update latestDoc
  latestDoc = data.docs[data.docs.length-1]

  // unattach event listeners if no more documents
  if (data.empty) {
    loadMore.removeEventListener('click',handleClick)
  }

}

// Load more docs (button)
const loadMore = document.querySelector('.load-more button');

const handleClick = () => {
  getNextReviews();
}

loadMore.addEventListener('click', handleClick);




// wait for DOM content to load
window.addEventListener('DOMContentLoaded', () => getNextReviews());

// async function main() {

// // Query the first page of docs
// const first = query(colRef, orderBy('numViews', 'desc'), limit(8))
// const documentSnapshots = await getDocs(q);
// console.log("first", first);

// // // // Get the last visible document
// const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
// console.log("last", lastVisible);

// // // // Construct a new query starting at this document,
// // // // get the next 25 cities.
// const next = query(collection(db, 'posts-g-sheets-valid'),
//   orderBy('numViews', 'desc'),
//   startAfter(lastVisible),
//   limit(8));
//   console.log("next", next);

// }
// main()

// Load More TESTING
// var loadMore = document.querySelector('.next')
// loadMore.addEventListener('click', (e) => {
//   e.preventDefault()
//   main().then(
//     console.log(next)

//   )

//   onSnapshot(next, (snapshot) => {
//     var posts = []
//     snapshot.docs.forEach((doc) => {
//       posts.push({
//         ...doc.data(),
//         id: doc.id
//       })
//     })
//     console.log(posts)
//     document.getElementById('postcard-mixitup').innerHTML = `
//     ${posts.map(function(grabData) {
//       return `
//       <div class="mix company-${grabData.company} blog-card" data-ref="item">
//         <div class="linkedin-post">
//           <div class="card-border"></div>
//           <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post">
//           </iframe>
//         </div>
//         <div>
//           ${grabData.company}
//         </div>
//       </div>
//       `
//     }).join('')}
//     `
//   })
// })


//  *--- FUNCTIONS TO RUN QUERIES ---* //

// Get collection data - WORKING postcard with labels
onSnapshot(q, (snapshot) => {
  var posts = []
  snapshot.docs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id
    })
  })

  console.log(posts)
  document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
        <div class="mix company-${grabData.company} blog-card" data-ref="item">
        
          <div class="linkedin-post">
            <div class="card-border"></div>
            <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post" loading="lazy">
            </iframe>
          </div>
          <div>
            ${grabData.company}
          </div>
        </div> 
      `
    }).join('')}
    `
})

// Clear Filter WORKING
var filterNone = document.querySelector('.clear')
filterNone.addEventListener('click', (e) => {
  e.preventDefault()
  q = query(colRef)
  console.log(q)
  onSnapshot(q, (snapshot) => {
    var posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id
      })
    })

    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
      <div class="mix company-${grabData.company} blog-card" data-ref="item">
        
      <div class="linkedin-post">
        <div class="card-border"></div>
        <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post">
        </iframe>
      </div>
      <div>
        ${grabData.company}
      </div>
    </div>
      `
    }).join('')}
    `
  })
})

// Canva Filter WORKING
var filterCanva = document.querySelector('.canva')
filterCanva.addEventListener('click', (e) => {
  e.preventDefault()
  q = query(colRef, where("company", "==", ["canva"]))
  console.log(q)
  onSnapshot(q, (snapshot) => {
    var posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id
      })
    })

    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
      <div class="mix company-${grabData.company} blog-card" data-ref="item">
        <div class="linkedin-post">
          <div class="card-border"></div>
          <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post">
          </iframe>
        </div>
        <div>
          ${grabData.company}
        </div>
      </div>
      `
    }).join('')}
    `
  })
})

// Apple Filter WORKING
var filterApple = document.querySelector('.apple')
filterApple.addEventListener('click', (e) => {
  e.preventDefault()
  q = query(colRef, where("company", "array-contains-any", ["apple"]))
  console.log(q)
  onSnapshot(q, (snapshot) => {
    var posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id
      })
    })

    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
      <div class="mix company-${grabData.company} blog-card" data-ref="item">
        <div class="linkedin-post">
          <div class="card-border"></div>
          <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post">
          </iframe>
        </div>
        <div>
          ${grabData.company}
        </div>
      </div> 
      `
    }).join('')}
    `
  })
})




// *--- GET COLLECITON DATA ---* //

// Get collection data (Point in time)
// This does not update the page in real time as new docs are added
// No 'subscription to the data'
// getDocs(colRef)
//   .then((snapshot) => {
//     let posts = []
//     snapshot.docs.forEach((doc) => {
//       posts.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(posts)
//   })
//   .catch(err => {
//     console.log(err.message)
//   })

// Get collection data - individual datapoints
// This updates in real time
onSnapshot(q, (snapshot) => {
  let posts = []
  snapshot.docs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id
    })
  })
  document.getElementById('datapoint').innerHTML = `
    <h3>Results (${posts.length})</h3>
    ${posts.map(function(grabData) {
      return grabData.topic + ' (' + grabData.id + ')'
    }).join(' - ')}
    `
})

// Get collection data - WORKING postcard no labels
// onSnapshot(q, (snapshot) => {
//     let posts = []
//     snapshot.docs.forEach((doc) => {
//       posts.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(posts)
//     document.getElementById('postcard-mixitup').innerHTML = `

//     ${posts.map(function(grabData) {
//       return `
//       <div class="blog-card">
//       <div class="linkedin-post">
//       <iframe src="${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>   
//       </div>
//       <div>
//       ${grabData.company}
//       </div>
//       <div>
//       ${grabData.id}
//       </div>
//     </div> 
//       `
//     }).join('')}
//     `
// })



// adding docs 
const addPostForm = document.querySelector('.add')
addPostForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
      topic: addPostForm.topic.value,
      date: addPostForm.date.value,
      embedlink: addPostForm.embedlink.value,
    })
    .then(() => {
      addPostForm.reset()
    })
})

// deleting docs
const deletePostForm = document.querySelector('.delete')
deletePostForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'posts', deletePostForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deletePostForm.reset()
    })
})

// get a single document
// Need to replace 'CBZoVLAvkVOpBsR3mL2x' with a valid ID

// const docRef = doc(db, 'posts', 'CBZoVLAvkVOpBsR3mL2x')
// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'posts', updateForm.id.value)

  updateDoc(docRef, {
      topic: 'updated topic'
    })
    .then(() => {
      updateForm.reset()
    })

})