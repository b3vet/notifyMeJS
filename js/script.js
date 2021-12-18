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

const checkNoti = (ev) => {
  if (Notification.permission !== "granted") {
    document.getElementById("trackButton").disabled = true;
  } else {
    document.getElementById("notiBanner").remove()
    document.getElementById("notiButton").remove()
  }
};

const handleNotificationPermissionChange = async () => {
  if (!("Notification" in window)) {
    alert(
      "This browser does not support notifications. This feature is not gonna work!"
    );
  } else {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      document.getElementById("trackButton").disabled = false;
    }
  }
};

const sendMail = (url, email) => {
  console.log("mail is", email);
  Email.send({
    Host: "smtp.yandex.com:465",
    Username: "thisismydummymail",
    Password: "decsix-Jegsaz-xocjy7",
    To: email,
    From: "notifyMe@js.com",
    Subject: `Something changed in the url: ${url}`,
    Body: "GO CHECK THE URL NOW! SOMETHING CHANGED! " + url,
  }).then((message) => alert(message));
};

const sendNotification = (url) => {
  var text = `HEY! Something changed in the URL: ${url}`;
  var notification = new Notification('CHANGE IN URL', { body: text });
  notification.addEventListener('show', async (ev) => {
    setTimeout(() => {
      notification.close()
    }, 5000)
  })
}

const getHashOfURL = async (url) => {
  const response = await fetch(
    "https://agile-earth-77295.herokuapp.com/" + url
  );
  const responseText = await response.text();
  try {
    return sha256(responseText);
  } catch {
    throw new Error("Cannot hash");
  }
};

const handleSubmit = async (url, email) => {
  document.getElementById("results").innerText =
    "Starting the track process...\n";

  const initHash = await getHashOfURL(url);
  await sleep(8000);
  while (true) {
    const hash = await getHashOfURL(url);
    if (hash !== initHash) {
      //something changed
      document.getElementById("results").innerText +=
        "SOMETHING CHANGED IN THE URL: " + url + " \nSending mail to NOTIFY!\n";
      //sendMail(url, email);
      sendNotification(url)
      return;
    } else {
      document.getElementById("results").innerText +=
        "Nothing is changed. Trying again in 8 seconds.\n";
    }
    await sleep(8000);
  }
};
