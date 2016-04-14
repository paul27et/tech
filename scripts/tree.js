/**
 * Single node constructor
 * @param value: initial value
 * @constructor
 */

function Node(value) {
    this.id = value + Date.now();
    this.value = value;
    this.parent = null;
    this.children = [];
    this.isElementDeleted = false;
}

/**
 * Node object methods
 * @type {{remove: Node.remove, setData: Node.setData}}
 */
Node.prototype = {
    remove: function () {
        this.isElementDeleted = true;
    },

    setData: function (value) {
        this.value = value;
    }
};

/**
 * Tree constructor
 * @param value: initial root value
 * @constructor
 */
function Tree(value) {
    var node = new Node(value);
    this._root = node;
}

/**
 * Tree object methods
 * @type {{render: Tree.render, deleted: Tree.deleted, level: Tree.level, addNode: Tree.addNode, removeNode: Tree.removeNode, findNode: Tree.findNode, findNodeWithValue: Tree.findNodeWithValue}}
 */
Tree.prototype = {
    /**
     * Renders whole tree to DOM container from current node
     * @param container: DOM element id
     * @param node: from which node to render
     * @param level: auxiliary element for nodes leveling
     */
    render: function (container, node, level) {
        level = level || 0;
        node = node || this._root;
        if (node == this._root) {
            document.getElementById(container).innerHTML += '<button type="button" id="' + node.id.slice(0, -13) +
                '" class="db list-group-item ' + this.deleted(node) + '">'
                + this.level(level++) + node.value + '</button>';
        } else {
            document.getElementById(container).innerHTML += '<button type="button" id="' + node.id +
                '" class="db list-group-item ' + this.deleted(node) + '">'
                + this.level(level++) + node.value + '</button>';
        }
        for (var i = 0; i < node.children.length; i++) {
            if (node.isElementDeleted)
                node.children[i].isElementDeleted = true;
            this.render(container, node.children[i], level);
        }
    },

    /**
     * Checks is element removed
     * @param node
     * @returns 'list-group-item-danger' to removed element
     */
    deleted: function (node) {
        if (node.isElementDeleted)
            return 'list-group-item-danger';
        else
            return ''
    },

    /**
     * auxiliary method for nodes leveling
     * @param num
     * @returns {string}
     */
    level: function (num) {
        var str = '';
        for (var i = 0; i < num; i++)
            str += '=';
        return str.slice(1);
    },

    /**
     * Adds a new child node with value to node with toData value
     * @param value: initial value to new node
     * @param toData: value of node you want to create child node
     */
    addNode: function (value, toData) {
        var parent, child;
        //del = del || false;
        //this.findNode(toData)
        if (toData)
            parent = this.findNodeWithValue(toData);
        else
            parent = this._root;
        child = new Node(value);
        parent.children.push(child);
        child.parent = parent;
        //child.isElementDeleted = del;
    },

    /**
     * Removing node with specified id
     * @param id: node id
     * @returns {*}
     */
    removeNode: function (id) {
        var node = this.findNode(id);
        var parent = node.parent;
        var index;
        if (parent == null) {
            this._root.children = [];
            //this._root = null;
        }
        else {
            index = findIndex(parent.children, node.value);
            node.children = [];
            node = parent.children.splice(index, 1);
        }
        return node;
    },

    /**
     * Finds node with specified id. Starts from specified node
     * @param id: node id
     * @param node: starting node
     * @returns node
     */
    findNode: function (id, node) {
        node = node || this._root;
        if (node.id == id)
            return node;
        else
            for (var i = 0; i < node.children.length; i++) {
                var a = this.findNode(id, node.children[i]);
                if (a)
                    return a;
            }
    },

    /**
     * Finds node with specified value. Starts from specified node
     * @param value: node value
     * @param node: starting node
     * @returns node
     */
    findNodeWithValue: function (value, node) {
        node = node || this._root;
        if (node.value == value)
            return node;
        else
            for (var i = 0; i < node.children.length; i++) {
                var a = this.findNodeWithValue(value, node.children[i]);
                if (a)
                    return a;
            }
    }

    /**
     * Depth-first search
     * @param node
     */
    //traverse: function (node) {
    //    if (node.children.length == 0) {
    //        console.log(node.value);
    //    } else {
    //        for (var i = 0; i < node.children.length; i++) {
    //            this.traverse(node.children[i]);
    //        }
    //        console.log(node.value);
    //    }
    //}
};

/**
 * Finds specified element's index in array
 * @param arr: array
 * @param value: element's value
 * @returns index
 */
function findIndex(arr, value) {
    var index;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value === value) {
            index = i;
        }
    }
    return index;
}