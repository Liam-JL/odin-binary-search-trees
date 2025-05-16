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

    prettyPrint (node, prefix = "", isLeft = true) {
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
            if (currentNode.value === value) return currentNode;

            if (currentNode.leftChild === null && currentNode.rightChild === null) return null;

            if(value < currentNode.value) {
                currentNode = currentNode.leftChild;
            } else {
                currentNode = currentNode.rightChild;
            }
        }
     }
}

const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree = new Tree(arr);
tree.delete(8)
tree.delete(9)
tree.prettyPrint(tree.root)