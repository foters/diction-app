const synth = window.speechSynthesis;
let voices = synth.getVoices();
let selectedLanguage = null;
let selectedVoice = null;
let selectedVoiceObj = null;
let selectedLaugageVoices = null;
let matchedVoices = null;
let isButtonEnabled = false;
const button = document.querySelector('.listen-message');
const steps = document.querySelectorAll('.step')

/**
 * 
 * @param {string array} classes: list of the classes name that must be added
 * @param {string} elements: list of the element on which the class must be added
 * @param {string} type: specify if the class must be added or removed
 */
 const toggleClass = (classes, elements, type) => {
  if(classes.length && elements.length) {
    elements.forEach(el => {
      const element = document.querySelector(el);
      if(element) {
        classes.forEach(cls => type === 'add' ? element.classList.add(cls) : element.classList.remove(cls))
      }
    });
  }
}

const checkFieldError = (el) => {
  const target = el.target;
  if(target) {
    const action = (target.value && target.value.trim().length > 0) ? 'remove' : 'add';
    toggleClass(['-invalid'], ['#speech-text'], action);
    toggleClass(['-untouched'], ['#speech-text'], 'remove');
  } else {
    switch (el.id) {
      case 'language-options':
        const langAction = el.value === 'default-value' ? 'add' : 'remove';
        toggleClass(['-invalid'], ['#language-options'], langAction);
        toggleClass(['-untouched'], ['#language-options'], 'remove');
        break;
        
        case 'voice-options':
          const voiceAction = el && el.value ? 'remove' : 'add';
          toggleClass(['-invalid'], ['#voice-options'], voiceAction);
          toggleClass(['-untouched'], ['#voice-options'], 'remove');
        break;
    
      default:
        break;
    }

  }
  checkAllErrors();
}

const checkAllErrors = () => {
  const elements = document.querySelectorAll('.input-element');
  const errors = [];
  if(elements && elements.length > 0) {
    elements.forEach(el => {
      if(el.classList.contains('-invalid') || el.classList.contains('-untouched')) {
        errors.push(el);
      } 
    });
  }
  isButtonEnabled = errors.length === 0;
  if(isButtonEnabled) {
    button && button.removeAttribute('disabled');
  } else {
    button && button.setAttribute('disabled', true);
  }
}

const enableStepButton = (ev) => {
  const value = ev.target.value;
  const parent = ev.srcElement.parentElement;
  const btn = parent && parent.querySelector('button');
  if(value.trim() !== '') {
    btn && btn.removeAttribute('disabled');
  } else {
    btn && btn.setAttribute('disabled', 'true');
  }
}

const getSelectedLanguage = (ev) => {
  voices = synth.getVoices();
  const languageField = document.querySelector('#language-options');
  const voiceField = document.querySelector('#voice-options');
  const selectedLang = languageField && languageField.value;
  selectedLanguage = selectedLang;
  matchedVoices = voices && voices.filter(v => v.lang === selectedLang);
  selectedLaugageVoices = matchedVoices;
  getSubvoiceOptions(matchedVoices);
  voiceField && voiceField.removeAttribute('disabled');
  checkFieldError(languageField);
}


/**
 * populate subvoices select according to the selected voice
 * @param {object array} voices: list of voices
 */
const getSubvoiceOptions = (selectedVoices) => {
  const voiceOptionField = document.querySelector('#voice-options');
  if(voiceOptionField) {
    // non prendere il primo figlio di option
    const voiceOptionFieldChildren = voiceOptionField.querySelectorAll('option');
    voiceOptionFieldChildren && voiceOptionFieldChildren.forEach( child => voiceOptionField.removeChild(child));

    const voiceOptionBox = voiceOptionField.closest('.language-voice-box')
    voiceOptionBox && voiceOptionBox.classList.remove('-hidden');
    selectedVoices && selectedVoices.forEach(v => {
      const option = document.createElement("option");
      const optionText = v.name && v.name.split('(')[0];
      option.textContent = optionText;

      if (v.default) {
        option.textContent += " — DEFAULT";
      }
  
      option.setAttribute("data-lang", v.lang);
      option.setAttribute("data-name", v.name);
      voiceOptionField.appendChild(option);
    });
    getSelectedVoice(selectedVoices[0].name);
  }

  checkFieldError(voiceOptionField);
}

const getSelectedVoice = (ev) => {
  const voiceName = ev.target && ev.target.value || ev;
  matchedVoices && matchedVoices.forEach(v => {
    const itemName = v.name.split(' (')[0];
    if(itemName === voiceName) {
      selectedVoice = v.name;
      selectedVoiceObj = v;
    }
  });
}

const listenMessage = () => {
  let utterance = new SpeechSynthesisUtterance('Please enter an utterance and try me');
  const input = document.getElementById('speech-text');
  const inputValue = input && input.value;
  
  if(inputValue && inputValue.length > 0) {
    utterance = new SpeechSynthesisUtterance(inputValue);
  }
  utterance.voice = selectedVoiceObj;
  speechSynthesis.speak(utterance);
}

const goToNextStep = (nextStep) => {
  steps && steps.forEach(s => {
    const stepNumber = s.getAttribute('data-step')
    s.classList.add('-hidden');
    if(stepNumber == nextStep) {
      s.classList.remove('-hidden');
    }
  });
}
