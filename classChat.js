function searchAttribute(attributes, name) {
    var attr = attributes.find(a => a.name === name);
    if (attr) {
        return attr.value;
    }
    return null;
}

function normarizeId(name) {
    return name.replace(/[!-/:-@[-`{-~]/g, '');
}

class Chat {
    constructor(dom_obj) {
        this.name = "test";
        var tabs = [];
        dom_obj.children.forEach(e => {
            tabs.push(new ChatTab(e, this));
        });
        this.tabs = tabs;
    }

    get allElements() {
        var all_elements = [];
        this.tabs.forEach(tab => {
            all_elements = all_elements.concat(tab.elements);
        });
        all_elements.sort(function (a, b) {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
        });
        return all_elements;
    }

    get allPlayers() {
        if (this.all_players) {
            return this.all_players;
        }
        var all_players = [];
        var num = 0;
        this.allElements.forEach(e => {
            var found = all_players.find(function (p) {
                return p.name == e.name;
            });
            if (!found) {
                all_players.push(new Player(e.name, 'player_' + num));
                num++;
            }
        });
        this.all_players = all_players;
        return this.all_players;
    }
}

class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

class ChatTab {
    constructor(dom_obj, chat) {
        var elements = [];
        this.parent = chat;
        this.name = searchAttribute(dom_obj.attributes, 'name');
        this.elements = elements;
        dom_obj.children.forEach(e => {
            elements.push(new ChatElement(e, this.name, chat));
        });
    }
}

class ChatElement {
    constructor(dom_obj, tab_name, parent) {
        this.name = searchAttribute(dom_obj.attributes, 'name');
        this.name = new String(this.name).replace(/[<>]/g, '')
        this.parent = parent;
        this.tab_name = tab_name;
        this.timestamp = searchAttribute(dom_obj.attributes, 'timestamp');
        this.text = dom_obj.content;
    }

    get html() {
        var all_players = this.parent.allPlayers;
        var _name = this.name;
        var found = all_players.find(function (element) {
            return element.name == _name;
        });
        var id = "__notfound__";
        if (found) {
            id = found.id;
        }
        var result = '<div>';
        result += '[' + this.tab_name + ']';
        result += '<span class=color_' + id + '>';
        result += '<b>' + this.name + '</b>';
        result += "：";
        result += this.text.replace(/\r*\n/g, '<br>');
        result += '</span>';
        result += "</div>";
        return result;
    }
}
