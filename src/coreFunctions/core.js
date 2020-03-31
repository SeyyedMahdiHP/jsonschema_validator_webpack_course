
const Validator = require('jsonschema').Validator;
import hljs from 'highlight.js';
import 'highlight.js/styles/an-old-hope.css';




// escape special chars in string
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(text, oldSubStr, newSubStr) {
    return text.replace(new RegExp(escapeRegExp(oldSubStr), 'g'), newSubStr);

}

// highlight code sections
function codeHighLighter(code, sectionName, language = "javascript", indentDepth=2) {
    let sectionContainer = document.createElement('div');
    let sectionTitle = document.createElement('h2');
    let preElement = document.createElement('pre');
    let codeElement = document.createElement('code');
    // set the title
    sectionTitle.innerHTML = sectionName;
    // highlight the code
    codeElement.setAttribute('data-language', language);
    codeElement.innerHTML = JSON.stringify(code, null, indentDepth);
    preElement.appendChild(codeElement);
    // add code and title to the container
    sectionContainer.appendChild(sectionTitle);
    sectionContainer.appendChild(preElement);
    return sectionContainer;
}
// highlight errors in instance section
function textHighLighter(text, subStr) {
    let newSubStr = `<span class='highlight'>${subStr}</span>`;
    return replaceAll(text, subStr , newSubStr);
}




function errorHandler(errors, errorSection) {
    let instanceSection = document.getElementById("instanceSection");
    errors.forEach((error, index) => {
        console.log(error)
        if (error.name === "uniqueItems") {
            console.log(error.instance[0].key)
            errorSection.appendChild(duplicateInstanceError(error, index));
            error.instance.map(instance => {
                instanceSection.innerHTML = textHighLighter(instanceSection.innerHTML, instance.key);
            })
        } else {
            try {
                let highLightText = "noError";

                switch (error.name) {
                    case "required":
                        highLightText = error.argument;
                        break;

                    case "pattern":
                        highLightText = error.instance;
                        break;
                    case "type":
                        highLightText = (error.instance || error.property.split('.').pop());
                        break;

                    default:
                        break;
                }
                const elements = [];
                elements.push(createElement('h2', `Error ${index} : ${error.name}`));
                elements.push(createElement('h4', `error message: ${error.stack}:`));
                elements.push(createElement('h5', `&nbsp; &nbsp; &nbsp; instance: ${JSON.stringify(error.instance)}`));
                // elements.push(createElement('pre', `schema: ${JSON.stringify(error.schema,null,1)}`));
                errorSection.appendChild(createHighlightedContainerElement(elements));
                instanceSection.innerHTML = textHighLighter(instanceSection.innerHTML, JSON.stringify(highLightText));

            } catch (err) {
                console.log("error has happend to error handler:", err, error)
            }

        }

    });
}
// create Element
function createElement(tagName, message = "") {
    let element = document.createElement(`${tagName}`);
    element.innerHTML = message;
    return element;
}

function createHighlightedContainerElement(elementArray) {
    const sectionContainer = createElement("div")
    let preElement = document.createElement('pre');
    let codeElement = document.createElement('code');
    codeElement.setAttribute('data-language', "javascript");
    preElement.appendChild(codeElement);
    elementArray.forEach(element => {
        codeElement.appendChild(element);
    });
    sectionContainer.appendChild(preElement);
    return sectionContainer;
}

function duplicateInstanceError(error, index) {
    const elements = [];
    elements.push(createElement('h2', `Error ${index} : Duplicate Error`));
    elements.push(createElement('h4', `error message: ${error.stack}:`));
    error.instance.forEach(instance => {
        elements.push(createElement('h5', `&nbsp; &nbsp; &nbsp; instance: ${JSON.stringify(instance)}`));
    });
    return createContainerElement(elements);
}




hljs.initHighlightingOnLoad();
const body = document.getElementsByTagName('body')[0];


console.time("Validate time:");
// schema validator
function errorValidator(instance, schema) {
    const errorSection = document.getElementById('errorSection');
    const schemaSection = document.getElementById('schemaSection');
    const instanceSection = document.getElementById('instanceSection');

    schemaSection.appendChild(codeHighLighter(schema, "JSON Schema"));
    instanceSection.appendChild(codeHighLighter(instance, "JSON Instance"));

    let instanceValidator = new Validator();
    const errors = instanceValidator.validate(instance, schema).errors;

    if (errors.length) {
        console.log(errors)
        errorHandler(errors, errorSection);
    } else {
        const successMSG = document.getElementById('successMSG');
        successMSG.innerHTML = " No errors found. JSON Instance validates against the schema";
    }
}
console.timeEnd("Validate time:");
export default errorValidator;