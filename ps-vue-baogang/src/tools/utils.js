const NodeConfig = {
  brothers: {
    enumerable: false,
    get() {
      let { parent } = this;
      if (parent == null) {
        return [];
      }
      let { children } = parent;
      return children.filter(d => d !== this);
    }
  },
  parent: {
    enumerable: false,
    get() {
      let { parents } = this, { length } = parents;
      return parents[length - 1];
    }
  },
  firstChildren: {
    enumerable: false,
    get() {
      let { children } = this,
      rs = [],
        child;
      while (children && children.length > 0) {
        child = children[0];
        rs.push(child);
        children = child.children;
      }
      return rs;
    }
  },
  firsts: {
    enumerable: false,
    get() {
      let { parents, firstChildren } = this;
      return [...parents, this, ...firstChildren];
    }
  }
};
class Node {
  constructor(data, parents, index, level) {
    this.index = index;
    this.level = level;
    this.value = data;
    Object.defineProperty(this, "parents", {
      enumerable: false,
      value: parents
    })
  }
  update(obj) {
    this.value = Object.assign({}, this.value, obj);
  }
  appendChild(obj) {
    let children = this.children = this.children || [],
      index = children.length,
      parents = this.parents.concat(this),
      level = this.level + 1;
    this.children = this.children.concat(new Node(obj, parents, index, level));
  }
  remove() {
    let { parents } = this, { length } = parents,
    parent = parents[length - 1], { children } = parent,
      filteredChildren = children ? children.filter(d => {
        return d !== this
      }) : [];
    if (filteredChildren.length > 0) {
      parent.children = filteredChildren;
    } else {
      delete parent.children;
    }
  }
}
Object.defineProperties(Node.prototype, NodeConfig);
class TreeNode {
  constructor(data, sort) {
    this.data = this.init(data, sort);
  }
  init(data, sort) {
    let rs = data.map((d, i) => new Node(d, [], i, 0)),
      item,
      queue;
    queue = rs.slice();
    while ((item = queue.shift())) {
      let { value, parents, index, level } = item, { children } = value;
      if (children) {
        sort &&
          children.sort(sort);
        children = children.map(
          (d, i) => new Node(d, [...parents, item], i, level + 1)
        );
        item.children = children;
        [].push.call(queue, ...children);
      }
    }
    return rs;
  }
  rawData() {
    const recursive = ({ value, children }) => {
      value.children = children.map(recursive);
      return value;
    }
    return this.data.map(recursive);
  }
  each(callback) {
    let { data } = this;

    function recursive(d) {
      callback && callback.call(this, d);
      d.children && d.children.forEach(recursive(d));
    }
    data.forEach(recursive);
  }
  search(callback) {
    if (typeof callback != "function") {
      let key = callback;
      callback = ({ label }) => {
        return label.indexOf(key) != -1;
      };
    }
    let map = {};
    this.queue((value, parents) => {
      if (callback && callback.call(this, value)) {
        map[value.id] = true;
        parents.forEach(({ value }) => {
          map[value.id] = true;
        });
      }
      map[value.id] = map[value.id] == null ? false : map[value.id];
    });
    return map;
  }
  open(callback) {
    if (typeof callback != "function") {
      let key = callback;
      callback = ({ label }) => {
        return label.indexOf(key) != -1;
      };
    }
    let map = {};
    this.queue((value, parents) => {
      if (callback && callback.call(this, value)) {
        parents.forEach(({ value }) => {
          map[value.id] = true;
        });
      }
      map[value.id] = map[value.id] == null ? false : map[value.id];
    });
    return map;
  }
  queue(callback) {
    let queue = this.data.slice(),
      item;
    while ((item = queue.shift())) {
      let { value, parents, children } = item,
      rs = callback && callback.call(this, value, parents, item);
      if (rs == true) {
        break;
      }
      if (children) {
        [].push.call(queue, ...children);
      }
    }
  }
  find(callback) {
    let rs;
    this.queue((value, parents, item) => {
      if (callback && callback.call(this, value)) {
        rs = item;
        return true;
      }
    });
    return rs;
  }
  filter(callback) {
    let rs = [];
    this.queue((value, parents, item) => {
      if (callback && callback.call(this, value)) {
        rs.push(item);
      }
    });
    return rs;
  }
}

function debounce(fn, time) {
  let timer = null;
  return function () {
    let args = arguments;
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.call(this, ...args);
      timer = null;
    }, time);
  };
}

function throttle(fn, time) {
  let timer = null;
  return function () {
    let args = arguments;
    if (timer == null) {
      fn.call(this, ...args);
      timer = 0;
    }
    if (timer == 0) {
      timer = setTimeout(() => {
        fn.call(this, ...args);
        timer = 0;
      }, time);
    }
  };
}
export default {
  debounce,
  throttle,
  TreeNode
};