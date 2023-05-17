const cU = localStorage.getItem("currentUser");
const user = JSON.parse(cU);

const currentURL = window.location.href.split("/")
const currentPage = currentURL[currentURL.length - 1].split(".")[0]


const hideDialog = document.querySelector("#hide-dialog");

if (cU != undefined) {
	if (user.type != currentPage && (currentPage != "myAccount" && currentPage != "index")) {
		hideDialog.showModal();
	}
} else {
	if (currentPage != "index") {
		window.location.href = "index.html";
	}
}

function changeToCurrentPage() {
	hideDialog.close();
	window.location.href = user.type + ".html";
}
