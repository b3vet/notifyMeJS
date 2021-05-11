function handleSubmit() {
    var message = $('#url').val()
    var telegram_bot_id = $('#botid').val()
    var chat_id = $('#chatid').val()

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.telegram.org/" + telegram_bot_id + "/sendMessage",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    "data": JSON.stringify({
      "chat_id": chat_id,
      "text": message
    })
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    console.log("ive sent the message")
  }); 
}
