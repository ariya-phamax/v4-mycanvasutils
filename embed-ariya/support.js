

const GitHubRepositoryAttachment = props => (
  <div style={{ fontFamily: "'Calibri', 'Helvetica Neue', Arial, sans-serif", margin: 20, textAlign: 'center' }}>
    <svg height="64" viewBox="0 0 16 16" version="1.1" width="64" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      ></path>
    </svg>
    <p>
      <a href={`https://github.com/${encodeURI(props.owner)}/${encodeURI(props.repo)}`} target="_blank">
        {props.owner}/<br />
        {props.repo}
      </a>
    </p>
  </div>
);

const ChartAttachment = props => (
  <div id={"chartCont" + props.id}>
  </div>
);

const TextRender = props => (
  <div style={{ width: '95%', padding: '10px', minHeight: '20px', fontFamily: "Calibri, Helvetica Neue, Arial, sans-serif" }} dangerouslySetInnerHTML={{ __html: props.text }}>

  </div>
);


(async function () {
  var md = window.markdownit();

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

  let previousQuestion = '';

  const { createStore, ReactWebChat } = window.WebChat;

  const store = createStore({}, store => next => action => {
    if (action.type === 'WEB_CHAT/SET_SEND_BOX') {
      const user_entered_text = action.payload.text;
    }

    if (action.type.toLowerCase() === 'DIRECT_LINE/INCOMING_ACTIVITY'.toLowerCase()) {

      if (action.payload.activity.from.role == 'user') {
        previousQuestion = action.payload.activity.text;
      }
      if (incId == 0) {
        removeMainOutline();
      }

      removeMessageOutline();

      if (action.payload.activity.text) {
        if (action.payload.activity.text.includes("![QnAMaker]")) {
          action.payload.activity.localId = incId;
          incId++;

          // let downloadAttrName = `download download-${incId}`;
          // let expandAttrName = `expand expand-${incId}`;

          // addImageControls(action, downloadAttrName, expandAttrName);
        }
      }
    }
    return next(action);
  });

  const attachmentMiddleware = () => next => card => {

    if (previousQuestion) {
      let questionAnswerChart = {
        "Show me the sales trend of Oxymat in KAM_T05 - East Midlands from 2018 to 2021": "sq11",
        "What is the sales trend of OXYMAT in UK-03-02 territory FY-21?": "sq12",
        "Sales trend of phamax in the UK": "sq13",
        "Sales trend of Allergan in the UK": "sq14",
        "Top 3 brands in UK": "sq15",
        "Sales trend by Reps for Oxymat in 2021.": "sq16",
        // "What is Santen's evolution index for EU5 countries in the latest quarter.": ,
        "What is Allergan's evolution index for EU5 countries in the latest quarter.": "sq19",
        "Show me the Oxymat sales trend for FY21 for Benelux cluster": "sq20",
        "Compare the sales of Oxymat vs Ganfort in the UK in 2020.": "sq21",
        "Compare the sales of Oxymat in UK vs France in 2021.": "sq22",
        "Show me Oxymat's net sales of the top 5 countries in FY21": "sq23",
        "Compare region-wise budget vs actual net sales for OXYMAT in FY2022": "sq24",
      };
      triggerChart(card.activity.localId, questionAnswerChart[previousQuestion]);
    }
    switch (card.attachment.contentType) {
      case 'application/vnd.microsoft.botframework.samples.github-repository':
        return (
          <GitHubRepositoryAttachment owner={card.attachment.content.owner} repo={card.attachment.content.repo} />
        );
      case 'text/markdown':
        if (card.attachment.content.includes("![QnAMaker]")) {
          return (
            <ChartAttachment id={card.activity.localId} />
          );
        }
        else {
          let splittedText = card.activity.text.split(' ');
          splittedText.map((textRef, index) => {
            if (abbreviationContents[textRef.trim()]) {
              let changedText = `<abbr title=${abbreviationContents[textRef.trim()]}>${textRef}</abbr>`;
              splittedText[index] = changedText;
            }
          });
          let newFormatedText = splittedText.join(' ');
          return (
            <TextRender text={newFormatedText} />
          );
        }

      default:
        return next(card);
    }

  };

  async function triggerChart(incId, answerOption) {
    let chartDisplayElem = document.getElementById(`chartCont${incId}`)

    if (chartDisplayElem) {
      // const res = await fetch('https://ariya-test-function.azurewebsites.net/api/embed-ariya-azfunc?', { method: 'GET' });

      const res = await fetch(`http://localhost:7071/api/embed-ariya-azfunc?value=${answerOption}`, { method: 'GET' });

      const chartData = await res.json();
      if (chartDisplayElem.children.length == 0) {
        let chartCanvasElem = document.createElement("canvas");
        chartCanvasElem.id = `chart${incId}`;
        chartCanvasElem.height = 200;
        chartDisplayElem.appendChild(chartCanvasElem);

        const config = {
          type: chartData.chart.type,
          data: chartData.chart.data,
          options: chartData.chart.options
        };

        const ariyaChart = new Chart(
          document.getElementById(`chart${incId}`),
          config
        );
      }

    }
  }

  window.ReactDOM.render(
    <ReactWebChat
      attachmentMiddleware={attachmentMiddleware}
      directLine={window.WebChat.createDirectLine({
        token: window.location.pathname === "/what-is-aav/" ? 'WWcxnyvMpPU.4ai75HJaI6_sHpeCyaH5LZATXhaFEl2qfUfBVWZuAEk' :'6dAwcLUiDzY.48ZcdFjorzD3KpGQjpSnlb9jzxBfHCzCxAcVuFDpiBM'
      })}
      store={store}
      renderMarkdown={md.render.bind(md)}
      styleOptions={styleOptions}
    />,
    document.getElementById('webchat')
  );

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

  function getImageUrl(text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    let returnUrl;
    text.replace(urlRegex, function (url) {
      returnUrl = url;
    });
    return returnUrl;
  }
})().catch(err => console.error(err));