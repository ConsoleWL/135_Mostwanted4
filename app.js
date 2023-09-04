function app(people) {
    displayWelcome();
    runSearchMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchMenu(people) {
    const searchResults = searchPeopleDataSet(people);
    if (searchResults.length > 1) {
        alert(`People found ${searchResults}`);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert("No one was found in the search");
    }
}

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

function searchById(people) {
    const idToSearchForString = prompt("Please enter the id of the person you are searcing for");
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the first name of the  person you are searching for:');
    const lastNameToSearchFor = prompt('Please enter the last name of the person you are searching for:');

    const fullNameSearchResults = people.filter(person => (
        person.firstName.toLowerCase() == firstNameToSearchFor.toLowerCase() &&
        person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()
    ));
    return fullNameSearchResults;
}

function searchByTraits(people) {
    const traitList = ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation'];

    let matchingResults = people;

    while (true) {
        const trait = validatedPrompt(
            `People found: ${matchingResults.length}. Choose a trait to search further done\nPress "reset" to start searvh again\nPress "Display" to display results:`,
            ['gender', 'dob', 'height', 'weight', 'eyeColor', 'occupation', 'reset', 'display']
        );

        if (trait === 'reset') {
            searchByTraits(people);
        }

        matchingResults = filterPeopleByTraits(matchingResults, trait);


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
            break;
        // maybe to make a seperate method for cases were you don;t have options
        case 'dob':
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

        // If done then we should break from loop above
    }

    return results;
}

function mainMenu(person, people) {
    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName} \n\nDo you want to know threir full information?`,
        ['info', 'family', 'descendats', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            displayPersonInfo(person);
            break;
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