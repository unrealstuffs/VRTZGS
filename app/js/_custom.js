document.addEventListener("DOMContentLoaded", function() {

	// Конфигурация Firebase
	const firebaseConfig = {
		apiKey: "AIzaSyBaSqV163g8Y7DHH07fy1IoHAFmzhk8FkA",
		authDomain: "vrtzgs.firebaseapp.com",
		databaseURL: "https://vrtzgs.firebaseio.com",
		projectId: "vrtzgs",
		storageBucket: "vrtzgs.appspot.com",
		messagingSenderId: "1094159227719",
		appId: "1:1094159227719:web:0f9b1eafab5e339af1ca62",
		measurementId: "G-J0J4GRRR4W"
	};

	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);
	const db = firebase.firestore();

	if(document.querySelector('body').classList.contains('home')) {

		// Запись в Firebase 
		document.querySelector('#form').addEventListener('submit', function(e) {
			e.preventDefault();

			const firstName_1 = document.querySelector('#first_name_1').value;
			const lastName_1 = document.querySelector('#last_name_1').value;
			const firstName_2 = document.querySelector('#first_name_2').value;
			const lastName_2 = document.querySelector('#last_name_2').value;

			db.collection("users").add({
				first_name_1: firstName_1,
				last_name_1: lastName_1,
				first_name_2: firstName_2,
				last_name_2: lastName_2,
				is_approved: false
			})
			.then(function(docRef) {
				// Появление ссылки
				document.querySelector("#output").classList.remove("hidden");
				document.querySelector("#output").classList.add("fadeInDown");
				document.querySelector("#output_link").value = `${window.location.href.split('#')[0]}sertificate.html?id=${docRef.id}`;
			})
			.catch(function(error) {
				console.error("Error adding document: ", error);
			})
			
		});

		// Вывод из Firebase 
		db.collection("users").where("is_approved", "==", true).limit(9)
			.get()
				.then(users => {
					users.forEach(doc => {
						data = doc.data()
						document.querySelector("#clients").innerHTML += `
							<div class="col-md-4 client">${data.first_name_1} и ${data.first_name_2}</div>
						`
					})
				})
				.catch(function(error) {
					console.log("Error getting documents: ", error);
				});

		// Копирование при нажатии на кнопку
		const btn = document.querySelector('#copyBtn');
		const text = document.querySelector('#output_link');
		
		btn.addEventListener('click', function () {
			// производим его выделение
			text.select();

			document.execCommand("copy");

			btn.innerHTML = '<i class="fa fa-copy"></i>Ссылка скопирована';

			setTimeout(function() {
				btn.innerHTML = '<i class="fa fa-copy"></i>Копировать ссылку';
			}, 3000);
			
		});
	}

	if(document.querySelector('body').classList.contains('page')) {
		// Чтение get-запроса
		const getParam = location.search;

		db.collection("users").doc(getParam.split('=')[1]).get().then(function(doc) {
			if (doc.exists) {
				db.collection("users").doc(getParam.split('=')[1]).update({
					is_approved = true
				});

				data = doc.data();
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext("2d");
				const imageObj = new Image();

				canvas.id = "mycanvas";
				canvas.width = 900;
				canvas.height = 1600;

				document.querySelector('#sertificate').appendChild(canvas);

				imageObj.onload = function(){
					ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
					ctx.fillStyle = "#ffffff";
					ctx.font = "30px Optima Cyr";
					ctx.fillText(data.first_name_1, 240, 650);
					ctx.fillText(data.first_name_2, 540, 650);
					ctx.fillText(data.last_name_1, 240, 740);
					ctx.fillText(data.last_name_2, 540, 740);
				};
				imageObj.src = `https://unrealstuffs.github.io/vrtzgs/img/@2x/sertificate.jpg`;

				const button = document.createElement('button');
				button.classList.add('button');
				button.innerHTML = 'Скачать';
				document.querySelector('#sertificate').appendChild(button);

				button.addEventListener('click', function() {
					const link = document.createElement('a');
					link.href = mycanvas.toDataURL('image/png');
					link.download = 'picture.png';
					link.style.display = 'none';
					document.body.appendChild(link);
					link.click();
					link.parentNode.removeChild(link);
				});
				
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});


		
	}

	if(document.querySelector('body').classList.contains('clients-list')) {
		db.collection("users").where("is_approved", "==", true)
			.get()
				.then(users => {
					users.forEach(doc => {
						data = doc.data()
						document.querySelector("#content").innerHTML += `
							<p>${data.first_name_1} и ${data.first_name_2}</p>
						`
					})
				})
				.catch(function(error) {
					console.log("Error getting documents: ", error);
				});
	}

	// Вывод даты в футер
	const year = new Date();
	document.querySelector("#footer span").innerHTML = year.getFullYear();

});
