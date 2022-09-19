// let ariyaStyle = document.createElement('link');
// ariyaStyle.setAttribute('rel', 'stylesheet');
// ariyaStyle.setAttribute('type', 'text/css');
// ariyaStyle.setAttribute('href', 'https://ariyav1-cdn.azureedge.net/ariya-cdn/floating-ariya.css');
// document.head.appendChild(ariyaStyle);

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

const reactLib = [{
    mapJs: 'https://unpkg.com/@babel/standalone@7.8.7/babel.min.js',
    type: '',
    origin: true
}, {
    mapJs: 'https://unpkg.com/react@16.8.6/umd/react.development.js',
    type: '',
    origin: true
}, {
    mapJs: 'https://unpkg.com/react-dom@16.8.6/umd/react-dom.development.js',
    type: '',
    origin: true
}, {
    mapJs: 'https://unpkg.com/react-redux@7.1.0/dist/react-redux.min.js',
    type: '',
    origin: true
}, {
    mapJs: 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js',
    type: '',
    origin: true
}, {
    mapJs: '/embed-ariya/support.js',
    type: 'text/babel',
    origin: false
}]

const libraries = [{
    mapJs: 'https://aka.ms/csspeech/jsbrowserpackageraw',
    type: '',
    origin: false
}, {
    mapJs: 'https://unpkg.com/adaptivecards@1.2.6/dist/adaptivecards.min.js',
    type: '',
    origin: false
}, {
    mapJs: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js',
    type: '',
    origin: false
}, {
    mapJs: 'https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.js',
    type: '',
    origin: false
}, {
    mapJs: '/embed-ariya/abbreviation-content.js',
    type: 'text/javascript',
    origin: false
}];

const loadLibrary = async function () {
    await Promise.all(libraries.map(async (lib, index) => {
        getLibrary(libraries[index].mapJs, libraries[index].type, libraries[index].origin)
    }));

    await reactLib.reduce((p, lib) => {
        return p.then(() => getLibrary(lib.mapJs, lib.type, lib.origin));
    }, Promise.resolve());

}

loadLibrary().then(() => {
    console.log('all library loaded')
}).catch((error) => {
    console.log('error', error);
});


document.addEventListener('readystatechange', event => {

    if (event.target.readyState === "complete") {

        // TO transpile the react code
        window.dispatchEvent(new Event('DOMContentLoaded'));

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
                        <img src="https://ariyav1-cdn.azureedge.net/images/new-chat-header.png" style="height: 9%; width: 100%;">
                        <img id="speechToTextButton" src="https://ariyav1-cdn.azureedge.net/images/microphone.png" class="microphone-icon">
                        <div class="dot-elastic" id="animatedButton"></div>
                        <div id="webchat" role="main">
                        </div>
                    </div>
                </a>
            </div>
        </div>`

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
    }
});
