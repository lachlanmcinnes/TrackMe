$('#navbar').load('navbar.html');
$('#footer').load('footer.html')

const devices = JSON.parse(localStorage.getItem('devices')) || []; 
const users = JSON.parse(localStorage.getItem('users')) || []; 


devices.forEach(function(device) {   
    $('#devices tbody').append(`    
        <tr>       
            <td>${device.user}</td>       
            <td>${device.name}</td>     
        </tr>`   
    ); 
});

users.forEach(function(user) {
    $('#users tbody').append(`
        <tr>
            <td>${user.username}</td>
            <td>${user.password}</td>
        </tr>`
    );
});

$('#add-device').on('click', function() {   
    const user = $('#user').val();   
    const name = $('#name').val();   
    devices.push({ user, name });   
    localStorage.setItem('devices',JSON.stringify(devices));
    location.href = '/'; 
})

$('#new-user').on('click', function() {   
    const user = $('#username').val();   
    const password = $('#password').val();
    const confirmpassword = $('#confirmpassword').val();

    const exists = users.find((user) => {
        return user.username === username;
    });

    if (password == confirmpassword){
        if (exists == undefined){
            users.push({username,password});
            localStorage.setItem('users',JSON.stringify(users));
            location.href = '/user-list';
        }else{
            location.href = '/user-list';
        }
    }else{
        location.href = '/user-list';
    }

}); 

$('#send-command').on('click', function() {   
    const command = $('#command').val();   
    console.log(`command is: ${command}`); 
    location.href = '/';
}); 

$('#log-in').on('click', function() {      
    const username = $('#username').val();   
    const password = $('#password').val();

    const foundIndex = users.findIndex((user) => {
        return user.username === username;
    });

    const u = users[foundIndex].username
    const p = users[foundIndex].password

    if(u == username && p == password){
        localStorage.setItem('isAuthenticated',true)
        location.href = '/';
    };
}); 

const logout = () => {
    localStorage.removeItem('isAuthenticated');
    location.href = '/login';
}