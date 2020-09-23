// 모든 애니메이션에 대한 정보를 배열에 담아둠
//전역 변수로 사용하면 네임스페이스오염 가능

// const arr = [1,2,3]

(() => {
  let yOffset = 0; //window.pageYoffset대신 쓸 변수
  let prevScrollHeight = 0 //현재 스크롤의 위치(yOffset)보다 이전에 위치한 스크롤 섹션드의 스크롤 높이값의합
  let currentScene = 0; //현재 눈앞에 보고있는 scroll-section(씬)
  let enterNewScene = false; //새로운 scene이 시작되는 순간시작되는 변수

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
      },
      values: {

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
      //1
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

      },
      values: {
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
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
      }
    },
    { //3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
        canvasCaption:document.querySelector('.canvas-caption')
      },
      values:{

      }
    },
  ];

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
    console.log('total', totalScrollHeight)
    document.body.setAttribute('id', `show-scene-${currentScene}`);
  }
  //currentYoffset은 현재의 씬이 얼마나 스크롤 되었는지?
  //비율계산 함수
  function calcValues(values, currentYOffset) {
    let rv;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    //비율 현재 씬에 스크롤된 범위를 비율로 정하기
    const scrollRatio = currentYOffset / scrollHeight
    // 분기처리가 필요하다. /3 번째 함수 객체가 있을 경우에
    console.log(values)
    if (values.length == 3) {
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
        if (scrollRatio <= 0.32) {
                // in
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currrentYOffset);
                objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currrentYOffset)}%, 0)`;
            } else {
                // out
                objs.messageA.style.opacity = calcValues(values.messageA_opacity_out,currrentYOffset);
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

        break;
      case 3:
        console.log('3 play');
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
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (yOffset < prevScrollHeight) {
      enterNewScene = true
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
    if (enterNewScene) return;
    //enterNewScene이 true가 아닐때 return한다 .넘어간다.오동작을 막아주는 코드. 
    playAnimation();

    console.log('prev', prevScrollHeight);
    console.log('currentScene', currentScene);
    console.log('yOffset', yOffset);
  }

  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();

  })
  window.addEventListener('resize', setLayout)

  //DOMContentLoaded가 실행시간이 더 빠르다.이미지 등 리소스가 로드되지않아도 html만 로드가 되어도 화면에 보여준다.
  //window.addEventListener('DOMContentLoaded',setLayout);
  window.addEventListener('load', setLayout);


})();

