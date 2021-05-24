const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//create element function
const renderCafe = (doc) => {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let city = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  cafeList.appendChild(li);

  // delete data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('cafes')
      .doc(id)
      .delete()
      .then(() => {
        console.log('document deleted');
      });
  });
};
// get Data
// db.collection('cafes')
//   .where('city', '==', 'Marioland')
//   .orderBy('name')
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       renderCafe(doc);
//     });
//   })
//   .catch((err) => console.error(err));

// realtime listener
db.collection('cafes')
  .orderBy('name')
  .onSnapshot((snapShot) => {
    let changes = snapShot.docChanges();
    changes.forEach((change) => {
      if (change.type === 'added') {
        renderCafe(change.doc);
      }
      if (change.type === 'removed') {
        let li = document.querySelector(`[data-id=${change.doc.id}]`);
        cafeList.removeChild(li);
      }
    });
  });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('cafes')
    .add({ name: form.name.value, city: form.city.value })
    .then(() => {
      console.log('saved to collection');
      form.name.value = '';
      form.city.value = '';
    })
    .catch((err) => console.error(err));
});
