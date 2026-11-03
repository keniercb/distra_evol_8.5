Ext.namespace('Ext.ux.maximgb.treegrid');

/**
 * This class shouldn't be created directly use NestedSetStore or AdjacencyListStore instead.
 *
 * @abstract
 */
Ext.ux.maximgb.treegrid.AbstractTreeStore = Ext.extend(Ext.data.Store,
    {
        /**
         * @cfg {String} is_leaf_field_name Record leaf flag field name.
         */
        leaf_field_name: '_is_leaf',

        icon_name: '_icon',

        /**
         * Current page offset.
         *
         * @access private
         */
        page_offset: 0,

        /**
         * Current active node.
         *
         * @access private
         */
        active_node: null,

        /**
         * @constructor
         */
        constructor: function (config) {
            Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.constructor.call(this, config);

            if (!this.paramNames.active_node) {
                this.paramNames.active_node = 'anode';
            }

            this.addEvents(
                /**
                 * @event beforeexpandnode
                 * Fires before node expand. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'beforeexpandnode',
                /**
                 * @event expandnode
                 * Fires after node expand.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'expandnode',
                /**
                 * @event expandnodefailed
                 * Fires when expand node operation is failed.
                 * param {AbstractTreeStore} this
                 * param {id} Record id
                 * param {Record} Record, may be undefined
                 */
                'expandnodefailed',
                /**
                 * @event beforecollapsenode
                 * Fires before node collapse. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'beforecollapsenode',
                /**
                 * @event collapsenode
                 * Fires after node collapse.
                 * param {AbstractTreeStore} this
                 * param {Record} record
                 */
                'collapsenode',
                /**
                 * @event beforeactivenodechange
                 * Fires before active node change. Return false to cancel operation.
                 * param {AbstractTreeStore} this
                 * param {Record} old active node record
                 * param {Record} new active node record
                 */
                'beforeactivenodechange',
                /**
                 * @event activenodechange
                 * Fires after active node change.
                 * param {AbstractTreeStore} this
                 * param {Record} old active node record
                 * param {Record} new active node record
                 */
                'activenodechange'
            );
        },

        // Store methods.
        // -----------------------------------------------------------------------------------------------
        /**
         * Removes record and all its descendants.
         *
         * @access public
         * @param {Record} record Record to remove.
         */
        remove: function (record) {
            // ----- Modification start
            if (record === this.active_node) {
                this.setActiveNode(null);
            }
            this.removeNodeDescendants(record);
            // ----- End of modification
            Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.remove.call(this, record);
        },

        /**
         * Removes node descendants.
         *
         * @access private
         */
        removeNodeDescendants: function (rc) {
            var i, len, children = this.getNodeChildren(rc);
            for (i = 0, len = children.length; i < len; i++) {
                this.remove(children[i]);
            }
        },

        /**
         * Applyes current sort method.
         *
         * @access private
         */
        applySort: function () {
            if (this.sortInfo && !this.remoteSort) {
                var s = this.sortInfo, f = s.field;
                this.sortData(f, s.direction);
            }
            // ----- Modification start
            else {
                this.applyTreeSort();
            }
            // ----- End of modification
        },

        /**
         * Sorts data according to sort params and then applyes tree sorting.
         *
         * @access private
         */
        sortData: function (f, direction) {
            direction = direction || 'ASC';
            var st = this.fields.get(f).sortType;
            var fn = function (r1, r2) {
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(direction, fn);
            if (this.snapshot && this.snapshot != this.data) {
                this.snapshot.sort(direction, fn);
            }
            // ----- Modification start
            this.applyTreeSort();
            // ----- End of modification
        },

        /**
         * Loads current active record data.
         */
        load: function (options) {
            if (options) {
                if (options.params) {
                    if (options.params[this.paramNames.active_node] === undefined) {
                        options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
                    }
                }
                else {
                    options.params = {};
                    options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
                }
            }
            else {
                options = {params: {}};
                options.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null;
            }
            if (options.params[this.paramNames.active_node] !== null) {
                options.add = true;
            }
            return Ext.ux.maximgb.treegrid.AbstractTreeStore.superclass.load.call(this, options);
        },

        /**
         * Called as a callback by the Reader during load operation.
         *
         * @access private
         */
        loadRecords: function (o, options, success) {
            if (!o || success === false) {
                if (success !== false) {
                    this.fireEvent("load", this, [], options);
                }
                if (options.callback) {
                    options.callback.call(options.scope || this, [], options, false);
                }
                return;
            }

            var r = o.records, t = o.totalRecords || r.length,
                page_offset = this.getPageOffsetFromOptions(options),
                loaded_node_id = this.getLoadedNodeIdFromOptions(options),
                loaded_node, i, len, self = this;

            if (!options || options.add !== true || loaded_node_id === null) {
                if (this.pruneModifiedRecords) {
                    this.modified = [];
                }
                for (var i = 0, len = r.length; i < len; i++) {
                    r[i].join(this);
                }
                if (this.snapshot) {
                    this.data = this.snapshot;
                    delete this.snapshot;
                }
                this.data.clear();
                this.data.addAll(r);
                this.page_offset = page_offset;
                this.totalLength = t;
                this.applySort();
                this.fireEvent("datachanged", this);
            } else {
                loaded_node = this.getById(loaded_node_id);
                if (loaded_node) {
                    this.setNodeChildrenOffset(loaded_node, page_offset);
                    this.setNodeChildrenTotalCount(loaded_node, Math.max(t, r.length));

                    this.removeNodeDescendants(loaded_node);
                    this.suspendEvents();
                    for (i = 0, len = r.length; i < len; i++) {
                        this.add(r[i]);
                    }
                    this.applySort();
                    this.resumeEvents();
                    idx = [];

                    r.sort(function (r1, r2) {
                        var idx1 = self.data.indexOf(r1),
                            idx2 = self.data.indexOf(r2),
                            r;

                        if (idx1 > idx2) {
                            r = 1;
                        }
                        else {
                            r = -1;
                        }
                        return r;
                    });

                    for (i = 0, len = r.length; i < len; i++) {
                        this.fireEvent("add", this, [r[i]], this.data.indexOf(r[i]));
                    }

                    /*
                     this.suspendEvents();
                     this.removeNodeDescendants(loaded_node);
                     this.add(r);
                     this.applyTreeSort();
                     this.resumeEvents();
                     this.fireEvent("datachanged", this);
                     */
                }
            }
            this.fireEvent("load", this, r, options);
            if (options.callback) {
                options.callback.call(options.scope || this, r, options, true);
            }
        },

        // Tree support methods.
        // -----------------------------------------------------------------------------------------------

        /**
         * Sorts store data with respect to nodes parent-child relation. Every child node will be
         * positioned after its parent.
         *
         * @access public
         */
        applyTreeSort: function () {
            var i, len, temp,
                rec, records = [],
                roots = this.getRootNodes();

            // Sorting data
            for (i = 0, len = roots.length; i < len; i++) {
                rec = roots[i];
                records.push(rec);
                this.collectNodeChildrenTreeSorted(records, rec);
            }

            if (records.length > 0) {
                this.data.clear();
                this.data.addAll(records);
            }

            // Sorting the snapshot if one present.
            if (this.snapshot && this.snapshot !== this.data) {
                temp = this.data;
                this.data = this.snapshot;
                this.snapshot = null;
                this.applyTreeSort();
                this.snapshot = this.data;
                this.data = temp;
            }
        },

        /**
         * Recusively collects rec descendants and adds them to records[] array.
         *
         * @access private
         * @param {Record[]} records
         * @param {Record} rec
         */
        collectNodeChildrenTreeSorted: function (records, rec) {
            var i, len,
                child,
                children = this.getNodeChildren(rec);

            for (i = 0, len = children.length; i < len; i++) {
                child = children[i];
                records.push(child);
                this.collectNodeChildrenTreeSorted(records, child);
            }
        },

        /**
         * Returns current active node.
         *
         * @access public
         * @return {Record}
         */
        getActiveNode: function () {
            return this.active_node;
        },

        /**
         * Sets active node.
         *
         * @access public
         * @param {Record} rc Record to set active.
         */
        setActiveNode: function (rc) {
            if (this.active_node !== rc) {
                if (rc) {
                    if (this.data.indexOf(rc) != -1) {
                        if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
                            this.active_node = rc;
                            this.fireEvent('activenodechange', this, this.active_node, rc);
                        }
                    }
                    else {
                        throw "Given record is not from the store.";
                    }
                }
                else {
                    if (this.fireEvent('beforeactivenodechange', this, this.active_node, rc) !== false) {
                        this.active_node = rc;
                        this.fireEvent('activenodechange', this, this.active_node, rc);
                    }
                }
            }
        },

        /**
         * Returns true if node is expanded.
         *
         * @access public
         * @param {Record} rc
         */
        isExpandedNode: function (rc) {
            return rc.ux_maximgb_treegrid_expanded === true;
        },

        /**
         * Sets node expanded flag.
         *
         * @access private
         */
        setNodeExpanded: function (rc, value) {
            rc.ux_maximgb_treegrid_expanded = value;
        },

        /**
         * Returns true if node's ancestors are all expanded - node is visible.
         *
         * @access public
         * @param {Record} rc
         */
        isVisibleNode: function (rc) {
            var i, len,
                ancestors = this.getNodeAncestors(rc),
                result = true;

            for (i = 0, len = ancestors.length; i < len; i++) {
                result = result && this.isExpandedNode(ancestors[i]);
                if (!result) {
                    break;
                }
            }

            return result;
        },

        /**
         * Returns true if node is a leaf.
         *
         * @access public
         * @return {Boolean}
         */
        isLeafNode: function (rc) {
            return rc.get(this.leaf_field_name) == true;
        },

        icon: function () {
            return icon_name;
        },

        /**
         * Returns true if node was loaded.
         *
         * @access public
         * @return {Boolean}
         */
        isLoadedNode: function (rc) {
            var result;

            if (rc.ux_maximgb_treegrid_loaded !== undefined) {
                result = rc.ux_maximgb_treegrid_loaded
            }
            else if (this.isLeafNode(rc) || this.hasChildNodes(rc)) {
                result = true;
            }
            else {
                result = false;
            }

            return result;
        },

        /**
         * Sets node loaded state.
         *
         * @access private
         * @param {Record} rc
         * @param {Boolean} value
         */
        setNodeLoaded: function (rc, value) {
            rc.ux_maximgb_treegrid_loaded = value;
        },

        /**
         * Returns node's children offset.
         *
         * @access public
         * @param {Record} rc
         * @return {Integer}
         */
        getNodeChildrenOffset: function (rc) {
            return rc.ux_maximgb_treegrid_offset || 0;
        },

        /**
         * Sets node's children offset.
         *
         * @access private
         * @param {Record} rc
         * @parma {Integer} value
         */
        setNodeChildrenOffset: function (rc, value) {
            rc.ux_maximgb_treegrid_offset = value;
        },

        /**
         * Returns node's children total count
         *
         * @access public
         * @param {Record} rc
         * @return {Integer}
         */
        getNodeChildrenTotalCount: function (rc) {
            return rc.ux_maximgb_treegrid_total || 0;
        },

        /**
         * Sets node's children total count.
         *
         * @access private
         * @param {Record} rc
         * @param {Integer} value
         */
        setNodeChildrenTotalCount: function (rc, value) {
            rc.ux_maximgb_treegrid_total = value;
        },

        /**
         * Collapses node.
         *
         * @access public
         * @param {Record} rc
         * @param {Record} rc Node to collapse.
         */
        collapseNode: function (rc) {
            if (
                this.isExpandedNode(rc) &&
                this.fireEvent('beforecollapsenode', this, rc) !== false
            ) {
                this.setNodeExpanded(rc, false);
                this.fireEvent('collapsenode', this, rc);
            }
        },

        /**
         * Expands node.
         *
         * @access public
         * @param {Record} rc
         */
        expandNode: function (rc) {
            var params;

            if (
                !this.isExpandedNode(rc) &&
                this.fireEvent('beforeexpandnode', this, rc) !== false
            ) {
                // If node is already loaded then expanding now.
                if (this.isLoadedNode(rc)) {
                    this.setNodeExpanded(rc, true);
                    this.fireEvent('expandnode', this, rc);
                }
                // If node isn't loaded yet then expanding after load.
                else {
                    params = {};
                    params[this.paramNames.active_node] = rc.id;
                    this.load({
                        add: true,
                        params: params,
                        callback: this.expandNodeCallback,
                        scope: this
                    });
                }
            }
        },

        /**
         * @access private
         */
        expandNodeCallback: function (r, options, success) {
            var rc = this.getById(options.params[this.paramNames.active_node]);

            if (success && rc) {
                this.setNodeLoaded(rc, true);
                this.setNodeExpanded(rc, true);
                this.fireEvent('expandnode', this, rc);
            }
            else {
                this.fireEvent('expandnodefailed', this, options.params[this.paramNames.active_node], rc);
            }
        },

        /**
         * Returns loaded node id from the load options.
         *
         * @access public
         */
        getLoadedNodeIdFromOptions: function (options) {
            var result = null;
            if (options && options.params && options.params[this.paramNames.active_node]) {
                result = options.params[this.paramNames.active_node];
            }
            return result;
        },

        /**
         * Returns start offset from the load options.
         */
        getPageOffsetFromOptions: function (options) {
            var result = 0;
            if (options && options.params && options.params[this.paramNames.start]) {
                result = parseInt(options.params[this.paramNames.start], 10);
                if (isNaN(result)) {
                    result = 0;
                }
            }
            return result;
        },

        // Public
        hasNextSiblingNode: function (rc) {
            return this.getNodeNextSibling(rc) !== null;
        },

        // Public
        hasPrevSiblingNode: function (rc) {
            return this.getNodePrevSibling(rc) !== null;
        },

        // Public
        hasChildNodes: function (rc) {
            return this.getNodeChildrenCount(rc) > 0;
        },

        // Public
        getNodeAncestors: function (rc) {
            var ancestors = [],
                parent;

            parent = this.getNodeParent(rc);
            while (parent) {
                ancestors.push(parent);
                parent = this.getNodeParent(parent);
            }

            return ancestors;
        },

        // Public
        getNodeChildrenCount: function (rc) {
            return this.getNodeChildren(rc).length;
        },

        // Public
        getNodeNextSibling: function (rc) {
            var siblings,
                parent,
                index,
                result = null;

            parent = this.getNodeParent(rc);
            if (parent) {
                siblings = this.getNodeChildren(parent);
            }
            else {
                siblings = this.getRootNodes();
            }

            index = siblings.indexOf(rc);

            if (index < siblings.length - 1) {
                result = siblings[index + 1];
            }

            return result;
        },

        // Public
        getNodePrevSibling: function (rc) {
            var siblings,
                parent,
                index,
                result = null;

            parent = this.getNodeParent(rc);
            if (parent) {
                siblings = this.getNodeChildren(parent);
            }
            else {
                siblings = this.getRootNodes();
            }

            index = siblings.indexOf(rc);
            if (index > 0) {
                result = siblings[index - 1];
            }

            return result;
        },

        // Abstract tree support methods.
        // -----------------------------------------------------------------------------------------------

        // Public - Abstract
        getRootNodes: function () {
            throw 'Abstract method call';
        },

        // Public - Abstract
        getNodeDepth: function (rc) {
            throw 'Abstract method call';
        },

        // Public - Abstract
        getNodeParent: function (rc) {
            throw 'Abstract method call';
        },

        // Public - Abstract
        getNodeChildren: function (rc) {
            throw 'Abstract method call';
        },

        // Public - Abstract
        addToNode: function (parent, child) {
            throw 'Abstract method call';
        },

        // Public - Abstract
        removeFromNode: function (parent, child) {
            throw 'Abstract method call';
        },

        // Paging support methods.
        // -----------------------------------------------------------------------------------------------
        /**
         * Returns top level node page offset.
         *
         * @access public
         * @return {Integer}
         */
        getPageOffset: function () {
            return this.page_offset;
        },

        /**
         * Returns active node page offset.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodePageOffset: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenOffset(this.active_node);
            }
            else {
                result = this.getPageOffset();
            }

            return result;
        },

        /**
         * Returns active node children count.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodeCount: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenCount(this.active_node);
            }
            else {
                result = this.getRootNodes().length;
            }

            return result;
        },

        /**
         * Returns active node total children count.
         *
         * @access public
         * @return {Integer}
         */
        getActiveNodeTotalCount: function () {
            var result;

            if (this.active_node) {
                result = this.getNodeChildrenTotalCount(this.active_node);
            }
            else {
                result = this.getTotalCount();
            }

            return result;
        }

    });

/**
 * Tree store for adjacency list tree representation.
 */
Ext.ux.maximgb.treegrid.AdjacencyListStore = Ext.extend(Ext.ux.maximgb.treegrid.AbstractTreeStore,
    {
        /**
         * @cfg {String} parent_id_field_name Record parent id field name.
         */
        parent_id_field_name: '_parent',

        getRootNodes: function () {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.parent_id_field_name) == null) {
                    result.push(records[i]);
                }
            }

            return result;
        },

        getNodeDepth: function (rc) {
            return this.getNodeAncestors(rc).length;
        },

        getNodeParent: function (rc) {
            return this.getById(rc.get(this.parent_id_field_name));
        },

        getNodeChildren: function (rc) {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.parent_id_field_name) == rc.id) {
                    result.push(records[i]);
                }
            }

            return result;
        }
    });

/**
 * Tree store for nested set tree representation.
 */
Ext.ux.maximgb.treegrid.NestedSetStore = Ext.extend(Ext.ux.maximgb.treegrid.AbstractTreeStore,
    {
        /**
         * @cfg {String} left_field_name Record NS-left bound field name.
         */
        left_field_name: '_lft',

        /**
         * @cfg {String} right_field_name Record NS-right bound field name.
         */
        right_field_name: '_rgt',

        /**
         * @cfg {String} level_field_name Record NS-level field name.
         */
        level_field_name: '_level',

        /**
         * @cfg {Number} root_node_level Root node level.
         */
        root_node_level: 1,

        getRootNodes: function () {
            var i,
                len,
                result = [],
                records = this.data.getRange();

            for (i = 0, len = records.length; i < len; i++) {
                if (records[i].get(this.level_field_name) == this.root_node_level) {
                    result.push(records[i]);
                }
            }

            return result;
        },

        getNodeDepth: function (rc) {
            return rc.get(this.level_field_name) - this.root_node_level;
        },

        getNodeParent: function (rc) {
            var result = null,
                rec, records = this.data.getRange(),
                i, len,
                lft, r_lft,
                rgt, r_rgt,
                level, r_level;

            lft = rc.get(this.left_field_name);
            rgt = rc.get(this.right_field_name);
            level = rc.get(this.level_field_name);

            for (i = 0, len = records.length; i < len; i++) {
                rec = records[i];
                r_lft = rec.get(this.left_field_name);
                r_rgt = rec.get(this.right_field_name);
                r_level = rec.get(this.level_field_name);

                if (
                    r_level == level - 1 &&
                    r_lft < lft &&
                    r_rgt > rgt
                ) {
                    result = rec;
                    break;
                }
            }

            return result;
        },

        getNodeChildren: function (rc) {
            var lft, r_lft,
                rgt, r_rgt,
                level, r_level,
                records, rec,
                result = [];

            records = this.data.getRange();

            lft = rc.get(this.left_field_name);
            rgt = rc.get(this.right_field_name);
            level = rc.get(this.level_field_name);

            for (i = 0, len = records.length; i < len; i++) {
                rec = records[i];
                r_lft = rec.get(this.left_field_name);
                r_rgt = rec.get(this.right_field_name);
                r_level = rec.get(this.level_field_name);

                if (
                    r_level == level + 1 &&
                    r_lft > lft &&
                    r_rgt < rgt
                ) {
                    result.push(rec);
                }
            }

            return result;
        }
    });

Ext.ux.maximgb.treegrid.GridView = Ext.extend(Ext.grid.GridView,
    {
        // private
        breadcrumbs_el: null,

        // private - overriden
        initTemplates: function () {
            var ts = this.templates || {};

            ts.master = new Ext.Template(
                '<div class="x-grid3" hidefocus="true">',
                '<div class="x-grid3-viewport">',
                '<div class="x-grid3-header">',
                // Breadcrumbs
                '<div class="x-grid3-header-inner">',
                '<div class="x-grid3-header-offset">',
                '<div class="ux-maximgb-treegrid-breadcrumbs">&#160;</div>',
                '</div>',
                '</div>',
                '<div class="x-clear"></div>',
                // End of breadcrumbs
                // Header
                '<div class="x-grid3-header-inner">',
                '<div class="x-grid3-header-offset">{header}</div>',
                '</div>',
                '<div class="x-clear"></div>',
                // End of header
                '</div>',
                // Scroller
                '<div class="x-grid3-scroller">',
                '<div class="x-grid3-body">{body}</div>',
                '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
                '</div>',
                // End of scroller
                '</div>',
                '<div class="x-grid3-resize-marker">&#160;</div>',
                '<div class="x-grid3-resize-proxy">&#160;</div>',
                '</div>'
            );

            ts.row = new Ext.Template(
                '<div class="x-grid3-row {alt} ux-maximgb-treegrid-level-{level}" style="{tstyle} {display_style}">',
                '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                '<tbody>',
                '<tr>{cells}</tr>',
                (
                    this.enableRowBody ?
                        '<tr class="x-grid3-row-body-tr" style="{bodyStyle}">' +
                        '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">' +
                        '<div class="x-grid3-row-body">{body}</div>' +
                        '</td>' +
                        '</tr>'
                        :
                        ''
                ),
                '</tbody>',
                '</table>',
                '</div>'
            );

            ts.cell = new Ext.Template(
                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
                '{treeui}',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
                '</td>'
            );

            ts.treeui = new Ext.Template(
                '<div class="ux-maximgb-treegrid-uiwrap" style="width: {wrap_width}px">',
                '{elbow_line}',
                '<div style="left: {left}px" class="{cls}">&#160;</div>',
                '</div>'
            );

            ts.elbow_line = new Ext.Template(
                '<div style="left: {left}px" class="{cls}">&#160;</div>'
            );

            ts.brd_item = new Ext.Template(
                '<a href="#" id="ux-maximgb-treegrid-brditem-{id}" class="ux-maximgb-treegrid-brditem" title="{title}">{caption}</a>'
            );

            this.templates = ts;
            Ext.ux.maximgb.treegrid.GridView.superclass.initTemplates.call(this);
        },

        // private - overriden
        initElements: function () {
            var E = Ext.Element;

            var el = this.grid.getGridEl().dom.firstChild;
            var cs = el.childNodes;

            this.el = new E(el);

            this.mainWrap = new E(cs[0]);
            this.mainHd = new E(this.mainWrap.dom.firstChild);

            if (this.grid.hideHeaders) {
                this.mainHd.setDisplayed(false);
            }

            // ----- Modification start
            //Original: this.innerHd = this.mainHd.dom.firstChild;
            this.innerHd = this.mainHd.dom.childNodes[2];
            // ----- End of modification
            this.scroller = new E(this.mainWrap.dom.childNodes[1]);

            if (this.forceFit) {
                this.scroller.setStyle('overflow-x', 'hidden');
            }
            this.mainBody = new E(this.scroller.dom.firstChild);

            this.focusEl = new E(this.scroller.dom.childNodes[1]);
            this.focusEl.swallowEvent("click", true);

            this.resizeMarker = new E(cs[1]);
            this.resizeProxy = new E(cs[2]);

            this.breadcrumbs_el = this.el.child('.ux-maximgb-treegrid-breadcrumbs');
            this.setRootBreadcrumbs();
        },

        // Private - Overriden
        doRender: function (cs, rs, ds, startRow, colCount, stripe) {
            var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount - 1;
            var tstyle = 'width:' + this.getTotalWidth() + ';';
            // buffers
            var buf = [], cb, c, p = {}, rp = {tstyle: tstyle}, r;
            for (var j = 0, len = rs.length; j < len; j++) {
                r = rs[j];
                cb = [];
                var rowIndex = (j + startRow);
                for (var i = 0; i < colCount; i++) {
                    c = cs[i];
                    p.id = c.id;
                    p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                    p.attr = p.cellAttr = "";
                    p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                    p.style = c.style;
                    if (p.value == undefined || p.value === "") {
                        p.value = "&#160;";
                    }
                    if (r.dirty && typeof r.modified[c.name] !== 'undefined') {
                        p.css += ' x-grid3-dirty-cell';
                    }
                    // ----- Modification start
                    if (c.id == this.grid.master_column_id) {
                        p.treeui = this.renderCellTreeUI(r, ds);
                    }
                    else {
                        p.treeui = '';
                    }
                    // ----- End of modification
                    cb[cb.length] = ct.apply(p);
                }
                var alt = [];
                if (stripe && ((rowIndex + 1) % 2 == 0)) {
                    alt[0] = "x-grid3-row-alt";
                }
                if (r.dirty) {
                    alt[1] = " x-grid3-dirty-row";
                }
                rp.cols = colCount;
                if (this.getRowClass) {
                    alt[2] = this.getRowClass(r, rowIndex, rp, ds);
                }
                rp.alt = alt.join(" ");
                rp.cells = cb.join("");
                // ----- Modification start
                if (!ds.isVisibleNode(r)) {
                    rp.display_style = 'display: none;';
                }
                else {
                    rp.display_style = '';
                }
                rp.level = ds.getNodeDepth(r);
                // ----- End of modification
                buf[buf.length] = rt.apply(rp);
            }
            return buf.join("");
        },

        renderCellTreeUI: function (record, store) {
            var tpl = this.templates.treeui,
                line_tpl = this.templates.elbow_line,
                tpl_data = {},
                rec, parent,
                depth = level = store.getNodeDepth(record);

            tpl_data.wrap_width = (depth + 1) * 16;
            if (level > 0) {
                tpl_data.elbow_line = '';
                rec = record;
                left = 0;
                while (level--) {
                    parent = store.getNodeParent(rec);
                    if (parent) {
                        if (store.hasNextSiblingNode(parent)) {
                            tpl_data.elbow_line =
                                line_tpl.apply({
                                    left: level * 16,
                                    cls: 'ux-maximgb-treegrid-elbow-line'
                                }) +
                                tpl_data.elbow_line;
                        }
                        else {
                            tpl_data.elbow_line =
                                line_tpl.apply({
                                    left: level * 16,
                                    cls: 'ux-maximgb-treegrid-elbow-empty'
                                }) +
                                tpl_data.elbow_line;
                        }
                    }
                    else {
                        throw [
                            "Tree inconsistency can't get level ",
                            level + 1,
                            " node(id=", rec.id, ") parent."
                        ].join("")
                    }
                    rec = parent;
                }
            }
            if (store.isLeafNode(record)) {
                if (store.hasNextSiblingNode(record)) {
                    tpl_data.cls = 'ux-maximgb-treegrid-elbow';
                }
                else {
                    tpl_data.cls = 'ux-maximgb-treegrid-elbow-end';
                }
            }
            else {
                tpl_data.cls = 'ux-maximgb-treegrid-elbow-active ';
                if (store.isExpandedNode(record)) {
                    if (store.hasNextSiblingNode(record)) {
                        tpl_data.cls += 'ux-maximgb-treegrid-elbow-minus';
                    }
                    else {
                        tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-minus';
                    }
                }
                else {
                    if (store.hasNextSiblingNode(record)) {
                        tpl_data.cls += 'ux-maximgb-treegrid-elbow-plus';
                    }
                    else {
                        tpl_data.cls += 'ux-maximgb-treegrid-elbow-end-plus';
                    }
                }
            }
            tpl_data.left = 1 + depth * 16;

            return tpl.apply(tpl_data);
        },

        // Private
        getBreadcrumbsEl: function () {
            return this.breadcrumbs_el;
        },

        // Private
        expandRow: function (record, initial) {
            var ds = this.ds,
                i, len, row, pmel, children, index, child_index;

            if (typeof record == 'number') {
                index = record;
                record = ds.getAt(index);
            }
            else {
                index = ds.indexOf(record);
            }

            row = this.getRow(index);
            pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
            if (pmel) {
                if (ds.hasNextSiblingNode(record)) {
                    pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
                    pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
                    pmel.addClass('ux-maximgb-treegrid-elbow-minus');
                }
                else {
                    pmel.removeClass('ux-maximgb-treegrid-elbow-plus');
                    pmel.removeClass('ux-maximgb-treegrid-elbow-end-plus');
                    pmel.addClass('ux-maximgb-treegrid-elbow-end-minus');
                }
                if (ds.isVisibleNode(record)) {
                    children = ds.getNodeChildren(record);
                    for (i = 0, len = children.length; i < len; i++) {
                        child_index = ds.indexOf(children[i]);
                        row = this.getRow(child_index);
                        Ext.fly(row).setStyle('display', 'block');
                        if (ds.isExpandedNode(children[i])) {
                            this.expandRow(child_index);
                        }
                    }
                }
            }
        },

        collapseRow: function (record) {
            var ds = this.ds,
                i, len, children, row, index;

            if (typeof record == 'number') {
                index = record;
                record = ds.getAt(index);
            }
            else {
                index = ds.indexOf(record);
            }

            row = this.getRow(index);
            pmel = Ext.fly(row).child('.ux-maximgb-treegrid-elbow-active');
            if (pmel) {
                if (ds.hasNextSiblingNode(record)) {
                    pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
                    pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
                    pmel.addClass('ux-maximgb-treegrid-elbow-plus');
                }
                else {
                    pmel.removeClass('ux-maximgb-treegrid-elbow-minus');
                    pmel.removeClass('ux-maximgb-treegrid-elbow-end-minus');
                    pmel.addClass('ux-maximgb-treegrid-elbow-end-plus');
                }
                children = ds.getNodeChildren(record);
                for (i = 0, len = children.length; i < len; i++) {
                    index = ds.indexOf(children[i]);
                    row = this.getRow(index);
                    Ext.fly(row).setStyle('display', 'none');
                    this.collapseRow(index);
                }
            }
        },

        /**
         * @access private
         */
        initData: function (ds, cm) {
            Ext.ux.maximgb.treegrid.GridView.superclass.initData.call(this, ds, cm);
            if (this.ds) {
                this.ds.un('activenodechange', this.onStoreActiveNodeChange, this);
                this.ds.un('expandnode', this.onStoreExpandNode, this);
                this.ds.un('collapsenode', this.onStoreCollapseNode, this);
            }
            if (ds) {
                ds.on('activenodechange', this.onStoreActiveNodeChange, this);
                ds.on('expandnode', this.onStoreExpandNode, this);
                ds.on('collapsenode', this.onStoreCollapseNode, this);
            }
        },

        onStoreActiveNodeChange: function (store, old_rc, new_rc) {
            var parents, i, len, rec, items = [],
                ts = this.templates;

            if (new_rc) {
                parents = this.ds.getNodeAncestors(new_rc),
                    parents.reverse();
                parents.push(new_rc);

                for (i = 0, len = parents.length; i < len; i++) {
                    rec = parents[i];
                    items.push(
                        ts.brd_item.apply({
                            id: rec.id,
                            title: this.grid.i18n.breadcrumbs_tip,
                            caption: rec.get(
                                this.cm.getDataIndex(
                                    this.cm.getIndexById(this.grid.master_column_id)
                                )
                            )
                        })
                    );
                }

                this.breadcrumbs_el.update(
                    this.grid.i18n.path_separator +
                    ts.brd_item.apply({
                        id: '',
                        title: this.grid.i18n.breadcrumbs_root_tip,
                        caption: this.grid.root_title
                    }) +
                    this.grid.i18n.path_separator +
                    items.join(this.grid.i18n.path_separator)
                );
            }
            else {
                this.setRootBreadcrumbs();
            }
        },

        setRootBreadcrumbs: function () {
            var ts = this.templates;
            this.breadcrumbs_el.update(
                this.grid.i18n.path_separator +
                ts.brd_item.apply({
                    id: '',
                    title: this.grid.i18n.breadcrumbs_root_tip,
                    caption: this.grid.root_title
                })
            );
        },

        onLoad: function (store, records, options) {
            var id = store.getLoadedNodeIdFromOptions(options);
            if (id === null) {
                Ext.ux.maximgb.treegrid.GridView.superclass.onLoad.call(this, store, records, options);
            }
        },

        onStoreExpandNode: function (store, rc) {
            this.expandRow(rc);
        },

        onStoreCollapseNode: function (store, rc) {
            this.collapseRow(rc);
        }
    });

Ext.ux.maximgb.treegrid.GridPanel = Ext.extend(Ext.grid.GridPanel,
    {
        /**
         * @cfg {String|Integer} master_column_id Master column id. Master column cells are nested.
         * Master column cell values are used to build breadcrumbs.
         */
        master_column_id: 0,

        /**
         * @cfg {String} Root node title.
         */
        root_title: null,

        /**
         * @cfg {Object} i18n I18N text strings.
         */
        i18n: null,

        // Private
        initComponent: function () {
            Ext.ux.maximgb.treegrid.GridPanel.superclass.initComponent.call(this);

            Ext.applyIf(this.i18n, Ext.ux.maximgb.treegrid.GridPanel.prototype.i18n);

            if (!this.root_title) {
                this.root_title = this.title || this.i18n.root_title;
            }

            this.getSelectionModel().on(
                'selectionchange',
                this.onTreeGridSelectionChange,
                this
            );
        },

        /****
         * Exportar a excel el grid
         ****/

        Base64 :function(input) {

            // private property
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/\r\n/g,"\n");
            var utftext = "";
            for (var n = 0; n < input.length; n++) {
                var c = input.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            input = utftext;
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        },

        normalize : function(str) {
            var from = "ÁÉÍÓÚÜáéíóúüÑñ",
                to   = [],
                mapping = {};

            to.push("&Aacute;");
            to.push("&Eacute;");
            to.push("&Iacute;");
            to.push("&Oacute;");
            to.push("&Uacute;");
            to.push("&Uuml;");
            to.push("&aacute;");
            to.push("&eacute;");
            to.push("&iacute;");
            to.push("&oacute;");
            to.push("&uacute;");
            to.push("&uuml;");
            to.push("&Ntilde;");
            to.push("&ntilde;");


            for(var i = 0, j = from.length; i < j; i++ )
                mapping[ from.charAt( i ) ] = to[i];

            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }
            return ret.join( '' );

        },

        saveAs: function(uri, filename) {
            var link = document.createElement('a');
            if (typeof link.download === 'string') {
                link.href = uri;
                link.setAttribute('download', filename);

                //Firefox requires the link to be in the body
                document.body.appendChild(link);

                //simulate click
                link.click();

                //remove the link when done
                document.body.removeChild(link);
            } else {
                window.open(uri);
            }
        },

        getExcelXml: function(includeHidden, title) {
            var worksheet = this.createWorksheet(includeHidden, title);
            var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
            return '<?xml version="1.0" encoding="UTF-8"?>' +
                '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
                '<o:DocumentProperties><o:Title>' + title + '</o:Title></o:DocumentProperties>' +
                '<ss:ExcelWorkbook>' +
                '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
                '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
                '<ss:ProtectStructure>False</ss:ProtectStructure>' +
                '<ss:ProtectWindows>False</ss:ProtectWindows>' +
                '</ss:ExcelWorkbook>' +
                '<ss:Styles>' +
                '<ss:Style ss:ID="Default">' +
                '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
                '<ss:Font ss:FontName="arial" ss:Size="10" />' +
                '<ss:Borders>' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
                '</ss:Borders>' +
                '<ss:Interior />' +
                '<ss:NumberFormat />' +
                '<ss:Protection />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="title">' +
                '<ss:Borders />' +
                '<ss:Font />' +
                '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
                '<ss:NumberFormat ss:Format="@" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="headercell">' +
                '<ss:Font ss:Bold="1" ss:Size="10" />' +
                '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="even">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="grid1">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#f8f8ff" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="grid2">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#ffffff" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evendate">' +
                '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenint">' +
                '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
                '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="odd">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
                '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
                '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
                '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '</ss:Styles>' +
                worksheet.xml +
                '</ss:Workbook>';
        },

        createWorksheet: function(includeHidden, title) {

            //      Calculate cell data types and extra class names which affect formatting
            var cellType = [];
            var cellTypeClass = [];
            var cm = this.getColumnModel();
            var totalWidthInPixels = 0;
            var colXml = '';
            var headerXml = '';
            for (var i = 1; i < cm.getColumnCount(); i++) {
                if (includeHidden || !cm.isHidden(i)) {
                    var w = cm.getColumnWidth(i)
                    if(cm.getDataIndex(i)=="nombreautor")
                        w=265;
                    totalWidthInPixels += w;
                    colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
                    headerXml += '<ss:Cell ss:StyleID="headercell">' +
                        '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                        '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                    var fld = this.getStore().recordType.prototype.fields.get(cm.getDataIndex(i));
                    switch(fld.type) {
                        case "int":
                            cellType.push("Number");
                            cellTypeClass.push("int");
                            break;
                        case "float":
                            cellType.push("Number");
                            cellTypeClass.push("float");
                            break;
                        case "bool":
                        case "boolean":
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                        case "date":
                            cellType.push("DateTime");
                            cellTypeClass.push("date");
                            break;
                        default:
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                    }
                }
            }
            var visibleColumnCount = cellType.length;

            var result = {
                height: 9000,
                width: Math.floor(totalWidthInPixels * 30) + 50
            };

            //      Generate worksheet header details.
            var t = '<ss:Worksheet ss:Name="' + title + '">' +
                '<ss:Names>' +
                '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + title + '\'!R1:R2" />' +
                '</ss:Names>' +
                '<ss:Table x:FullRows="1" x:FullColumns="1"' +
                ' ss:ExpandedColumnCount="' + visibleColumnCount +
                '" ss:ExpandedRowCount="' + (this.store.getCount() + 2) + '">' +
                colXml +
                '<ss:Row ss:Height="38">' +
                '<ss:Cell ss:StyleID="title" ss:MergeAcross="' + (visibleColumnCount - 1) + '">' +
                '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">' +
                '<html:B><html:U><html:Font html:Size="15">' + title +
                '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />' +
                '</ss:Cell>' +
                '</ss:Row>' +
                '<ss:Row ss:AutoFitHeight="1">' +
                headerXml +
                '</ss:Row>';

            //      Generate the data rows from the data in the Store
            for (var i = 0, it = this.getStore().data.items, l = it.length; i < l; i++) {
                t += '<ss:Row>';
                r = it[i].data;
                var cellClass = (i & 1) ? 'grid2' : 'grid1';
                var nivel="";
                for (var j = 1; j < cm.getColumnCount(); j++) {
                    if (includeHidden || !cm.isHidden(j)) {
                        var v = r[cm.getDataIndex(j)];
                        if(v!=null){
                            if(cm.getDataIndex(j)=='denominacion'){
                                nivel=this.contruirNivel(this.nivel(r));
                                v=nivel+v;
                            }
                            if(v.length>0)
                                v=this.normalize(v);
                            t += ('<ss:Cell  ss:StyleID="'+cellClass+'">'+'<ss:Data ss:Type="String">' + v + '</ss:Data></ss:Cell>');
                        }
                        else{
                            t += ('<ss:Cell  ss:StyleID="'+cellClass+'">'+'<ss:Data ss:Type="String">' + '' + '</ss:Data></ss:Cell>');
                        }
                    }

                }
                t += '</ss:Row>';
            }

            result.xml = t + '</ss:Table>' +
                '<x:WorksheetOptions>' +
                '<x:PageSetup>' +
                '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
                '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
                '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
                '</x:PageSetup>' +
                '<x:FitToPage />' +
                '<x:Print>' +
                '<x:PrintErrors>Blank</x:PrintErrors>' +
                '<x:FitWidth>1</x:FitWidth>' +
                '<x:FitHeight>32767</x:FitHeight>' +
                '<x:ValidPrinterInfo />' +
                '<x:VerticalResolution>600</x:VerticalResolution>' +
                '</x:Print>' +
                '<x:Selected />' +
                '<x:DoNotDisplayGridlines />' +
                '<x:ProtectObjects>False</x:ProtectObjects>' +
                '<x:ProtectScenarios>False</x:ProtectScenarios>' +
                '</x:WorksheetOptions>' +
                '</ss:Worksheet>';
            return result;
        },

        nivel:function(nodo){
            if(nodo._parent==null){
                return 0;
            }
            else {
                var rec=this.getStore().getById(nodo._parent);
                return 1+this.nivel(rec.data);
            }
        },
        contruirNivel:function(cant){
            var pos=0;
            var nivel='';
            while(pos<cant){
                if(pos+1==cant)
                    nivel+='|----';
                else
                    nivel+='|    ';
                pos++;
            }
            return  nivel;
        },
        /**
         * Returns view instance.
         *
         * @access private
         * @return {GridView}
         */
        getView: function () {
            if (!this.view) {
                this.view = new Ext.ux.maximgb.treegrid.GridView(this.viewConfig);
            }
            return this.view;
        },

        /**
         * @access private
         */
        onClick: function (e) {
            var target = e.getTarget(),
                view = this.getView(),
                row = view.findRowIndex(target),
                store = this.getStore(),
                sm = this.getSelectionModel(),
                record, record_id;

            // Row click
            if (row !== false) {
                if (Ext.fly(target).hasClass('ux-maximgb-treegrid-elbow-active')) {
                    record = store.getAt(row);
                    if (store.isExpandedNode(record)) {
                        store.collapseNode(record);
                    }
                    else {
                        store.expandNode(record);
                    }
                }
            }
            // Breadcrumb click
            else if (Ext.fly(target).hasClass('ux-maximgb-treegrid-brditem')) {
                record_id = Ext.id(target);
                record_id = record_id.substr(record_id.lastIndexOf('-') + 1);
                if (record_id != '') {
                    record = store.getById(record_id);
                    row = store.indexOf(record);

                    if (e.hasModifier()) {
                        if (store.isExpandedNode(record)) {
                            store.collapseNode(record);
                        }
                        else {
                            store.expandNode(record);
                        }
                    }
                    else if (sm.isSelected && !sm.isSelected(row)) {
                        sm.selectRow(row);
                    }
                }
                else {
                    sm.clearSelections();
                }
                e.stopPropagation();
            }

            Ext.ux.maximgb.treegrid.GridPanel.superclass.onClick.call(this, e);
        },

        /**
         * @access private
         */
        onDblClick: function (e) {
            var target = e.getTarget(),
                view = this.getView(),
                row = view.findRowIndex(target),
                store = this.getStore(),
                sm = this.getSelectionModel(),
                record, record_id;

            // Breadcrumbs select + expand/collapse
            if (!row && Ext.fly(target).hasClass('ux-maximgb-treegrid-brditem')) {
                record_id = Ext.id(target);
                record_id = record_id.substr(record_id.lastIndexOf('-') + 1);
                if (record_id != '') {
                    record = store.getById(record_id);
                    row = store.indexOf(record);

                    if (store.isExpandedNode(record)) {
                        store.collapseNode(record);
                    }
                    else {
                        store.expandNode(record);
                    }

                    if (sm.isSelected && !sm.isSelected(row)) {
                        sm.selectRow(row);
                    }
                }
                else {
                    sm.clearSelections();
                }
            }

            Ext.ux.maximgb.treegrid.GridPanel.superclass.onDblClick.call(this, e);
        },

        /**
         * @access private
         */
        onTreeGridSelectionChange: function (sm, selection) {
            var record;
            // Row selection model
            if (sm.getSelected) {
                record = sm.getSelected();
                this.getStore().setActiveNode(record);
            }
            // Cell selection model
            else if (Ext.type(selection) == 'array' && selection.length > 0) {
                record = store.getAt(selection[0])
                this.getStore().setActiveNode(record);
            }
            else {
                throw "Unknown selection model applyed to the grid.";
            }
        }
    });

Ext.ux.maximgb.treegrid.GridPanel.prototype.i18n = {
    path_separator: ' / ',
    root_title: '[root]',
    breadcrumbs_tip: 'Click para marcar el elemento, CTRL+Click para expandir o collapsar el elemento, Doble Click para seleccionar y expandir(o colapsar) el elemento.',//'Click to select node, CTRL+Click to expand or collapse node, Double click to select and expand or collapse node.',
    breadcrumbs_root_tip: 'Click para desmarcar la selecci&oacute;n y activar el paginado inicial.'//'Click to select the top level node.'
}

/**
 * Paging toolbar for work this AbstractTreeStore.
 */
/**
 *
 * @class Ext.ux.maximgb.treegrid.PagingToolbar
 * @extends Ext.PagingToolbar
 * @return {Ext.ux.maximgb.treegrid.PagingToolbar}
 */
Ext.ux.maximgb.treegrid.PagingToolbar = Ext.extend(Ext.PagingToolbar,
    {
        onRender: function (ct, position) {
            Ext.ux.maximgb.treegrid.PagingToolbar.superclass.onRender.call(this, ct, position);
            this.updateUI();
        },

        getPageData: function () {
            var total = 0, cursor = 0;
            if (this.store) {
                cursor = this.store.getActiveNodePageOffset();
                total = this.store.getActiveNodeTotalCount();
            }
            return {
                total: total,
                activePage: Math.ceil((cursor + this.pageSize) / this.pageSize),
                pages: total < this.pageSize ? 1 : Math.ceil(total / this.pageSize)
            };
        },

        updateInfo: function () {
            var count = 0, cursor = 0, total = 0, msg;
            if (this.displayEl) {
                if (this.store) {
                    cursor = this.store.getActiveNodePageOffset();
                    count = this.store.getActiveNodeCount();
                    total = this.store.getActiveNodeTotalCount();
                }
                msg = count == 0 ?
                    this.emptyMsg
                    :
                    String.format(
                        this.displayMsg,
                        cursor + 1, /*cursor + count*/total, total
                    );
                this.displayEl.update(msg);
            }
        },

        updateUI: function () {
            var d = this.getPageData(), ap = d.activePage, ps = d.pages;
            this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
            this.field.dom.value = ap;
            this.first.setDisabled(ap == 1);
            this.prev.setDisabled(ap == 1);
            this.next.setDisabled(ap == ps);
            this.last.setDisabled(ap == ps);
            this.loading.enable();
            this.updateInfo();
        },

        unbind: function (store) {
            Ext.ux.maximgb.treegrid.PagingToolbar.superclass.unbind.call(this, store);
            store.un('activenodechange', this.onStoreActiveNodeChange, this);
        },

        bind: function (store) {
            Ext.ux.maximgb.treegrid.PagingToolbar.superclass.bind.call(this, store);
            store.on('activenodechange', this.onStoreActiveNodeChange, this);
        },

        beforeLoad: function (store, options) {
            Ext.ux.maximgb.treegrid.PagingToolbar.superclass.beforeLoad.call(this, store, options);
            if (options && options.params) {
                if (this.paramNames !== undefined) {
                    if (options.params[this.paramNames.start] === undefined) {
                        options.params[this.paramNames.start] = 0;
                    }
                    if (options.params[this.paramNames.limit] === undefined) {
                        options.params[this.paramNames.limit] = this.pageSize;
                    }
                } else {
                    options.params.start = 0;
                    options.params.limit = this.pageSize;
                }
            }
        },

        onClick: function (which) {
            var store = this.store,
                cursor = store ? store.getActiveNodePageOffset() : 0,
                total = store ? store.getActiveNodeTotalCount() : 0;

            switch (which) {
                case "first":
                    this.doLoad(0);
                    break;
                case "prev":
                    this.doLoad(Math.max(0, cursor - this.pageSize));
                    break;
                case "next":
                    this.doLoad(cursor + this.pageSize);
                    break;
                case "last":
                    var extra = total % this.pageSize;
                    var lastStart = extra ? (total - extra) : total - this.pageSize;
                    this.doLoad(lastStart);
                    break;
                case "refresh":
                    this.doLoad(cursor);
                    break;
            }
        },

        onStoreActiveNodeChange: function (store, old_rec, new_rec) {
            if (this.rendered) {
                this.updateUI();
            }
        },

        getLastStart: function () {
            var store = this.store;
            var total = store ? store.getActiveNodeTotalCount() : 0;
            var extra = total % this.pageSize;
            return lastStart = extra ? (total - extra) : total - this.pageSize;
        }

    });

Ext.reg('ux-maximgb-treegrid', Ext.ux.maximgb.treegrid.GridPanel);
Ext.reg('ux-maximgb-paging', Ext.ux.maximgb.treegrid.PagingToolbar);

