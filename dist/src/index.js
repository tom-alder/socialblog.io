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
const colRef = collection(db, "fully-tagged-2");
var q = query(collection(db, "fully-tagged-2"));
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
// var q = query(colRef, orderBy('numViews', 'desc'), limit(6))
// var q = query(colRef, orderBy('numComments', 'desc'), limit(6))

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
var currentFirstQuery = query(q, orderBy("createdAt", "desc"), limit(6));
var currentNextQuery = query(
  q,
  orderBy("createdAt", "desc"),
  startAfter(latestDoc),
  limit(6)
);
var orderCol = "createdAt";
var orderDir = "desc";

// function to update query
function recalcFirstQuery() {
  currentFirstQuery = query(q, orderBy(orderCol, orderDir), limit(6));
}

function recalcNextQuery() {
  currentNextQuery = query(
    q,
    orderBy(orderCol, orderDir),
    startAfter(latestDoc),
    limit(6)
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
// var currentQuery = query(q, orderBy('numViews', 'asc'), startAfter(latestDoc), limit(6));
// var orderCol = 'numViews';

// // function to update query
// function recalcQuery () {
//   currentQuery = query(q, orderBy(orderCol, 'asc'), startAfter(latestDoc), limit(6));
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

// Sort by most Recent WORKING
function mostRecent() {
  console.log("mostRecent has run");
  orderCol = "createdAt";
  orderDir = "desc";
  clear();
  getFirstReviews();
}

// Sort by least Recent WORKING
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

// Filter by topic (product) WORKING
function filterProduct() {
  console.log("filterProduct has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "product"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (fintech) WORKING
function filterFintech() {
  console.log("filterFintech has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "fintech"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (crypto) Working
function filterCrypto() {
  console.log("filterCrypto has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "crypto"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (NFTs) Working
function filterNFTs() {
  console.log("filterNFTs has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "NFTs"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (big tech) Working
function filterBigTech() {
  console.log("filterBigTech has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "big tech"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (Startups) Working
function filterStartups() {
  console.log("filterStartups has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "startups"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}

// Filter by topic (Creator Economy) Working
function filterCreatorEconomy() {
  console.log("filterCreatorEconomy has run");
  // orderCol = 'createdAt';
  // orderDir = 'asc';
  q = query(colRef, where("category", "array-contains", "creator economy"));
  // q = query(colRef, where("regions", "array-contains", "west_coast"));
  clear();
  getFirstReviews();
}


var filterSS = new SlimSelect({
  select: '#filter',
  placeholder: 'Choose a topic:',
  showSearch: false,
  allowDeselectOption: false,
  valuesUseText: true, // Use text instead of innerHTML for selected values - default false
  data: [
    {'placeholder': true, 'text': 'Choose a topic:'},
    {innerHTML: '<i class="fa-solid fa-book mr-3 w-3 ml-[0.07rem]"></i> All', text: 'All', value: 'all'},
    {innerHTML: '<i class="fa-solid fa-chess mr-3  w-3"></i> Strategy', text: 'Strategy', value: 'strategy'},
    {innerHTML: '<i class="fa-solid fa-box-open mr-[0.84rem] w-3 ml-[-0.07rem]"></i> Product', text: 'Product', value: 'product'},
    {innerHTML: '<i class="fa-solid fa-credit-card mr-[0.65rem]"></i> Fintech', text: 'Fintech', value: 'fintech'},
    {innerHTML: '<i class="fa-solid fa-cubes mr-[0.65rem]"></i> Crypto', text: 'Crypto', value: 'crypto'},
    {innerHTML: '<i class="fa-solid fa-image mr-3"></i> NFTs', text: 'NFTs', value: 'NFTs'},
    {innerHTML: '<i class="fa-solid fa-globe mr-3"></i> Big Tech', text: 'Big Tech', value: 'big tech'},
    {innerHTML: '<i class="fa-solid fa-rocket mr-3"></i> Startups', text: 'Startups', value: 'startups'},
    {innerHTML: '<i class="fa-solid fa-pen mr-3"></i> Creator Economy', text: 'Creator Economy', value: 'creator economy'},
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
      if ($("#filter").val() == "product") {
        filterProduct();
      }
      if ($("#filter").val() == "fintech") {
        filterFintech();
      }
      if ($("#filter").val() == "crypto") {
        filterCrypto();
      }
      if ($("#filter").val() == "NFTs") {
        filterNFTs();
      }
      if ($("#filter").val() == "big tech") {
        filterBigTech();
      }
      if ($("#filter").val() == "startups") {
        filterStartups();
      }
      if ($("#filter").val() == "creator economy") {
        filterCreatorEconomy();
      }
    });
  });

var sortSS = new SlimSelect({
  select: '#sort',
  placeholder: 'Sort by:',
  showSearch: false,
  allowDeselectOption: false,
  valuesUseText: true, // Use text instead of innerHTML for selected values - default false
  data: [
    {'placeholder': true, 'text': 'Sort by:'},
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



// Get next posts
const getNextPosts = async () => {
  console.log("getNextPosts has run");
  loadAfterSecondTime();
  recalcQuery();
  var load = currentQuery;
  const data = await getDocs(load);
  console.log(latestDoc);
  console.log("^ after await getDocs");

  // Output docs WORKING
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
