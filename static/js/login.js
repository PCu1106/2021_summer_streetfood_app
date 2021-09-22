$(document).ready(function() {
    $('#login button[class="log"]').click((event) => {
        event.preventDefault()

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

    $('#login button[class="reg"]').click(function(){
        event.preventDefault();
        let login_page = $("form#login");
        let signup_page = $("form#register");
        login_page.css("display", "none");
        signup_page.css("display", "block");
    });

    $('#register button[class="create"]').click((event) => {
        event.preventDefault();
        $.post("./register", {
            account: $('#register input[name="re_username"]').val(),
            password: $('#register input[name="re_password"]').val(),
            passwordagain: $('#register input[name="re_passwordagain"]').val()
        }, (data) => {
            // Assume success LOL
            $("#register-output").html(`<p>${data}</p>`)

            // Go back to main page
            console.log(data);
            
            if(data=='註冊成功！將為您跳轉到登入畫面'){
                setTimeout(function(){
                    let login_page = $("form#login");
                    let signup_page = $("form#register");
                    login_page.css("display", "block");
                    signup_page.css("display", "none");
                },3000);
            }
            
        });
    });
});