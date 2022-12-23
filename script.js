
let wrapper = document.createElement("div");
wrapper.classList.add("wrapper");
document.body.appendChild(wrapper);

let input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("name", "search");
wrapper.appendChild(input);

let container = document.createElement("ul");
container.classList.add("container");
wrapper.appendChild(container);

let selected = document.createElement("ul");
selected .classList.add("selected");
wrapper.appendChild(selected);


async function getRepositories() {
    const url = new URL("https://api.github.com/search/repositories");
    url.searchParams.append("q", input.value);
    try {
    let response = await fetch(url);
    if (response.ok) {
    let repositories = await response.json();
    showRepositories(repositories);
}
    } catch(error) {
    return null;
    }
}


function showRepositories(repositories) {
    removeList();
    for (let i = 0; i < 5; i++) {
    let repo =  repositories.items[i];
	let name = repo.name;
	let user = repo.owner.login;
	let stars = repo.stargazers_count;

	let selectList = `<li class="container__list" data-owner="${user}" data-stars="${stars}">${name}</li>`;
	container.innerHTML += selectList;
    }

}

function addChosen(target) {
    let name = target.textContent;
    let stars = target.dataset.stars;
    let user = target.dataset.owner;
    selected.innerHTML += `<li class="selected__elem">Name: ${name}<br>Owner: ${user}<br>Stars: ${stars}<button class="btn-close"></button></li>`;
}


function debounce(fn, debounceTime) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), debounceTime);
    };
}


input.addEventListener("input", debounce(getRepositories, 500));
selected.addEventListener("click", function(event) {
    let target = event.target;
    if(target.classList.contains("btn-close")){
        target.parentElement.remove();
    } 
});

function removeList() {
    container.innerHTML = "";
}

container.addEventListener("click", function(event) {
    let target = event.target;
    if(target.classList.contains("container__list")){
        addChosen(target);
        removeList();
        input.value = "";
    }
});

