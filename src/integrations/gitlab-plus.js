// Add custom css to head
let style = document.createElement('style');
style.innerHTML = `
    .time-tracker.sidebar-help-wrap .hide-collapsed + .hide-collapsed {
        display: none;
    }
    .clockifyButton {
        margin-top: 10px;
    }
    .clockify-button-inactive {
        color: #909090 !important;
    }
    .clockifyButton svg {
        filter: invert(100%) grayscale(100%);
    }
    .ReactModal__Overlay--after-open {
        display: none;
    }
    .time-tracker {
        min-height: 82px;
    }
    .time-tracking .time-tracker {
        min-height: 55px;
    }
    [data-testid="add-time-entry-button"] {
        display: none;
    }
`;
document.head.appendChild(style);

// Observe if Task detail is opened
let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(function(node) {
                if (node.classList && node.classList.contains('boards-sidebar')) {
                    let sidebarTracker = node.querySelector('.time-tracker');
                    let addButton = sidebarTracker.querySelector('.btn');
                    let content = sidebarTracker.querySelector('.gl-button-text');
                    addButton.remove();
                    content.innerHTML = '';                    
                    renderDetailButton(node, sidebarTracker);
                }
            });
        }
    });
});
observer.observe(document.body, { childList: true, subtree: true });

function renderDetailButton(sidebar, el, tryAgain = true) {
    let labelNames = getLabel(sidebar);
    let title = getTitle(sidebar);
    
    if (labelNames.length == 0) {
        // Try again in 1 second
        if (tryAgain) {
            setTimeout(function() {
                renderDetailButton(sidebar, el, false);
            }, 1000);
        }
        return;
    }
    
    // get first label name to use as project name that does start with a letter
    let projectName = null;
    for (let i = 0; i < labelNames.length; i++) {
        if (labelNames[i].match(/^[a-zA-Z]/)) {
            projectName = labelNames[i];
            break;
        }
    }
    if (!projectName) { return; }
    
    // add BUTTON_CONTAINER_ID to el
    el.id = 'clockifybutton-container';
    
    // Add clockify button
    clockifyButton.render(`#clockifybutton-container`, {}, (elem) => {
        let btn = clockifyButton.createButton({
            description: () => title,
            projectName: () => projectName,
            tags: () => labelNames
        });
        el.appendChild(btn);
    });
}

function getLabel(sidebar) {
    let labelList = sidebar.querySelector('.labels');
    if (!labelList) { return []; }
    let labels = labelList.querySelectorAll('.gl-label-text');
    let labelNames = [];
    labels.forEach(function(label) {
        let labelName = label.innerText;
        if (labelName.startsWith('\n')) { return; }
        labelNames.push(labelName);
    });
    return labelNames;
}

function getTitle(sidebar) {
    let titleItem = sidebar.querySelector('[data-testid="sidebar-title"]');
    let title = titleItem.querySelector('.gl-link');
    if (!title) { return ''; }
    return title.innerText;
}

// If Task page is opened (on load)
// page load:
//document.addEventListener('DOMContentLoaded', checkTaskPage);
function checkTaskPage()
{
    let sidebarTracker = document.querySelector('.time-tracker');
    if (!sidebarTracker) { return; }
    let sidebar = document.querySelector('.issuable-sidebar');
    if (!sidebar) { return; }
    renderPageButton(sidebar, sidebarTracker);
}

function renderPageButton(sidebar, el, retries = 3) {
    let labelNames = getPageLabel(sidebar);
    let title = getPageTitle(sidebar);
        
    if (labelNames.length == 0) {
        // Try again in 1 seconds
        if (retries > 0) {
            setTimeout(function() {
                renderPageButton(sidebar, el, retries - 1);
            }, 1000);
        }
        return;
    }
    
    // get first label name to use as project name that does start with a letter
    let projectName = null;
    for (let i = 0; i < labelNames.length; i++) {
        if (labelNames[i].match(/^[a-zA-Z]/)) {
            projectName = labelNames[i];
            break;
        }
    }
    if (!projectName) { return; }
    
    // add BUTTON_CONTAINER_ID to el
    el.id = 'clockifybutton-container';
    
    // Add clockify button
    clockifyButton.render(`#clockifybutton-container`, {}, (elem) => {
        let btn = clockifyButton.createButton({
            description: () => title,
            projectName: () => projectName,
            tags: () => labelNames
        });
        el.appendChild(btn);
    });
}

function getPageLabel(sidebar) {
    let labelList = sidebar.querySelector('.labels');
    if (!labelList) { return []; }
    let labels = labelList.querySelectorAll('.gl-label-text');
    let labelNames = [];
    labels.forEach(function(label) {
        let labelName = label.innerText;
        if (labelName.startsWith('\n')) { return; }
        labelNames.push(labelName);
    });
    return labelNames;
}

function getPageTitle() {
    let titleItem = document.querySelector('[data-testid="issue-title"]');
    return titleItem.innerHTML;
}
checkTaskPage();