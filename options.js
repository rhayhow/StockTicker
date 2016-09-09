/*
** file: js/options.js
** description: javascript code for "html/options.html" page
*/

function init_options() {
    console.log("function: init_options");

    //load currently stored options configuration
    var timeout_value = localStorage['timeout'];

    //set the current state of the options form elements to match the stored options values
    //favorite_movie
    if (timeout_value) {
        var timeout_value_dropdown = document.getElementById('timeout-dropdown');
        for (var i = 0; i < timeout_value_dropdown.children.length; i++) {
            var option = timeout_value_dropdown.children[i];
            if (option.value == timeout_value) {
                option.selected = 'true';
                break;
            }
        }
    }
}

function save_options() {
    console.log("function: save_options");

    //favorite-movie-dropdown
    var timeout_value = document.getElementById('timeout-dropdown').children[document.getElementById('timeout-dropdown').selectedIndex].value;
    localStorage['timeout'] = timeout_value;
    console.log("timeout = " + timeout_value);
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_options);
document.querySelector('#save-options-button').addEventListener('click', save_options);
