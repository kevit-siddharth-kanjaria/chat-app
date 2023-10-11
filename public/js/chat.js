const socket = io()

const $messageForm = document.querySelector('#message-form') // the '$' is just for convention to show this is an element from the DOM
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate,{
        message:msg
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.on('locationMessage',(url)=>{
    console.log(url);
    const html = Mustache.render(locationMessageTemplate,{
        url:url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const msg = e.target.elements.message.value //document.querySelector('input').value

    socket.emit('sendMessage', msg, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }

        console.log("Msg delivered!");
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported in your browser.")
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            long: position.coords.longitude,
            lat: position.coords.latitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log("Location shared");
        })
    })
})
