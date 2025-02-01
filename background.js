chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
  scheduleDailyProblems();
});

function scheduleDailyProblems() {
  const today = new Date().getDay();
  if (today === 6 || today === 0) {
    pickRandomProblems();
  } else {
    pickSequentialProblems();
  }
}

function pickSequentialProblems() {
  console.log("Selecting sequential problems...");
}

function pickRandomProblems() {
  console.log("Selecting random problems...");
}
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});
