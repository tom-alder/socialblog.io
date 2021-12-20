import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, 
    query, where,
    orderBy,
    getDoc,
    updateDoc
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

// querying to sort by date
const q = query(colRef, orderBy('date', 'desc'))

// querying to filter for certain topics and sort by date
// const q = query(colRef, where("topic", "==", "social media"), orderBy('date', 'desc'))

// Get collection data - individual datapoints
onSnapshot(q, (snapshot) => {
    let posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id })
    })
    console.log(posts)
    document.getElementById('datapoint').innerHTML = `
    <h3>Results (${posts.length})</h3>
    ${posts.map(function(grabData) {
      return grabData.topic
    }).join(' - ')}
    <p class="subtitle">Please enjoy reading through my most recent posts</p>
    `
})

// Get collection data - TESTING postcard (Only 1??)
// onSnapshot(q, (snapshot) => {
//     let posts = []
//     snapshot.docs.forEach((doc) => {
//       posts.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(posts)
//     document.getElementById('postcard').innerHTML = `
  
//     ${posts.map(function(grabData) {
//       return `
//       <iframe src="${grabData.link}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
//       `
//     }).join(' - ')}
//     <p class="subtitle">Please enjoy reading through my most recent posts</p>
//     `
// })

// Get collection data - TESTING postcard (Lets make a grid)
onSnapshot(q, (snapshot) => {
    let posts = []
    snapshot.docs.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id })
    })
    console.log(posts)
    document.getElementById('postcard').innerHTML = `
  
    ${posts.map(function(grabData) {
      return `

        <div class="blog-card">
          <div class="linkedin-post">
          <iframe src="${grabData.link}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
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
      link: addPostForm.link.value,
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

const docRef = doc(db, 'posts', 'CBZoVLAvkVOpBsR3mL2x')

getDoc(docRef)
    .then((doc) => {
        console.log(doc.data(), doc.id)
    })

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