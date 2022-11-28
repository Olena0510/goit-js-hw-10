import './css/styles.css';
import debounce from 'lodash.debounce'
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');


inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
    const nameCountry = evt.target.value.trim();

    if (!nameCountry) {
        clearInfo(listRef);
        clearInfo(infoRef)
        return;
    }
    fetchCountries(nameCountry).then(markup => {
        console.log(markup);
        if (markup.length > 10) {
            clearInfo();
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.')
        } else if (markup.length > 1) {
            fetchCountries(nameCountry).then(countries => {
                markupList(markup);
                clearInfo(infoRef)
            }) 

        } else if (markup.length === 1) {
            fetchCountries(nameCountry).then(countries => {
                markupCard(markup)
                clearInfo(listRef)
            })
        }
    }).catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'))

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


function clearInfo(section) {
    section.innerHTML = '';
}