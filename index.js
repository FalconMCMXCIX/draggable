document.addEventListener("DOMContentLoaded", function() {
    let active = false;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let activeElement = null;
    let initialLeft = 0;
    let initialTop = 0;
    let arrows = document.getElementById('arrows');


    document.addEventListener("mousedown", dragStart);
    updateArrows()
    function dragStart(e) {
        if (e.target.classList.contains("draggable")) {
            activeElement = e.target;
            initialX = e.clientX - activeElement.getBoundingClientRect().left;
            initialY = e.clientY - activeElement.getBoundingClientRect().top;
            initialLeft = activeElement.offsetLeft;
            initialTop = activeElement.offsetTop;
            active = true;
            updateArrows();
        }
    }

    document.addEventListener("mouseup", dragEnd);

    function dragEnd() {
        active = false;
        activeElement = null;
        arrows.innerHTML = ''; // Clear arrows
        updateArrows()
    }

    document.addEventListener("mousemove", drag);

    function drag(e) {
        if (active) {
            e.preventDefault();
            const currentX = e.clientX - initialX;
            const currentY = e.clientY - initialY;
            const deltaX = currentX - initialLeft;
            const deltaY = currentY - initialTop;
            setTranslate(deltaX, deltaY, activeElement);
            updateArrows();
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

});

function updateArrows() {
    arrows.innerHTML = '';

    const subCategoryContainers = document.querySelectorAll('.sub-category-container');

    subCategoryContainers.forEach(container => {
        const titleRect = container.querySelector('.sub-category-title').getBoundingClientRect();
        const childSets = container.querySelectorAll('.child-set');

        const titleCenterX = titleRect.left + titleRect.width / 2;
        const titleCenterY = titleRect.top + titleRect.height / 2;

        childSets.forEach(child => {
            const childRect = child.getBoundingClientRect();
            const childCenterX = childRect.left + childRect.width / 2;
            const childCenterY = childRect.top + childRect.height / 2;

            const deltaX = childCenterX - titleCenterX;
            const deltaY = childCenterY - titleCenterY;

            const titleWidth = titleRect.width / 2;
            const titleHeight = titleRect.height / 2;
            const childWidth = childRect.width / 2;
            const childHeight = childRect.height / 2;

            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arrow.setAttribute('stroke', 'black');
            arrow.setAttribute('stroke-width', '2');
            arrow.setAttribute('fill', 'none');

            let startX, startY, midX, midY, endX, endY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    startX = titleRect.left + titleRect.width;
                    startY = titleCenterY;
                    endX = childRect.left;
                    endY = childCenterY;
                    if (Math.abs(deltaY) < childRect.height / 2) {
                        midX = endX - 10;
                        midY = startY;
                    } else {
                        midX = endX - 10;
                        midY = endY;
                    }
                } else {
                    startX = titleRect.left;
                    startY = titleCenterY;
                    endX = childRect.left + childRect.width;
                    endY = childCenterY;
                    if (Math.abs(deltaY) < childRect.height / 2) {
                        midX = endX + 10;
                        midY = startY;
                    } else {
                        midX = endX + 10;
                        midY = endY;
                    }
                }
            } else {
                if (deltaY > 0) {
                    startX = titleCenterX;
                    startY = titleRect.top + titleRect.height;
                    endX = childCenterX;
                    endY = childRect.top;
                    midX = startX;
                    midY = endY - 10;
                } else {
                    startX = titleCenterX;
                    startY = titleRect.top;
                    endX = childCenterX;
                    endY = childRect.top + childRect.height;
                    midX = startX;
                    midY = endY + 10;
                }
            }


            const pathString = `M ${startX},${startY} L ${midX},${startY} L ${midX},${midY} L ${endX},${midY} L ${endX},${endY}`;
            arrow.setAttribute('d', pathString);

            arrows.appendChild(arrow);
            const grid = document.getElementById('grid');
            if (grid) {
                grid.parentNode.removeChild(grid);
            }
            const newGrid = document.createElement('div');
            newGrid.id = 'grid';
            document.body.appendChild(newGrid);
        });
    });
}