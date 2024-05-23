///*!
// * Copyright (c) 2024 Gig Game Corp.
// *
// * Author: Jason Bramble
// *
// * All rights reserved. This file or any portion thereof
// * may not be reproduced or used in any manner whatsoever
// * without the express written permission of the author
// * except for the use of brief quotations in a review.
// *
// * For permission requests, write to the author at the email address below:
// * - Email: support@sparkinnovationscorp.com
// */

//((global) => {
//    class HandlebarsBoundView {
//        constructor(target = "#app", template = null) {
//            this.target = target;
//            this.templatePath = template
//                ? template
//                : this.constructor.name + ".html";
//            this.template = null; // Placeholder for the compiled template
//            this.translateHandle = null;
//            this.register();
//        }

//        register() {
//            this.bindHandles = [];
//            this.onclickHandles = [];
//            this.localizationId = 0;
//            const base = this;

//            if (!this.valid()) return;

//            if (typeof Handlebars === "undefined") {
//                console.error(
//                    "Handlebars.js is not installed. Please make sure to include it in your project."
//                );
//                return;
//            }
//            Handlebars.registerHelper("eq", function (arg1, arg2) {
//                return arg1 === arg2;
//            });

//            Handlebars.registerHelper("neq", function (arg1, arg2) {
//                return arg1 !== arg2;
//            });

//            Handlebars.registerHelper("gt", function (arg1, arg2) {
//                return arg1 > arg2;
//            });

//            Handlebars.registerHelper("lt", function (arg1, arg2) {
//                return arg1 < arg2;
//            });

//            Handlebars.registerHelper("click", function (fn, redraw) {
//                if (typeof base[fn] === "function") {
//                    base.onclickHandles.push({
//                        fn: base[fn].bind(base),
//                        redraw: typeof redraw === "boolean" ? redraw : true,
//                        data: this,
//                    });

//                    var index = base.onclickHandles.length - 1;
//                    return `data-onclickhandler='${index}'`;
//                } else {
//                    console.error(
//                        `Error: Method ${fn} does not exist on the class.`
//                    );
//                    return "";
//                }
//            });

//            Handlebars.registerHelper("bind", function (prop) {
//                base.bindHandles.push({
//                    prop: prop,
//                    data: this,
//                });
//                var index = base.bindHandles.length - 1;
//                return `data-bind='${index}'`;
//            });

//            Handlebars.registerHelper("call", function (fn) {
//                if (typeof base[fn] === "function") {
//                    var funct = base[fn].bind(base);
//                    return funct(this);
//                } else {
//                    console.error(
//                        `Error: Method ${fn} does not exist on the class.`
//                    );
//                    return "";
//                }
//            });

//            Handlebars.registerHelper("nullOrEmpty", function (value) {
//                return (
//                    value === null ||
//                    value === undefined ||
//                    value === "" ||
//                    (Array.isArray(value) && value.length === 0)
//                );
//            });

//            Handlebars.registerHelper("null", function (value) {
//                console.log(value);
//                return value === null || value === undefined;
//            });

//            Handlebars.registerHelper("or", function () {
//                var args = Array.prototype.slice.call(arguments);

//                for (var i = 0; i < args.length - 1; i++) {
//                    if (args[i]) {
//                        return true;
//                    }
//                }

//                return false;
//            });

//            Handlebars.registerHelper("and", function () {
//                var args = Array.prototype.slice.call(arguments);

//                for (var i = 0; i < args.length - 1; i++) {
//                    if (!args[i]) {
//                        return false;
//                    }
//                }

//                return true;
//            });

//            Handlebars.registerHelper("add", function (num1, num2) {
//                // Check if both parameters are numbers
//                if (typeof num1 === "number" && typeof num2 === "number") {
//                    // Perform addition
//                    return num1 + num2;
//                } else {
//                    // If one or both parameters are not numbers, return an error message
//                    return "Error: Both parameters must be numbers";
//                }
//            });

//            Handlebars.registerHelper("subtract", function (num1, num2) {
//                // Check if both parameters are numbers
//                if (typeof num1 === "number" && typeof num2 === "number") {
//                    // Perform subtraction
//                    return num1 - num2;
//                } else {
//                    // If one or both parameters are not numbers, return an error message
//                    return "Error: Both parameters must be numbers";
//                }
//            });
//        }

//        loadTemplate(callback) {
//            if (this.template) {
//                callback();
//            } else {
//                fetch(this.templatePath)
//                    .then((response) => {
//                        if (!response.ok) {
//                            throw new Error(
//                                `HTTP error! status: ${response.status}`
//                            );
//                        }
//                        return response.text();
//                    })
//                    .then((templateHtml) => {
//                        this.template = Handlebars.compile(templateHtml);
//                        callback();
//                    })
//                    .catch((error) => {
//                        console.error(
//                            "Error: Could not load template " +
//                                this.templatePath +
//                                " " +
//                                error.message
//                        );
//                    });
//            }
//        }

//        render() {
//            this.onclickHandles = [];
//            this.bindHandles = [];
//            this.asyncHandles = [];
//            if (!this.valid()) return;
//            this.loadTemplate(() => {
//                const html = this.template(this);

//                const targetElement = document.querySelector(this.target);

//                if (targetElement) {
//                    targetElement.innerHTML = html;
//                } else {
//                    console.error(
//                        `The target "${this.target}" could not be found.`
//                    );
//                }

//                this.bindProps();
//                this.bindEvents();

//                if (
//                    typeof global !== "undefined" &&
//                    global.$GG &&
//                    global.$GG.globalization
//                ) {
//                    if (this.translateHandle != null) {
//                        clearTimeout(this.translateHandle);
//                    }

//                    setTimeout(() => {
//                        this.translateHandle =
//                            $GG.globalization.language.translateDom();
//                    }, 200);
//                }
//            });
//        }

//        bindEvents() {
//            const base = this;
//            document
//                .querySelectorAll("[data-onclickhandler]")
//                .forEach((element) => {
//                    const index = parseInt(
//                        element.getAttribute("data-onclickhandler"),
//                        10
//                    );
//                    const handle = base.onclickHandles[index];

//                    element.addEventListener("click", function () {
//                        const redraw = handle.redraw;
//                        if (redraw) {
//                            const state1 = base.serialize();
//                            handle.fn(handle.data); // Execute the function
//                            const state2 = base.serialize();
//                            if (state1 !== state2) base.render();
//                        } else {
//                            handle.fn(handle.data); // Execute the function without redraw
//                        }
//                    });
//                });
//        }

//        bindProps() {
//            const base = this;
//            document.querySelectorAll("[data-bind]").forEach((element) => {
//                const index = parseInt(element.getAttribute("data-bind"), 10);
//                const handle = base.bindHandles[index];

//                var propName = handle.prop;
//                var data = null;

//                if (propName.startsWith("base.")) {
//                    data = base;
//                    propName = handle.prop.substring(5);
//                } else if (propName.startsWith("this.")) {
//                    data = handle.data;
//                    propName = handle.prop.substring(5);
//                } else {
//                    data = handle.data;
//                }

//                // Handling nested properties
//                if (propName.includes(".") || propName.includes("[")) {
//                    const { targetObject, finalProp } = this.resolveNested(
//                        data,
//                        propName
//                    );
//                    data = targetObject;
//                    propName = finalProp;
//                }

//                if (
//                    element.tagName === "INPUT" &&
//                    element.type === "checkbox"
//                ) {
//                    element.checked = data[propName];
//                } else if (
//                    element.tagName === "INPUT" ||
//                    element.tagName === "SELECT" ||
//                    element.tagName === "TEXTAREA"
//                ) {
//                    element.value = data[propName];
//                } else {
//                    element.textContent = data[propName];
//                }

//                element.addEventListener("change", function () {
//                    if (element.type === "checkbox") {
//                        data[propName] = element.checked;
//                    } else if (element.type === "number") {
//                        data[propName] = parseFloat(element.value);
//                    } else {
//                        data[propName] = element.value;
//                    }
//                    base.render();
//                });
//            });
//        }

//        async bindAsyncs() {
//            console.log("Bind Asyncs");
//            if (this.asyncHandles.length > 0) {
//                await $GG.globalization.language.settings.initCache();
//            }

//            while (this.asyncHandles.length > 0) {
//                const fn = this.asyncHandles.pop();
//                if (typeof fn === "function") {
//                    fn();
//                }
//            }
//        }

//        resolveNested(base, path) {
//            const props = path.replace(/\[(\w+)\]/g, ".$1").split("."); // Convert indexes to properties
//            let targetObject = base;
//            for (let i = 0; i < props.length - 1; i++) {
//                const propName = props[i];
//                if (!(propName in targetObject))
//                    throw new Error(`Property ${propName} not found`);
//                targetObject = targetObject[propName];
//            }
//            const finalProp = props[props.length - 1];
//            return { targetObject, finalProp };
//        }

//        serialize() {
//            var replacer = function (key, value) {
//                var excludeKeys = [
//                    "onclickHandles",
//                    "bindHandles",
//                    "target",
//                    "template",
//                    "templatePath",
//                ];
//                if (excludeKeys.indexOf(key) > -1) {
//                    return undefined;
//                }
//                return value;
//            };

//            return JSON.stringify(this, replacer);
//        }

//        valid() {
//            if (typeof Handlebars === "undefined") {
//                console.error(
//                    "Handlebars.js is not installed. Please make sure to include it in your project."
//                );
//                return false;
//            }
//            return true;
//        }
//    }

//    global.$GG.web = {
//        types: {
//            HandlebarsBoundView: HandlebarsBoundView,
//        },
//    };
//})(typeof window !== "undefined" ? window : global);
