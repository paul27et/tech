var dbTree;
var cachedTree;
var selectedDBNode;
var selectedCacheNode;

/**
 * Reset whole app to default
 */
function resetToDefault() {
    dbTree = new Tree('DBTree');
    cachedTree = new Tree('CachedTree');
    selectedCacheNode = null;
    selectedDBNode = null;
    document.getElementById('addon').innerHTML = 'No node selected';
    document.getElementById('addonAdd').innerHTML = 'No node selected';
    document.getElementById('changingValue').value = '';
    document.getElementById('addingNode').value = '';
    dbTree.addNode('Node1');
    dbTree.addNode('Node2');
    dbTree.addNode('Node3');
    dbTree.addNode('Node4', 'Node3');
    dbTree.addNode('Node5', 'Node4');
    dbTree.addNode('Node10', 'Node4');
    dbTree.addNode('Node6', 'Node1');
    dbTree.addNode('Node7', 'Node6');
    dbTree.addNode('Node8', 'Node7');
    dbTree.addNode('Node9', 'Node8');
    dbTree.addNode('Node11', 'Node8');
	dbTree.addNode('Node12');
	dbTree.addNode('Node13', 'Node12');
	dbTree.addNode('Node14', 'Node13');
	dbTree.addNode('Node15', 'Node14');
	dbTree.addNode('Node16', 'Node15');
	dbTree.addNode('Node17', 'Node16');
	dbTree.addNode('Node18', 'Node16');
	dbTree.addNode('Node19', 'Node12');
	dbTree.addNode('Node20', 'Node19');
	dbTree.addNode('Node21', 'Node20');
	dbTree.addNode('Node22', 'Node21');
	dbTree.addNode('Node23', 'Node22');
	dbTree.addNode('Node24', 'Node22');
    render(dbTree, 'DBTreeView');
    render(cachedTree, "CachedTreeView");
}

/**
 * Returns element id you have clicked to
 * @param e: event
 * @returns id
 */
function nodeSelection(e) {
    if (e.target !== e.currentTarget) {
        console.log(e.target.id);
        if (e.target.parentNode.id == 'DBTreeView')
            return selectedDBNode = e.target.id;
        else {
            selectedCacheNode = e.target.id;
            var node = cachedTree.findNode(selectedCacheNode);
            document.getElementById('addon').innerHTML = node.value + ' change to: ';
            document.getElementById('addonAdd').innerHTML = 'Add child to ' + node.value + ':';
            return selectedCacheNode;
        }
    }
    e.stopPropagation();
}

/**
 * Changes value of selected node
 */
function changeNode() {
    if (selectedCacheNode) {
        var node = cachedTree.findNode(selectedCacheNode);
        if (node && !node.isElementDeleted) {
            //var node = cachedTree.findNode(selectedCacheNode);
            var value = document.getElementById('changingValue').value;
            value.trim() != '' ? node.setData(value) : alert('Please, input smth');
            render(cachedTree, "CachedTreeView");
            document.getElementById('addon').innerHTML = node.value + ' value change to: ';
            document.getElementById('addonAdd').innerHTML = 'Add child to ' + node.value + ':';
            document.getElementById('changingValue').value = '';
        } else if (node.isElementDeleted)
            alert('Element has been deleted, you cannot change its value');
    } else
        alert('You should select a node to change')
}

/**
 * Adds a new child node to selected node
 */
function addNode() {
    if (selectedCacheNode && !cachedTree.findNode(selectedCacheNode).isElementDeleted) {
        var parentNode = cachedTree.findNode(selectedCacheNode);
        var value = document.getElementById('addingNode').value;
        if (value.trim() != '') {
            var childNode = new Node(value);
            //childNode.id = childNode.id + 'u';
            parentNode.children.push(childNode);
            childNode.parent = parentNode;
            render(cachedTree, "CachedTreeView");
            document.getElementById('addingNode').value = '';
		} else
            alert('Please, input smth');
        parentNode.children.push()
    } else if (cachedTree.findNode(selectedCacheNode).isElementDeleted)
			alert('Parent has been deleted. You cannot add child to this element');
	else
        alert('You should select a parent node to add new one')
}

/**
 * Removes node: change nodes isElementDeleted parameter to true
 */
function removeNode() {
    if (selectedCacheNode) {
        var node = cachedTree.findNode(selectedCacheNode);
        if (node.isElementDeleted)
            alert('This element is already deleted');
        else {
            node.remove();
            for (var i = 0; i < node.children.length; i++)
                if (!node.children[i].isElementDeleted)
                    node.children[i].remove();
        }
        render(cachedTree, 'CachedTreeView');
    } else
        alert('No cache node selected!');
}

/**
 * Applies all cache changes to 'database'
 * @param node: node to start from
 */
function applyChanges(node) {
    node = node || cachedTree._root;
    for (var i = 0; i < node.children.length; i++) {
        var currentNode = node.children[i];
        var oldNode = dbTree.findNode(currentNode.id);
        if (oldNode) {
            oldNode.value = currentNode.value;
            oldNode.isElementDeleted = currentNode.isElementDeleted;	
            applyChanges(currentNode);
        } else {
            oldNode = new Node(currentNode.value);
            oldNode.isElementDeleted = currentNode.isElementDeleted;
            oldNode.id = currentNode.id;
            oldNode.parent = dbTree.findNode(currentNode.parent.id);
            oldNode.parent.children.push(oldNode);
            applyChanges(currentNode);
        }
    }
	for (var i = 0; i < node.children.length; i++) {
		var currentNode = node.children[i];
		var oldNode = dbTree.findNode(currentNode.id);
		if(oldNode)
			currentNode.isElementDeleted = oldNode.isElementDeleted;
	}
    render(dbTree, 'DBTreeView');
    render(cachedTree, 'CachedTreeView');
}

/**
 * Copies node without parent and children pointers
 * expectedParent field contains parent id
 * Used to copy elements from 'database' to cache
 * @param node
 * @returns {Node}
 */
function nodeShallowCopy(node) {
    var destination = new Node(node.value);
    destination.id = node.id;
    destination.expectedParent = node.parent.id;
    destination.isElementDeleted = node.isElementDeleted;
    return destination;
}

/**
 * Copies node with parent and children pointers
 * Used to copy elements inside cache
 * @param node
 * @returns {Node}
 */
function nodeDeepCopy(node) {
    var destination = new Node(node.value);
    destination.id = node.id;
    destination.expectedParent = null;
    destination.parent = node.parent;
    destination.isElementDeleted = node.isElementDeleted;
    for (var i = 0; i < node.children.length; i++) {
        destination.children.push(node.children[i]);
        destination.children[i].parent = destination;
    }
    return destination;
}

/**
 * Copies selected node from 'database' to cache
 */
function copyToCache() {
    var to = cachedTree._root.children;
    var nodeToCopy = dbTree.findNode(selectedDBNode, dbTree._root);
    var clonedNode = nodeShallowCopy(nodeToCopy);
    if (cachedTree.findNode(selectedDBNode) || nodeToCopy.isElementDeleted)
        alert('This node already exists in cache or removed');
    else if (clonedNode.expectedParent) {
        var tmp = cachedTree.findNode(clonedNode.expectedParent);
        if (tmp) {
            tmp.children.push(clonedNode);
            clonedNode.parent = tmp;
            clonedNode.expectedParent = null;
        } else {
            to.push(clonedNode);
            clonedNode.parent = cachedTree._root;
        }
    }
    render(cachedTree, 'CachedTreeView');
}

/**
 * Rebuilds whole tree to correct nodes view
 */
function buildTree() {
    var tmp = cachedTree._root.children;
    for (var i = 0; i < tmp.length; i++) {
        var child = tmp[i];//cachedTree.findNode(tmp[i].id);
        if (tmp[i].expectedParent) {
            var parent = cachedTree.findNode(tmp[i].expectedParent);
            if (parent) {
                var childCopy = nodeDeepCopy(child);
				child.id = 'deleted' + Math.random(1);
				cachedTree.removeNode(child.id);
                parent.children.push(childCopy);
				childCopy.parent = parent;
				i--;
            }
        }
    }
}

/**
 * Renders specified tree to DOM container with specified id
 * @param tree: tree to render
 * @param id: DOM container id
 */
function render(tree, id) {
    document.getElementById(id).innerHTML = '';
    document.getElementById(id).addEventListener("click", nodeSelection, false);
    buildTree();
    tree.render(id);
    document.getElementById(id.slice(0, -4)).setAttribute('class', 'list-group-item list-group-item-info')
    document.getElementById(id.slice(0, -4)).disabled = true;
}

resetToDefault();
