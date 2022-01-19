// NOTE: You get console 'Uncaught TypeError' if you render pages that dont use all of these js functions

import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, 
    query, where,
    orderBy,
    getDoc,
    updateDoc,
    getDocs
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

// collection ref
const colRef = collection(db, 'posts')


// *--- QUERIES ---* //

// querying to sort by date
// NOTE This means you NEED a date datapoint in firebase
// var q = query(colRef, orderBy('date'))

// No filter
// var q;
var q = query(colRef);
// var q = query(colRef, where("topic", "==", "test"))

console.log(q);

// querying to filter for certain topics and sort by date
// var q = query(colRef, where("topic", "==", "test"), orderBy('date', 'desc'))

//  *--- FUNCTIONS TO RUN QUERIES ---* //

// No Filter WORKING
var filterNone = document.querySelector('.all')
  filterNone.addEventListener('click', (e) => {
  e.preventDefault()
  q = query(colRef)
  console.log(q)
  onSnapshot(q, (snapshot) => {
    var posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id})
    })
    
    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
        <div class="mix company-${grabData.company} blog-card" data-ref="item">
          <div class="linkedin-post">
            <iframe src="${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
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
      posts.push({ ...doc.data(), id: doc.id})
    })
    
    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
        <div class="mix company-${grabData.company} blog-card" data-ref="item">
          <div class="linkedin-post">
            <iframe src="${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
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
      posts.push({ ...doc.data(), id: doc.id })
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

// Get collection data - WORKING postcard with labels
onSnapshot(q, (snapshot) => {
    var posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id})
    })
    
    console.log(posts)
    document.getElementById('postcard-mixitup').innerHTML = `
    ${posts.map(function(grabData) {
      return `
        <div class="mix company-${grabData.company} blog-card" data-ref="item">
          <div class="linkedin-post">
            <iframe src="${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
          </div>
          <div>
            ${grabData.company}
          </div>
          <div>
            ${grabData.id}
          </div>
        </div> 
      `
    }).join('')}
    `
})

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