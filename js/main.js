// 모든 애니메이션에 대한 정보를 배열에 담아둠
//전역 변수로 사용하면 네임스페이스오염 가능

// const arr = [1,2,3]

(() => {
  let yOffset = 0; //window.pageYoffset대신 쓸 변수
  let prevScrollHeight = 0 //현재 스크롤의 위치(yOffset)보다 이전에 위치한 스크롤 섹션드의 스크롤 높이값의합
  let currentScene = 0; //현재 눈앞에 보고있는 scroll-section(씬)
  let enterNewScene = false; //새로운 scene이 시작되는 순간시작되는 순간 true
  //loop함수의 변수
  let acc = 0.1;
  let delayedYOffset = 0;
  let rafId;
  let rafState;

  //1.스크롤의 높이 ,2.
  const sceneInfo = [
    {
      //0
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        // dom객체 오소들
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
      },
      values: {
        canvasOpacity: [1, 0, { start: 0.9, end: 1 }],
        videoImageCount: 300, //이미지 개수
        imageSquence: [0, 299], //이미지순서 
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],

        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],

        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
      }
    },
    {
      //1 정적 콘텐츠
      type: 'normal',
      // heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1')
      }
    },
    {
      //2
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
        messageA: document.querySelector('#scroll-section-2 .a'),
        messageB: document.querySelector('#scroll-section-2 .b'),
        messageC: document.querySelector('#scroll-section-2 .c'),
        pinB: document.querySelector('#scroll-section-2 .b .pin'),
        pinC: document.querySelector('#scroll-section-2 .c .pin'),
        canvas: document.querySelector('#video-canvas-1'),
        context: document.querySelector('#video-canvas-1').getContext('2d'),
        videoImages: [],
      },
      values: {
        canvasOpacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvasOpacity_out: [1, 0, { start: 0.95, end: 1 }],
        videoImageCount: 960, //이미지 개수
        imageSquence: [0, 959], //이미지순서 
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      }
    },
    { //3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption: document.querySelector('.canvas-caption'),
        canvas: document.querySelector('.image-blend-canvas'),
        context: document.querySelector('.image-blend-canvas').getContext('2d'),
        imagePath: [
          './images/blend-image-1.jpg',
          './images/blend-image-2.jpg'
        ],
        images: []
      },
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],//canvas의 왼쪽하얀 박스
        rect2X: [0, 0, { start: 0, end: 0 }], // 오른쩍 하얀박스
        rectStartY: 0,
        canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [20, 0, { start: 0, end: 0 }],
        canvas_sacale: [0, 0, { start: 0, end: 0 }],
        BlendHeight: [0, 0, { start: 0, end: 0 }], ///애니메이션이 시작되는 순간은 캔버스가 위에 닿을때 
      }
    },
    {//4
      type:'sticky',
      heightnum:3,
      scrollHeight:0,
      objs:{
        container:document.querySelector('#scroll-section-4'),
        messageA:document.querySelector('#scroll-section-4 .main-message.a'),
        messageB:document.querySelector('#scroll-section-4 .main-message.b'),
        pencilLogo:document.querySelector('#scroll-section-4 .pencil-logo'),
        pencil:document.querySelector('#scroll-section-4 .pencil'),
        ribbonPath:document.querySelector('.ribbon-path path')
      },
      values:{
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
        messageA_opacity_out: [1, 0, { start: 0.3, end: 0.4 }],
        messageB_opacity_out: [1, 0, { start: 0.6, end: 0.7 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.3, end: 0.4 }],
        pencilLogo_width_in: [1000, 200, { start: 0.1, end: 0.4 }],
				pencilLogo_width_out: [200, 50, { start: 0.4, end: 0.8 }],
				pencilLogo_translateX_in: [-10, -20, { start: 0.2, end: 0.4 }],
				pencilLogo_translateX_out: [-20, -50, { start: 0.4, end: 0.8 }],
        pencilLogo_opacity_out: [1, 0, { start: 0.8, end: 0.9 }],
        pencil_right: [-10, 70, { start: 0.3, end: 0.8 }],
				pencil_bottom: [-80, 100, { start: 0.3, end: 0.8 }],
        pencil_rotate: [-120, -200, { start: 0.3, end: 0.8 }],
        path_dashoffset_in: [1401, 0, { start: 0.2, end: 0.4 }],
				path_dashoffset_out: [0, -1401, { start: 0.6, end: 0.8 }]
      }
    }
  ];

  // canvas의 이미지를 세팅해주는 함수
  function setCanvasImages() {
    //첫번째 section의 이미지 처리
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();//이미지 객체를 하나 만듦
      // imgElem = document.createElement('img')
      imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = new Image();
      imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }
    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagePath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[3].objs.imagePath[i];
      sceneInfo[3].objs.images.push(imgElem3)
    }
    // console.log(sceneInfo[3].objs.images)
    // console.log(sceneInfo[0].objs.videoImages)
    // console.log(sceneInfo[0].objs.videoImages)
  }

  //메뉴 투명도, 사라짐
  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add('local-nav-sticky');
    } else {
      document.body.classList.remove('local-nav-sticky')
    }
    return;
  }

  // 기본적인 레이아웃 함수
  function setLayout() {
    //각 스크롤의 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === 'sticky') {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;

      } else if (sceneInfo[i].type === 'normal') {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      //공통
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    //curentScene 
    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    // console.log('total', totalScrollHeight)
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;

  }
  //currentYoffset은 현재의 씬이 얼마나 스크롤 되었는지?
  //비율계산 함수
  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //비율 현재 씬에 스크롤된 범위를 비율로 정하기
    const scrollRatio = currentYOffset / scrollHeight
    // 분기처리가 필요하다. /3 번째 함수 객체가 있을 경우에
    // console.log(values)
    if (values.length === 3) {
      // start - end 사이의 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      // 부분 스크롤 부분
      //조건에 부합할 때
      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0]
      } else if (currentYOffset < partScrollStart) {
        rv = values[0]
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1]
      }

    } else {
      //현재 씬의 전체 영역 부분
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  //애니메이션을 관리하는 함수 
  function playAnimation() {

    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values
    const currrentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //얼만큼 스크롤했는지의 비율
    const scrollRatio = currrentYOffset / scrollHeight;

    // console.log('cur',currentScene)
    switch (currentScene) {
      case 0:
        // console.log('0 play');
        //시쿼스에 따라 이미지가 바뀜
        // 인덱스로 사용
        // let sequence = Math.round(calcValues(values.imageSquence, currrentYOffset));
        // //화면에 이미지를 순서대로 보이게 함
        // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        //canvas의 마지막 opacity부분

        objs.canvas.style.opacity = calcValues(values.canvasOpacity, currrentYOffset);

        // console.log('sequence', sequence);

        if (scrollRatio <= 0.22) {
          //in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currrentYOffset)
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currrentYOffset)}%, 0)`;
        } else {
          //out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currrentYOffset)
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currrentYOffset)}%, 0)`;
        }
        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currrentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currrentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currrentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currrentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currrentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currrentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currrentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currrentYOffset)}%, 0)`;
        }
        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currrentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currrentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currrentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currrentYOffset)}%, 0)`;
        }
        break;

      case 2:
        //시쿼스에 따라 이미지가 바뀜
        // let sequence2 = Math.round(calcValues(values.imageSquence, currrentYOffset));
        // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

        // 처음 시작과 마지막 투명도
        if (scrollRatio <= 0.5) {
          //in
          objs.canvas.style.opacity = calcValues(values.canvasOpacity_in, currrentYOffset);
        } else {
          //out
          objs.canvas.style.opacity = calcValues(values.canvasOpacity_out, currrentYOffset);
        }

        if (scrollRatio <= 0.32) {
          // in
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currrentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currrentYOffset)}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currrentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currrentYOffset)}%, 0)`;
        }
        if (scrollRatio <= 0.67) {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currrentYOffset);
          objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_in, currrentYOffset)},0)`;
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currrentYOffset)})`;
        } else {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currrentYOffset);
          objs.messageB.style.transform = `translate3d(0,${calcValues(values.messageB_translateY_out, currrentYOffset)},0)`;
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currrentYOffset)})`;
        }
        if (scrollRatio <= 0.93) {
          // in
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currrentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currrentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currrentYOffset)})`;
        } else {
          // out
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currrentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currrentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currrentYOffset)})`;
        }

        //currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
        //const는 블록레벨 스코프를 가지기 때문에 변수를 지켜줄수 있음
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          //transform scale 조정
          let canvasScaleRatio;
          // 비율에 따라 캔버스의 비율을 다르게함
          if (widthRatio <= heightRatio) {
            //캔버스보다 창이 긴경우
            canvasScaleRatio = heightRatio;
            console.log('heightRatio로 결정');
          } else {
            //캔버스보다 창이 납작한 경우
            canvasScaleRatio = widthRatio;
            console.log('widthRatio 로 결정');
          }
          //scale 조정
          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          //3번째 캔버스의 색을 흰색으로 바꿈 ,fillStyle를 사용한다.
          objs.context.fillStyle = 'white';
          //3번째 캔버스에 이미지 삽입
          objs.context.drawImage(objs.images[0], 0, 0)

          //캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
          const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
          // const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

          const whiteRectWidth = recalculatedInnerWidth * 0.15;

          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          //움직이는 것이 아닌 고정값을 사용
          objs.context.fillRect(
            parseInt(values.rect1X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height)

          objs.context.fillRect(
            parseInt(values.rect2X[0]),
            0,
            parseInt(whiteRectWidth),
            objs.canvas.height);
        }
        break;

      case 3:
        //가로 세로 모두 꽈 차게 하기 위해 세팅(계산 필요)
        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;
        // 비율에 따라 캔버스의 비율을 다른게 하낟.
        if (widthRatio <= heightRatio) {
          //캔버스보다 창이 긴경우
          canvasScaleRatio = heightRatio;
          console.log('heightRatio로 결정');
        } else {
          //캔버스보다 창이 납작한 경우
          canvasScaleRatio = widthRatio;
          console.log('widthRatio 로 결정');
        }
        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        //3번째 캔버스의 색을 흰색으로 바꿈 ,fillStyle를 사용한다.
        objs.context.fillStyle = 'white';
        //3번째 캔버스에 이미지 삽입
        objs.context.drawImage(objs.images[0], 0, 0)

        //캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
        const recalculatedInnerWidth = window.innerWidth / canvasScaleRatio;
        const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

        //values.rectStartY값이 있을때
        //resize 이벤트 곧 창의 크기가 바뀔때 다시 정의를 해준다.
        if (!values.rectStartY) {
          // values.rectStartY = objs.canvas.getBoundingClientRect().top;
          values.rectStartY = objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

          //타이밍
          values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
          console.log('top', values.rectStartY)
        }


        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        //3번 section이 시작되는 부분
        // console.log('3start')

        //fillRect(x축,y축,width,height)
        //좌우 흰 박스 그리기
        // objs.context.fillRect(values.rect1X[0],0,parseInt(whiteRectWidth),recalculatedInnerHeight);
        // objs.context.fillRect(values.rect2X[0],0,parseInt(whiteRectWidth),recalculatedInnerHeight);

        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currrentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height);

        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currrentYOffset)),
          0,
          parseInt(whiteRectWidth),
          objs.canvas.height);

        // console.log(widthRatio, heightRatio);
        console.log(recalculatedInnerWidth, recalculatedInnerHeight);
        if (scrollRatio < values.rect1X[2].end) {
          step = 1;
          console.log('scrollRatio', scrollRatio);
          console.log('캔버스 닿기 전')
          objs.canvas.classList.remove('sticky')
        } else {
          //닿은 이후 //posiiton fixed
          step = 2;
          console.log('캔버스에 닿은 이후')
          console.log('scrollRatio', scrollRatio);
          //이미지 블렌드
          //BlendHeight:[0,0,{start:0,end:0}]
          //BledHeight 애니메이션의 타이밍 설정
          values.BlendHeight[0] = 0;
          values.BlendHeight[1] = objs.canvas.height;
          values.BlendHeight[2].start = values.rect2X[2].end;
          values.BlendHeight[2].end = values.BlendHeight[2].start + 0.2;

          //values에 계산된 BlendHeight 값이 들어가야함,currentYoffset얼만큼 scorll했는지?
          const blendHeight = calcValues(values.BlendHeight, currrentYOffset);
          //캠버스에서 그림을 그림
          objs.context.drawImage(
            objs.images[1],
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
            0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
          );

          objs.canvas.classList.add('sticky');
          //원래크기의 캔버스 - 조정된 크기의 캔버스 / 2
          objs.canvas.style.top = `-${(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

          //이미지 블랜드가 끝난 이후에  
          if (scrollRatio > values.BlendHeight[2].end) {
            //초기값
            values.canvas_sacale[0] = canvasScaleRatio;
            //작아진 크기의 canvas의 비율을 브라우정 화면을 기준으로 해줘야한다.
            values.canvas_sacale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
            values.canvas_sacale[2].start = values.BlendHeight[2].end;
            //구간의 비율을 정함
            values.canvas_sacale[2].end = values.canvas_sacale[2].start + 0.2;
            console.log('초기값,끝 값', values.canvas_sacale[0], values.canvas_sacale[1]);

            objs.canvas.style.transform = `scale(${calcValues(values.canvas_sacale, currrentYOffset)})`;
            objs.canvas.style.marginTop = 0;
          }

          //시점을 나눠줌
          //values.canvas_scale[2].end의 끝난 이후
          //초기에 스크롤을 section3의 영역까지 내리 않았다면 
          //values.canvas_sacale[2].end의 값은 0이기때문에 방어 코드가 필요
          if (scrollRatio > values.canvas_sacale[2].end &&
            values.canvas_sacale[2].end > 0) {
            console.log('스크롤 시작')
            objs.canvas.classList.remove('sticky');
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;


            //opacity 시작 시점
            values.canvasCaption_opacity[2].start = values.canvas_sacale[2].end;
            values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
            values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
            values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;

            objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currrentYOffset);
            objs.canvasCaption.style.transform = `translate3d(0,${calcValues(values.canvasCaption_translateY, currrentYOffset)}%,0)`;

          }
        }
        break;
      case 4:
      if(scrollHeight <= 0.25){
        //in 
        objs.messageA.style.opacity = calcValues(values.messageA_opacity_in,currrentYOffset);
        objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_in,currrentYOffset)}%,0)`;
      }else{
        //out
        objs.messageA.style.opacity  = calcValues(values.messageA_opacity_out,currrentYOffset);
        objs.messageA.style.transform = `translate3d(0,${calcValues(values.messageA_translateY_out,currrentYOffset)}%,0)`;
      }
      if(scrollHeight <= 0.55){
        //in
        objs.messageB.style.opacity = calcValues(values.messageB_opacity_in,currrentYOffset);
      }else {
        //out
        obj.messageB.style.opacity = calcValues(values.messageB_opacity_out,currrentYOffset);
      }
      //크기가 커져도 깨지지안흔ㄴ svg의 장점을 살리기 위해 tranform scale대신 width조정
      if(scrollRATIO <= 0.4){
        objs.pencilLogo.style.width = `${calcValues(valuse.pencilLogo_width_in,currrentYOffset)}vw`;
        objs.pencilLogo.style.transform = `translate3d(${calcValues(values.pencilLogo_translateX_in,currrentYOffset)}%,-50%)`;

      }else{
        objs.pencilLogo.style.width = `${calcValues(values.pencilLogo_width_out,currrentYOffset)}vw`;
        objs.pencilLogo.style.tranform = `translate3d(${calcValues(values.pencilLogo_translateX_out,currrentYOffset)}%,-50%)`;

      }
      //빨간 리본 패스(줄 긋기)
      if(scrollRatio <= 0.5){
        //in
        objs.ribbonPath.style.strokeDashoffset = calcValues(valuse.path_dashoffset_in,currrentYOffset);
      }else{
        //off
        objs.ribbonPath.style.strokeDashoffset = calcValues(values.path_dashoffset_out,currrentYOffset);
      }
      objs.pencilLogo.style.opacity = calcValues(values.pencilLogo_opacity_out,currrentYOffset);
      objs.pencil.style.right = `${calcValues(values.pencil_right,currrentYOffset)}%`;
      objs.pencil.style.bottom = `${calcValues(values.pencil_bottom,currrentYOffset)}%`;
      objs.pencil.style.transform = `rotate(${calcValues(values.pencil_rotate,currrentYOffset)}deg)`;

      break;
    }
  }

  //스크롤을 관리하는 함수
  function scrollLoop() {
    enterNewScene = false
    prevScrollHeight = 0;
    //현재 활성화 시킬 section이 몇 번째 이냐 ?
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;

    }
    if(delayedYOffset < prevScrollHeight +sceneInfo[currentScene].scrollHeight){
      document.body.classList.remove('sticky-effect-end');
    }

    //값을 Yoffset이 아닌 감속을 적용한 변수인 deleayedYOffset을 적용한다.
    if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      //현재의 씬이 마지막 씬일때
      console.log('currentScene',currentScene);
      console.log('sceneInfo.length',sceneInfo.length);
      if(currentScene === sceneInfo.length - 1){
        document.body.classList.add('sticky-effect-end');
      }
      if(currentScene < sceneInfo.length - 1){
        currentScene++;
      }
      
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    //값을 Yoffset이 아닌 감속을 적용한 변수인 deleayedYOffset을 적용한다.
    if (delayedYOffset < prevScrollHeight) {
      enterNewScene = true
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    //enterNewScene이 true가 아닐때 return한다 .넘어간다.오동작을 막아주는 코드. 
    playAnimation();

  }
  //가속도 처리 함수
  function loop() {
    //캔버스에 가속도 부드럽게 처리
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
    //새로운 씬이 아닐때에만 실행하겠다.
    if (!enterNewScene) {
      //currenttScene 첫번째와 세번째일때만 실행
      if (currentScene === 0 || currentScene === 2) {
        //currentYOffset의 값에 yOffset은 delayedYOffset을 이용하여 가속도가 생긴 값을 사용한다.
        const currrentYOffset = delayedYOffset - prevScrollHeight;
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;

        let sequence = Math.round(calcValues(values.imageSquence, currrentYOffset));
        // console.log('sequence', sequence);
        //해당하는 시퀀스 이미지 존재할 때만 그려준다.
        if (objs.videoImages[sequence]) {
          objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        }
      }
    }

    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayedYOffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }

  }

  ///이벤트 핸들러


  //DOMContentLoaded가 실행시간이 더 빠르다.이미지 등 리소스가 로드되지않아도 html만 로드가 되어도 화면에 보여준다.
  //window.addEventListener('DOMContentLoaded',setLayout);
  //load 중일때는 값들이 초기화가 되었지읺는다.
  window.addEventListener('load', () => {

    document.body.classList.remove('before-load');
    //loading은 보이지만않는 요소이기 때문에 메뉴의 요소를 누를 수 없게 만든다.그렇디 땜누에 젝를 해주어야한다.
    //여기서 loading을 바로 지우면 자연스럽게 지우기 힘들다.document.body.removeChlild(document.querySelector('.loading'));
    //트랜지션이 끝이 나면 loading 요소를 제거해 준다.
    setLayout();
    //laod될때 첫 화면에 가장 첫번째 사진을 보이게 함
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);

    let tempYOffset = yOffset;
    let tempScrollCount = 0; //5px씩 몇번했는지 count할 변수
    //스크롤을 했다면 / 스크롤을 안했다면 자동 스크롤을 하지마라
    if (yOffset > 0) {
      let siId = setInterval(() => {
        window.scrollTo(0, tempYOffset);
        tempYOffset += 5;
        if (tempScrollCount > 20) {
          clearInterval(siId);
        }
        tempScrollCount++;
      }, 20);
    }

    //scroll
    window.addEventListener('scroll', () => {
      yOffset = window.pageYOffset;
      //load중일때 scroll을 하면 scrolllop 함수가 호출되기 때문에 애러가 발생하게된다.
      //해결하는 방법은 scorll 이벤트가 발생하는것을 load이벤트가 발생한 이후에 동작하게 해주면 된다.
      scrollLoop();
      checkMenu();

      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });
    //resize
    window.addEventListener('resize', () => {
      // landscape 모드에서 대부분의 디바이스의 너비는 900이 넘어간다.
      if (window.innerWidth > 900) {

        window.location.reload();
        // setLayout();
        // //resize 되었을때 sceneInfo[3].values.restStartY = 0 으로 초기화한다.
        // sceneInfo[3].values.rectStartY = 0;
      }
    });

    //orientationchange 모바일 기기를 방향을 바꿀때 발생하는 이벤트
    //canvas의 크기를 셋팅하는 문제가 있다.
    window.addEventListener('orientationchange', () => {
      scrollTo(0, 0);
      // setTimeout(setLayout, 500);
      setTimeout(() => {
        window.location.reload()
      }, 500);
    });

    //loading에 transitionend라는 이벤트를 바인딩 시켜서 이벤트 객체를 통해 현재 자신의 요소를 removeChild시킨다.
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
      document.body.removeChild(e.currentTarget);
    })

  });



  setCanvasImages();



})();

