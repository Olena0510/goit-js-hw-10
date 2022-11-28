import './css/styles.css';
import debounce from 'lodash.debounce'
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');


inputRef.addEventListener('input', debounce((onInput), DEBOUNCE_DELAY));

function onInput(evt) {
    const nameCountry = inputRef.value.trim();

    if (!nameCountry) {
        clearInfo();
        return
    }
    fetchCountries(nameCountry).then(markup).catch(error => Notiflix.Notify.failure(`${error}`))

}

function markup(countries) {
    clearInfo();

    if (countries.length === 1) {
        markupCard(countries[0]);
    } else if (countries.length >= 2 && countries.length <= 10) {
        countries.forEach(markupList)
    } else if (countries.length > 10) {
                    clearInfo();
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.'
    )   } else {
                    Notiflix.Notify.failure('Oops, there is no country with that name');
                }
            }
    

function markupCard(countries) {
    listRef.innerHTML = '';
    const markup = countries.map((country) => {
        return `<img src="${country.flags.svg}" alt="Flag" width="40px"></img><span> ${country.name.official}</span>
        <p><b>Capital</b> ${country.capital} </p>
        <p><b>Population</b> ${country.population} </p>
        <p><b>Languages</b> ${Object.values(country.languages).join(', ')}</p>`
    }).join('');
    infoRef.innerHTML = markup;
}

function markupList (countries) {
    infoRef.innerHTML = '';
    const markup = countries.map((country) => {
        return `<li class = "list">
        <img src = "${country.flags.svg}" alt = "Flag" width="40px">
        <span>${country.name.official}</span>
        </li>`
    }).join('');
    listRef.innerHTML = markup;
}


function clearInfo() {
    infoRef.innerHTML = '';
    listRef.innerHTML = '';
}