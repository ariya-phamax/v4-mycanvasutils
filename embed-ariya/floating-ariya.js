let ariyaStyle = document.createElement('link');
ariyaStyle.setAttribute('rel', 'stylesheet');
ariyaStyle.setAttribute('type', 'text/css');
ariyaStyle.setAttribute('href', '/embed-ariya/floating-ariya.css');
document.head.appendChild(ariyaStyle);

function getLibrary(url, type, origin) {
    let promise = new Promise((resolve, reject) => {
        let loadScript = document.createElement('script');

        if (origin) {
            loadScript.setAttribute('crossorigin', 'anonymous');
        }
        if (type) {
            loadScript.setAttribute('type', type);
        }
        loadScript.setAttribute('src', url);

        document.head.appendChild(loadScript);

        loadScript.onload = function () {
            console.log(`Loaded: ${url}`, Date.now());
            resolve(url);
        }

        loadScript.onerror = function (error) {
            console.error("Error while loading the script", error);
            reject('error')
        }
    });
    return promise;
}

const libraries = [{
    mapJs: 'https://aka.ms/csspeech/jsbrowserpackageraw',
    type: '',
    origin: false
}, {
    mapJs: 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js',
    type: '',
    origin: true
}];

const loadLibrary = async function () {
    await Promise.all(libraries.map(async (lib, index) => {
        getLibrary(libraries[index].mapJs, libraries[index].type, libraries[index].origin)
    }));
}

loadLibrary();


document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "complete") {

        let floatingAriya = document.createElement('div');
        floatingAriya.setAttribute('id', 'ariyaChat');
        floatingAriya.setAttribute('class', 'ariya-chat');
        document.body.appendChild(floatingAriya);

        let target = document.getElementById("ariyaChat");

        target.innerHTML += `
        <div class="image-zoom-container" id="imageZoom">
            <img src="" class="image-set-zoom" id="imageCont">
            <img src="https://ariyav1-cdn.azureedge.net/images/download-white.png" class="zoom-download-option" id="zoomDownloadOption">
            <img src="https://ariyav1-cdn.azureedge.net/images/zoom-out.png" class="zoom-out-option" id="zoomOutOption">
            <img src="https://ariyav1-cdn.azureedge.net/images/zoom-in.png" class="zoom-in-option" id="zoomInOption">
            <img src="https://ariyav1-cdn.azureedge.net/images/close.png" class="zoom-close-option" id="zoomCloseOption">
        </div>
        <div class="fab-wrapper">
            <input id="fabCheckbox" type="checkbox" class="fab-checkbox" />
            <label class="fab" for="fabCheckbox">
            <img src="https://demo.ariya.ch/static/media/bot.11494d2a.png" class="ariya-float-icon">
            </label>
            <div class="fab-wheel">
                <a class="fab-action fab-action-1">
                    <div class="ariya-chat-popup">
                        <img src="https://ariyav1-cdn.azureedge.net/images/new-chat-header.png" style="height: 10%; width: 100%;">
                        <img id="speechToTextButton" src="https://ariyav1-cdn.azureedge.net/images/microphone.png" class="microphone-icon">
                        <div class="dot-elastic" id="animatedButton"></div>
                        <div id="webchat" role="main">
                        </div>
                    </div>
                </a>
            </div>
        </div>`
        const styleOptions = {
            botAvatarImage: 'https://demo.ariya.ch/static/media/bot.11494d2a.png',
            botAvatarInitials: 'AR',
            userAvatarImage: 'https://ariyav1-cdn.azureedge.net/images/user-image.png',
            userAvatarInitials: 'GU',
            bubbleBackground: '#FFFFFF',
            bubbleFromUserBackground: '#0070C0',
            bubbleBorderRadius: 15,
            bubbleFromUserBorderRadius: 15,
            backgroundColor: '#D6E3FF',
            bubbleTextColor: '#000',
            bubbleFromUserTextColor: '#FFF',
            sendBoxButtonColor: "rgb(0, 0, 102)",
            sendBoxBackground: '#B4C1D8',
            hideUploadButton: "true",
            sendBoxHeight: 65,
            microphoneButtonColorOnDictate: '#F33',
            avatarSize: 24,
        };
        let incId = 0;

        const store = window.WebChat.createStore(
            {},
            store => next => action => {
                if (action.type === 'WEB_CHAT/SET_SEND_BOX') {
                    const user_entered_text = action.payload.text;
                }

                if (action.type.toLowerCase() === 'DIRECT_LINE/INCOMING_ACTIVITY'.toLowerCase()) {
                    if (incId == 0) {
                        removeMainOutline();
                    }

                    removeMessageOutline();
                    if (action.payload.activity.text) {

                        if (action.payload.activity.text.includes("![QnAMaker]")) {
                            let downloadAttrName = `download download-${incId}`;
                            let expandAttrName = `expand expand-${incId}`;
                            incId++;
                            addImageControls(action, downloadAttrName, expandAttrName);
                        }
                    }
                }
                return next(action);
            }
        );

        window.WebChat.renderWebChat(
            {
                directLine: window.WebChat.createDirectLine({
                    token: window.location.pathname === "/what-is-aav/" ? 'WWcxnyvMpPU.4ai75HJaI6_sHpeCyaH5LZATXhaFEl2qfUfBVWZuAEk' :'6dAwcLUiDzY.48ZcdFjorzD3KpGQjpSnlb9jzxBfHCzCxAcVuFDpiBM'
                }),
                username: 'Ariya',
                locale: 'en-US',
                styleOptions,
                store
            },
            document.getElementById('webchat')
        );

        function Initialize(onComplete) {
            if (!!window.SpeechSDK) {
                onComplete(window.SpeechSDK);
            }
        }

        function enumerateMicrophones() {
            if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                console.log(`Unable to query for audio input devices. Default will be used.\r\n`);
                return;
            }

            navigator.mediaDevices.enumerateDevices().then((devices) => {
            });
        }

        enumerateMicrophones();

        speechToTextButton = document.getElementById('speechToTextButton');
        animatedButton = document.getElementById('animatedButton');
        animatedButton.style.display = "none";
        speechToTextButton.addEventListener("click", function () {
            doRecognizeOnceAsync();
        });

        function doRecognizeOnceAsync() {
            let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

            let lang = "en-US";
            let speechConfig;
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription("4976615d703348959030b1d1282cdfc5", "westeurope");
            speechConfig.endpointId = "9a775095-838a-4292-bf37-8890ea4ee529";
            speechConfig.outputFormat = SpeechSDK.OutputFormat.Detailed;
            speechConfig.speechRecognitionLanguage = lang;

            if (!audioConfig || !speechConfig) return;

            reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
            speechToTextButton.style.display = "none";
            animatedButton.style.display = "block";
            applyCommonConfigurationTo(reco);
            reco.recognized = undefined;
            reco.recognizeOnceAsync(
                function (successfulResult) {
                    onRecognizedResult(successfulResult);
                },
                function (err) {
                    window.console.log(err);
                    phraseDiv.innerHTML += "ERROR: " + err;
                });
        }

        function applyCommonConfigurationTo(recognizer) {
            recognizer.recognizing = onRecognizing;
            recognizer.recognized = onRecognized;
            recognizer.canceled = onCanceled;
            recognizer.sessionStarted = onSessionStarted;
            recognizer.sessionStopped = onSessionStopped;
        }

        function onRecognizing(sender, recognitionEventArgs) {
            console.log('onRecognizing', recognitionEventArgs.result)
        }

        function onRecognized(sender, recognitionEventArgs) {
            let result = recognitionEventArgs.result;
            onRecognizedResult(recognitionEventArgs.result);
        }

        function onRecognizedResult(result) {
            speechToTextButton.style.display = "block";
            animatedButton.style.display = "none";
            store.dispatch({
                type: 'WEB_CHAT/SET_SEND_BOX',
                payload: {
                    text: result.privText,
                }
            });

            const sendButton = document.querySelector('.webchat__icon-button');
            sendButton.click();
        }

        function onSessionStarted(sender, sessionEventArgs) {
            console.log('onSessionStarted', sessionEventArgs)
        }

        function onSessionStopped(sender, sessionEventArgs) {
            console.log('onSessionStopped', sessionEventArgs)
        }

        function onCanceled(sender, cancellationEventArgs) {
            console.log('onCanceled', cancellationEventArgs)
        }

        async function downloadImageContent(imageValue) {
            const image = await fetch(imageValue);
            const imageBlog = await image.blob()
            const imageURL = URL.createObjectURL(imageBlog)

            let el = document.createElement("a");
            el.setAttribute("href", imageURL);
            el.setAttribute("download", 'downloaded-image.png');
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        }

        function expandImageContent(imageValue) {
            let zoomContainer = document.getElementById('imageZoom');
            zoomContainer.style.display = 'flex';
            let imageCont = document.getElementById('imageCont');
            imageCont.src = imageValue;

            let zoomDownloadOption = document.getElementById('zoomDownloadOption');
            let zoomOutOption = document.getElementById('zoomOutOption');
            let zoomInOption = document.getElementById('zoomInOption');
            let zoomCloseOption = document.getElementById('zoomCloseOption');

            zoomDownloadOption.addEventListener("click", function () {
                downloadImageContent(imageValue);
            });

            zoomOutOption.addEventListener("click", function () {
                zoomOut(imageCont)
            });

            zoomInOption.addEventListener("click", function () {
                zoomIn(imageCont)
            });

            zoomCloseOption.addEventListener("click", function () {
                closeZoom(zoomContainer);
            });
        }

        function closeZoom(element) {
            element.style.display = 'none';
        }

        function zoomIn(element) {
            let currWidth = element.clientWidth;
            if (currWidth >= 1300) return false;
            else {
                element.style.width = (currWidth + 100) + "px";
            }
        }

        function zoomOut(element) {
            let currWidth = element.clientWidth;
            if (currWidth <= 300) return false;
            else {
                element.style.width = (currWidth - 100) + "px";
            }
        }

        function addImageControls(action, downloadAttrName, expandAttrName) {
            let imageUrl = getImageUrl(action.payload.activity.text);

            action.payload.activity.text += `![${downloadAttrName}](https://ariyav1-cdn.azureedge.net/images/download.png)`;
            action.payload.activity.text += `![${expandAttrName}](https://ariyav1-cdn.azureedge.net/images/expand-image.png)`;
            setTimeout(() => {
                let downloadElement = document.querySelector(`img[alt= ${CSS.escape(downloadAttrName)} ]`);
                downloadElement.addEventListener("click", function () {
                    downloadImageContent(imageUrl);
                });

                let expandElement = document.querySelector(`img[alt= ${CSS.escape(expandAttrName)}]`);
                expandElement.addEventListener("click", function () {
                    expandImageContent(imageUrl);
                });
            }, 500);
        }

        function getImageUrl(text) {
            var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            let returnUrl;
            text.replace(urlRegex, function (url) {
                returnUrl = url;
            });
            return returnUrl;
        }

        function removeMainOutline() {
            setTimeout(() => {
                let outlineShadow = document.getElementsByClassName("webchat__basic-transcript__focus-indicator");
                while (outlineShadow.length > 0) outlineShadow[0].remove();
                let messageoutlineShadow = document.getElementsByClassName("webchat__basic-transcript__activity-indicator--focus");
                while (messageoutlineShadow.length > 0) messageoutlineShadow[0].remove();
            }, 500);
        }

        function removeMessageOutline() {
            setTimeout(() => {
                let messageoutlineShadow = document.getElementsByClassName("webchat__basic-transcript__activity-indicator--focus");
                while (messageoutlineShadow.length > 0) messageoutlineShadow[0].remove();
            }, 500);
        }

    }
});
document.onload = function () {

};

