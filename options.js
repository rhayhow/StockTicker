/*
** file: js/options.js
** description: javascript code for "html/options.html" page
*/

function init_options() {

    //load currently stored options configuration
    var timeout_value = localStorage['timeout'];
    var normal_threshold_value = localStorage['normal_threshold'];
    var special_threshold_value = localStorage['special_threshold'];
    var i = 0;
    var option = 'bogus';

    //set the current state of the options form elements to match the stored options values
    //favorite_movie
    if (timeout_value) {
        var timeout_value_dropdown = document.getElementById('timeout-dropdown');
        for (i = 0; i < timeout_value_dropdown.children.length; i++) {
            option = timeout_value_dropdown.children[i];
            if (option.value === timeout_value) {
                option.selected = 'true';
                break;
            }
        }
    }

    if (normal_threshold_value) {
        var threshold_value_dropdown = document.getElementById('threshold-dropdown');
        for (i = 0; i < threshold_value_dropdown.children.length; i++) {
            option = threshold_value_dropdown.children[i];
            if (option.value === normal_threshold_value) {
                option.selected = 'true';
                break;
            }
        }
    }

    if (special_threshold_value) {
        var special_threshold_value_dropdown = document.getElementById('special-threshold-dropdown');
        for (i = 0; i < special_threshold_value_dropdown.children.length; i++) {
            option = special_threshold_value_dropdown.children[i];
            if (option.value === special_threshold_value) {
                option.selected = 'true';
                break;
            }
        }
    }
}

function save_options() {

    //timeout value dropdown
    var timeout_value = document.getElementById('timeout-dropdown').children[document.getElementById('timeout-dropdown').selectedIndex].value;
    localStorage['timeout'] = timeout_value;

    //normal threshold value dropdown
    var normal_threshold_value = document.getElementById('threshold-dropdown').children[document.getElementById('threshold-dropdown').selectedIndex].value;
    //special threshold value dropdown
    var special_threshold_value = document.getElementById('special-threshold-dropdown').children[document.getElementById('special-threshold-dropdown').selectedIndex].value;

    var status = document.getElementById("status");
    //clear any previous status warnings
    status.innerHTML = null;
    status.style.color = null;

    if (special_threshold_value <= normal_threshold_value) {
        status.innerHTML = "The special alert threshold must be greater than the normal threshold, settings not saved!";
        status.style.color = "red";
        return;
    }
    //else {
    //    
    //    return;
    //}

    localStorage['normal_threshold'] = normal_threshold_value;

    localStorage['special_threshold'] = special_threshold_value;
};


//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_options);
document.querySelector('#save-options-button').addEventListener('click', save_options);
