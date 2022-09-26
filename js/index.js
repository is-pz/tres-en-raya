let turno = 0;
let arregloTablero = new Array(9);
let celdas = document.querySelectorAll(".celda");
let movimientoMaquina;
let letraX = "X", letraO = "O";
let imagenGatoParaTablero;
let urlImagenUsuario = "img/Usuario.png", urlImagenMaquina = "img/Maquina.png";
let partidasGanadasUsuario = 0, partidasGanadasMaquina = 0;
let Ganador = false, partidaEmpatada = false;
let nickNameUser;
let soundGameOver = new Audio('sounds/Pacman(GameOver).mp3'), soundWin = new Audio('sounds/SuperMarioBrosEfectoMoneda.mp3'), soundEmpate = new Audio('sounds/MarioBrosmuere.mp3');

//Funcion que reinicia el tablero
function reiniciarJuego(){
    document.getElementById("turno").innerHTML ="Tú turno de marcar...";
    turno = 0;
    Ganador = false;
    partidaEmpatada = false;
    let contadorCeldas = 0;
    //Permite agregar nuevamente el evento escucha del tablero ademas de que regresa el color original y quita las imagenes
    while(contadorCeldas < celdas.length){
        //Se limpia el arreglo
        arregloTablero[contadorCeldas] = "";
        //Se añade de nuevo el evento a las celdad
        celdas[contadorCeldas].addEventListener("click", gato);
        //Regresa al color de fondo
        celdas[contadorCeldas].style.background = "#00a896";
        //Elimina las images del tablero
        document.getElementById("imagen"+ (contadorCeldas + 1)).removeAttribute("src");
        contadorCeldas++;
    }
}

//Coloca el nuemero total de partidad ganadas
function colocaPartidasGandasPorUsuario(){
    let text = "";
    if (nickNameUser == null || nickNameUser == ""){
        text = "Puntos Desconocido : " + partidasGanadasUsuario;
    }else{
        text = "Puntos "+ nickNameUser +": " + partidasGanadasUsuario;
    }  
    document.getElementById("jugador").innerHTML = text;
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
                nickNameUser +' Haz Ganado!',
                'success'
            );
            turno = 0;
            soundWin.play();
            Ganador = true;
            setTimeout(reiniciarJuego, 300);
            partidasGanadasUsuario++;
            colocaPartidasGandasPorUsuario();
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
//Marca la casilla con la imagen y color para la maquina
function marcaCasillaMaquina(celdaSeleccionada){
    let celdaAOcupar = document.getElementById("c" + celdaSeleccionada); 
    document.getElementById("turno").innerHTML ="Tú turno de marcar...";
    imagenGatoParaTablero = document.getElementById("imagen" + celdaSeleccionada );
    imagenGatoParaTablero.src = urlImagenMaquina; 
    celdaAOcupar.style.background="#354f52";
    celdaAOcupar.removeEventListener("click",gato);
    arregloTablero[celdaSeleccionada - 1] = letraO;
    turno++;
    ganador(letraO);
}

//Verifica que la celda seleccionada por la maquina este disponible
function celdaVacia(celdaSeleccionada){
    if(arregloTablero[celdaSeleccionada - 1] == letraX || arregloTablero[celdaSeleccionada - 1] == letraO){
        maquina();
    }else{
        marcaCasillaMaquina(celdaSeleccionada);
    }
}

//Funcion que otorga el lugar donde se marcara la celda departe de la maquina
function maquina(){
    if(partidaEmpatada == false){  
        movimientoMaquina = Math.floor(Math.random() * 9) + 1;
        celdaVacia(movimientoMaquina);
    }
}
//Marca la casilla con la imagen y color para el usuario
function marcarCasillaUsuario(celda, posicionMarcada){
    imagenGatoParaTablero = document.getElementById("imagen"+ (posicionMarcada + 1));
    imagenGatoParaTablero.src = urlImagenUsuario; 
    arregloTablero[posicionMarcada] = letraX;
    celda.style.background = "#05668d";
    celda.removeEventListener("click",gato);
    turno++;
    ganador(letraX);
    setTimeout(maquina, 400);
}

//Funcion para detectar la celda seleccionada por el usuario y marcarla 
function gato(evento){
    document.getElementById("turno").innerHTML ="Tú turno de marcar...";
    let celda = evento.target;
    let idCelda = evento.target.id;
    let posicionMarcada = idCelda[1]-1;
    document.getElementById("turno").innerHTML ="Turno de la maquina de marcar...";
    marcarCasillaUsuario(celda, posicionMarcada)
}

//Funcion para agregar el evento de escucha a las celdas del tablero
function cargarJuego(){
    let contadorCeldas = 0;
    while(contadorCeldas<celdas.length){
        celdas[contadorCeldas].addEventListener("click", gato);
        contadorCeldas++;
    }
}

//Funcion para pedir el nickNameUser del usuario
(async () => {
    let { value: nickNameIngresado } = await Swal.fire({
      title: 'Ingrese su nombre',
      input: 'text',
      showCancelButton: false,
    })
    if (nickNameIngresado) {
        nickNameUser = nickNameIngresado;
    }    
    colocaPartidasGandasPorUsuario();
})()

//Funcion que permite inicialiar la escucha de los eventos del tablero
window.addEventListener("load", cargarJuego);
