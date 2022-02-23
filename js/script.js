async function sha256(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const removeNoti = () => {
  document.getElementById("notiBanner").remove();
  document.getElementById("notiButton").remove();
};

const checkNoti = (ev) => {
  if (Notification.permission !== "granted") {
    document.getElementById("trackButton").disabled = true;
  } else {
    removeNoti();
  }
};

const handleNotificationPermissionChange = async () => {
  if (!("Notification" in window)) {
    alert(
      "this browser does not support notifications. this feature is not gonna work!"
    );
  } else {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      document.getElementById("trackButton").disabled = false;
      removeNoti();
    }
  }
};

const sendMail = async (url, email) => {
  const response = await fetch({
    url: "https://notify-me-email-service.herokuapp.com/sendmail",
    body: { url, to: email},
    method: "POST",
  })
  if (response?.status === 400) {
    alert("could not send the mail but something changed yeah")
  }
};

const sendNotification = (url) => {
  var text = `HEY! something changed in the URL: ${url}`;
  var notification = new Notification("CHANGE IN URL", { body: text });
  notification.addEventListener("show", async (ev) => {
    setTimeout(() => {
      notification.close();
    }, 5000);
  });
};

const getHashOfURL = async (url) => {
  const response = await fetch("https://notify-me-proxy.herokuapp.com/",{
    headers: [
      ["Target-URL", url] 
    ]
  });
  const responseText = await response.text();
  try {
    return sha256(responseText);
  } catch {
    throw new Error("Cannot hash");
  }
};

const handleSubmit = async (e, url, email) => {
  e.preventDefault();
  document.getElementById("results").innerText =
    "starting the track process...\n";

  const initHash = await getHashOfURL(url);
  await sleep(8000);
  while (true) {
    const hash = await getHashOfURL(url);
    if (hash !== initHash) {
      //something changed
      document.getElementById("results").innerText +=
        "SOMETHING CHANGED IN THE URL: " + url;
      if (email) {
        await sendMail(url, email);
      }
      sendNotification(url);
      return;
    } else {
      document.getElementById("results").innerText +=
        "nothing is changed. Trying again in 8 seconds.\n";
    }
    await sleep(8000);
  }
};
