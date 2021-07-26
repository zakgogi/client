// const { describe } = require("yargs");
const helpers = require("../static/js/helpers");
const profileHelpers = require("../profile/static/js/helpers")


const fs = require('fs');
const path = require('path');
// const { describe } = require("yargs");
// const { expect } = require("@jest/globals");
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('head testing', () => {

  //===== use this if you're bring in an entire file =====//

  beforeEach(() => {
      document.documentElement.innerHTML = html.toString()
  })


  test('the title has been changed from the default', () => {
      
      let title = document.querySelector('title')
      expect(title.textContent).not.toEqual('Document');
  });

  test('css link is not # (default)', () => {
      let css = document.querySelector('link[rel="stylesheet"]');
      expect(css.getAttribute("href")).not.toEqual('#') 
  });

  test('css links to a file with .css as its extension', () => {
      let css = document.querySelector('link[rel="stylesheet"]');
      let link = css.getAttribute("href");
      let result = /.css$/i.test(link)
      expect(result).toBeTruthy()
  });

  test('the page has a favicon element', () => {
      let iconLink = document.querySelector('link[rel="icon"]');
      expect(iconLink).toBeTruthy()
  });

  test('the favicon link is present', () => {
      let iconLink = document.querySelector('link[rel="icon"]');
      expect(iconLink.getAttribute("href")).not.toEqual('#') 
  });

  test('the favicon is in the correct .ico format', () => {
      let linkElm = document.querySelector('link[rel="icon"]');
      let link = linkElm.getAttribute("href");
      let result = /.ico$/i.test(link)
      expect(result).toBeTruthy()
  });

  test('script tag is present', () => {
      let javascriptLink = document.querySelector('script');
      expect(javascriptLink).toBeTruthy()
  });

  test('script has a src attribute', () => {
      let javascriptLink = document.querySelector('script');
      let src = javascriptLink.getAttribute("src");
      expect(src).toBeTruthy();
  });

  test('script link is a bundle.js', () => {
      let javascriptLink = document.querySelector('script');
      let src = javascriptLink.getAttribute("src");
      expect(src).toBe("/static/js/bundle.js");
  });
})


describe("clear input fields tests", () => {

    beforeEach(() => {
        document.documentElement.innerHTML = `<main><input type="text">test</input><input type="text">test</input></main>`;
    });


    test('all input fields should be emptied', () => {
        helpers.clearAllInputFields()
        expect(document.querySelector("input").value).toBe("");
    });

    test("an input with a type of submit shouldn't be affected.", () => {
        document.documentElement.innerHTML = `<main><input type="submit" value="hello"></input></main>`;
        helpers.clearAllInputFields()
        expect(document.querySelector("input").value).toBe("hello");
    });

    test("clears multiple input fields", () => {
        document.documentElement.innerHTML = `<main><input type="text" value="hello"></input><input type="text" value="hello"></input><input type="text" value="hello"></input><input type="text" value="hello"></input></main>`;
        helpers.clearAllInputFields()
        const inputs = document.querySelectorAll("input");
        const inputsArr = Array.from(inputs);
        const values = []
        inputsArr.forEach(element => {
            values.push(element.value);
        });
        const result = values.every(e => e === values[0])
        expect(result).toBeTruthy();
    });

    test("clears multiple input fields but not a submit", () => {
        document.documentElement.innerHTML = `<main><input type="text" value="hello"></input><input type="submit" value="hello"></input><input type="text" value="hello"></input><input type="text" value="hello"></input><input type="text" value="hello"></input></main>`;
        helpers.clearAllInputFields()
        const inputs = document.querySelectorAll("input");
        const inputsArr = Array.from(inputs);
        const values = []
        inputsArr.forEach(element => {
            values.push(element.value);
        });
        const result = values.every(e => e === values[0])
        expect(result).toBeFalsy();
    });
    
})


describe('profile page', () => {
    describe('create new element', () => {
        beforeEach(() => {
            document.documentElement.innerHTML = `<section id="habits"></section>`
        })
        test('new habit is made', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            expect(document.querySelector("article")).toBeTruthy();
        })
        test('article has the right class', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            expect(document.querySelector("article").id).toBe("1");
        })
        test('text section has the right class', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            
            expect(document.querySelector(".habit-details")).toBeTruthy()
        })
        test('text section has the right number of paragraphs', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            
            expect(document.querySelectorAll("p").length).toBe(2)
        })
        test('text section has the right number of h2s', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            
            expect(document.querySelectorAll("h3").length).toBe(2)
        })
        test('text section has the right number of h3s', () => {
            const data = {
                habitId: 1,
                habitTitle: "test",
                todayTotal: 3,
                todayGoal: 10,
                streak: 7
            
            };
            const target = document.querySelector("#habits");
            target.append(profileHelpers.renderHabitContainer(data))
            
            expect(document.querySelectorAll("h2").length).toBe(1)
        })
    })
})
