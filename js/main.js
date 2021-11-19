//定义移动端尺寸
//页面dom的宽度
let documentWidth = document.documentElement.clientWidth;
//console.log(documentWidth);
//棋盘的宽度
let containerWidth = documentWidth * 0.92;
//棋子的宽度
let cellWidth = documentWidth * 0.18;
//棋子的间隔宽度
let cellSpace = documentWidth * 0.04;

//定义滑动时的坐标
let startx = 0;
let starty = 0;
let endx = 0;
let endy = 0;




let nums = new Array();
let score = 0;
//定义一个数组，设置是否已经叠加，用于解决单元格重复叠加的问题
let hasConflicted = new Array();

$(function() {
    newGame();
});


//开始游戏
function newGame() {
    if (documentWidth > 500) {
        containerWidth = 500;
        cellWidth = 100;
        cellSpace = 20;
    } else {
        //设置移动端尺寸
        settingForMobile();
    }

    init();
    //在上层单元格随机找到一个空白格，填上一个随机数2或4
    generateOneNumber();
    generateOneNumber();
}

function settingForMobile() {
    $('#header .wrapper').css('width', containerWidth);

    $('#grid-container').css('width', containerWidth - cellSpace * 2);
    $('#grid-container').css('height', containerWidth - cellSpace * 2);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', containerWidth * 0.02);

    $('.grid-cell').css('width', cellWidth);
    $('.grid-cell').css('height', cellWidth);
    $('.grid-cell').css('border-radius', containerWidth * 0.02);




}

//初始化界面
function init() {
    //初始化棋盘，底层单元格
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getPosTop(i));
            gridCell.css('left', getPosLeft(j));
        }
    }

    //初始化数组,将二维数组中值设置为0
    for (let i = 0; i < 4; i++) {
        nums[i] = new Array();
        hasConflicted[i] = new Array();
        for (let j = 0; j < 4; j++) {
            nums[i][j] = 0;
            //将所有格子设置为未叠加状态
            //false--》表示未叠加，true--->表示已叠加
            hasConflicted[i][j] = false;
        }
    }

    //手动设置3个棋子
    // nums[0][1]=16;
    // nums[1][3]=32;
    // nums[2][2]=8;

    //更新上层单元格视图
    updateView();

    //重置分数
    score = 0;
    updateScore(score);




}

//更新上层单元格视图
function updateView() {
    //将上层所有单元格清空，然后重新初始化创建
    $('.number-cell').remove();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            //在每一个格子上增加一个图层，1.没有值，默认值为0,2.初始的那三个值
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '" ></div>');
            //获取这每一个div
            let numberCell = $('#number-cell-' + i + '-' + j);
            if (nums[i][j] == 0) {
                numberCell.css('width', '0px');
                numberCell.css('height', '0px');
                numberCell.css('top', getPosTop(i));
                numberCell.css('left', getPosLeft(j));

            } else {
                numberCell.css('width', cellWidth);
                numberCell.css('height', cellWidth);
                numberCell.css('top', getPosTop(i));
                numberCell.css('left', getPosLeft(j));
                numberCell.css('background-color', getNumberBackgroundColor(nums[i][j]));
                numberCell.css('color', getNumberColor(nums[i][j]));
                numberCell.text(nums[i][j]);
            }
            //保证下一次移动时，相同可以进行叠加
            hasConflicted[i][j] = false;

            //适配移动端尺寸
            $('.number-cell').css('font-size', cellWidth * 0.5);
            $('.number-cell').css('border-radius', cellWidth * 0.06);
            $('.number-cell').css('line-height', cellWidth + 'px');
        }
    }
}
/*
   在上层单元格随机找到一个空白格，填上一个随机数2或4
   1.在空闲的单元格中去随机找到一个
   2.随机产生2或4
 */
function generateOneNumber() {

    //判断是否还有空间，如果没有空间则直接返回
    if (noSpace(nums)) {
        return;
    }
    let tmp = new Array();
    let count = 0;
    //随机一个位置
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (nums[i][j] == 0) {
                //将该二维数组的下标转成值写入一维数组中:
                //原理：二维---》一维：i*4+j
                //     一维----》二维：i=floor(n/4),j=floor(n%4)
                tmp[count] = i * 4 + j;
                count++;
            }
        }
    }
    //获取一维数组中的随机位置,向下取整
    let pos = Math.floor(Math.random() * count); //[0,1]--->[0,count-1]
    // 一维----》二维坐标：i=floor(n/4),j=floor(n%4)
    let randx = Math.floor(tmp[pos] / 4);
    let randy = Math.floor(tmp[pos] % 4);

    //获取随机值2,或者4
    let randNum = Math.random() < 0.5 ? 2 : 4

    //在随机位置上显示随机数字
    nums[randx][randy] = randNum;
    //通过动画的方式显示数字
    showNumberWithAnimation(randx, randy, randNum);


}

$(document).keydown(function(evt) {
    //阻止事件的默认动作
    evt.preventDefault();
    evt = window.event || evt;
    //console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 37: //left
            //判断是否可以向左移动
            if (canMoveLeft(nums)) {
                //console.log(11)
                moveLeft();
                //移动完成后，重新生成一个数字2/4,延迟0.2秒，让移动操作完成
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000); //时间必须大于动画显示的时间，在游戏结束之前先让棋子显示完成
            }
            break;
        case 38: //up
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }
            break;
        case 39: //right
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }

            break;
        case 40: //down
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }

            break;
        default:
            // statements_def
            break;
    }
});

//向左移动
//需求
//需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况
//a.落脚点没有数字，并且移动的路径中没有障碍物
//b.落脚点数字和自己相同，并且移动的路径中没有障碍物
function moveLeft() {
    for (var i = 0; i < 4; i++) { //行
        for (var j = 1; j < 4; j++) { //列
            //console.log(nums[i][j]);
            if (nums[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    //如果当前没有值，并且在当前行的左侧没有障碍物
                    if (nums[i][k] == 0 && noBlockHorizontal(i, k, j, nums)) {

                        showMoveAnimation(i, j, i, k); //设置移动的动画效果
                        //移动
                        nums[i][k] = nums[i][j]; //将值移过去
                        nums[i][j] = 0; //原来值置0
                        break; //跳出循环，后面的数字不再判断
                    }
                    //b.落脚点数字和自己相同，并且移动的路径中没有障碍物,并且该格子处于未叠加状态
                    else if (nums[i][k] == nums[i][j] && noBlockHorizontal(i, k, j, nums) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //设置移动的动画效果
                        nums[i][k] *= 2;
                        nums[i][j] = 0;
                        //统计分数
                        score += nums[i][k];
                        //更新成绩
                        updateScore(score);
                        //更新叠加状态，设置为已叠加
                        hasConflicted[i][k] = true;
                        break;

                    }

                }
            }
        }
    }
    //更新页面上的数字单元格
    setTimeout(updateView, 500);
}
//向右移动
function moveRight() {
    for (var i = 0; i < 4; i++) { //行
        for (var j = 2; j >= 0; j--) { //列
            //console.log(nums[i][j]);
            if (nums[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    //如果当前没有值，并且在当前行的左侧没有障碍物
                    if (nums[i][k] == 0 && noBlockHorizontal(i, j, k, nums)) {

                        showMoveAnimation(i, j, i, k); //设置移动的动画效果
                        //移动
                        nums[i][k] = nums[i][j]; //将值移过去
                        nums[i][j] = 0; //原来值置0
                        break; //跳出循环，后面的数字不再判断
                    }
                    //b.落脚点数字和自己相同，并且移动的路径中没有障碍物,并且该格子处于未叠加状态
                    else if (nums[i][k] == nums[i][j] && noBlockHorizontal(i, j, k, nums) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k); //设置移动的动画效果
                        nums[i][k] *= 2;
                        nums[i][j] = 0;
                        //统计分数
                        score += nums[i][k];
                        //更新成绩
                        updateScore(score);
                        //更新叠加状态，设置为已叠加
                        hasConflicted[i][k] = true;
                        break;

                    }

                }
            }
        }
    }
    //更新页面上的数字单元格
    setTimeout(updateView, 500);
}

//向上移动
function moveUp() {
    for (var j = 0; j < 4; j++) { //列
        for (var i = 1; i < 4; i++) { //行
            //console.log(nums[i][j]);
            if (nums[i][j] != 0) {
                for (let k = 0; k < i; k++) {
                    //如果当前没有值，并且在当前行的左侧没有障碍物
                    if (nums[k][j] == 0 && noBlockVertical(j, k, i, nums)) { //第j列的第k-i行之间是否有障碍物

                        showMoveAnimation(i, j, k, j); //设置移动的动画效果
                        //移动
                        nums[k][j] = nums[i][j]; //将值移过去
                        nums[i][j] = 0; //原来值置0
                        break; //跳出循环，后面的数字不再判断
                    }
                    //b.落脚点数字和自己相同，并且移动的路径中没有障碍物,并且该格子处于未叠加状态
                    else if (nums[k][j] == nums[i][j] && noBlockVertical(j, k, i, nums) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //设置移动的动画效果
                        nums[k][j] *= 2;
                        nums[i][j] = 0;
                        //统计分数
                        score += nums[k][j];
                        //更新成绩
                        updateScore(score);
                        //更新叠加状态，设置为已叠加
                        hasConflicted[k][j] = true;
                        break;

                    }

                }
            }
        }
    }
    //更新页面上的数字单元格
    setTimeout(updateView, 500);
}

//向下移动
function moveDown() {
    for (var j = 0; j < 4; j++) { //列
        for (var i = 2; i >= 0; i--) { //行
            //console.log(nums[i][j]);
            if (nums[i][j] != 0) {
                for (let k = 3; k > i; k--) {
                    //如果当前没有值，并且在当前行的左侧没有障碍物
                    if (nums[k][j] == 0 && noBlockVertical(j, i, k, nums)) { //第j列的第i-k行之间是否有障碍物

                        showMoveAnimation(i, j, k, j); //设置移动的动画效果
                        //移动
                        nums[k][j] = nums[i][j]; //将值移过去
                        nums[i][j] = 0; //原来值置0
                        break; //跳出循环，后面的数字不再判断
                    }
                    //b.落脚点数字和自己相同，并且移动的路径中没有障碍物,并且该格子处于未叠加状态
                    else if (nums[k][j] == nums[i][j] && noBlockVertical(j, i, k, nums) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j); //设置移动的动画效果
                        nums[k][j] *= 2;
                        nums[i][j] = 0;
                        //统计分数
                        score += nums[k][j];
                        //更新成绩
                        updateScore(score);
                        //更新叠加状态，设置为已叠加
                        hasConflicted[k][j] = true;
                        break;

                    }

                }
            }
        }
    }
    //更新页面上的数字单元格
    setTimeout(updateView, 500);
}

//实现触摸滑动响应
document.addEventListener('touchstart', function(evt) {
    evt = window.event || evt;
    //console.log('e1--->'+evt);
    startx = evt.touches[0].pageX;
    starty = evt.touches[0].pageY;

});

document.addEventListener('touchend', function(evt) {
    evt = window.event || evt;
    //console.log('e2--->'+evt);
    endx = evt.changedTouches[0].pageX;
    endy = evt.changedTouches[0].pageY;

    //判断滑动方向
    let deltax = endx - startx;
    let deltay = endy - starty;

    //判断当前滑动距离小于一定的值时，不做任何操作
    if (Math.abs(deltax) < documentWidth * 0.08 && Math.abs(deltay) < documentWidth * 0.08) {
        return;
    }

    if (Math.abs(deltax) >= Math.abs(deltay)) { //水平方向移动
        if (deltax > 0) { //向右移动
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }

        } else { //向左移动
            if (canMoveLeft(nums)) {
                //console.log(11)
                moveLeft();
                //移动完成后，重新生成一个数字2/4,延迟0.2秒，让移动操作完成
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000); //时间必须大于动画显示的时间，在游戏结束之前先让棋子显示完成
            }
        }

    } else { //垂直方向移动
        if (deltay > 0) { //向下移动
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }
        } else { //向上移动
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber, 500);
                setTimeout(isGameOver, 1000);
            }
        }

    }


});