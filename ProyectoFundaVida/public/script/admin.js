//===================================================
//Logica para agregar productos
//===================================================
const agregar=document.querySelector('#agregar-form');
agregar.addEventListener('submit',(e)=>{
    e.preventDefault();
    const nombre = document.querySelector('#NombreProducto').value;
    const descripcion = document.querySelector('#Descripcion').value;
    const precio = document.querySelector('#Precio').value;
    
    subirImagenesFirbase(nombre,descripcion,precio);
    document.querySelector('.progress-bar-animated').innerHTML='';
});
const SubirDoc=(Url,nombre,descripcion,precio,nombreImagen)=>{    
    fs.collection("Productos").add({
        Descripcion:descripcion,
        Imagen:Url,
        NombreImagen:nombreImagen,
        Nombre:nombre,
        Precio:precio
    })
    .then(function(docRef) {
        console.log("Documento creado con el id: ", docRef.id);
         //Limpia el form
         agregar.reset();  
         document.querySelector('.progress').innerHTML=
        `<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width:0"></div>`;
         actualizarDatosEnPantalla();                         
    })
    .catch(function(error) {
        console.error("Error al crear el documento: ", error);
    });
}
const subirImagenesFirbase=function(nombre,descripcion,precio) {
    var imagen = document.querySelector('#fichero').files[0];
    var nombreImagen="imagenesDeProductos/"+imagen.name+new Date();
    console.log("el nombre es: "+nombreImagen);
    var uploadTask = storageRef.child(nombreImagen).put(imagen);        
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed();
      console.log('Subiendo ' + progress + '% terminado');
      if(progress==100){
        document.querySelector('.progress').innerHTML=
        `<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${progress+'%'}">¡Listo!</div>`;
      }else{
        document.querySelector('.progress').innerHTML=
        `<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${progress+'%'}">${progress+'%'}</div>`;
      }
     
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('La subida esta pausada');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Corriendo subida...');
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {        
        console.log('Link de la imagen: ', downloadURL);
        SubirDoc(downloadURL,nombre,descripcion,precio,nombreImagen);
      });
    }); 
   
    }
//===================================================
//Logica para editar
//===================================================
const CargarModalParaEditar=id=>{
    var docRef = fs.collection("Productos").doc(id);
    event.preventDefault();    
    docRef.get().then(function(docs) {         
        document.querySelector('.editar').innerHTML=
        `<div class="modal fade" id="EditarProductos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Agregar Producto</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="agregar-form">
                            <div class="form-grup">
                                <input type="text" id="NombreProducto-Editar" class="form-control" value="${docs.data().Nombre}" required><br>
                            </div>
                            <div class="form-grup">
                                <textarea  type="text" id="Descripcion-Editar" class="form-control"  required>${docs.data().Descripcion}</textarea><br>
                            </div>
                            <div class="form-grup">
                                <input type="number" min="0" id="Precio-Editar" class="form-control"  value="${docs.data().Precio}" required><br>
                            </div>
                            <div class="form-grup">
                                <input type="text" id="Imagen-Editar" class="form-control"  value="${docs.data().Imagen}" required><br>
                            </div>
                            <div class="form-grup">
                                <p id="AgregarProductoError-error"  class="text-danger"></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                <button type="submit" class="btn btn-primary" onclick="Editar('${docs.id}')" >Editar</button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>`
        $('#EditarProductos').modal('show');
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });  
}
const Editar=id=>{    
    event.preventDefault();
    const nombre = document.querySelector('#NombreProducto-Editar').value;
    const descripcion = document.querySelector('#Descripcion-Editar').value;
    const precio = document.querySelector('#Precio-Editar').value;
    const imagen = document.querySelector('#Imagen-Editar').value;    
    fs.collection("Productos").doc(id).set({
        
        Descripcion:descripcion,
        Imagen:imagen,
        Nombre:nombre,
        Precio:precio
        
    })
    .then(function() {
        console.log("Documento editado con el id: ", id);    
        $('#EditarProductos').modal('hide');  
        actualizarDatosEnPantalla();                     
    })
    .catch(function(error) {
        console.error("Error al crear el documento: ", error);
    });
}
//===================================================
//Logica para eliminar
//===================================================
const CargarModalParaEliminar=id=>{
    var docRef = fs.collection("Productos").doc(id);
    event.preventDefault();    
    docRef.get().then(function(docs) {         
        document.querySelector('.eliminar').innerHTML=
        `<div class="modal fade" id="EliminarProductos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">¿Esta seguro que quieres eliminarlo?</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-footer">                                              
                        <form id="agregar-form">                                               
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="submit" class="btn btn-danger" onclick="Eliminar('${docs.id}')" >¡ELIMINAR!</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>`
        $('#EliminarProductos').modal('show');
    }).catch(function(error) {
        console.log("Error getting document:", error);
      
    });  
}
const Eliminar=id => {
    event.preventDefault();
    //Elimina la imagen    
    var docRef = fs.collection("Productos").doc(id);    
    docRef.get().then(function(docs) {   
        console.log(i);
        var desertRef = storageRef.child(docs.data().NombreImagen);    
        desertRef.delete().then(function() {
            console.log("Imagen eliminada");
            eliminarData(id);
        }).catch(function(error) {
            console.log("Error a la hora de eliminar la imagen"+error);
        });
    }).catch(function(error) {
        console.log("Error al obtener el documento:", error);
    });  
}
const eliminarData=id=>{
  //Elimina la informacion
  fs.collection("Productos").doc(id).delete().then(function() {
    console.log("Documento eliminado correctamente");
    $('#EliminarProductos').modal('hide');          
    actualizarDatosEnPantalla();    
    }).catch(function(error) {
        console.error("Error al intentar eliminar el documento: ", error);
    }); 
}
//===================================================
//Muestra los datos de la base de datos
//===================================================
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
            <div class="row list-group-item">		                
                    <img id="imagen" src="${docs.data().Imagen}" />
                    <h5>${docs.data().Nombre}</h5>
                    <h3>${docs.data().Precio}</h3>
                    <p>${docs.data().Descripcion}</p>
                    <button type="button" class="btn btn-info" onclick="CargarModalParaEditar('${docs.id}')">Editar</button>
                    <button type="button" class="btn btn-danger"onclick="CargarModalParaEliminar('${docs.id}')">Eliminar</button>	               	
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
    }else{
        tablaProductos.innerHTML = `<br><div class= "container border">No hay informacion que mostrar</div>`;
    }
}
function actualizarDatosEnPantalla(){
    fs.collection('Productos').get().then((snapshot)=>{            
    muestraProductos(snapshot.docs)
    }) 
}
fs.collection('Productos')
        .get()
        .then((snapshot)=>{            
            muestraProductos(snapshot.docs)
        })            
//===================================================