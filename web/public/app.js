$('#navbar').load('navbar.html');
$('#footer').load('footer.html')

const API_URL = 'https://217545902-sit-209.now.sh/api';

const responseUsers = $.get(`${API_URL}/users`)
.then(responseUsers => {
    responseUsers.forEach(user => {
    $('#users tbody').append(`
        <tr>
            <td>${user.user}</td>
            <td>${user.password}</td>
        </tr>`
        );
    });
})
.catch(error => {
    console.log(`Error: ${error}`);
});

$('#add-device').on('click', function() {   
    const user = $('#user').val();   
    const name = $('#name').val();   
    const sensorData = [];

    const body = {
        name,
        user,
        sensorData
    };

    $.post(`${API_URL}/devices`, body)
    .then(response => {
        location.href = '/'; 
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
});

$('#new-user').on('click', function() {   
    const username = $('#username').val();   
    const password = $('#password').val();
    const confirmpassword = $('#confirmpassword').val();

    if (password == confirmpassword){
       $.post(`${API_URL}/register`, { username, password })
       .then((response)=>{
            if (response.success){
                location.href = '/';
            }else{
                $('#message').append(`<p class="alert alert-danger".${response}</p>`);
            }
        });
    }else{
        location.href = '/users';
    }
}); 

$('#send-command').on('click', function() {   
    const command = $('#command').val();   
    const deviceId = $('#deviceId').val(); 

    $.post(`http://localhost:5001/send-command`, {command, deviceId})
}); 

$('#login').on('click', () =>{
    const user = $('#username').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) => {
        if (response.success==true) {
            localStorage.setItem('user', user);
            localStorage.setItem('isAdmin', response.isAdmin);
            location.href = '/';
        }else{
            $('#message').append(`<p class="alert alert-danger".${response}</p>`);
        }
    });
    localStorage.setItem('user', user);
    location.href = '/'
}); 

const currentUser = localStorage.getItem('user');
if (currentUser){
    $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
        response.forEach((device) => {
            $('#devices tbody').append(`
            <tr data-device-id=${device._id}>
                <td>${device.user}</td>
                <td>${device.name}</td>
            </tr>`
            );
        });
        $('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            $.get(`${API_URL}/devices/${deviceId}/device-history`)
            .then(response => {
                response.map(sensorData => {
                    $('#historyContent').append(`
                        <tr>
                            <td>${sensorData.ts}</td>
                            <td>${sensorData.temp}</td>
                            <td>${sensorData.loc.lat}</td>
                            <td>${sensorData.loc.lon}</td>
                        </tr>
                    `);
                });
                $('#historyModal').modal('show');
            });
        });
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });
}

$('#log-out').on('click', function() {   
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user');
    location.href = '/login';
}); 