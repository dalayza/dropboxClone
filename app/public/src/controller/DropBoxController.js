class DropBoxController {

    constructor() { // 1 crea el constructor de los id

        this.btnSendFileEl = document.querySelector('#btn-send-file'); // boton enviar archivo
        this.inputFileEl = document.querySelector('#files'); // input del boton enviar archivo
        this.snackModalEl = document.querySelector('#react-snackbar-root'); // barra de progreso

        this.initEvent();

    }


    initEvent() { // 2 // inicio los eventos

        this.btnSendFileEl.addEventListener('click', event => {

            this.inputFileEl.click(); // muestra el file directory

        });

        this.inputFileEl.addEventListener('change', event => {

            this.uploadTask(event.target.files);

            this.snackModalEl.style.display = 'block'; // muestra la barra de progreso como modal

        });

    }


    uploadTask(files) { // 3 // recibir los archivos

        let promise = []; // cada archivo va tener una promesa

        //insertar los archivos dentre de las promise
        [...files].forEach(file => {

            promise.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {

                    try {

                        resolve(JSON.parse(ajax.responseText));

                    } catch(e) {

                        reject(e);

                    }

                };

                ajax.onerror = event => {

                    reject(event);

                };

                let formdata = new FormData();

                formData.append('input-file', 'file'); // append para juntar

                ajax.send(formData);

            }));

        });

        return Promise.all(promise);

    }
}