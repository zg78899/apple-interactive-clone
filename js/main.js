// 모든 애니메이션에 대한 정보를 배열에 담아둠
//전역 변수로 사용하면 네임스페이스오염 가능

// const arr = [1,2,3]

(() => {
  let yOffset = 0; //window.pageYoffset대신 쓸 변수
  let prevScrollHeight = 0 //현재 스크롤의 위치(yOffset)보다 이전에 위치한 스크롤 섹션드의 스크롤 높이값의합
  let currentScene = 0; //현재 눈앞에 보고있는 scroll-section(씬)

  //1.스크롤의 높이 ,2.
  const sceneInfo = [
    {
      //0
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0')
      }
    },
    {
      //1
      type: 'normal',
      heightNum: 5,
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
        container: document.querySelector('#scroll-section-2')
      }
    },
    { //3
      type: 'sticky',
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3')
      }
    },
  ];

  function setLayout() {
    //각 스크롤의 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }
    //curentScene 
    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for(let i =0;i<sceneInfo.length;i++){
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if(totalScrollHeight >= yOffset){
        currentScene = i;
        break;
      }
    }
    console.log('total',totalScrollHeight)
    document.body.setAttribute('id',`show-scene-${currentScene}`);
  }
  
  function scrollLoop(){
    prevScrollHeight = 0;
    //현재 활성화 시킬 section이 몇 번째 이냐 ?
    for(let i =0;i<currentScene;i++){
      prevScrollHeight +=sceneInfo[i].scrollHeight;

    }
    if(yOffset > prevScrollHeight+sceneInfo[currentScene].scrollHeight){
      currentScene++;
      document.body.setAttribute('id',`show-scene-${currentScene}`);
    }
    if(yOffset < prevScrollHeight){
      if(currentScene === 0)return;
      currentScene--;
      document.body.setAttribute('id',`show-scene-${currentScene}`);
    }
    

    console.log('prev',prevScrollHeight);
    console.log('currentScene',currentScene);
    console.log('yOffset',yOffset);
  }

  window.addEventListener('resize',setLayout)

  //DOMContentLoaded가 실행시간이 더 빠르다.이미지 등 리소스가 로드되지않아도 html만 로드가 되어도 화면에 보여준다.
  //window.addEventListener('DOMContentLoaded',setLayout);
  window.addEventListener('load',setLayout);
  window.addEventListener('scroll',()=>{
    yOffset = window.pageYOffset;
    scrollLoop();
  })
  

})();

