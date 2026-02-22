const steps = document.querySelectorAll('.step');
const progress = document.querySelector('.progress-fill');

let currentStep = 0;
let timerInterval;

// ---------- Step Navigation ----------
function goToStep(index){
  steps[currentStep].classList.remove('step-active');
  currentStep = index;
  steps[currentStep].classList.add('step-active');
  progress.style.width = `${index/(steps.length-1)*100}%`;
}

// ---------- Step 1 : Phone ----------
const phoneInput = document.getElementById('phone');
const sendPhoneBtn = document.getElementById('sendPhone');

sendPhoneBtn.disabled = true;

phoneInput.addEventListener('input',()=>{
  phoneInput.value = phoneInput.value.replace(/[^0-9]/g,'');
  sendPhoneBtn.disabled = !/^09\d{9}$/.test(phoneInput.value);
});

phoneInput.addEventListener('keydown', e => {
  if(e.key === 'Enter' && !sendPhoneBtn.disabled){
    sendPhoneBtn.click();
  }
});

sendPhoneBtn.addEventListener('click',()=>{
  sendPhoneBtn.classList.add('loading');

  setTimeout(()=>{
    sendPhoneBtn.classList.remove('loading');
    goToStep(1);
    startOtpTimer();
    otpInputs[0].focus();
  },800); // شبیه‌سازی ارسال واقعی
});

// ---------- Step 2 : OTP ----------
const otpInputs = document.querySelectorAll('.otp-group input');
const verifyBtn = document.getElementById('verifyOtp');
const otpError = document.getElementById('otpError');
const timerEl = document.getElementById('timer');
const resendBtn = document.getElementById('resend');

verifyBtn.disabled = true;

otpInputs.forEach((input,idx)=>{
  input.addEventListener('input',()=>{
    input.value = input.value.replace(/[^0-9]/g,'');
    if(input.value && idx < otpInputs.length-1){
      otpInputs[idx+1].focus();
    }
    verifyBtn.disabled = ![...otpInputs].every(i=>i.value);
  });

  input.addEventListener('keydown',e=>{
    if(e.key==='Backspace' && !input.value && idx>0){
      otpInputs[idx-1].focus();
    }
  });
});

otpInputs.forEach((input)=>{
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter' && !verifyBtn.disabled){
      verifyBtn.click();
    }
  });
});

// ---------- Verify OTP ----------
verifyBtn.addEventListener('click',()=>{
  verifyBtn.classList.add('loading');
  otpError.textContent = '';

  setTimeout(()=>{
    const fakeSuccess = Math.random() > 0.3;

    verifyBtn.classList.remove('loading');

    if(fakeSuccess){
      goToStep(2);
      clearInterval(timerInterval);
    }else{
      otpError.textContent = 'کد وارد شده نادرست است';
      steps[currentStep].classList.add('shake');
      setTimeout(()=>steps[currentStep].classList.remove('shake'),300);
    }
  },800);
});

// ---------- Timer ----------
function startOtpTimer(duration = 120){
  let time = duration;
  resendBtn.disabled = true;

  clearInterval(timerInterval);

  timerInterval = setInterval(()=>{
    const m = String(Math.floor(time/60)).padStart(2,'0');
    const s = String(time%60).padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;

    if(time-- <= 0){
      clearInterval(timerInterval);
      resendBtn.disabled = false;
    }
  },1000);
}

// ---------- Resend ----------
resendBtn.addEventListener('click',()=>{
  otpInputs.forEach(i=>i.value='');
  verifyBtn.disabled = true;
  otpError.textContent = '';
  startOtpTimer();
  otpInputs[0].focus();
});
function goToStep(index){
  // اضافه کردن انیمیشن کارت
  const card = document.querySelector('.flow-card');
  card.classList.add('step-change');
  setTimeout(()=>card.classList.remove('step-change'),400);

  // تغییر Step
  steps[currentStep].classList.remove('step-active');
  currentStep = index;
  steps[currentStep].classList.add('step-active');

  // تغییر Progress bar
  progress.style.width = `${index/(steps.length-1)*100}%`;

  // تغییر کلاس body برای بک‌گراند واکنش‌گرا
  document.body.classList.remove('step-1','step-2','step-3');
  document.body.classList.add(`step-${index+1}`);
}
document.querySelectorAll('button').forEach(btn=>{
  btn.addEventListener('mousedown',()=>{
    btn.style.transform = 'scale(0.97)';
  });
  btn.addEventListener('mouseup',()=>{
    btn.style.transform = 'scale(1)';
  });
});
