"use strict";

const typeStateM = {
  "multi": (options, correctKeys, doShuffle = false) => { return {
     "control": "checkbox",
     "options": doShuffle ? _.shuffle(options || []) : options || [],
     "correctKeys": correctKeys || {}
  }},
  "single": (options, correctKeys, doShuffle = false) => { return {
     "control": "radio",
     "options": doShuffle ? _.shuffle(options || []) : options || [],
     "correctKeys": correctKeys || {}
  }}
}

export const questionsHelper = {

    generateHtml(info) {
        let qObj = info.questionsObj,
            content = [], correctanswers = "",
            params = !qObj.qtype ? null 
                        : (typeStateM[qObj.qtype])(qObj.answsArr, qObj.ranswsObj, qObj.qbehaviour === "yes");

        content.push("<div class='mgmt-questions formulation'>");        
        if (qObj.qtext) {content.push(`<h2 class="deviceDescription">${qObj.qtext}</h2>`);}
        if (qObj.instruction) {content.push(`<h2 class="italic">${qObj.instruction}</h2>`);}

        if (params) {
            correctanswers = _.map(_.keys(_.pick(params.correctKeys, v => !!v )), m => "s_" + m).join(",");

            content.push("<div class='qanswer'>");

            params.options.map((ob, i) => {
                content.push(`
                    <div class="r1">
                        <input id="s_${ob.key}" name="answer" type="${params.control}" class="form-control-left" value="s_${ob.key}" />
                        <label for="s_${ob.key}" class="answer_wrapper">
                            ${ob.val}
                            <img src="" class="questioncorrectnessicon hidden">
                        </label>
                    </div>`
                );
            });

            content.push("</div>"); //qanswer
        }

        content.push("</div>"); //formulation

        content.push(`
            <div class='submitbtns' id='submitbtns'>
                <button type='button' class='btn btn-info' id='mysubmits' 
                    onclick="app3dScormUtils.doSubmitAnswer('${qObj.qtype}', '${correctanswers}', '${!!qObj.correctfb}', '${!!qObj.incorrectfb}')">
                    <span className='fa fa-save'></span> Submit
                </button>
            </div>
        `);

        content.push(`
            <div class='outcome' id='outcome' style='display:none;'>
                <div class='feedback' id='feedback'>
                    <div class='specificfeedback' id='correctfeedback'>${qObj.correctfb}</div>
                    <div class='specificfeedback' id='incorrectfeedback'>${qObj.incorrectfb}</div>
                    <div class='rightanswer' id='rightanswer'></div>
                </div>
            </div>

            <div class='btn-padding-bottom'></div>
        `);

        return content.join("");
    }
}