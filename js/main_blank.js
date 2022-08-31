(() => {
	
	let yOffset = 0; // window.pageYOffset 대신 쓸 변수
	let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 값의 합
	let currentScene = 0; // 현재 보고있는 씬(scroll-section)
	let enterNewScene = false;
	
	let acc = 0.1;
	let delayedYOffset = 0;
	let rafId;
	let rafState;
	
	const sceneInfo = [
		{
			// 0
			type: 'sticky',
			heightNum: 6, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0, // scrollHeight 선언
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
				canvas: document.querySelector('#video-canvas-0'),
				context: document.querySelector('#video-canvas-0').getContext('2d'),
				videoImages: []
			},
			values: {
				videoImageCount: 300,
				imageSequence: [0,299],
				canvas_opacity_out: [1, 0, { start: 0.8, end: 1 }],
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
				//TODO opcacity와 transY 변수와 start, end 변수들을 따로 저장하고, 뚜렷하게 보여줄수 없을까?
			}
		},
		{
			// 1
			type: 'normal',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1')
			}
		},
		{
			// 2
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
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
				videoImages: []
			},
			values: {
				videoImageCount: 960,
				imageSequence: [0,959],
				canvas_opacity_in: [0, 1, { start: 0, end: 0.15 }],
				canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
				messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
				messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
				messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
				messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
				messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
				pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
				pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
				pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
				pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
			}
		},
		{
			// 3
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				// 기존과 달리 canvasCaption 추가됨.
				canvas: document.querySelector('.image-blend-canvas'),
				context: document.querySelector('.image-blend-canvas').getContext('2d'),
				imagesPath: [
					'./images/blend-image-1.jpg',
					'./images/blend-image-2.jpg'
				],
				images:[]
			},
			values: {
				rect1X: [0, 0, {start: 0, end: 0}],
				rect2X: [0, 0, {start: 0, end: 0}],
				blendHeights: [0, 0, {start: 0, end: 0}],
				canvas_scale: [0, 0, {start: 0, end: 0}],
				canvasCaption_opacity: [0, 1, {start: 0, end: 0}],
				canvasCaption_translateY: [0, 1, {start: 0, end: 0 }],
				rectStartY: 0,
			}
		}
	]
	
	function setCanvasImages() {
		let imgElem;
		for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
			//imgElem = document.createElement('img');
			imgElem = new Image();
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
			//첫번째 videoImages 배열에 src주소에 있는 이미지들을 넣어줌.
		}
		let imgElem2;
		for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
			imgElem2 = new Image();
			imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}
		let imgElem3;
		for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++ ) {
			imgElem3 = new Image();
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}
	}
	
	function checkMenu() {
		if (yOffset > 44 /* global-nav의 height*/ ) {
			document.body.classList.add('local-nav-sticky');
		} else {
			document.body.classList.remove('local-nav-sticky');
		}
	}
	
	function setLayout() {
		// 각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; // 창의 높이 * 5 로 scrollHeight 설정
			if (sceneInfo[i].type === 'stikcy') {
				sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`; // #scroll-section-0.style.height = scroll.height px 로 설정 `${변수} px`
			} else if(sceneInfo[i].type === 'normral'){
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
			}
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}
		
		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for (let i = 0; i< sceneInfo.length; i++) {
			totalScrollHeight += sceneInfo[i].scrollHeight;
			if(totalScrollHeight >= yOffset) { /* for loop마다 scrollHeight와 pageYOffset을 비교, F5 실행 시에도 show-scene이 정확하게 설정되도록 해야함 */
			currentScene = i;
			break;
		}
	}
	document.body.setAttribute('id',`show-scene-${currentScene}`);
	
	const heightRatio = window.innerHeight / 1080;
	sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
	/* sticky-elem-canvas cavnas를 top, left를 50%로 두고, translate로 반대로 밀어버려 가운데 정렬 +) //TODO margin-top, left를 height, width의 절반만큼 밀어버려도 된다.*/
}

	function calcValues(values_arr, currentYOffset /*현재 얼마나 스크롤 되었는지 */) {
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		// 현재 씬에서 스크롤된 범위의 비율
		const scrollRatio = currentYOffset / scrollHeight;
		
		if (values_arr.length === 3) {
			// start - end 사이에 애니메이션 실행
			const partScrollStart = values_arr[2].start * scrollHeight;
			const partScrollEnd = values_arr[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;
			
			const partScrollRatio = (currentYOffset - partScrollStart) / partScrollHeight;
			//rv = scrollRatio * (values_arr[1] - values_arr[0]) + values_arr[0];
			//TODO 왜 음수가 나오는 경우가 생기는지?
			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = partScrollRatio * (values_arr[1] - values_arr[0]) + values_arr[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values_arr[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values_arr[1];
			}
			//TODO if문을 나누지 않고 [values_arr0 : "0:a", values_arr : "a:b", values_arr1: "b:1"] 로 구현할 수 없는지?
			
		} else {
			rv = scrollRatio * (values_arr[1] - values_arr[0]) + values_arr[0];
		}
		
		return rv;
	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight; /* sceneInfo[currentScene].scrollHeight 와의 차이? = 4615 */
		
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		//TODO function calcValues에서도 쓰이는데 전역변수로 만들수는 없는지?
		const scrollRatio = currentYOffset / scrollHeight;
		
		switch (currentScene) {
			case 0:
			
			// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
			// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
			// 부드러운 감속 적용하기

			objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
			
			// console.log('0 play');
			if (scrollRatio <= 0.22) {
				// in
				objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
				objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
			} else {
				// out
				objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
				objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
			}
			
			if (scrollRatio <= 0.42) {
				// in
				objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
				objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
			} else {
				// out
				objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
				objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
			}
			
			if (scrollRatio <= 0.62) {
				// in
				objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
				objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
			} else {
				// out
				objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
				objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
			}
			
			if (scrollRatio <= 0.82) {
				// in
				objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
				objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
			} else {
				// out
				objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
				objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
			}
			
			break;
			// no case 1:
			// break;
			
			case 2:
				// let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
				// objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

				if (scrollRatio <= 0.5) {
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
					
				} else {
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}
				// console.log('2 play');
				if (scrollRatio <= 0.25) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
				
				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}
				
				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}
				
				if (scrollRatio > 0.9) {
					// currentScene3의 canvas를 미리 그려주기 위함
					const objs = sceneInfo[3].objs;
					const values = sceneInfo[3].values;
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;
					
					if (widthRatio <= heightRatio) {
						canvasScaleRatio = heightRatio;
					} else {
						canvasScaleRatio = widthRatio;
					}
					
					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = 'white';
					objs.context.drawImage(objs.images[0], 0, 0);
					
					const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
					
					const whiteRectWidth = recalculatedInnerWidth * 0.15;
					values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
					values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
					
					objs.context.fillRect(
						parseInt(values.rect1X[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
						);
					objs.context.fillRect(
						parseInt(values.rect2X[0]),
						0,
						parseInt(whiteRectWidth),
						objs.canvas.height
						);
							
				}
					
			break;

			case 3:
				let step = 0; // scroll에 따른 동작을 step으로 구분
				//가로, 세로 모두 꽉차도록 세팅해야함
				//디스플레이 크기와 방향에 따라 비율의 크기가 달라짐.
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				let canvasScaleRatio;
				
				if (widthRatio <= heightRatio) {
					canvasScaleRatio = heightRatio;
				} else {
					canvasScaleRatio = widthRatio;
				}
				
				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = 'white';
				objs.context.drawImage(objs.images[0], 0, 0);
				
				//캔버스 사이즈에 맞춰 가정한 innerWidth 와 innerHeight
				const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
				// MEMO window.innerWidth 는 스크롤바 영역이 제외되어 계산이 정확하지 않음.
				const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
				
				if (!values.rectStartY) {
					//values.rectStartY = objs.canvas.getBoundingClientRect().top;
					//MEMO 스크롤 속도에 따라 값이 달라지는 문제가 있음
					values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height *(1-canvasScaleRatio)) / 2;
					// MEMO canvas.offsetTop을 그냥 사용하면 바뀐 canvas의 크기를 고려하지 않아 실제 값보다 작게나와 동작이 예상보다 일찍 끝나게 됨.
					values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					// 창사이즈 절반을 비율로 나누어줌.
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}
				
				const whiteRectWidth = recalculatedInnerWidth * 0.1;
				// MEMO 계수값을 임의로 건드렸더니, 추후 mid-message width를 1000px로 두었을 때 맞지 않는 문제가 생겨 0.1로 수정
				// 출발값: ( )전체 canvas너비에서 화면 너비를 뺀 값 ) = 남는 부분을 2로 나눔.
				values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
				// 최종값: 왼쪽 흰 박스 영역이 자기 너비만큼 왼쪽으로 밀림.
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
				values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
				// 최종값: 처음 출발값에서 자기 너비만큼 오른쪽으로 이동
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
				
				/*
				// 좌우 흰색 박스 그리기
				objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
				//TODO objs.canvas.height = recalculatedInnerHeight? 둘은 같지 않은듯
				//TODO 작은 화면에서 이미지의 중요부분이 깨지는 것은 고려하지 않은듯
				*/
				objs.context.fillRect(
					parseInt(calcValues(values.rect1X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
				objs.context.fillRect(
					parseInt(calcValues(values.rect2X, currentYOffset)),
					0,
					parseInt(whiteRectWidth),
					objs.canvas.height
				);
					
				// step 1
				if (scrollRatio < values.rect1X[2].end) {
					step = 1;
					//  console.log('캔버스 닿기 전');
					objs.canvas.classList.remove('sticky');
				} else {
					step = 2;
					//  console.log('캔버스 닿기 후');
					values.blendHeights[0] = 0;
					values.blendHeights[1] = objs.canvas.height;
					values.blendHeights[2].start = values.rect1X[2].end;
					values.blendHeights[2].end = values.blendHeights[2].start + 0.25;
					
					const blendHeights = calcValues(values.blendHeights, currentYOffset);
					//TODO class.getContext('2d').context.drawImage( ??? )
					objs.context.drawImage(
						objs.images[1],
						0, objs.canvas.height - blendHeights, objs.canvas.width, blendHeights,
						0, objs.canvas.height - blendHeights, objs.canvas.width, blendHeights,
					);
						
					objs.canvas.classList.add('sticky');
					objs.canvas.style.top = `${-objs.canvas.height * (1-canvasScaleRatio) / 2}px`;
					
					if (scrollRatio > values.blendHeights[2].end){
						values.canvas_scale[0] = canvasScaleRatio;
						values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
						values.canvas_scale[2].start = values.blendHeights[2].end;
						values.canvas_scale[2].end = values.canvas_scale[2].start + 0.25;
						
						objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
						objs.canvas.style.marginTop = 0;
						// MEMO 스크롤이 다시 올라갔을 때 다시 marginTop = 0으로 해주어 초기화
					}
					
					if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
						objs.canvas.classList.remove('sticky');
						objs.canvas.style.marginTop = `${scrollHeight * 0.5}px`;
						// MEMO 스크롤이 다시 올라갈 떄 부여된 marginTop 때문에 canvas가 보이지 않음.
						// TODO scrollHeight * (앞선 blendHeight.end 계수와 cavnas_scale.end의 계수를 합한 값) 을 넣어주면 딱 맞게 marginTop이 계산됨. HOW?
						
						values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
						values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
						
						values.canvasCaption_translateY[2].start = values.canvas_scale[2].end;
						values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].start + 0.1;
						
						
						objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
						objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
					}
				}
						
				break;
							}
	}

	function scrollLoop() {
		enterNewScene = false;
		prevScrollHeight = 0;
		for (let i=0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}
		
		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length-1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length-1){
				currentScene++;
			}
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}
		if (delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			if (currentScene === 0) return; // 브라우저 바운스 효과로 yOffset이 음수인 경우 방지
			currentScene--;
			document.body.setAttribute('id',`show-scene-${currentScene}`);
		}
		
		if (enterNewScene) return; // newScene에 들어가면 playAnimation()실행없이 함수종료(아주잠깐)
		//TODO enterNewScene consolelog해보기, 적절한 방법test, 더나은방법find
		
		playAnimation();
		
		// document.body.setAttribute('id',`show-scene-${currentScene}`); 새로고침 시에 할당해주므로, if문 안에서 바뀔 때만 설정해주어도 된다.
	}

	function loop() {
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
		
		if (!enterNewScene) {
			// enterNewScene이 false일때만 실행, currentScene이 감소할때 처음 이미지가 보이는 현상 해결
			if (currentScene === 0 || currentScene === 2) {
				
				const currentYOffset = delayedYOffset - prevScrollHeight;
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;

				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				if (objs.videoImages[sequence]){
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


	//window.addEventListener('DOMContentLoaded',setLayout); // html,css 요소만 load 되면 바로 실행
	window.addEventListener('load',() => {
		document.body.classList.remove('before-loading');
		// document.body.removeChild(document.querySelector('.loading'));
		// 남아있는 원형 부분을 없애야함. 여기에서 바로 없애면 부자연스럽게 넘어감.
		setLayout();
		sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
		// 처음 load할 시에 머그컵 image를 바로 보여주게 하기 위함.
		
		let tempYoffset = yOffset;
		let tempScrollCount = 0;
		
		// 중간에 새로고침 시 자연스럽게 나타나게
		if(yOffset > 0) {
			// 스크롤 맨 상단일 때 약간 밀리는 것을 방지
			let siID = setInterval(() => {
				window.scrollTo(0, tempYoffset);
				tempYoffset += 5;
				// 현재 yOffset으로 scroll이동 후, 약간 움직임
	
				if (tempScrollCount > 6) {
					clearInterval(siID);
				}
				tempScrollCount++;
			}, 20);

		}
		
		// load 도중 scroll시 오류를 없애기 위해 load handler안에 넣어줌.
		//TODO window.pageYOffset을 쓰면 밑줄 X, pageYOffset을쓰면 취소선, scrollY가 최신
		window.addEventListener('scroll',() =>{
			yOffset = window.pageYOffset;
			scrollLoop(); /*scroll 하면 실행되는 함수 */
			checkMenu();
			
			if (!rafState) {
				rafId = requestAnimationFrame(loop);
				rafState = true;
			}
		})
		window.addEventListener('resize', () => {
			if (window.innerWidth > 900) {
				// setLayout();
				// sceneInfo[3].values.rectStartY = 0;
				window.location.reload();
			}
		});
		window.addEventListener('orientationchange', () => {
			scrollTo(0,0);
			setTimeout(() => {
				window.location.reload();
			}, 500);
		});
		//MEMO 자연스럽게 로딩 화면 구성하기 위해 loading이 transition_end 되고나면 현재 class를 제거해준다!
		document.querySelector('.loading').addEventListener('transitionend', (e) => {
			document.body.removeChild(e.currentTarget);
		});
	});
	setCanvasImages();

})();