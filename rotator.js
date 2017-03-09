(function(){
	'use strict'

	//set up initial conditions

	const imgs = ["0","1","10","100","101","102","103","104","105","106","107","108","109","11","110","111","112","113","114","115","116","117","118","119","12","13","14","15","16","17","18","19","2","20","21","22","23","24","25","26","27","28","29","3","30","31","32","33","34","35","36","37","38","39","4","40","41","42","43","44","45","46","47","48","49","5","50","51","52","53","54","55","56","57","58","59","6","60","61","62","63","64","65","66","67","68","69","7","70","71","72","73","74","75","76","77","78","79","8","80","81","82","83","84","85","86","87","88","89","9","90","91","92","93","94","95","96","97","98","99"].sort(function(a,b) {return a-b})

	//const path = 'https://s3-us-west-1.amazonaws.com/blueprint-cdn.searchoptics.com/356e7c861f61d54faa1df3008bace721/hb20InteriorBrown/t-none.brown.382723.0.'
	const path = 'https://s3-us-west-1.amazonaws.com/blueprint-cdn.searchoptics.com/356e7c861f61d54faa1df3008bace721/hb20InteriorBrown/none.brown.382723.0.'

	const step = 25 //how many pixels to drag the mouse till the image changes once
	const stride = 20 //how many images per row

	const rotatorelem = document.getElementById('rotator')

	let img = 0 //current image shown
	let newimg = 60 //initial image. Also, calculated image.

	let startrow = Math.floor(newimg/stride)
	let startcol = newimg%stride

	let mousestartx 
	let mousestarty 

	let isdragging = false

	let xdist = 0
	let ydist = 0


	//event listeners

	rotatorelem.addEventListener('mousedown', e => {
		e.stopPropagation()
		e.preventDefault()
		isdragging = true
		xdist = ydist = 0
		mousestartx = e.pageX
		mousestarty =  e.pageY 
		startrow = Math.floor(newimg/stride)
		startcol = newimg%stride

		console.log(`mousedown : img : ${img} newimg : ${newimg}`)
	})

	rotatorelem.addEventListener('mouseup', e => {
		isdragging = false	
	})

	rotatorelem.addEventListener('mousemove', e => {
		if(isdragging) {
			[ xdist, ydist ] = [ e.pageX - mousestartx, e.pageY - mousestarty ]
			setImageNumber()
			drawImage()
			drawGraph() 
		}
	})

	rotatorelem.addEventListener('mouseleave', e => {
		isdragging = false
	})


	//helper functions

	let setImageNumber = () => {

		let row = Math.floor(img/stride) //what row were on
		let col = img%stride //what col were on

		let movex = Math.floor(-xdist / step)
		let movey = Math.floor(-ydist / step)

		let newrow = startrow + movey%Math.floor(imgs.length/stride)
		if(newrow < 1) newrow = 1

		let newcol = startcol + movex 

		/*console.log(`movex:${movex}   movey:${movey} 
	newrow:${newrow}   newcol:${newcol} 
	img:${img}   newimg:${newimg}
	xdist:${xdist}   ydist:${ydist}`)*/
		
		if( newrow >= Math.floor(imgs.length/stride - 1) ) 
			newrow = Math.floor(imgs.length/stride - 1)	

		if(newrow < 0)
			newrow = row

		newimg = stride * newrow + newcol
		
		if(newimg > imgs.length -1) 
			newimg = img
		
		if(newimg < 0) 
			newimg = img		
	}


	let drawImage = () => {

		if(img !== newimg) { //only redraw if img is now different
			console.log(`changing image from ${img} to ${newimg}`)		
			img = newimg
			requestAnimationFrame( function() {
				rotatorelem.style.backgroundImage = `url(${path}${newimg}.jpg)`	
			})
		}
		
	}
	drawImage();


	//preload images
	// (function(array){
	//     var list = [];
	//     for (let i = 0; i < array.length; i++) {
	//         let img = new Image();
	//         img.onload = function() {
	//             let index = list.indexOf(this)
	//             if (index !== -1) {
	//                 list.splice(index, 1)
	//             }
	//         }
	//         list.push(img);
	//         img.src = array[i];
	//     }
	// })(imgs.map( e => `${path}${e}.jpg` ))


	let drawGraph = () => {
		let graph = document.getElementById('graph')
		if(graph === null) {
			console.log('creating graph')

			graph = document.createElement('div')
			graph.setAttribute('id', 'graph')

			let body = document.getElementsByTagName('body')[0]
			body.append(graph)

			imgs.forEach( (e, i) => {
				let tmpdiv = document.createElement('div')
				let tmpp = document.createElement('p')
				let tmptextnode = document.createTextNode(e)
				tmpp.append(tmptextnode)
				tmpdiv.append(tmpp)
				graph.append(tmpdiv)
			})
		}

		let active = document.getElementsByClassName('active')[0]
		if(active) 
			active.classList.remove('active')

		document.querySelectorAll(`#graph > div:nth-child(${img+1})`)[0].classList.add('active')
	}

})()