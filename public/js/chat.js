// initialize socket
const socket = io()

//elements
const $messageForm = document.querySelector('#message-form') // the '$' is just for convention to show this is an element from the DOM
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//autoscroll
const autoscroll=()=>{
     //New message element
     const $newMessage = $messages.lastElementChild

     //height of the new message
     const newMessageStyles = getComputedStyle($newMessage)
     const newMessageMargin = parseInt(newMessageStyles.marginBottom)
     const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
 
     //visible height
     const visibleHeight = $messages.offsetHeight
 
     //height of messages container
     const containerHeight = $messages.scrollHeight
 
     //how far have I scrolled ?
     const scrollOffset = $messages.scrollTop + visibleHeight
 
     if(containerHeight - newMessageHeight <= scrollOffset){
         $messages.scrollTop = $messages.scrollHeight
     } 
}

// message sockets
socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (msg) => {
    console.log(msg);
    const html = Mustache.render(locationMessageTemplate, {
        username: msg.username,
        url: msg.url,
        createdAt: moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData',({room, users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

//button events listeners
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

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})