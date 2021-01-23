//================================================================
// Script escrito por: Ricardo Apuy 
// Finalidad: Controlar el funcionamiento de lectura y escritura
// Diciembre 2020 para el proyecto Your Store!
//===============================================================
//Collecion donde almacena los productos
const Producto="Productos";
const DirecotorioImagenes="imagenesDeProductos/";
function OptenerParametros(){
    var mProducto= new Object();
    mProducto.Nombre=document.querySelector('#NombreProducto').value;
    mProducto.DescripcionCorta=document.querySelector('#DescripcionCorta').value;
    mProducto.DescripcionLarga=document.querySelector('#DescripcionLarga').value;
    mProducto.Precio=document.querySelector('#Precio').value;
    mProducto.ImagenPrincipal=document.querySelector('#ImagenPrincipal').value;
    mProducto.ImagenSecundaria=document.querySelector('#VectorImagenes').value;
    return mProducto;
}
function SubirImagenesFirbase(){
    var imagen = document.querySelector('#fichero').files[0];
    var nombreImagen=DirecotorioImagenes+imagen.name+new Date();
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
}
function AgregarPorducto(){
    SubirImagenesFirbase();
    var producto=OptenerParametros();
    fs.collection(Productos).add({
        Nombre=producto.Nombre,
        DescripcionCorta=producto.DescripcionCorta,
        DescripcionLarga=producto.DescripcionLarga,
        Precio=producto.Precio,
        ImagenPrincipal=producto.ImagenPrincipal,
        ImagenSecundaria=producto.ImagenSecundaria
    })



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
        



}
//===============================================================
//Eliminar
//===============================================================
function EliminarProducto(id){
    event.preventDefault();
    //Elimina la imagen    
    var docRef = fs.collection(Producto).doc(id);    
    docRef.get().then(function(docs) {          
        var desertRef = storageRef.child(docs.data().NombreImagen);    
        desertRef.delete().then(function() {
            console.log("Imagen eliminada");
            //Se da orden de eliminar la informacion una vez que la imagen ha sido elimianada
            EliminarInformacion(id)
        }).catch(function(error) {
            console.log("Error a la hora de eliminar la imagen"+error);
        });
    }).catch(function(error) {
        console.log("Error al obtener el documento:", error);
    });  

}
function EliminarInformacion(id){
    //Elimina la informacion de la colleccion
    fs.collection(Producto).doc(id).delete().then(function() {
    console.log("Documento eliminado correctamente");
    //$('#EliminarProductos').modal('hide');          
    ActualizarDatosEnPantalla();    
    }).catch(function(error) {
        console.error("Error al intentar eliminar el documento: ", error);
    });
}
function ActualizarDatosEnPantalla(){
    fs.collection(Producto).get().then((snapshot)=>{            
      //  muestraProductos(snapshot.docs)
    }) 
}