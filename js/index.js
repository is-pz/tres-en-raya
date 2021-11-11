var turno = 0;
var arregloTablero = new Array(9);
var celdas = document.getElementsByClassName("celda");
var movimientoMaquina;
var letraX = "X", letraO = "O";
var imagenGato;
var urlImagenUsuario = "img/Usuario.png";
var urlImagenMaquina = "img/Maquina.png";
var partidasGanadasUsuario = 0, partidasGanadasMaquina = 0;
var Ganador = false, partidaEmpatada = false;
var Nombre;
var soundGameOver = new Audio('sounds/Pacman(GameOver).mp3');
var soundMoneda = new Audio('sounds/SuperMarioBrosEfectoMoneda.mp3');
var soundEmpate = new Audio('sounds/MarioBrosmuere.mp3');

//Funcion que reinicia el tablero
function reiniciarJuego(){
    document.getElementById("turno").innerHTML ="Tú turno de marcar...";
    turno = 0;
    Ganador = false;
    partidaEmpatada = false;
    var contadorCeldas = 0;
    //Permite agregar nuevamente el evento escucha del tablero ademas de que regresa el color original y quita las imagenes
    while(contadorCeldas < celdas.length){
        arregloTablero[contadorCeldas] = " ";
        celdas[contadorCeldas].addEventListener("click", gato);
        celdas[contadorCeldas].style.background = "#00a896";
        imagenGato = document.getElementById("imagen"+ (contadorCeldas + 1));
        imagenGato.removeAttribute("src");
        contadorCeldas++;
    }
}

//Funcion que verificar si hay un hanador y tambien verifica si hay un empate
function ganador(letra){
    if(
    (arregloTablero[0] == letra && arregloTablero[1] == letra && arregloTablero[2] == letra )  || 
    (arregloTablero[3] == letra && arregloTablero[4] == letra && arregloTablero[5] == letra )  || 
    (arregloTablero[6] == letra && arregloTablero[7] == letra && arregloTablero[8] == letra )  || 
    (arregloTablero[0] == letra && arregloTablero[3] == letra && arregloTablero[6] == letra )  ||
    (arregloTablero[1] == letra && arregloTablero[4] == letra && arregloTablero[7] == letra )  || 
    (arregloTablero[2] == letra && arregloTablero[5] == letra && arregloTablero[8] == letra )  ||
    (arregloTablero[0] == letra && arregloTablero[4] == letra && arregloTablero[8] == letra )  || 
    (arregloTablero[2] == letra && arregloTablero[4] == letra && arregloTablero[6] == letra )) {
        if(letra == letraX){
            Swal.fire(
                'Ganador!',
                Nombre +' Haz Ganado!',
                'success'
            );
            turno = 0;
            soundMoneda.play();
            Ganador = true;
            setTimeout(reiniciarJuego, 300);
            partidasGanadasUsuario++;
            if (Nombre == null || Nombre == ""){
                document.getElementById("jugador").innerHTML = "Puntos Desconocido : " + partidasGanadasUsuario;
            }else{
                document.getElementById("jugador").innerHTML = "Puntos "+ Nombre +": " + partidasGanadasUsuario;
            }    
        }else if(letra == letraO){
            Swal.fire(
                'Ganador!',
                'La Maquina Ha Ganado!',
                'warning'
            );
            turno = 0;
            soundGameOver.play();
            Ganador = true;
            setTimeout(reiniciarJuego, 300);
            partidasGanadasMaquina++;
            document.getElementById("maquina").innerHTML = "Puntos Máquina: " + partidasGanadasMaquina;
        }
    }else if(turno >= 9 && Ganador == false){
        console.log("empate");
        soundEmpate.play();
        Swal.fire(
            'Uups!',
            'Es un empate!',
            'info'
        );
        partidaEmpatada = true;
        setTimeout(reiniciarJuego, 300);
    }
}

//Verifica que la celda seleccionada por la maquina este disponible
function celdaVacia(celdaSeleccionada){
    var celdaAOcupar = document.getElementById("c" + celdaSeleccionada); 
    if(arregloTablero[celdaSeleccionada - 1] == letraX || arregloTablero[celdaSeleccionada - 1] == letraO){
        movimientoMaquina = Math.floor(Math.random() * 9) + 1;
        celdaVacia(movimientoMaquina);  
        
    }else{
        document.getElementById("turno").innerHTML ="Tú turno de marcar...";
        imagenGato = document.getElementById("imagen" + celdaSeleccionada );
        imagenGato.src = urlImagenMaquina; 
        celdaAOcupar.style.background="#354f52";
        celdaAOcupar.removeEventListener("click",gato);
        arregloTablero[celdaSeleccionada - 1] = letraO;
        turno++;
        ganador(letraO);
    }
}

//Funcion que otorga el lugar donde se marcara la celda departe de la maquina
function maquina(){
    if(partidaEmpatada == false){  
        movimientoMaquina = Math.floor(Math.random() * 9) + 1;
        celdaVacia(movimientoMaquina);
    }
}

//Funcion para detectar la celda seleccionada por el usuario y marcarla 
function gato(evento){
    document.getElementById("turno").innerHTML ="Tú turno de marcar...";
    var celda = evento.target;
    var idCelda = evento.target.id;
    var posicionMarcada = idCelda[1]-1;
    document.getElementById("turno").innerHTML ="Turno de la maquina de marcar...";
    imagenGato = document.getElementById("imagen"+ (posicionMarcada + 1));
    imagenGato.src = urlImagenUsuario; 
    arregloTablero[posicionMarcada] = letraX;
    celda.style.background = "#05668d";
    celda.removeEventListener("click",gato);
    turno++;
    ganador(letraX);
    setTimeout(maquina, 400);
}
//Funcion para agregar el evento de escucha a las celdas del tablero
function cargarJuego(){
    var contadorCeldas = 0;
    while(contadorCeldas<celdas.length){
        celdas[contadorCeldas].addEventListener("click", gato);
        contadorCeldas++;
    }
}

//Funcion para pedir el nombre del usuario
(async () => {
    var { value: nombreUsaurio } = await Swal.fire({
      title: 'Ingrese su nombre',
      input: 'text',
      showCancelButton: false,
    })
    if (nombreUsaurio) {
        Nombre = nombreUsaurio;
        document.getElementById("jugador").innerHTML = "Puntos "+ nombreUsaurio +": 0";
    }else{
        document.getElementById("jugador").innerHTML = "Puntos Desconocido : 0";
    }    
})()

//Funcion que permite inicialiar la escucha de los eventos del tablero
window.addEventListener("load", cargarJuego);
