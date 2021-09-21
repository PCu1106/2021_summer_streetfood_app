$(document).ready(function() {
    $('#login button[class="log"]').click((event) => {
        event.preventDefault()
        console.log("????????????????")

        $.post('./login', {
            account: $('#login input[name="username"]').val(),
            password: $('#login input[name="password"]').val()
        }, (data) => {
            if (data == 'jump')
                window.location.href = '../../templates/dist/homepage.html';
            else {
                console.log(data);
                $("#signin-output").html(`<p>${data}</p>`)
            }
        })
    })
});