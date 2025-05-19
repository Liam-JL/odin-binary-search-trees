//convert a sorted list into a BST

class Node {
    constructor(value, leftChild = null, rightChild = null){
        this.value = value
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
}

class Tree {
    constructor(array) {
        this.root = this.buildTree(array); //returns root node
    }

    buildTree(array) {
        if (array.length === 0) return null;
        const sortedArray = [...new Set(array.sort((a, b) => a - b))];
        const midIndex = Math.floor((sortedArray.length -1) / 2);
        const root = new Node(sortedArray[midIndex]);
        root.leftChild = this.buildTree(sortedArray.slice(0, midIndex));
        root.rightChild = this.buildTree(sortedArray.slice(midIndex + 1));
        return root;
    } 

    prettyPrint (node = this.root, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }
        if (node.rightChild !== null) {
            this.prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }
        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
        if (node.leftChild !== null) {
            this.prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
        } 
    }

    //Inserting a value needs to become a leaf. A duplicate won't be added
    insert(value) {
        let currentNode = this.root;
        
        while (true) {
            if (value === currentNode.value) return;

            if (value < currentNode.value) {
                if (currentNode.leftChild === null) {
                    currentNode.leftChild = new Node(value);
                    break
                } 
                currentNode = currentNode.leftChild;
            } else {
                if (currentNode.rightChild === null) {
                    currentNode.rightChild = new Node(value);
                    break
                }
                currentNode = currentNode.rightChild;
            }    
        }
    }

    delete(value) {
        let currentNode = this.root;
        let previousNode = null;
        let successorNode = null

        //Search for node and predecessor
        while(true) {
            if (currentNode.value === value) break;

            //Is the node even here?
            if (currentNode.leftChild === null && currentNode.rightChild === null) return null;

            //Next layer
            previousNode = currentNode;
            if(value < currentNode.value) {
                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;
            }
        }

        //Node to delete is leaf node
        if (currentNode.leftChild === null && currentNode.rightChild === null) {
            if (currentNode === this.root) {
                this.root = null;
            } else if(previousNode.leftChild === currentNode) {
                previousNode.leftChild = null;
            } else {
                previousNode.rightChild = null;
            }
            return;
        }

        //Node to delete has 1 child
        //left XOR right
        if ((currentNode.leftChild ? 1 : 0) ^ (currentNode.rightChild ? 1 : 0)) {
            successorNode = currentNode.leftChild ? currentNode.leftChild : currentNode.rightChild;

            if(currentNode === this.root) {
                this.root = successorNode;
            } else if (previousNode.leftChild === currentNode) {
                previousNode.leftChild = successorNode;
            } else {
                previousNode.rightChild = successorNode;
            }
            return;
        }

        //Node to delete has 2 children
        if (currentNode.leftChild && currentNode.rightChild) {
            successorNode = currentNode.rightChild;
            let successorParent = currentNode;

            //Find leftmost child of right subtree
            while (successorNode.leftChild) {
                successorParent = successorNode;
                successorNode = successorNode.leftChild;
            }

            //If successor is not immediate right child
            if (successorParent !== currentNode) {
                //Reattatch successor's right subtree
                successorParent.leftChild = successorNode.rightChild;
                successorNode.rightChild = currentNode.rightChild;
            }

            successorNode.leftChild = currentNode.leftChild;

            //Replace current node with successor node
            if (currentNode === this.root) {
                this.root = successorNode;
            } else if (previousNode.leftChild === currentNode) {
                previousNode.leftChild = successorNode;
            } else {
                previousNode.rightChild = successorNode;
            }
            return;
        }   
    }

    find(value) {
        let currentNode = this.root;
        while (true) {
            if (currentNode === null) return null

            if (currentNode.value === value) return currentNode;

            if(value < currentNode.value) {
                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;
            }
        }
     }

     levelOrder(callback) {
        if (typeof(callback) != "function") {
            throw new Error("Parameter not a callback function.")
        }

        if (this.root === null) {
            return callback(null);
        }

        let queue = [this.root];

        while (queue.length > 0) {
            let next = queue.shift();
            callback(next);

            if (next.leftChild) queue.push(next.leftChild);
            if (next.rightChild) queue.push(next.rightChild);
        }
     }

     inOrder(callback, root = this.root) {
        if (typeof(callback) != "function") {
            throw new Error("Parameter not a callback function.")
        }

        if (root === null) {
            return
        }

        this.inOrder(callback, root.leftChild);
        callback(root.value);
        this.inOrder(callback,root.rightChild)
     }

    preOrder(callback, root = this.root) {
        if (typeof(callback) != "function") {
            throw new Error("Parameter not a callback function.")
        }

        if (root === null) {
            return
        }

        callback(root.value);
        this.preOrder(callback, root.leftChild);
        this.preOrder(callback,root.rightChild)
     }

    postOrder(callback, root = this.root) {
        if (typeof(callback) != "function") {
            throw new Error("Parameter not a callback function.")
        }

        if (root === null) {
            return
        }

        this.postOrder(callback, root.leftChild);
        this.postOrder(callback,root.rightChild)
        callback(root.value);
     }

     //Return distance from specified node to furthest leaf within its own subtree
     height(value) {

        let currentNode = this.find(value);

        //check distance from value to furthest node
        function findHeight (current){
            if (current === null) {
                return -1
            }
            let leftHeight = findHeight(current.leftChild);
            let rightHeight = findHeight(current.rightChild);
            return  Math.max(leftHeight, rightHeight) +1
        }

        return findHeight(currentNode);
    }
     
     //Distance from root to specified
     depth(value) {
        let currentNode = this.root;
        let depth = 0;

        while (currentNode !== null) {
            if (value === currentNode.value) {
                return depth;
            }

            if (value < currentNode.value) {
                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;
            }

            depth++;
        }

        // Value not found
        return -1;
     }

     //Check balance for every node recursively 
     isBalanced(root = this.root) {
        function checkBalance(node) {
            if (node === null) return {height: -1, balanced: true}; //an empty node is balanced, doesn't count to height

            const left = checkBalance(node.leftChild);
            const right = checkBalance(node.rightChild);

            const height = Math.max(left.height, right.height) + 1;
            const balanced = left.balanced && right.balanced && Math.abs(left.height - right.height) <= 1;

            return {height, balanced};
        }

        return checkBalance(root).balanced
     }

     rebalance() {
        const oldTreeArray = [];
        this.inOrder((data) => {oldTreeArray.push(data)})
        this.root = this.buildTree(oldTreeArray);
     }
}

//Driver
//Generate n length array of integers from 0 - 100
function generateRandomArray (n) {
    let array = [];
    while (n > 0) {
        array.push(Math.floor(Math.random() * 101));
        n --
    }
    return array;
}

const arr = generateRandomArray(20);
const tree = new Tree(arr);
console.log(`Tree is balanced: ${tree.isBalanced()}`)
const unbalancingArr = [203, 356, 5670, 6580, 6099];
for (int of unbalancingArr) {
    tree.insert(int);
}
console.log(`Tree is balanced: ${tree.isBalanced()}`)
tree.rebalance();
console.log(`Tree is balanced: ${tree.isBalanced()}`)
tree.levelOrder(console.log);
tree.inOrder(console.log);
tree.preOrder(console.log);
tree.postOrder(console.log)
