
/**
 * 
 * @param {*} people Data of people comes in
 * @returns 
 */
function app(people) {
    displayWelcome();
    runSearchMenu(people);
    return exitOrRestart(people);
}

/**
 * Displaying a welcome message
 */
function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

/**
 * Get the final result from the search and display the results
 * @param {*} people Data of people comes in
 */
function runSearchMenu(people) {
    const searchResults = searchPeopleDataSet(people);
    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert("No one was found in the search");
    }
}

/**
 * 
 * @param {*} people Data of people comes in
 * @returns returns the final result of people Which return to the runSearchMenu 
 */
function searchPeopleDataSet(people) {
    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform',
        ['id', 'name', 'traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
        case 'traits':
            results = searchByTraits(people);
    }
    return results;
}

/**
 * @param {*} people Data of people comes in
 * @returns  the results of the search by ID
 */
function searchById(people) {
    const idToSearchForString = prompt("Please enter the id of the person you are searcing for");
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

/**
 * 
 * @param {*} people Data of people comes in
 * @returns a person from the data search by name and lastname
 */
function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the first name of the  person you are searching for:');
    const lastNameToSearchFor = prompt('Please enter the last name of the person you are searching for:');

    const fullNameSearchResults = people.filter(person => (
        person.firstName.toLowerCase() == firstNameToSearchFor.toLowerCase() &&
        person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()
    ));
    return fullNameSearchResults;
}

/**
 * 
 * @param {*} people Data of people comes in
 * @Function is searching people by traits. 
 * @Function when trait is set we call another function
 * @returns return a person or a list of people found by particular trait
 */
function searchByTraits(people) {
    let matchingResults = people;

    while (true) {

        const trait = validatedPrompt(
            `Choose a trait to search further done\nPress "reset" to start search again\n`,
            ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation', 'reset']
        );

        matchingResults = filterPeopleByTraits(matchingResults, trait);

        let action = validatedPrompt(
            `Matching results: ${matchingResults.length}\nEnter "Display" to finish the search\nEnter "search to search further down`,
            ['display', 'reset', 'search']
        );

        if (action === 'display') {
            return matchingResults;
        } else if (action === 'reset') {
            matchingResults = people
        }
    }
}


function filterPeopleByTraits(matchingResults, trait) {
    let results = [];
    let traitSearch;

    switch (trait) {
        case 'gender':
            traitSearch = validatedPrompt(
                `Please select a gender type:`,
                ['male', 'female']
            );
            results = matchingResults.filter(person => person.gender === traitSearch);
            break;
        case 'eyecolor':
            traitSearch = validatedPrompt(
                `Please select an eye color`,
                ['brown', 'black', 'hazel', 'blue', 'green']
            );
            results = matchingResults.filter(person => person.eyeColor === traitSearch);
            break;
        case 'occupation':
            traitSearch = validatedPrompt(
                `Please select occupation`,
                ['programmer', 'assistant', 'landscaper', 'assistant', 'nurse', 'student', 'architect', 'doctor', 'politician']
            );
            results = matchingResults.filter(person => person.occupation === traitSearch);
            break;
        case 'dob': // DOB is not a trait =) let's just leave it here
            traitSearch = prompt('Please enter the date of birth: m/d/year:')
            results = matchingResults.filter(person => person.dob === traitSearch);
            break;
        case 'height':
            traitSearchString = prompt('Please enter height: ex 6ft 1inch = 61');
            traitSearch = parseInt(traitSearchString);
            results = matchingResults.filter(person => person.height === traitSearch);
            break;
        case 'weight':
            traitSearchString = prompt('Please enter the weight in lbs');
            traitSearch = parseInt(traitSearchString);
            results = matchingResults.filter(person => person.weight === traitSearch);
            break;
    }

    return results;
}

function mainMenu(person, people) {
    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName} \n\nDo you want to know threir full information?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            displayPersonInfo(person);
            break;
        case "family":
            let personFamily = findPersonFamily(person, people);
            displayPeople('Family', personFamily);
            break;
        case "descendants":
            let personDescendants = findPersonDescendants(person, people);
            displayPeople('Descendants', personDescendants);
        case "quit":
            return;
    }
    return mainMenu(person, people);
}

function displayPersonInfo(person) {
    alert(
        `Person's info:
        Id: ${person.id}
        Name: ${person.firstName}
        Last Name: ${person.lastName}
        Gender: ${person.gender}
        DOB: ${person.dob}
        Weight: ${person.weight}
        Eyes: ${person.eyeColor}
        Occupation: ${person.occupation}
        Parents: ${person.parents}
        Spouse: ${person.currentSpouse}`
    );
}

function findPersonFamily(person, people) {
    const familyMembers = [];

    if (person.currentSpouse !== null) {
        familyMembers.push(people.find(per => per.id === person.currentSpouse));
    }

    if (person.parents.length > 0) {
        for (i = 0; i < person.parents.length; i++) {
            familyMembers.push(people.find(per => per.id === person.parents[i]));
        }
    }

    let siblings = [];

    siblings = people.filter(function (per) {
        for (i = 0; i < person.parents.length; i++) {
            if (per.parents.includes(person.parents[i]) && per.id !== person.id) {
                return true;
            } else {
                return false;
            }
        }
    });

    for (let i = 0; i < siblings.length; i++) {
        familyMembers.push(siblings[i]);
    }

    return familyMembers;
}

function findPersonDescendants(person, people) {
    let descendants = [];

    function findPersonDescendantsRecursive(person) {
        kids = people.filter(p => p.parents.includes(person.id));
        kids.forEach(kid => {
            descendants.push(kid);
            findPersonDescendantsRecursive(kid);
        })
    }

    findPersonDescendantsRecursive(person);

    return descendants;
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);;
    }
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}