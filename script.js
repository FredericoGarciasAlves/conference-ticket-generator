document.addEventListener("DOMContentLoaded", () => {
    const boxInputImage = document.getElementById("box-input-image");
    const btnUpload = document.getElementById("btn-upload");
    const inputFile = document.getElementById("input-file");
    const paragrathClickUpload = document.getElementById(
        "paragrath-click-upload"
    );
    const previewImage = document.getElementById("preview-image");
    const paragrathMaxUpload = document.querySelector(".paragrath-max-upload");
    const emailAdress = document.getElementById("email-address");
    const form = document.getElementById("form");
    const inputName = document.getElementById("input-full-name");
    const gitHub = document.getElementById("github-username");
    const boxInfos = document.querySelector(".box-infos");
    const imgCicleBottom = document.querySelector(".img-cicle-bottom");

    let cropper;

    // Função para carregar a imagem e abrir o modal de recorte
    function loadingImage(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const cropperModal = document.createElement("div");
            cropperModal.style.position = "absolute";
            cropperModal.style.top = "0";
            cropperModal.style.left = "0";
            cropperModal.style.width = "100%";
            cropperModal.style.height = "100%";
            cropperModal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
            cropperModal.style.display = "flex";
            cropperModal.style.alignItems = "center";
            cropperModal.style.justifyContent = "center";
            cropperModal.style.zIndex = "4";
            cropperModal.innerHTML = `
            <div style="background: white; padding: 20px;">
                <img id="cropper-image" src="${e.target.result}" style="max-width: 100%; max-height: 70vh;">
                <div style="text-align: center; margin-top: 10px;">
                    <button id="crop-image">Cut</button>
                    <button id="cancel-crop">Cancel</button>
                </div>
            </div>`;

            document.body.appendChild(cropperModal);

            const cropperImage = document.getElementById("cropper-image");
            cropper = new Cropper(cropperImage, {
                aspectRatio: 1, // Mantém uma proporção quadrada
            });

            document
                .getElementById("crop-image")
                .addEventListener("click", () => {
                    const croppedCanvas = cropper.getCroppedCanvas();
                    previewImage.src = croppedCanvas.toDataURL();
                    previewImage.style.display = "block";
                    paragrathClickUpload.style.display = "none";
                    btnUpload.style.display = "none";

                    document.body.removeChild(cropperModal);
                    cropper.destroy();
                    createButtons(); // Adiciona os botões após o recorte
                });

            document
                .getElementById("cancel-crop")
                .addEventListener("click", () => {
                    document.body.removeChild(cropperModal);
                    cropper.destroy();
                });
        };

        reader.readAsDataURL(file);
    }

    // Função para criar os botões de "Remover" e "Trocar"
    function createButtons() {
        const existingButtons = document.querySelector(".box-btns");
        if (existingButtons) {
            existingButtons.remove(); // Remove botões antigos se existirem
        }

        const boxBtns = document.createElement("div");
        boxBtns.className = "box-btns";

        const btnRemImg = document.createElement("button");
        btnRemImg.type = "button";
        btnRemImg.className = "btn-remove-image";
        btnRemImg.textContent = "Remove Image";

        btnRemImg.addEventListener("click", () => {
            previewImage.src = "";
            previewImage.style.display = "none";
            boxBtns.remove();
            btnUpload.style.display = "block";
            paragrathClickUpload.style.display = "block";
        });

        const btnChanImg = document.createElement("button");
        btnChanImg.type = "button";
        btnChanImg.className = "btn-chan-img";
        btnChanImg.textContent = "Change Image";

        btnChanImg.addEventListener("click", () => {
            inputFile.click();
        });

        boxBtns.appendChild(btnRemImg);
        boxBtns.appendChild(btnChanImg);
        boxInputImage.appendChild(boxBtns);
    }

    // Evento para carregar a imagem ao clicar no botão de upload
    btnUpload.addEventListener("click", () => {
        inputFile.click();
    });
    btnUpload.addEventListener("focus", () => {
        boxInputImage.style.outline = "1px solid #d1d0d5";
        boxInputImage.style.outlineOffset = "3px";
    });
    btnUpload.addEventListener("blur", () => {
        boxInputImage.style.outline = "none";
    });

    inputFile.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verifica o tipo do arquivo (JPEG ou JPG)
            const validTypes = ["image/jpeg", "image/png"];
            let alertMessagePhotoType = document.getElementById(
                "alert-message-photo-type"
            );
            let alertMessagePhotoMaxSize = document.getElementById(
                "alert-message-photo-max-size"
            );

            if (!validTypes.includes(file.type)) {
                // Remove mensagem de tamanho, se existir
                if (alertMessagePhotoMaxSize) {
                    alertMessagePhotoMaxSize.remove();
                }

                // Adiciona mensagem de tipo inválido, se não existir
                if (!alertMessagePhotoType) {
                    const alertMessagePhoto = document.createElement("p");
                    alertMessagePhoto.textContent =
                        "We do not accept this type of file. Please choose a JPG or PNG file!";
                    alertMessagePhoto.className = "alert-message-photo";
                    alertMessagePhoto.id = "alert-message-photo-type";
                    boxInputImage.insertAdjacentElement(
                        "afterend",
                        alertMessagePhoto
                    );
                }

                paragrathMaxUpload.style.display = "none";
                inputFile.value = ""; // Reseta o input

                return;
            }
            const messageEmptRe = document.getElementById(
                "message-empty-input-img"
            );

            if (inputFile.files || inputFile.files.length > 0) {
                if (messageEmptRe) {
                    messageEmptRe.remove();
                    paragrathMaxUpload.style.display = "block";
                }
            }
            // Remove mensagem de tipo inválido, se existir
            if (alertMessagePhotoType) {
                alertMessagePhotoType.remove();
            }

            // Verifica o tamanho do arquivo (máximo de 500 KB)
            const maxSizeInKB = 500;
            const fileSizeInKB = file.size / 1024; // Converte bytes para KB

            if (fileSizeInKB > maxSizeInKB) {
                // Remove mensagem de tipo inválido, se existir
                if (alertMessagePhotoType) {
                    alertMessagePhotoType.remove();
                }

                // Adiciona mensagem de tamanho excedido, se não existir
                if (!alertMessagePhotoMaxSize) {
                    alertMessagePhotoType.remove();
                    const alertMessagePhoto = document.createElement("p");
                    alertMessagePhoto.textContent =
                        "File too large. Please upload a photo under 500KB.";
                    alertMessagePhoto.className = "alert-message-photo";
                    alertMessagePhoto.id = "alert-message-photo-max-size";
                    boxInputImage.insertAdjacentElement(
                        "afterend",
                        alertMessagePhoto
                    );
                }

                paragrathMaxUpload.style.display = "none";
                inputFile.value = ""; // Reseta o input
                return;
            }

            // Remove mensagem de tamanho excedido, se existir
            if (alertMessagePhotoMaxSize) {
                alertMessagePhotoMaxSize.remove();
            }
            paragrathMaxUpload.style.display = "block";

            // Carrega a imagem caso atenda aos critérios
            loadingImage(file);
        }
    });

    function validateFilesInput(event) {
        let validateFile = true;
        // Verifica se há um arquivo selecionado
        const messageEmptRe = document.getElementById(
            "message-empty-input-img"
        );
        const alertMessagePhotoType = document.getElementById(
            "alert-message-photo-type"
        );
        const alertMessagePhotoMaxSize = document.getElementById(
            "alert-message-photo-max-size"
        );
        if (!inputFile.files || inputFile.files.length === 0) {
            if (messageEmptRe) {
                messageEmptRe.remove();
            }
            if (alertMessagePhotoMaxSize) {
                alertMessagePhotoMaxSize.remove();
            }

            if (alertMessagePhotoType) {
                alertMessagePhotoType.remove();
            }
            const messageEmpt = document.createElement("P");
            messageEmpt.textContent = "This field is mandatory to be filled in";
            messageEmpt.id = "message-empty-input-img";
            messageEmpt.className = "message-empty-input-img";
            paragrathMaxUpload.style.display = "none";
            boxInputImage.insertAdjacentElement("afterend", messageEmpt);
            return (validateFile = false); // Previne o envio
        }

        const file = inputFile.files[0]; // Obtém o primeiro arquivo
        const fileSizeKB = file.size / 1024; // Converte para KB
        const fileType = file.type; // Tipo MIME do arquivo

        // Verifica as condições
        if (fileSizeKB > 500) {
            return (validateFile = false);
        }

        if (fileType !== "image/jpeg" && fileType !== "image/png") {
            return (validateFile = false);
        }

        return validateFile;
    }

    function alertMessageEmailFunc() {
        let validateFile = true;
        const alertMessageEmailRe = document.getElementById(
            "alert-message-email"
        );
        if (
            !emailAdress.value.includes("@") ||
            !emailAdress.value.includes(".com")
        ) {
            if (alertMessageEmailRe) {
                alertMessageEmailRe.remove();
            }
            const alertMessageEmail = document.createElement("p");
            alertMessageEmail.id = "alert-message-email";
            alertMessageEmail.className = "alert-message-email";
            alertMessageEmail.textContent =
                "Plase enter a valid email address.";
            emailAdress.insertAdjacentElement("afterend", alertMessageEmail);
            return (validateFile = false);
        }
        if (
            emailAdress.value.includes("@") &&
            emailAdress.value.includes(".com")
        ) {
            if (alertMessageEmailRe) {
                alertMessageEmailRe.remove();
            }
        }
        return validateFile;
    }

    emailAdress.addEventListener("blur", () => {
        const alertMessageEmailRe = document.getElementById(
            "alert-message-email"
        );
        if (
            emailAdress.value.includes("@") &&
            emailAdress.value.includes(".com")
        ) {
            if (alertMessageEmailRe) {
                alertMessageEmailRe.remove();
            }
        }
    });

    function nameEmpty() {
        validateFiles = true;

        const messageEmptyNameRe =
            document.getElementById("message-empty-name");
        if (
            inputName.value === "" ||
            inputName.value === null ||
            inputName.value === undefined
        ) {
            if (messageEmptyNameRe) {
                messageEmptyNameRe.remove();
            }
            const messageEmptyName = document.createElement("p");
            messageEmptyName.textContent =
                "This field is mandatory to be filled in.";
            messageEmptyName.className = "message-empty-name";
            messageEmptyName.id = "message-empty-name";
            inputName.insertAdjacentElement("afterend", messageEmptyName);
            return (validateFiles = false);
        }

        if (!inputName.value === "") {
            messageEmptyNameRe.remove();
        }
        return validateFiles;
    }

    inputName.addEventListener("blur", () => {
        const messageEmptyNameRe =
            document.getElementById("message-empty-name");
        if (inputName.value !== "") {
            if (messageEmptyNameRe) {
                messageEmptyNameRe.remove();
            }
        }
    });

    function gitHubFun() {
        validateFiles = true;
        const messageFieldEmptyRe = document.getElementById(
            "message-empty-github"
        );
        if (
            gitHub.value === "" ||
            gitHub.value === null ||
            gitHub.value === undefined
        ) {
            if (messageFieldEmptyRe) {
                messageFieldEmptyRe.remove();
            }
            const messageFieldEmpty = document.createElement("p");
            messageFieldEmpty.textContent =
                "This field is mandatory to be filled in.";
            messageFieldEmpty.id = "message-empty-github";
            messageFieldEmpty.className = "message-empty-github";
            gitHub.insertAdjacentElement("afterend", messageFieldEmpty);
            return (validateFile = false);
        }

        if (!gitHub.value === "") {
            messageFieldEmptyRe.remove();
        }
        return validateFiles;
    }

    gitHub.addEventListener("blur", () => {
        const messageFieldEmptyRe = document.getElementById(
            "message-empty-github"
        );
        if (gitHub.value !== "") {
            if (messageFieldEmptyRe) {
                messageFieldEmptyRe.remove();
            }
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateFilesInput()) {
            e.preventDefault();
        }

        if (!alertMessageEmailFunc()) {
            e.preventDefault();
        }

        if (!nameEmpty()) {
            e.preventDefault();
        }

        if (!gitHubFun()) {
            e.preventDefault();
        }

        if (
            gitHubFun() &&
            nameEmpty() &&
            alertMessageEmailFunc() &&
            validateFilesInput()
        ) {
            console.log("esta disparando!");
            // Criando ticket apenas se todas as validações passaram
            boxInfos.remove();
            let numberRandom = Math.floor(10000 + Math.random() * 90000);
            const sectionTicket = document.createElement("div");
            sectionTicket.className = "section-ticket";
            sectionTicket.innerHTML = `
                <img src="./assets/images/logo-full.svg" alt="image of the logo described coding conf" class="logo-header">
                <h1 class="title-section-ticket">Congrats, <span class="name-user-ticket" id="name-user-ticket"></span>! Your ticket is ready.</h1>
                <p class="paragrath-section-ticket"> We've emailed your ticket to <span class="email-section-ticket"></span> and will send updates in the run up to the event.</p>
                <div class="ticket">
                    <div class="ticket-header">
                        <img src="./assets/images/logo-full.svg" alt="image of the logo described coding conf" class="logo-ticket">
                        <p class="date-location"><span class="date"></span> / <span class="location"></span></p>
                    </div>
                    <div class="ticket-footer">
                        <img src="" alt="ticket profile icon" class="ticket-profile-icon">
                        <div class="name-github">
                            <h3 class="name-ticket"></h3>
                            <p class="github-location"><img src="./assets/images/icon-github.svg" alt="icon gitHub"></p>
                        </div>
                    </div>
                    <p class="number-random">#${numberRandom}</p>
                </div>
            `;

            imgCicleBottom.insertAdjacentElement("afterend", sectionTicket);

            // Pegando os elementos que serão preenchidos
            const nameUserTicket = document.getElementById("name-user-ticket");
            const emailSectionTicket = document.querySelector(
                ".email-section-ticket"
            );
            const ticketProfileIcon = document.querySelector(
                ".ticket-profile-icon"
            );
            const dateText = document.querySelector(".date");
            const locationText = document.querySelector(".location");
            const nameTicket = document.querySelector(".name-ticket");
            const githubLocation = document.querySelector(".github-location");

            nameUserTicket.textContent = inputName.value;
            emailSectionTicket.textContent = emailAdress.value;
            ticketProfileIcon.src = previewImage.src;
            nameTicket.textContent = inputName.value;
            githubLocation.innerHTML = `<img src="./assets/images/icon-github.svg" alt="icon gitHub"> ${gitHub.value}`;
            // Pegando a data no formato MM/DD/YYYY
            const dataAtual = new Date();
            const dataFormatada = dataAtual.toLocaleDateString("en-US"); // Formato americano
            dateText.textContent = dataFormatada;

            // Pegando a localização do usuário
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        // API para obter cidade e estado
                        fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        )
                            .then((response) => response.json())
                            .then((data) => {
                                const cidade =
                                    data.address.city ||
                                    data.address.town ||
                                    data.address.village ||
                                    "Unknown city";
                                const estado =
                                    data.address.state || "Unknown status";

                                locationText.textContent = `${cidade}, ${estado}`;
                            })
                            .catch(() => {
                                locationText.textContent =
                                    "Unable to access location.";
                            });
                    },
                    () => {
                        locationText.textContent = "Unable to access location.";
                    }
                );
            } else {
                locationText.textContent =
                    "Geolocation not supported by the browser.";
            }
        }
    });
});
