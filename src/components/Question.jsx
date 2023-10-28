import React from "react";
import { Loader } from "./Loader";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import beautify from "js-beautify";
import "./question.css";

export const Question = () => {
  const answer = React.useRef(null);
  const [spoilerOpen, setSpoilerOpen] = React.useState(false);
  const questions = [
    {
      question:
        "function sayHi() {console.log(name);console.log(age); var name = 'Lydia'; let age = 21;}sayHi();",

      options: [
        "Lydia and undefined",
        "Lydia and ReferenceError",
        "ReferenceError and 21",
        "undefined and ReferenceError",
      ],
      answer: "D",
      explanation:
        "Within the function, we first declare the name variable with the var keyword. This means that the variable gets hoisted (memory space is set up during the creation phase) with the default value of undefined, until we actually get to the line where we define the variable. We haven't defined the variable yet on the line where we try to log the name variable, so it still holds the value of undefined. Variables with the let keyword (and const) are hoisted, but unlike var, don't get initialized. They are not accessible before the line we declare (initialize) them. This is called the \"temporal dead zone\". When we try to access the variables before they are declared, JavaScript throws a ReferenceError.",
    },
    {
      question:
        "for (var i = 0; i < 3; i++) {setTimeout(() => console.log(i), 1);}",
      options: ["0 1 2 and 0 1 2", "0 1 2 and 0 1 2", "3 3 3 and 0 1 2"],
      answer: "C",
      explanation:
        "Because of the event queue in JavaScript, the setTimeout callback function is called after the loop has been executed. Since the variable i in the first loop was declared using the var keyword, this value was global. During the loop, we incremented the value of i by 1 each time, using the unary operator ++. By the time the setTimeout callback function was invoked, i was equal to 3 in the first example.In the second loop, the variable i was declared using the let keyword: variables declared with the let (and const) keyword are block-scoped (a block is anything between { }). During each iteration, i will have a new value, and each value is scoped inside the loop.",
    },
  ];
  React.useEffect(() => {
    let formatted = [...questions];
    formatted = formatted.map((el) => {
      el.question = beautify(el.question, {
        indent_size: 2,
        space_in_empty_paren: true,
      });
      return el;
    });
    setQuestionsFormatted(() => formatted);
    console.log(formatted);
  }, []);
  const [formattedQuestions, setQuestionsFormatted] = React.useState([]);
  const letters = ["A", "B", "C", "D"];

  return (
    <section className="question">
      <h3 className="question__header">What's the output?</h3>

      {formattedQuestions[1] ? (
        <SyntaxHighlighter
          className="question__body"
          language="javascript"
          style={stackoverflowLight}
        >
          {formattedQuestions[1].question}
        </SyntaxHighlighter>
      ) : (
        <Loader />
      )}

      <ul className="question__options">
        {formattedQuestions[1]
          ? formattedQuestions[1].options.map((el, idx) => {
              return (
                <li key={idx} className="question__option option-item">
                  <label className="option-radio">
                    <input name="option" type="radio" value={el} />
                    <span></span>
                    <div className="option-item__content">
                      <span className="option-item__marker">
                        {letters[idx] + ":"}
                      </span>
                      <p className="option-text">{el}</p>
                    </div>
                  </label>
                </li>
              );
            })
          : null}
      </ul>
      <div className="question__answer answer">
        <button
          className="answer__button"
          onClick={(e) => {
            if (!spoilerOpen)
              // answer.current.style.height = getComputedStyle(answer.current).height + "px";
              answer.current.style.height = answer.current.scrollHeight + "px";
            else answer.current.style.height = "0";
            setSpoilerOpen((prev) => !prev);
            e.target.classList.toggle("open");
          }}
        >
          Check answer
        </button>
        <div ref={answer} className="answer__content">
          <span className="answer__marker">Answer: C</span>
          <p className="answer__explanation">
            {formattedQuestions[1] ? formattedQuestions[1].explanation : null}
          </p>
        </div>
      </div>
    </section>
  );
};
