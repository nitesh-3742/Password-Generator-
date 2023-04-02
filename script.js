const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set indicator color to gray
setIndicator("#ccc")


function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //hw... add color to slider
    const max = inputSlider.max;
    const min = inputSlider.min;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow  = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const ranInt = getRndInteger(0,symbols.length);
    return symbols.charAt(ranInt);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    }
    else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add('active');

    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
    
}

function shufflePassword(array){
    //shuffle yates method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })

    //Special condition

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{

    if(checkCount<=0)
        return;

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    
    //lets find new password

    //remove old password
    password="";

    //lets put the stuff mentioned by the checkboxes
    // if(upperCaseCheck.checked)
    //     password+=generateUpperCase();

    // if(upperCaseCheck.checked)
    //     password+=generateLowerCase();

    // if(upperCaseCheck.checked)
    //     password+=generateRandomNumber();

    // if(upperCaseCheck.checked)
    //     password+=generateSymbol();


    let funArr = [];

    if(upperCaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        funArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funArr.push(generateSymbol);

    //compulsary addition
    for(let i=0;i<funArr.length;i++)
    {
        password += funArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funArr.length;i++)
    {
        let randIndex = getRndInteger(0,funArr.length);
        password += funArr[randIndex]();
        
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show password
    passwordDisplay.value=password;

    //calculate strength
    calcStrength();
    
});

