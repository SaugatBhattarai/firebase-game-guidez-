//listen for auth status changes
auth.onAuthStateChanged((user) => {
  // console.log(user);
  if (user) {
    //get data
    db.collection("guides").onSnapshot(
      (snapshot) => {
        setupGuides(snapshot.docs);
        setupUI(user);
      },
      (err) => {
        console.log(err.message);
      }
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

//create new guide
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();

  db.collection("guides")
    .add({
      title: createForm["title"].value,
      content: createForm["content"].value,
    })
    .then(() => {
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

//SIGNUP
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  //   console.log(email, password);

  //sign up the user
  //Note: this is async task it might take some time to complete
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        bio: signupForm["signup-bio"].value,
      });
    })
    .then(() => {
      // console.log(cred.user);
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    });
});

//LOGOUT
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  // auth.signOut();
  auth.signOut().then(() => {
    console.log("User has signed out.");
  });
});

//LOGIN
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // console.log("logged in", cred.user);

    //close the login model and reset the form
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });
});
