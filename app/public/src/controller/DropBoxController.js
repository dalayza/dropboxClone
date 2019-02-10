class DropBoxController {

    constructor() { // 1 crea el constructor de los id

        this.btnSendFileEl = document.querySelector('#btn-send-file'); // boton enviar archivo
        this.inputFileEl = document.querySelector('#files'); // input del boton enviar archivo
        this.snackModalEl = document.querySelector('#react-snackbar-root'); // barra de progreso
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg'); // barra de progreso
        this.nameFileEl = this.snackModalEl.querySelector('.filename'); // nombre del archivo
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft'); // tiempo en ejecucion

        this.initEvent();

    }


    initEvent() { // 2 // inicio los eventos

        this.btnSendFileEl.addEventListener('click', event => {

            this.inputFileEl.click(); // muestra el file directory

        });

        this.inputFileEl.addEventListener('change', event => {

            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFileEl.value = '';

        });

    }


    modalShow(show = true) {

        this.snackModalEl.style.display = (show) ? 'block' : 'none'; // valida si muestra la barra de progreso como modal

    }


    uploadTask(files) { // 3 // recibir los archivos

        let promises = []; // cada archivo va tener una promesa

        //insertar los archivos dentre de las promise
        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    this.modalShow(false);

                    try {

                        resolve(JSON.parse(ajax.responseText)); // respuesta dentro del servidor

                    } catch(e) {

                        reject(e);

                    }

                };

                ajax.onerror = event => {

                    this.modalShow(false);

                    reject(event);

                };

                ajax.upload.onprogress = event => { // cargar archivo en el upload

                    this.uploadProgress(event, file);

                    console.log(event);

                };

                let formData = new FormData();

                formData.append('input-file', file); // append para juntar

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

        });

        return Promise.all(promises);

    }

    uploadProgress(event, file) {

        let timespent = Date.now() - this.startUploadTime; // tiempo que gasto

        let loaded = event.loaded;

        let total = event.total;

        let porcent = parseInt((loaded / total) * 100); // porcentaje de avance

        let timeleft = ((100 -porcent) * timespent) / porcent; // tiempo que resta

        this.progressBarEl.style.width = `${porcent}%`; // porcentaje de progreso

        this.nameFileEl.innerHTML = file.name; // indicar nombre del archivo a cargar

        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft); // tiempo de progreso

    }

    formatTimeToHuman(duration) { // convertir el tiempo restante en tiempo humano

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt(duration / (1000 / 60)) % 60;
        let hours = parseInt(duration / (1000 * 60 * 60)) % 24;

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        } 

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        } 

        if (seconds > 0) {
            return `${seconds} segundos`;
        } 

        return '';

    };

}