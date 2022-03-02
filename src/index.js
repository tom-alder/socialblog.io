// // // *--- INITIALISATION ---* // // //

// NOTE: You get console 'Uncaught TypeError' if you render pages that dont use all of these js functions

import { initializeApp } from "firebase/app";
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
  limitToLast,
  limitToFirst,
  startAfter,
  startAt,
  get,
  endBefore,
  endAt,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAduE2GkMxli8LVcVyp2oSWyqIueqfW-Us",
  authDomain: "linkedin-portfolio-v2.firebaseapp.com",
  projectId: "linkedin-portfolio-v2",
  storageBucket: "linkedin-portfolio-v2.appspot.com",
  messagingSenderId: "575135045635",
  appId: "1:575135045635:web:08e3811e7803e06e129636",
  measurementId: "G-ZDJ82ELVP8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// init firebase app
// initializeApp(firebaseConfig)

// const q = query(collection(db, "users"));

// init services
// const db = getFirestore()

// collection ref - CHANGE THIS TO CHANGE THE FIRESTORE COLLECTION YOU PULL FROM
const colRef = collection(db, "posts-g-sheets-reduced-5");
var q = query(collection(db, "posts-g-sheets-reduced-5"));
// const q = query(collection(db, 'posts-g-sheets-reduced-5'), where("category", "==", ["strategy"]));

// // // *--- QUERIES ---* // // //

// querying to sort by date
// NOTE This means you NEED a date datapoint in firebase
// var q = query(colRef, orderBy('date'))

// No filter
// var q;
// var q = query(colRef);
// var q = query(colRef, where("topic", "==", "test"))

// querying to filter for certain topics and sort by date
// var q = query(colRef, where("topic", "==", "test"), orderBy('date', 'desc'))
// var q = query(colRef, orderBy('numViews', 'desc'), limit(4))
// var q = query(colRef, orderBy('numComments', 'desc'), limit(4))

// CLEAN CONSOLE LOG FOR THE VALUE OF Q:
onSnapshot(q, (snapshot) => {
  var consoleData = [];
  snapshot.docs.forEach((doc) => {
    consoleData.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(consoleData);
});

// // //*--- LOAD MORE ---* // // //

// LOAD MORE BUTTON
const container = document.querySelector(".containerload");

// Store last document
let latestDoc = null;

// // // CLIENT SORT // // //

// Set initial query
var currentFirstQuery = query(q, orderBy("createdAt", "desc"), limit(4));
var currentNextQuery = query(
  q,
  orderBy("createdAt", "desc"),
  startAfter(latestDoc),
  limit(4)
);
var orderCol = "createdAt";
var orderDir = "desc";

// function to update query
function recalcFirstQuery() {
  currentFirstQuery = query(q, orderBy(orderCol, orderDir), limit(4));
}

function recalcNextQuery() {
  currentNextQuery = query(
    q,
    orderBy(orderCol, orderDir),
    startAfter(latestDoc),
    limit(4)
  );
}

const getFirstReviews = async () => {
  console.log("getFirstReviews has run!");

  recalcFirstQuery();
  var load = currentFirstQuery;

  // Retrieve the first 5 data
  const data = await getDocs(load);

  // To output the retrieved first 5 data
  data.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log("Summary: ", doc.data().summary , " => ", doc.data().createdAt);
    // use toDate to easily read dates
    console.log(
      "Summary: ",
      doc.data().summary,
      " => ",
      doc.data().createdAt.toDate()
    );
  });

  // Run renderPosts based on value of data
  renderPosts(data);

  // Update latestDoc reference
  latestDoc = data.docs[data.docs.length - 1];

  // // Unattach event listeners if no more documents
  if (data.empty) {
    loadMore.removeEventListener("click", handleClick);
  }
};

const getNextReviews = async () => {
  console.log("getNextReviews has run!");

  recalcNextQuery();
  var next = currentNextQuery;

  // Automatically pulls the remaining data in the collection
  const data_next = await getDocs(next);

  // Outputs the remaining data in the collection
  data_next.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log("Summary: ", doc.data().summary , " => ", doc.data().createdAt);
    // use toDate to easily read dates
    console.log(
      "Summary: ",
      doc.data().summary,
      " => ",
      doc.data().createdAt.toDate()
    );
  });

  // Run renderPosts based on value of data
  renderPosts(data_next);

  // Update latestDoc reference
  latestDoc = data_next.docs[data_next.docs.length - 1];

  // // Unattach event listeners if no more documents
  if (data_next.empty) {
    loadMore.removeEventListener("click", handleClick);
  }
};

function renderPosts(data) {
  loadAfterSecondTime();
  let template = "";
  data.docs.forEach((doc) => {
    const grabData = doc.data();
    template += `
    <div class="mix company-${grabData.company} blog-card" data-ref="item">
      <div class="linkedin-post">
        <div class="card-preloader" id="card-preloader">
          <div class="card-loader card-loader--tabs">
            <div class="skeleton-content-coumn">
              <div class="skeleton-header-line">
                <div class="skeleton-type-icon">
                </div>  
                <div class="skeleton-title">
                </div>
              </div>
              <div class="skeleton-content-1"></div>
              <div class="skeleton-content-2"></div>
              <div class="skeleton-content-3"></div>
              <div class="skeleton-content-4"></div>
              <div class="skeleton-content-6"></div>
              <div class="skeleton-content-7"></div>
              <div class="skeleton-content-8"></div>
            </div>
          </div>
        </div>
        <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post" loading="lazy" class="iframe">
        </iframe>
        <div class="card-border">
        </div>
      </div>
    </div> 
    `;
  });
  container.innerHTML += template;
}

// Clear latest doc and html container
function clear() {
  container.innerHTML = "";
  latestDoc = null;
}

// // // END CLIENT SORT

// // Set initial query
// var currentQuery = query(q, orderBy('numViews', 'asc'), startAfter(latestDoc), limit(4));
// var orderCol = 'numViews';

// // function to update query
// function recalcQuery () {
//   currentQuery = query(q, orderBy(orderCol, 'asc'), startAfter(latestDoc), limit(4));
// }

// // // *--- SORT BY ---* // // //

// Sort by least Views WORKING (NOT IN USE)
function leastViews() {
  console.log("leastViews has run");
  orderCol = "numViews";
  orderDir = "desc";
  clear();
  getNextPosts();
}

// Sort by most Views WORKING
function mostViews() {
  console.log("mostViews has run");
  orderCol = "numViews";
  orderDir = "desc";
  clear();
  getFirstReviews();
}

// Sort by most Likes WORKING
function mostLikes() {
  console.log("mostLikes has run");
  orderCol = "numLikes";
  orderDir = "desc";
  clear();
  getFirstReviews();
}

// Sort by most Comments WORKING
function mostComments() {
  console.log("mostComments has run");
  orderCol = "numComments";
  orderDir = "desc";
  clear();
  getFirstReviews();
}

// Sort by most Recent BUILDING
function mostRecent() {
  console.log("mostRecent has run");
  orderCol = "createdAt";
  orderDir = "desc";
  clear();
  getFirstReviews();
}

// Sort by least Recent BUILDING
function leastRecent() {
  console.log("leastRecent has run");
  orderCol = "createdAt";
  orderDir = "asc";
  clear();
  getFirstReviews();
}

// // // *--- FILTER BY ---* // // //

// Filter by topic (all) WORKING
function filterAll() {
  console.log("filterAll has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef);
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (strategy) WORKING
function filterStrategy() {
  console.log("filterStrategy has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "strategy"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (crypto) BUILDING
function filterCrypto() {
  console.log("filterCrypto has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "crypto"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}


var filterSS = new SlimSelect({
  select: '#filter',
  placeholder: 'Topic',
  showSearch: false,
  allowDeselectOption: false,
  valuesUseText: true, // Use text instead of innerHTML for selected values - default false
  data: [
    {'placeholder': true, 'text': 'Topic'},
    {innerHTML: '<i class="fa-solid fa-book mr-3"></i> All', text: 'All', value: 'all'},
    {innerHTML: '<i class="fa-solid fa-chess mr-3"></i> Strategy', text: 'Strategy', value: 'strategy'},
    {innerHTML: '<i class="fa-solid fa-cubes mr-3"></i> Crypto', text: 'Crypto', value: 'crypto'},
  ],
  onChange: (info) => {
    console.log(info)

  }
})

  $(document).ready(function () {
    $("#filter").on("change", function () {
      if ($("#filter").val() == "all") {
        filterAll();
      }
      if ($("#filter").val() == "strategy") {
        filterStrategy();
      }
      else if ($("#filter").val() == "crypto") {
        filterCrypto();
      }
    });
  });

var sortSS = new SlimSelect({
  select: '#sort',
  placeholder: 'Sort',
  showSearch: false,
  allowDeselectOption: false,
  valuesUseText: true, // Use text instead of innerHTML for selected values - default false
  data: [
    {'placeholder': true, 'text': 'Sort'},
    {innerHTML: '<i class="fa-solid fa-eye mr-3"></i> Most views', text: 'Most views', value: 'most views'},
    {innerHTML: '<i class="fa-solid fa-thumbs-up mr-3"></i> Most likes', text: 'Most likes', value: 'most likes'},
    {innerHTML: '<i class="fa-solid fa-comment mr-3"></i> Most comments', text: 'Most comments', value: 'most comments'},
    {innerHTML: '<i class="fa-solid fa-calendar-plus mr-3"></i> Newest', text: 'Newest', value: 'newest'},
    {innerHTML: '<i class="fa-solid fa-calendar-minus mr-3"></i> Oldest', text: 'Oldest', value: 'oldest'},
  ],
  onChange: (info) => {
    console.log(info)
  }
})

  $(document).ready(function () {
    $("#sort").on("change", function () {
      if ($("#sort").val() == "most views") {
        mostViews();
      }
      else if ($("#sort").val() == "most likes") {
        mostLikes();
      }
      else if ($("#sort").val() == "most comments") {
        mostComments();
      }
      else if ($("#sort").val() == "newest") {
        mostRecent();
      }
      else if ($("#sort").val() == "oldest") {
        leastRecent();
      }
    });
  });


// // // *--- SORT AND FILTER TOGGLES ---* // // //
// // // *--- These all need to be uncommented for loadmoreclientsort.html to work! ---* // // //

// // Most Views (dropdown)
// var mostViewsDropdown = document.getElementById("mostViewsID");
// mostViewsDropdown.onclick = function () {
//   console.log("Sort by most Views");
//   mostViews();
// };

// // Most Likes (dropdown)
// var mostLikesDropdown = document.getElementById("mostLikesID");
// mostLikesDropdown.onclick = function () {
//   console.log("Sort by most Likes");
//   mostLikes();
// };

// // Most comments (dropdown)
// var mostCommentsDropdown = document.getElementById("mostCommentsID");
// mostCommentsDropdown.onclick = function () {
//   console.log("Sort by most Comments");
//   mostComments();
// };

// // Most Recent (dropdown)
// var mostRecentDropdown = document.getElementById("mostRecentID");
// mostRecentDropdown.onclick = function () {
//   console.log("Sort by most Recent");
//   mostRecent();
// };

// // Least Recent (dropdown)
// var leastRecentDropdown = document.getElementById("leastRecentID");
// leastRecentDropdown.onclick = function () {
//   console.log("Sort by least Recent");
//   leastRecent();
// };

// // Filter Strategy (dropdown)
// var filterStrategyDropdown = document.getElementById("filterStrategyID");
// filterStrategyDropdown.onclick = function () {
//   console.log("Filter by Strategy");
//   filterStrategy();
// };

// // Filter Crypto (dropdown)
// var filterCryptoDropdown = document.getElementById("filterCryptoID");
// filterCryptoDropdown.onclick = function () {
//   console.log("Filter by Crypto");
//   filterCrypto();
// };

// Load more docs (button)
const loadMore = document.querySelector(".load-more button");

const handleClick = () => {
  console.log(latestDoc);
  console.log("^ on load more button");
  getNextReviews();
};

// For some reason this breaks grid page...
loadMore.addEventListener("click", handleClick);

// wait for DOM content to load
window.addEventListener("DOMContentLoaded", () => getFirstReviews());
// window.addEventListener('DOMContentLoaded', () => leastViews());

// // //
// // // *--- NOT IN USE ---* // // //
// // //

// Get next posts
const getNextPosts = async () => {
  console.log("getNextPosts has run");
  loadAfterSecondTime();
  recalcQuery();
  var load = currentQuery;
  const data = await getDocs(load);
  console.log(latestDoc);
  console.log("^ after await getDocs");

  // Output docs TESTING
  let template = "";
  data.docs.forEach((doc) => {
    const grabData = doc.data();
    template += `
    <div class="mix company-${grabData.company} blog-card" data-ref="item">
      <div class="linkedin-post">
        <div class="card-preloader" id="card-preloader">
          <div class="card-loader card-loader--tabs">
            <div class="skeleton-content-coumn">
              <div class="skeleton-header-line">
                <div class="skeleton-type-icon">
                </div>  
                <div class="skeleton-title">
                </div>
              </div>
              <div class="skeleton-content-1"></div>
              <div class="skeleton-content-2"></div>
              <div class="skeleton-content-3"></div>
              <div class="skeleton-content-4"></div>

              <div class="skeleton-content-6"></div>
              <div class="skeleton-content-7"></div>
              <div class="skeleton-content-8"></div>
            </div>
          </div>
        </div>
        <iframe src="https://www.linkedin.com/embed/feed/update/${grabData.embedlink}" height="420" width="500" frameborder="0" allowfullscreen="" title="Embedded post" loading="lazy" class="iframe" style="opacity: 0">
        </iframe>
        <div class="card-border">
        </div>
      </div>
    </div> 
    `;
  });
  container.innerHTML += template;

  // // Output docs WORKING plain text
  // let template = '';
  // data.docs.forEach(doc => {
  //   const grabData = doc.data();
  //   template += `
  //   <div class="card">
  //     <h2>${grabData.summary}</h2>
  //     <p>Views: ${grabData.numViews}</p>
  //     <p>Likes: ${grabData.numLikes}</p>
  //   </div>
  //   `
  // });
  // container.innerHTML += template;

  // // Update latestDoc
  latestDoc = data.docs[data.docs.length - 1];
  console.log(latestDoc);
  console.log("^ after latestDoc updated");

  // // Unattach event listeners if no more documents
  if (data.empty) {
    loadMore.removeEventListener("click", handleClick);
  }
};

// // // *--- FUNCTIONS TO RUN QUERIES ---* // // //

// Get collection data - WORKING postcard with labels
onSnapshot(q, (snapshot) => {
  var posts = [];
  snapshot.docs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  // console.log(posts)
  document.getElementById("postcard-mixitup").innerHTML = `
    ${posts
      .map(function (grabData) {
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
      `;
      })
      .join("")}
    `;
});

// Clear Filter WORKING
var filterNone = document.querySelector(".clear");
filterNone.addEventListener("click", (e) => {
  e.preventDefault();
  q = query(colRef, orderBy("numViews", "desc"), limit(4));
  console.log(q);
  onSnapshot(q, (snapshot) => {
    var posts = [];
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    console.log(posts);
    document.getElementById("postcard-mixitup").innerHTML = `
    ${posts
      .map(function (grabData) {
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
      `;
      })
      .join("")}
    `;
  });
});

// Canva Filter WORKING
var filterCanva = document.querySelector(".canva");
filterCanva.addEventListener("click", (e) => {
  e.preventDefault();
  q = query(colRef, where("company", "==", ["canva"]));
  console.log(q);
  onSnapshot(q, (snapshot) => {
    var posts = [];
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    console.log(posts);
    document.getElementById("postcard-mixitup").innerHTML = `
    ${posts
      .map(function (grabData) {
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
      `;
      })
      .join("")}
    `;
  });
});

// Apple Filter WORKING
var filterApple = document.querySelector(".apple");
filterApple.addEventListener("click", (e) => {
  e.preventDefault();
  q = query(colRef, where("company", "array-contains-any", ["apple"]));
  console.log(q);
  onSnapshot(q, (snapshot) => {
    var posts = [];
    snapshot.docs.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    console.log(posts);
    document.getElementById("postcard-mixitup").innerHTML = `
    ${posts
      .map(function (grabData) {
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
      `;
      })
      .join("")}
    `;
  });
});

// // // *--- GET COLLECITON DATA ---* // // //

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
  let posts = [];
  snapshot.docs.forEach((doc) => {
    posts.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  document.getElementById("datapoint").innerHTML = `
    <h3>Results (${posts.length})</h3>
    ${posts
      .map(function (grabData) {
        return grabData.topic + " (" + grabData.id + ")";
      })
      .join(" - ")}
    `;
});

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
const addPostForm = document.querySelector(".add");
addPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    topic: addPostForm.topic.value,
    date: addPostForm.date.value,
    embedlink: addPostForm.embedlink.value,
  }).then(() => {
    addPostForm.reset();
  });
});

// deleting docs
const deletePostForm = document.querySelector(".delete");
deletePostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "posts", deletePostForm.id.value);

  deleteDoc(docRef).then(() => {
    deletePostForm.reset();
  });
});

// get a single document
// Need to replace 'CBZoVLAvkVOpBsR3mL2x' with a valid ID

// const docRef = doc(db, 'posts', 'CBZoVLAvkVOpBsR3mL2x')
// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

// updating a document
const updateForm = document.querySelector(".update");
updateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "posts", updateForm.id.value);

  updateDoc(docRef, {
    topic: "updated topic",
  }).then(() => {
    updateForm.reset();
  });
});
