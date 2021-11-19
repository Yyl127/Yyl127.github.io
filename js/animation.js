//通过动画的方式显示数字
function showNumberWithAnimation(i,j,randNum){

    let numberCell=$('#number-cell-'+i+'-'+j);
    numberCell.css('background-color',getNumberBackgroundColor(randNum));
    numberCell.css('color',getNumberColor(randNum));
    numberCell.text(randNum);
	numberCell.animate({ 
		width:cellWidth,
		height:cellWidth, 
        top:getPosTop(i),
        left:getPosLeft(j)
	}, 500 );


}

//通过动画显示移动
function showMoveAnimation(fromx,fromy,tox,toy){
	 let numberCell=$('#number-cell-'+fromx+'-'+fromy);
	 numberCell.animate({ 
        top:getPosTop(tox),
        left:getPosLeft(toy)
	}, 500);
}