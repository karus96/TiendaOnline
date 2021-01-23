// Registro de usuario
const signupForm=document.querySelector('#signup-form');
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;    
    const nombre=document.querySelector('#login-nombre').value;
firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential=>{
            //Limpia el form
            signupForm.reset();
            //Cierra el modal
            $('#signupModal').modal('hide');
            //Crea el documento de usuario
            fs.collection("Usuario").doc(email).set({
                Nombre:nombre,
                carrito: [],
                registroDeCompras:[]
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
            console.log('Usuario agregado con exito');
            document.querySelector('#signup-error').innerHTML='';
        },
        userCredentialFaill=>{
            console.log('Error de correo o contraseña');            
            document.querySelector('#signup-error').innerHTML=  'El correo ya esta registrado o la contraseña es menor de 6 caracteres<br> Vuelva a intentarlo';                      
        })
});
//===================================================
//Logica de ingreso de usaurio
//===================================================
const signinForm=document.querySelector('#login-form');
signinForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(userCredential=>{            
            MostrarNombreDeUsuario();
            //Limpia el form
            signupForm.reset();
            //Cierra el modal
            $('#signinModal').modal('hide');
            console.log('Usuario ingreso correctamente');
        
            document.querySelector('#signin-error').innerHTML='';
        },
        userCredentialFaill=>{
            console.log('Error de correo o contraseña');            
            document.querySelector('#signin-error').innerHTML=  'Error de correo o contraseña<br> Vuelva a intentarlo';                      
        })
});

//logout
const logout=document.querySelector('#logout');
logout.addEventListener('click', e=>{
    e.preventDefault();
    firebase.auth()
    .signOut().then(()=>{
        console.log('Cerro Sesión');
        document.querySelector('.navbar-brand').innerHTML='Invitado';
    })
})
const tablaProductos=document.querySelector('.informacionProductos');
const muestraProductos=data =>{
    if(data.length){
        let html='';
        var contador=0;
        //Mostrar muchos datos repetidos
        data.forEach(docs => {
            var li='';
            if(contador==0){
                li= `<tr>`
            }
            li= `
            <th>
            <div class="row">		
                <button onclick="AbrirPagina('${docs.id}')" class="list-group-item list-group-item-action">
                    <img id="imagen" src="${docs.data().Imagen}" />
                    <h5>${docs.data().Nombre}</h5>
                    <h3>${docs.data().Precio}</h3>
                    <p>${docs.data().Descripcion}</p>
                </button>
            </div>
          </th>` ;
          if(contador==5){
            li= `</tr>`;
          }
          contador++
            html +=li;
            if(contador==6){
                contador=0;
            }
        });
        if(contador<1||contador>=5){
            html+= `</tr>` ;
        }        
        tablaProductos.innerHTML = html;
    }
}
fs.collection('Productos')
        .get()
        .then((snapshot)=>{            
            muestraProductos(snapshot.docs)
        });

