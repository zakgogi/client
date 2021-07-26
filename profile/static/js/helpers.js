function renderHabitData(data) {
    const newSection = document.createElement("section");
    newSection.classList.add("habit-details");

    const habitTitle = document.createElement("h2");
    habitTitle.textContent = data.habitname;

    const habitBoilerToday = document.createElement("h3");
    habitBoilerToday.textContent = "Today";

    const submittedToday = document.createElement("p");
    submittedToday.textContent = `${data.times_completed} of ${data.frequency_day}`;

    const habitBoilerStreak = document.createElement("h3");
    habitBoilerStreak.textContent = "Streak";

    const streak = document.createElement("p");
    streak.textContent = data.streak;

    newSection.append(habitTitle);
    newSection.append(habitBoilerToday);
    newSection.append(submittedToday);
    newSection.append(habitBoilerStreak);
    newSection.append(streak);

    return newSection;
}

function renderHabitContainer(data) {
    const newArticle = document.createElement("article");
    newArticle.id = data.id;
    newArticle.classList.add("habit-container");

    const habitData = renderHabitData(data);
    newArticle.append(habitData);

    const bgImage = document.createElement("img");
    bgImage.src = "../static/assets/ER0AQagU8AAUjHM.jpg";
    bgImage.classList.add("habit-gradient");
    bgImage.alt = "background gradient";
    //* the opacity is based on the percentage of the goal complete.
    bgImage.style.opacity = (parseInt(data.times_completed) / parseInt(data.frequency_day));
    newArticle.append(bgImage);

    const removeButton = document.createElement("button");
    removeButton.textContent = "remove";
    removeButton.classList.add("remove");
    newArticle.append(removeButton);   
    
    const addToCountButton = document.createElement("button");
    addToCountButton.id = "add-to-total";
    addToCountButton.type = "button";
    addToCountButton.textContent = "+";

    newArticle.append(addToCountButton);
    
    return newArticle;

}

function removeAllHabitContainers() {
    const articles = document.querySelectorAll("article");
    const articlesArr = Array.from(articles);


    articlesArr.forEach(article => {
        article.remove();
    });

}

function updateTimesCompleted(timesComplete, targetTimes, id) {

    const targetArticle = document.getElementById(`${id}`);
    
    const paragraph = targetArticle.querySelector("p");
    paragraph.textContent = `${timesComplete} of ${targetTimes}`;
    
}

function updateBackgroundOpacity(timesComplete, targetTimes, id) {
    const targetArticle = document.getElementById(`${id}`);
    
    const backgroundImage = targetArticle.querySelector("img");
    
    backgroundImage.style.opacity = (parseInt(timesComplete) / parseInt(targetTimes));
}

module.exports = {renderHabitContainer, removeAllHabitContainers, updateTimesCompleted, updateBackgroundOpacity};