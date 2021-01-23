//=================================================
//Para administracion
//=================================================
function SalirDeAdmi() {   
    fs.collection("Administracion").get().then((querySnapshot) => {       
        querySnapshot.forEach((doc) => {               
            fs.collection("Administracion").doc(doc.id).update({
                activo:false
            })
            .then(function() {
                //saltar al html                   
                window.location.href ="../admin/index.html";
            })
            .catch(function(error) {
                // el documento no existe?
                console.error("Error desconocido");
            })      
        });
    })
    
}

function InicioSecion() {
    const nombre = document.querySelector('#login-user').value;
    const contraseña = document.querySelector('#login-password').value;  
     event.preventDefault(); 
     
    fs.collection("Administracion").get().then((querySnapshot) => {       
        querySnapshot.forEach((doc) => {               
            if(doc.data().contraseña==contraseña &&
               doc.data().usuario==nombre){  
                fs.collection("Administracion").doc(doc.id).update({
                    activo:true
                })
                .then(function() {
                    //saltar al html                   
                    window.location.href ="../admin/crud.html";
                })
                .catch(function(error) {
                    // el documento no existe?
                    console.error("Error desconocido");
                })               
            }else{
                document.querySelector('.LoginError').innerHTML=`<p class="text-danger">ERROR DE USUARIO O CONTRASEÑA</p>`;
            }    
        });
    })
}
function ConfirmacionDeUsuario() {
    fs.collection("Administracion").get().then((querySnapshot) => {  
        var w=0;     
        querySnapshot.forEach((doc) => {                           
            if(doc.data().activo==false){  
                window.location.href ="../admin/index.html";
            }
        });
    });
}
//=================================================
function CerrarSesion() {
    firebase.auth().signOut().then(() => {
        console.log('Cerro Sesión');
    })
}
function AbrirPagina(id){    
    location.href = 'producto.html'+"#"+id;
}
function CargarInfo(){    
    MostrarNombreDeUsuario();
    fs.collection("Productos").doc(window.location.hash.substring(1)).get().then(function(docs) {
       document.querySelector('#infoProducto').innerHTML=`    
       <div class="container">
           <br>
           <div class="row">            
               <div class="col"><img id="imagen" src="${docs.data().Imagen}"/></div>
               <div class="col">
                   <h5>${docs.data().Nombre}</h5>
                   <h3>${docs.data().Precio}</h3>
                   <p>${docs.data().Descripcion}</p>
               </div>       
             </div>
             <br>
             <button type="button" class="btn btn-success" onclick="Comprar()">Comprar</button>
             <button type="button" class="btn btn-success" onclick="AñadirAlCarrito('${docs.id}')" >Añadir al Carrito</button>             
       </div>`        
    })
}
function cargarCarrito(){
    MostrarNombreDeUsuario();
    MostrarTotalAPagar();
    document.querySelector('.navbar-brand').innerHTML=window.location.hash.substring(1);
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var objetosYaEnCarrito=[];
            var contador=0;            
            const tablaProductos=document.querySelector('.informacionProductos');                    
            //Cargamos los datos previos del carrito del usuario
            fs.collection("Usuario").doc(user.email).get().then(function(docs){
                docs.data().carrito.forEach(element => {
                    objetosYaEnCarrito[contador]=element;                   
                    contador++;                    
                });                
                if (objetosYaEnCarrito.length){                    
                    let html='';                    
                    objetosYaEnCarrito.forEach(element => {                             
                        fs.collection("Productos").doc(element).get().then(function(docs){                           
                           html+=` <div class="container">
                           <br>
                           <div class="row">
                               <div class="col"><img id="imagen" src="${docs.data().Imagen}"/></div>
                               <div class="col">
                                   <h5>${docs.data().Nombre}</h5>
                                   <h3>${docs.data().Precio}</h3>
                                   <p>${docs.data().Descripcion}</p>
                               </div>       
                             </div>
                             <br>
                             <button type="button" class="btn btn-success" onclick="Comprar()">Comprar</button>
                             <button type="button" class="btn btn-danger" onclick="EliminarDelCarrito('${docs.id}')" >Eliminar</button>             
                       </div>`;
                       tablaProductos.innerHTML= html;                             
                        });
                                                            
                    });
                }else{
                    tablaProductos.innerHTML= `<p>No hay nada que mostrar</p>`
                }          
            });
        }
    });
}
function MostrarTotalAPagar(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var totalAPagar=0;
            var divTotalApagar=document.querySelector('.TotalAPagar');                   
            //Sumamos todo lo que hay en el carrito del usuario
            fs.collection("Usuario").doc(user.email).get().then(function(docs){
                if(docs.data().carrito.length){
                    docs.data().carrito.forEach(element => {                    
                        fs.collection("Productos").doc(element).get().then(function(producto){
                            totalAPagar+= parseFloat(producto.data().Precio);
                            divTotalApagar.innerHTML=` 
                            <div class="row">
                                <div class="col">
                                    <h5>Total a Pagar: ${totalAPagar}</h5>
                                </div>
                                <div class="col">
                                    <button type="button" class="btn btn-success btn-block" onclick="Comprar()">Pagar</button>
                                </div>                                                           
                            </div>
                            <br>`;
                        })  
                    }); 
                }else{
                    divTotalApagar.innerHTML="";
                }
                          
               
            });             
        }
    });
}
function EliminarDelCarrito(id){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {            
            var objetosYaEnCarrito=[];
            var contador=0;
            //Cargamos los datos previos del carrito del usuario
            fs.collection("Usuario").doc(user.email).get().then(function(docs){
                docs.data().carrito.forEach(element => {
                    if(id!=element){
                        objetosYaEnCarrito[contador]=element;
                        contador++;  
                    }else{
                        id=0;
                    }                                
                });                                           
                //Agrega los id de los productos al carrito del usuario
                fs.collection("Usuario").doc(user.email).set({    
                    Nombre:docs.data().Nombre,     
                    carrito:objetosYaEnCarrito,
                    registroDeCompras:docs.data().registroDeCompras
                   })
                   cargarCarrito()
            })
        } else {
             console.log("usuario nullo");                          
        }      
      });
      
}

function MostrarNombreDeUsuario(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {            
            fs.collection("Usuario").doc(user.email).get().then(function(docs) {               
                document.querySelector('.navbar-brand').innerHTML=docs.data().Nombre;
            });            
        } else {
            document.querySelector('.navbar-brand').innerHTML="Invitado";
        }      
    });
}
function Comprar(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {            
           alert("¡Funcion no disponible para demostracion! Esta funcion necesita conexiones especializadas a servicios bancarios, queda, por el momento, fuera de demostracion")
        } else {
             console.log("usuario nullo");       
             alert("¡Solo un usuario registrado puede ingresar objetos al carrito!");      
        }      
      });
}

function AñadirAlCarrito(idProducto){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {            
            var objetosYaEnCarrito=[];
            var contador=0;
            //Cargamos los datos previos del carrito del usuario
            fs.collection("Usuario").doc(user.email).get().then(function(docs){
                docs.data().carrito.forEach(element => {
                    objetosYaEnCarrito[contador]=element;
                    contador++;                    
                });                           
                objetosYaEnCarrito[contador]=idProducto;
                //Agrega los id de los productos al carrito del usuario
                fs.collection("Usuario").doc(user.email).set({    
                    Nombre:docs.data().Nombre,     
                    carrito:objetosYaEnCarrito,
                    registroDeCompras:docs.data().registroDeCompras
                   })
            })
            alert("Objeto añadido al carrito");
        } else {
             console.log("usuario nullo");     
             alert("¡Solo un usuario registrado puede ingresar objetos al carrito!");
        }      
      });
}
