async function getPokemon(pokemon) {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(
    (response) => response.json()
  );
}
async function getSpecie(pokemon) {
  return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`).then(
    (response) => response.json()
  );
}
async function getAllPokemons() {
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=3000`).then(
    (response) => response.json()
  );
}

function shiny(url, button) {
  const formatBtn = button.split("/");
  if (formatBtn[formatBtn.length - 1] == "star.png") {
    return url.front_default;
  } else {
    return url.front_shiny;
  }
}
async function update(busca) {
  // Reset das config
  sessionStorage.clear();

  sessionStorage.setItem("pokemon", JSON.stringify(await getPokemon(busca)));
  const pokemon = JSON.parse(sessionStorage.getItem("pokemon"));

  sessionStorage.setItem(
    "specie",
    JSON.stringify(await getSpecie(pokemon.species.name))
  );

  const specie = JSON.parse(sessionStorage.getItem("specie"));

  shiny(
    pokemon.sprites.other["official-artwork"],
    document.getElementById("sprite-btn").src
  );
  document.getElementById("name").innerHTML = pokemon.name;
  document.getElementById("sprite").src = shiny(
    pokemon.sprites.other["official-artwork"],
    document.getElementById("sprite-btn").src
  );
  document.getElementById("sprite").alt = pokemon.name;
  document.getElementById("height").innerHTML = `${pokemon.height / 10} m`;
  document.getElementById("weight").innerHTML = `${pokemon.weight / 10} kg`;
  document.getElementById("base-exp").innerHTML = pokemon.base_experience;

  document.getElementById("prev").onclick = () => update(pokemon.id - 1);
  document.getElementById("next").onclick = () => update(pokemon.id + 1);

  document.getElementById("pokedex-n").innerHTML = specie.id
    .toString()
    .padStart(4, "0");
  document.getElementById("species").innerHTML = specie.genera[7].genus;
  document.getElementById("catch-rate").innerHTML = specie.capture_rate;
  document.getElementById("base-friendship").innerHTML = specie.base_happiness;
  document.getElementById("growth-rate").innerHTML = specie.growth_rate.name;
  document.getElementById("egg-cyles").innerHTML = specie.hatch_counter;

  document.getElementById(
    "type1"
  ).src = `../img/clemerson/types/${pokemon.types[0].type.name}.png`;
  document.getElementById("type1").alt = pokemon.types[0].type.name;

  if (pokemon.types[1]?.type) {
    document.getElementById("type2").style.display = "block";
    document.getElementById(
      "type2"
    ).src = `../img/clemerson/types/${pokemon.types[1].type.name}.png`;
    document.getElementById("type2").alt = pokemon.types[1].type.name;
  } else {
    document.getElementById("type2").style.display = "none";
  }

  //Exibição das habilidades
  let abilitiesText = "";
  pokemon.abilities.forEach((element) => {
    if (element.is_hidden) {
      abilitiesText += `<small>${element.ability.name}  (hidden ability)</small>`;
    } else {
      abilitiesText += `<spam>${element.slot}. ${element.ability.name}</spam><br>`;
    }
  });
  document.getElementById("abilities").innerHTML = abilitiesText;

  //Exibição dos EVs
  let EVtext = "";
  pokemon.stats.forEach((element) => {
    if (element.effort != 0) {
      if (EVtext == "") {
        EVtext = `${element.effort} ${element.stat.name}`;
      } else {
        EVtext += `,${element.effort} ${element.stat.name}`;
      }
    }
  });
  document.getElementById("ev").innerHTML = EVtext;

  //Exibição do EggGroup
  let eggGroupstxt = "";
  specie.egg_groups.forEach((element) => {
    if (eggGroupstxt == "") {
      eggGroupstxt = `${element.name}`;
    } else {
      eggGroupstxt += `, ${element.name}`;
    }
  });
  document.getElementById("egg-groups").innerHTML = eggGroupstxt;

  if (specie.gender_rate != -1) {
    const female = (specie.gender_rate / 8) * 100;
    const male = 100 - female;
    document.getElementById(
      "gender"
    ).innerHTML = `<spam class="c-gender-male">${male}% Male</spam>, <spam class="c-gender-female">${female}% Female</spam>`;
  } else {
    document.getElementById("gender").innerHTML = `<spam>Genderless</spam>`;
  }
  pokemon.stats.forEach((element) => {
    const percent = (element.base_stat * 100) / 180;
    let rank = 0;
    if (element.base_stat <= 30) {
      rank = 1;
    } else if (element.base_stat <= 60) {
      rank = 2;
    } else if (element.base_stat <= 90) {
      rank = 3;
    } else if (element.base_stat <= 120) {
      rank = 4;
    } else if (element.base_stat <= 150) {
      rank = 5;
    } else {
      rank = 6;
    }
    let th = document.getElementById(`${element.stat.name}-stat`).cells[0]
      .firstChild.data;
    document.getElementById(`${element.stat.name}-stat`).innerHTML = `
    <th>${th}</th>
    <td class="c-stat-txt">${element.base_stat}</td>
    <td class="c-stat-cell-bar"><div class="c-bar-stat c-rank-${rank}" style="width: ${percent}%"></div></td>`;
  });

  const typeMap = {
    normal: "NOR",
    fire: "FIR",
    water: "WAT",
    electric: "ELE",
    grass: "GRA",
    ice: "ICE",
    fighting: "FIG",
    poison: "POI",
    ground: "GRO",
    flying: "FLY",
    psychic: "PSY",
    bug: "BUG",
    rock: "ROC",
    ghost: "GHO",
    dragon: "DRA",
    dark: "DAR",
    steel: "STE",
    fairy: "FAI",
  };

  // prettier-ignore
  const weaknesses = {
    NOR: { FIG: 2, GHO: 0 },
    FIR: { WAT: 2, GRA: 0.5, ICE: 0.5, FIR: 0.5, BUG: 0.5, ROC: 2 },
    WAT: { ELE: 2, GRA: 2, FIR: 0.5, ICE: 0.5, STE: 0.5 },
    ELE: { GRO: 2, ELE: 0.5, FLY: 0.5, STE: 0.5 },
    GRA: { FIR: 2, ICE: 2, POI: 2, FLY: 2, BUG: 2, WAT: 0.5, ELE: 0.5, GRA: 0.5, GRO: 0.5},
    ICE: { FIR: 2, FIG: 2, ROC: 2, STE: 2, ICE: 0.5 },
    FIG: { FLY: 2, PSY: 2, BUG: 0.5, ROC: 0.5, DAR: 0.5, FAI: 2 },
    POI: { GRO: 2, PSY: 2, BUG: 0.5, GRA: 0.5, POI: 0.5, FAI: 0.5 },
    GRO: { WAT: 2, ICE: 2, GRA: 2, ELE: 0, ROC: 0.5, POI: 0.5 },
    FLY: { ELE: 2, ICE: 2, ROC: 2, GRO: 0, BUG: 0.5, FIG: 0.5, GRA: 0.5 },
    PSY: { BUG: 2, GHO: 2, DAR: 2, FIG: 0.5, PSY: 0.5 },
    BUG: { FIR: 2, FLY: 2, ROC: 2, FIG: 0.5, GRA: 0.5 },
    ROC: { WAT: 2, GRA: 2, FIG: 2, GRO: 2, STE: 2, NOR: 0.5, FIR: 0.5, POI: 0.5, FLY: 0.5},
    GHO: { GHO: 2, DAR: 2, NOR: 0, FIG: 0 },
    DRA: { ICE: 2, DRA: 2, FAI: 2, FIR: 0.5, WAT: 0.5, ELE: 0.5, GRA: 0.5 },
    DAR: { FIG: 2, BUG: 2, FAI: 2, GHO: 0.5, DAR: 0.5, PSY: 0 },
    STE: { FIR: 2, FIG: 2, GRO: 2, NOR: 0.5, GRA: 0.5, ICE: 0.5, FLY: 0.5, PSY: 0.5, BUG: 0.5, ROC: 0.5, DRA: 0.5, STE: 0.5, FAI: 0.5, POI: 0},
    FAI: { STE: 2, POI: 2, FIG: 0.5, BUG: 0.5, DAR: 0.5, DRA: 0 },
  };

  // Função para converter números decimais em frações
  function decimalToFraction(value) {
    if (value === 1) return "1";
    if (value === 0.5) return "1/2";
    if (value === 0.25) return "1/4";
    if (value === 2) return "2";
    return value; // Caso não seja um valor que queremos transformar em fração
  }

  function getPokemonWeaknesses(types) {
    const convertedTypes = types.map((type) => typeMap[type] || type);
    const result = {};

    Object.keys(weaknesses).forEach((defType) => {
      let multiplier = 1;
      convertedTypes.forEach((pokemonType) => {
        if (
          weaknesses[pokemonType] &&
          weaknesses[pokemonType][defType] !== undefined
        ) {
          multiplier *= weaknesses[pokemonType][defType];
        }
      });
      result[defType] = multiplier;
    });
    return result;
  }

  function fillTableWithWeaknesses(tableId, types) {
    const table = document.getElementById(tableId);
    const weaknessesData = getPokemonWeaknesses(types);
    const headers = Array.from(table.rows[0].cells).map(
      (th) => typeMap[th.textContent] || th.textContent
    );

    let secondRow = table.rows[1];
    if (!secondRow) {
      secondRow = table.insertRow();
    } else {
      secondRow.innerHTML = "";
    }

    headers.forEach((defType) => {
      const cell = document.createElement("td");
      const value = weaknessesData[defType];
      cell.textContent = value !== undefined ? decimalToFraction(value) : "-";
      if (value < 1 && value > 0) {
        cell.className = "c-pokemon-defenses-notefct";
      } else if (value == 0) {
        cell.className = "c-pokemon-defenses-imefct";
      } else if (value > 1) {
        cell.className = "c-pokemon-defenses-suefct";
      } else {
        cell.className = "c-pokemon-defenses-norfct";
      }
      secondRow.appendChild(cell);
    });
  }

  // Exemplo de uso para preencher a tabela com um Pokémon do tipo Fire/Flying
  fillTableWithWeaknesses("table-type-1", [
    pokemon.types[0].type.name,
    pokemon.types[1]?.type.name,
  ]);
  fillTableWithWeaknesses("table-type-2", [
    pokemon.types[0].type.name,
    pokemon.types[1]?.type.name,
  ]);
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

document.getElementById("pokemons").addEventListener("input", function () {
  const input = this.value;
  const datalist = document.getElementById("list");
  const options = Array.from(datalist.options).map((option) => option.value);
  if (options.includes(input)) update(input);
});

addEventListener("load", start());

document.getElementById("sprite-btn").addEventListener("click", () => {
  const pokemon = JSON.parse(sessionStorage.getItem("pokemon"));
  const formatBtn = document.getElementById("sprite-btn").src.split("/");
  if (formatBtn[formatBtn.length - 1] == "star.png") {
    document.getElementById("sprite").src =
      pokemon.sprites.other["official-artwork"].front_shiny;
    document.getElementById("sprite-btn").src =
      "./img/clemerson/shiny-star.png";
  } else {
    document.getElementById("sprite").src =
      pokemon.sprites.other["official-artwork"].front_default;
    document.getElementById("sprite-btn").src = "./img/clemerson/star.png";
  }
});
