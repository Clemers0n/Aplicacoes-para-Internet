async function getPokemon(nome) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`).then((response) =>
    response.json()
  );
}

async function getAllPokemons() {
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=3000`).then(
    (response) => response.json()
  );
}

async function update(busca) {
  const sprite = document.getElementById("sprite");
  const name = document.getElementById("name");
  const type1 = document.getElementById("type1");
  const type2 = document.getElementById("type2");

  const pokemon = await getPokemon(busca);
  sprite.src = pokemon.sprites.front_default;
  sprite.alt = pokemon.name;
  name.value = pokemon.name;
  type1.innerHTML = pokemon.types[0].type.name;
  type1.className = "c-" + pokemon.types[0].type.name;

  if (pokemon.types.length > 1) {
    type2.style.display = "block";
    type2.innerHTML = pokemon.types[1].type.name;
    type2.className = "c-" + pokemon.types[1].type.name;
  } else {
    type2.style.display = "none";
  }
  document.getElementById("prev").onclick = () => update(pokemon.id - 1);
  document.getElementById("next").onclick = () => update(pokemon.id + 1);
}

async function start() {
  update(1);
  const pokemons = await getAllPokemons();
  const list = document.getElementById("list");
  pokemons.results.forEach((pokemon) => {
    const option = document.createElement("option");
    option.value = pokemon.name;
    list.appendChild(option);
  });
}

document.getElementById("name").addEventListener("input", function () {
  const input = this.value;
  const datalist = document.getElementById("list");
  const options = Array.from(datalist.options).map((option) => option.value);
  if (options.includes(input)) update(input);
});

addEventListener("load", start);
