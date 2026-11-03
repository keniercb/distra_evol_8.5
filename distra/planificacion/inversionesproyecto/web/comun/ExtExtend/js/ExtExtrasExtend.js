/**
 * Created by john on 14/05/15.
 */

/**
 * Script con los componentes extras como menus, tbar etc
 * requires : [
 *      _ExtBase(dev).js,
 *      ExtExtends.js
 *  ]
 */

(function(_){

    var cls = _.Class,
        reg = Ext.reg,
        comps = _.Components,
        utils = _.Utils;

    comps.plugins = {
        tree: {
            localTree: cls({
                $extend : Ext.util.Observable,
                tree: null,
                loaderFunctions: {
                    proccesNodeAttributes: function(pJson){
                        return pJson;
                    },
                    proccessJsonNodes: function(pNode, pJson){
                        for(var i = 0, len = pJson.length; i < len; i++){
                            var n = this.createNode(pJson[i]);
                            if(n){
                                pNode.appendChild(n);
                            }
                        }
                    },
                    processResponse: function(response, node, callback, scope){
                        var json = response.responseText;
                        try{
                            var o = response.responseData || Ext.decode(json);
                            node.beginUpdate();
                            this.proccessJsonNodes(node, o);
                            node.endUpdate();
                            this.runCallback(callback, scope || node, [node]);
                        } catch(e){
                            this.handleFailure(response);
                        }
                    },
                    createNode: function(pNode){
                        pNode = this.proccesNodeAttributes(pNode);
                        if(utils.isArray(pNode.children) && pNode.children.length == 0){
                            delete pNode.children;
                        }

                        if(!pNode.children){
                            pNode.leaf = true;
                        }
                        return Ext.tree.TreeLoader.prototype.createNode.call(this, pNode);
                    }
                },
                nodeFunctions: {
                    parentIndex: {},

                    /**
                     * Funcion que mueve un nodo dentro del arbol
                     * @param pNewParent
                     */
                    moveTo: function(pNewParent){
                        this.moving = true;
                        pNewParent.appendChild(this);
                        delete this.moving;
                    },

                    /**
                     *
                     * @param n
                     * @returns {*|XML|Element|Node}
                     */
                    appendChild: function(n){
                        var tree = this.getOwnerTree();
                        if(!n.render && !Ext.isArray(n)){
                            n = this.getLoader().createNode(n);
                        }
                        var node = Ext.tree.TreeNode.superclass.appendChild.call(this, n);
                        if(node && this.childrenRendered){
                            tree.fireEvent('beforenoderender', tree, node);
                            node.render();
                            tree.fireEvent('afternoderender', tree, node);
                        }
                        if(this.leaf){
                            this.leaf = false;
                            this.wasLeaf = true;
                        }
                        this.ui.updateExpandIcon();
                        return node;
                    },

                    /**
                     * Actualiza el objeto con el indice de padres
                     */
                    updateParentIndex: function(pUpdateChildsIndexes){
                        pUpdateChildsIndexes = pUpdateChildsIndexes == undefined ? false : pUpdateChildsIndexes;
                        this.parentIndex = {};
                        if(this.parentNode){
                            this.parentNode.updateParentIndex();

                            var pIndex = {};
                            pIndex[this.parentNode.id] = this.parentNode;

                            this.parentIndex = Ext.apply(pIndex, this.parentNode.parentIndex);
                        }

                        if(pUpdateChildsIndexes) this.updateChildsParentIndexes();
                    },

                    updateChildsParentIndexes: function(){
                        if(!this.updatingChildsParentsIndexes){
                            this.updatingChildsParentsIndexes = true;
                            var chlds = this.getChilds(false);
                            for(var i = 0; i < chlds.length; i++){
                                chlds[i].updateParentIndex();
                            }
                            this.updatingChildsParentsIndexes = false;
                        }
                    },

                    /**
                     * Funcion que devuelve los nodos hijos
                     * @param pAttrs
                     * @param pMatchCase
                     * @param pDeep
                     * @param pFn
                     * @param pShowOnly
                     * @returns {Array}
                     */
                    getChildsByAttrs: function(pAttrs, pMatchCase, pDeep, pFn, pShowOnly, pHightLight){
                        pDeep = pDeep == undefined ? false : pDeep;
                        pMatchCase = pMatchCase == undefined ? false : pMatchCase;
                        pHightLight = pHightLight == undefined ? false : pHightLight;
                        pFn = pFn == undefined ? false : pFn;
                        pShowOnly = pShowOnly == undefined ? false : pShowOnly;

                        var res = [],
                            strSearch,
                            attribute,
                            strString,
                            flgMatch, nd, glfMatchProp,
                            chlds = this.getChilds(pDeep);

                        for(var i = 0; i < chlds.length; i++){
                            nd = chlds[i];
                            for(var o in pAttrs){

                                if(pAttrs[o] && pAttrs[o].toString() != ''){
                                    strSearch = pAttrs[o].toString().toLocaleLowerCase();
                                    attribute = nd.attributes[o];
                                    if(attribute){
                                        strString = attribute.toString().toLocaleLowerCase();
                                        flgMatch = pMatchCase ? (nd.attributes[o] == pAttrs[o]) : (strString.indexOf(strSearch) >= 0);
                                        glfMatchProp = o;
                                        if(!flgMatch){
                                            break;
                                        }
                                    }
                                    else{
                                        flgMatch = false;
                                        break;
                                    }
                                }
                                else{
                                    flgMatch = true;
                                }

                            }

                            if(flgMatch){

                                if(pShowOnly) nd.show(strSearch, glfMatchProp);
                                //this.forceExpand();
                                res.push(nd);
                                if(utils.isFunction(pFn)) pFn(nd);
                            }
                            else{
                                pShowOnly ? nd.hide() : '';
                                nd.removeHightLight();
                            }
                        }

                        return res;
                    },

                    /**
                     *
                     * @returns {*}
                     */
                    hasHighLightedParent: function(){
                        if(this.parentNode){
                            if(this.parentNode.highLighted){
                                return true;
                            }
                            else{
                                return this.parentNode.hasHighLightedParent();
                            }
                        }
                        return false;
                    },

                    /**
                     *
                     */
                    hide: function(){
                        if(!this.hasHighLightedParent()){
                            this.ui.hide();
                        }
                    },

                    /**
                     *
                     * @param pStr
                     * @param pStyle
                     */
                    highLight: function(pStr, pAttr){
                        pAttr = pAttr || 'text';
                        this.highLighted = true;
                        if(pAttr == 'text'){
                            this.setText(utils.ireplaceStyle((this.attributes._text ? this.attributes._text : this.attributes.text), pStr, 'b'));
                        }

                    },

                    /**
                     *
                     */
                    removeHightLight: function(){
                        if(this.highLighted){
                            this.highLighted = false;
                            this.attributes.text = this.attributes._text || this.attributes.text;
                            this.setText(this.attributes.text);
                        }
                    },

                    /**
                     *
                     * @param pHighLightStr
                     * @param pNode
                     */
                    show: function(pHighLightStr, pAttribute){
                        var node = this,
                            attrs = this.attributes;

                        if(this.parentNode && this.parentNode.hidden){
                            this.parentNode.show();
                        }
                        this.ui.show();

                        if(pHighLightStr){
                            if(node.id = this.id){
                                this.highLight(pHighLightStr, pAttribute);
                            }
                        }
                        else{
                            this.removeHightLight();
                        }
                    },

                    /**
                     * Retorna los hijos de un nodo y ejecuta funcion con cada uno
                     * @param pDepp
                     * @param pFn
                     * @returns {Array}
                     */
                    getChilds: function(pDepp, pFn){
                        if(this.childNodes.length == 0 && this.hasChildrenInAtributes()){
                            this.preload();
                        }

                        pDepp = pDepp == undefined ? false : pDepp;
                        var chldIndex = this.getOwnerTree().index;

                        var res = [];
                        for(var node in chldIndex){
                            if(chldIndex[node].isChild(this, pDepp)){
                                pFn ? pFn(chldIndex[node]) : null;
                                res.push(chldIndex[node]);
                            }
                        }
                        return res;
                    },

                    /**
                     * Verifica si el nodo es hijo a cualquier nivel de otro nodo
                     * @param pParent
                     * @param pDepp
                     * @returns {boolean}
                     */
                    isChild: function(pParent, pDepp){
                        pDepp = pDepp == undefined ? false : pDepp;

                        return (pDepp ? (this.parentIndex[pParent.id]) : (this.parentNode && this.parentNode.id == pParent.id) ) ? true : false;
                    },

                    /**
                     * Retorna los nodos hijos chequeados
                     * @param pDepp
                     * @returns {Array}
                     */
                    getCheckedChilds: function(pDepp, pFn, pScope){
                        pDepp = pDepp == undefined ? false : pDepp;
                        var chlds = this.getChilds(pDepp);

                        var res = [];
                        for(var i = 0; i < chlds.length; i++){
                            if(chlds[i].ui.isChecked()){
                                res.push(chlds[i]);
                                if(utils.isFunction(pFn)) pScope ? pFn.call(pScope, chlds[i]) : pFn(chlds[i]);
                            }
                        }
                        return res;
                    },

                    /**
                     * Retorna los nodos hijos que no se encuentran chequeados
                     * @param pDepp
                     * @returns {Array}
                     */
                    getUnCheckedChilds: function(pDepp){
                        pDepp = pDepp == undefined ? false : pDepp;
                        var chlds = this.getChilds(pDepp);

                        var res = [];
                        for(var i = 0; i < chlds.length; i++){
                            if(!chlds[i].ui.isChecked()){
                                res.push(chlds[i]);
                            }
                        }
                        return res;
                    },

                    /**
                     * Funcion que carga los nodos hijos de este nodo
                     */
                    preload: function(pFnCallBack){
                        var loadComplete = function(deep, anim, callback){
                            this.loading = false;
                            this.loaded = true;
                            this.ui.afterLoad(this);
                            this.fireEvent("load", this);
                            if(utils.isFunction(pFnCallBack)) pFnCallBack(this);
                        };

                        var fn = function(deep, anim, callback){
                            if(this.loading){
                                var timer;
                                var f = function(){
                                    if(!this.loading){
                                        clearInterval(timer);
                                        this.expand(deep, anim, callback);
                                    }
                                }.createDelegate(this);
                                timer = setInterval(f, 200);
                                return;
                            }
                            if(!this.loaded){
                                if(this.fireEvent("beforeload", this) === false){
                                    return;
                                }
                                this.loading = true;
                                //this.ui.beforeLoad(this);
                                var loader = this.loader || this.attributes.loader || this.getOwnerTree().getLoader();
                                if(loader){
                                    loader.load(this, loadComplete.createDelegate(this, [deep, anim, callback]));
                                    return;
                                }
                            }
                        };

                        fn.call(this, false, false);
                    },

                    /**
                     * Verifica si el nodo contiene nodos hijos en los attributos
                     * @returns {boolean}
                     */
                    hasChildrenInAtributes: function(){
                        return this.attributes.children && this.attributes.children.length > 0 ? true : false;
                    },

                    /**
                     * Verifica si el nodo aun no ha cargado los nodos
                     * @returns {boolean}
                     */
                    hasChildrenInCache: function(){
                        return this.childNodes.length == 0 && this.hasChildrenInAtributes();
                    },

                    /**
                     * Verifica si el nodo tiene hijos
                     * @returns {boolean}
                     */
                    hasChildNodes: function(){
                        return this.isRoot ? true : (this.childNodes.length > 0 ? true : ( !this.loaded && this.hasChildrenInAtributes() ? true : false ) );
                    },

                    /**
                     * Renderiza el nodo
                     * @param bulkRender
                     */
                    render: function(bulkRender){
                        this.ui.render(bulkRender);
                        if(!this.rendered){
                            // make sure it is registered
                            this.getOwnerTree().registerNode(this);
                            this.rendered = true;
                            if(this.expanded){
                                this.expanded = false;
                                !this.isRoot ? this.expand(false, false) : null;
                            }
                        }
                    },

                    /**
                     *
                     */
                    beginUpdate: function(){
                        this.childrenRendered = false;
                        this.fireEvent('beginUpdate', this);
                    },

                    /**
                     *
                     */
                    endUpdate: function(){
                        if(this.expanded && this.rendered){
                            this.renderChildren();
                        }
                        this.fireEvent('endUpdate', this);
                    },

                    /**
                     *
                     */
                    forceExpand: function(){
                        if(this.parentNode){
                            this.parentNode.forceExpand();
                        }
                        //if(!this.expanded){
                        this.expand(false, false);
                        //}
                    },

                    /**
                     *
                     * @param suppressEvent
                     */
                    renderChildren: function(suppressEvent){
                        var th = this.getOwnerTree();

                        if(suppressEvent !== false){
                            this.fireEvent("beforechildrenrendered", this);
                        }
                        var cs = this.childNodes;
                        for(var i = 0, len = cs.length; i < len; i++){
                            th.fireEvent('beforenoderender', th, cs[i]);
                            cs[i].render(true);
                            th.fireEvent('afternoderender', th, cs[i]);
                        }
                        this.fireEvent("childrenrendered", this);
                        this.childrenRendered = true;
                    },

                    /**
                     *
                     */
                    removeAll: function(){
                        var me = this;

                        this.getChilds(false, function(pChld){
                            me.removeChild(pChld);
                        });
                    },

                    /**
                     *
                     */
                    requestData: function(pObject, pExpandOnREquestComplete){
                        this.removeAll();
                        var loader = this.getOwnerTree().getLoader();
                        if(pObject){
                            loader.baseParams = pObject;
                        }
                        if(this.ui){
                            this.ui.beforeLoad();
                        }
                        loader.requestData(this, function(){
                            if(this.ui){
                                this.ui.afterLoad();
                            }
                            if(pExpandOnREquestComplete){
                                this.expand(false, false);
                            }
                        });
                    },

                    getLastChild: function(){
                        if(this.childNodes.length == 0) return false;
                        return this.childNodes[this.childNodes.length - 1];
                    },

                    getFirstChild: function(){
                        if(this.childNodes.length == 0) return false;
                        return this.childNodes[0];
                    }
                },
                prepareNode: function(pNode){
                    if(!pNode.$prepared){
                        pNode.attributes._text = pNode.attributes._text || pNode.attributes.text;
                        pNode.$prepared = true;
                        Ext.apply(pNode, this.nodeFunctions);
                    }
                    return pNode;
                },
                prepareTreeLoader: function(pLoader){
                    var th = this,
                        tree = th.tree,
                        loader = pLoader || tree.getLoader();

                    if(!loader) return;
                    Ext.apply(loader, th.loaderFunctions);
                    loader.on({
                        scope: tree,
                        beforeload: function(pThis, pNode){
                            for(var node in this.index){
                                if(this.index[node].isChild(pNode, true)){
                                    delete this.index[node];
                                }
                            }
                        }
                    });
                    return loader;
                },
                prepareTree: function(pTree){
                    var th = this,
                        tree = pTree || th.tree;

                    tree.index = {};
                    this.prepareTreeLoader();
                    this.prepareNode(tree.root);

                    tree.on({
                        scope: th,
                        afterrender: function(pTree){
                            if(pTree.selectedChildAttribute){
                                pTree.root.getChildsByAttrs(pTree.selectedChildAttribute, true, true, function(nd){
                                    nd.forceExpand();
                                    pTree.getSelectionModel().select(nd);
                                });
                            }
                        },
                        append: function(pTree, pParent, pNode){
                            this.prepareNode(pParent);
                            this.prepareNode(pNode);

                            var chldIndex = pTree.index;
                            if(pParent.isRoot){
                                chldIndex[pParent.id] = pParent;
                            }
                            chldIndex[pNode.id] = pNode;

                            pNode.updateParentIndex((this.lastRemovedNode && this.lastRemovedNode.id == pNode.id && pNode.hasChildNodes() ? true : false));

                            pNode.hasChildrenInCache() ? pNode.preload(function(pThNode){
                                if(pParent.isRoot && pTree.selectedChildAttribute){
                                    pThNode.getChildsByAttrs(pTree.selectedChildAttribute, true, true, function(nd){
                                        nd.forceExpand();
                                        pTree.getSelectionModel().select(nd);
                                    });
                                }
                            }) : null;

                        },
                        remove: function(pThis, pParent, pNode){
                            this.lastRemovedNode = pNode;
                            if(!pNode.moving){
                                var ind = this.index;

                                for(var n in ind){
                                    if(ind[n].id == pNode.id || ind[n].parentIndex[pNode.id]){
                                        delete ind[n];
                                    }
                                }
                            }
                        }
                    });

                },
                init: function(pTree){
                    this.tree = pTree;
                    this.prepareTree();

                    if(pTree.root) this.prepareNode(pTree.root);
                }
            })
        },
        grid: {
            checkColumn: cls({
                init: function(grid){
                    this.grid = grid;
                    this.observer = new Ext.util.Observable();
                    this.observer.addEvents({
                        'gridcheckchange': true
                    });
                    this.grid.on('render', function(){
                        var view = this.grid.getView();
                        view.mainBody.on('mousedown', this.onMouseDown, this);
                    }, this);

                },

                onMouseDown: function(e, t){
                    if(Ext.fly(t).hasClass(this.createId())){
                        e.stopEvent();
                        var index = this.grid.getView().findRowIndex(t);
                        var record = this.grid.store.getAt(index);
                        record.set(this.dataIndex, !record.data[this.dataIndex]);
                        if(typeof record.data[this.dataIndex] != 'undefined'){
                            this.observer.fireEvent('gridcheckchange', this, record.data[this.dataIndex], index);
                        }
                    }
                },

                renderer: function(v, p, record){
                    if(record.data.activo == false){
                        p.css += ' x-grid3-check-col-td';
                        return String.format('<div style="background-color: #e8e5e5" class="x-grid3-check-col{0} {1}">&#160;</div>', v ? '-on' : '', this.createId());
                    }
                    else{
                        p.css += ' x-grid3-check-col-td';
                        return String.format('<div class="x-grid3-check-col{0} {1}">&#160;</div>', v ? '-on' : '', this.createId());
                    }
                },

                createId: function(){
                    return 'x-grid3-cc-' + this.id;
                },

                constructor: function(config){
                    Ext.apply(this, config);
                    if(!this.id){
                        this.id = Ext.id();
                    }
                    this.renderer = this.renderer.createDelegate(this);
                }
            }),
            changesValidator: cls({
                $extend : Ext.util.Observable,
                recordCreateObject : null,

                initRecordCreateObject : function(){
                    this.recordCreateObject = new Ext.data.Record.create(this.store.fields);
                },

                getRecordBlankData : function(){
                    var res = {};

                    utils.each(this.grid.getColumnModel().config, function(i, v){
                        res[v.dataIndex] = "";
                    });

                    return res;
                },

                storeGetValuesFunction: function(pAssoc){
                    var th = this, v,
                        assoc = pAssoc == undefined ? false : pAssoc,
                        res = assoc ? {} : [];

                    th.each(function(pRecord){
                        v = utils.apply({},pRecord.data);
                        if(assoc){
                            res[pRecord.id] = v;
                        }
                        else{
                            res.push(v);
                        }
                    });

                    return res;
                },

                storeHaschanges: function(){
                    var orgIndxValues = this.originalsIndexValues,
                        currentIndxValues = this.getValue(true);

                    return Ext.encode(orgIndxValues) != Ext.encode(currentIndxValues);
                },

                storeGetChanges: function(pAssoc){
                    var th = this, tmpV,
                        assoc = pAssoc == undefined ? false : pAssoc,
                        orgIdxV = th.originalsIndexValues || {},
                        currV = th.getValue(true), flgHasChange, chgAct,
                        resChanges = {
                            add: assoc ? {} : [],
                            del: assoc ? {} : [],
                            mod: assoc ? {} : []
                        };

                    if(!this.isDirty()) return false;

                    utils.each(orgIdxV, function(pI, pV){
                        tmpV = currV[pI];
                        flgHasChange = false;

                        if(!tmpV){
                            flgHasChange = true;
                            chgAct = 'del';
                        }
                        else{
                            if(Ext.encode(tmpV) != Ext.encode(pV)){
                                flgHasChange = true;
                                chgAct = 'mod';
                            }
                        }

                        if(flgHasChange){
                            if(assoc){
                                resChanges[chgAct][pI] = chgAct == 'del' ? pV : tmpV;
                            }
                            else{
                                resChanges[chgAct].push((chgAct == 'del' ? pV : tmpV));
                            }
                        }
                    });

                    utils.each(currV, function(pI, pV){
                        tmpV = orgIdxV[pI];

                        if(!tmpV){
                            if(assoc){
                                resChanges['add'][pI] = pV;
                            }
                            else{
                                resChanges['add'].push(pV);
                            }
                        }
                    });

                    return resChanges;
                },

                storeResetOriginalValuesFunction: function(){
                    this.originalsValues = this.getValue();
                    this.originalsIndexValues = this.getValue(true);
                },

                storeAddDataFunction : function(pData){
                    var th = this,
                        utils = _.Utils,
                        changesValObj = th.changesValidator;

                    switch(utils.getTypeOf(pData)){
                        case 'Array':{
                            utils.each(pData, function(i,v){
                                th.addData(v);
                            });
                        }break;
                        case 'Object':{
                            th.add(new changesValObj.recordCreateObject(utils.apply(changesValObj.getRecordBlankData(),pData)));
                        }break;
                    }
                },

                prepareStore: function(){
                    var th = this;

                    Ext.apply(th.store, {
                        originalsValues: {},
                        getChanges: th.storeGetChanges,
                        getXType: function(){
                            return 'gisStore';
                        },
                        isDirty: th.storeHaschanges,
                        getValue: th.storeGetValuesFunction,
                        resetOriginalValues: th.storeResetOriginalValuesFunction,
                        addData : th.storeAddDataFunction,
                        changesValidator : th
                    })
                },

                prepareGrid : function(){
                    var th = this;

                    utils.apply(this.grid,{
                        getXType : function(){
                            return 'grid';
                        },
                        isValid: function(){
                            var grid = th.grid,
                                columns = grid.getColumnModel(),
                                st = th.store, fldName,
                                gridView = grid.getView(),
                                invalidClass = ' invalid-grid-cell',
                                editor, valid = true,
                                column,
                                fnUpdateView = function(pRow,pCol,pValid){
                                    if(gridView.getRow(pRow)){
                                        var cell = gridView.getCell(pRow,pCol);
                                        if(!pValid){
                                            if(cell.className.indexOf(invalidClass) == -1){
                                                cell.className += invalidClass;
                                            }
                                        }else{
                                            cell.className.replace(invalidClass,'');
                                        }
                                    }else{
                                        gridView.on('rowsinserted', function(){
                                            fnUpdateView(pRow,pCol,pValid);
                                        });
                                    }
                                };


                            utils.each(columns.config,function(col,column){
                                fldName = column.dataIndex;

                                st.each(function(pRecord,pRow){
                                    if(editor = columns.getCellEditor(col,pRow)){
                                        editor = editor.field;
                                        editor.setValue(pRecord.get(fldName));
                                        valid = editor.isValid ? editor.isValid() : true;
                                        fnUpdateView(pRow,col,valid);
                                        if(!valid){
                                            return null;
                                        }
                                    }
                                });

                                if(!valid){
                                    return null;
                                }
                            });

                            return valid;
                        },
                        isDirty: function(){
                            return th.store.isDirty();
                        },
                        getValue : function(){
                            return th.store.getValue();
                        },
                        setValue : function(pData){
                            this.store.removeAll();

                            this.store.loadData(pData);
                        },
                        getChanges : function(){
                            return th.store.getChanges.apply(th.store,arguments);
                        },
                        resetOriginalValue : function(){
                            th.store.resetOriginalValues();

                            if(th.rendered) th.view.refresh();
                        },
                        addData : function(){
                            return th.store.addData.apply(th.store,arguments);
                        },
                        changesValidator : th
                    });

                    function fireChange(){
                        th.grid.fireEvent('change');
                    }
                    this.store.on('update',fireChange);
                    this.store.on('remove',fireChange);
                    this.store.on('add',fireChange);
                },
                store: null,
                init: function(pGrid){
                    var th = this;

                    this.grid = pGrid;
                    this.store = pGrid.getStore();

                    this.prepareStore();
                    this.prepareGrid();
                    this.initRecordCreateObject();

                    this.grid.resetOriginalValue();
                }
            }),
            rowEditorr : (new _.FacadeFactory({
                $extend : comps.containers.Panel,
                floating: true,
                shadow: false,
                layout: 'column',
                cls: 'x-small-editor',
                buttonAlign: 'center',
                baseCls: 'x-row-editor',
                //elements: 'header,footer,body',
                frameWidth: 5,
                buttonPad: 3,
                clicksToEdit: 'auto',
                monitorValid: true,
                focusDelay: 250,
                //height: 50,
                errorSummary: true,
                defaults: {
                    normalWidth: true
                },

                cancelButton : null,
                saveButton : null,
                saveButtonClass : _.Components.buttons.btnGuardar,
                cancelButtonClass : _.Components.buttons.btnCancelar,

                editors : null,

                startValidator : true,
                validator : null,
                initValidator : function(){
                    if(this.startValidator){
                        this.validator = new _.FormValidator({
                            fields : this.editors,
                            buttons: [this.saveButton]
                        });
                    }
                },
                updateButtonsPanelWidth : function(){
                    if(this.btns.rendered) this.btns.setWidth((this.saveButton.getWidth() + this.cancelButton.getWidth()) + 23);
                    this.btns.el.dom.style.width = "";
                },
                initComponent: function(){
                    this.initButtons();

                    comps.containers.Panel.prototype.initComponent.call(this);
                    this.addEvents(
                        /**
                         * @event beforeedit
                         * Fired before the row editor is activated.
                         * If the listener returns <tt>false</tt> the editor will not be activated.
                         * @param {comps.plugins.grid.rowEditor} roweditor This object
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'beforeedit',
                        /**
                         * @event validateedit
                         * Fired after a row is edited and passes validation.
                         * If the listener returns <tt>false</tt> changes to the record will not be set.
                         * @param {comps.plugins.grid.rowEditor} roweditor This object
                         * @param {Object} changes Object with changes made to the record.
                         * @param {Ext.data.Record} r The Record that was edited.
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'validateedit',
                        /**
                         * @event afteredit
                         * Fired after a row is edited and passes validation.  This event is fired
                         * after the store's update event is fired with this edit.
                         * @param {comps.plugins.grid.rowEditor} roweditor This object
                         * @param {Object} changes Object with changes made to the record.
                         * @param {Ext.data.Record} r The Record that was edited.
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'afteredit'
                    );
                },
                init: function(grid){
                    this.grid = grid;
                    this.ownerCt = grid;
                    if(this.clicksToEdit === 2){
                        grid.on('rowdblclick', this.onRowDblClick, this);
                    }else{
                        grid.on('rowclick', this.onRowClick, this);
                        if(Ext.isIE){
                            grid.on('rowdblclick', this.onRowDblClick, this);
                        }
                    }

                    // stopEditing without saving when a record is removed from Store.
                    grid.getStore().on('remove', function() {
                        this.stopEditing(false);
                    },this);

                    var cm = grid.getColumnModel();
                    cm.getColumnAt = cm.getColumnAt ? cm.getColumnAt : function(i){
                        return this.config[i];
                    };

                    grid.on({
                        scope: this,
                        keydown: this.onGridKey,
                        columnresize: this.verifyLayout,
                        columnmove: this.refreshFields,
                        reconfigure: this.refreshFields,
                        destroy : this.destroy,
                        bodyscroll: {
                            buffer: 250,
                            fn: this.positionButtons
                        }
                    });
                    grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {delay:1});
                    grid.getView().on('refresh', this.stopEditing.createDelegate(this, []));
                },
                refreshFields: function(){
                    this.initFields();
                    this.verifyLayout();
                },
                isDirty: function(){
                    var dirty;
                    if(this.items instanceof Ext.util.MixedCollection){
                        this.items.each(function(f){
                            if(String(this.values[f.id]) !== String(f.getValue())){
                                dirty = true;
                                return false;
                            }
                        }, this);
                        return dirty;
                    }

                },
                startEditing: function(rowIndex, doFocus){
                    if(this.editing && this.isDirty()){
                        this.showTooltip('You need to commit or cancel your changes');
                        return;
                    }
                    this.editing = true;
                    if(typeof rowIndex == 'object'){
                        rowIndex = this.grid.getStore().indexOf(rowIndex);
                    }
                    if(this.fireEvent('beforeedit', this, rowIndex) !== false){
                        var g = this.grid, view = g.getView();
                        var row = view.getRow(rowIndex);
                        var record = g.store.getAt(rowIndex);
                        this.record = record;
                        this.rowIndex = rowIndex;
                        this.values = {};
                        if(!this.rendered){
                            this.render(view.getEditorParent());
                        }
                        var w = Ext.fly(row).getWidth();
                        this.setSize(w);
                        if(!this.initialized){
                            this.initFields();
                        }
                        var cm = g.getColumnModel(), fields = this.items.items, f, val;
                        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                            val = this.preEditValue(record, cm.getDataIndex(i));
                            f = fields[i];
                            if(f instanceof Ext.form.Radio || f instanceof Ext.form.Checkbox){
                                val = val ==undefined ? false : val;
                                if(f.rendered){
                                    f.setValue(val);
                                }else{
                                    f.checked = val;
                                }
                            }else{
                                f.setValue(val == '' ? '  ' : val);
                            }
                            this.values[f.id] = val || '';
                        }
                        this.verifyLayout(true);
                        if(!this.isVisible()){
                            this.setPagePosition(Ext.fly(row).getXY());
                        } else{
                            this.el.setXY(Ext.fly(row).getXY(), {duration:0.15});
                        }
                        if(!this.isVisible()){
                            this.show().doLayout();
                        }
                        if(doFocus !== false){
                            this.doFocus.defer(this.focusDelay, this);
                        }
                        this.updateButtonsPanelWidth();

                        if(this.startValidator){
                            this.validator.resetOriginalValues();
                            this.validator.check();
                        }
                    }
                },
                stopEditing : function(saveChanges){
                    this.editing = false;
                    if(!this.isVisible()){
                        return;
                    }
                    if(saveChanges === false || !this.isValid()){
                        this.hide();
                        this.fireEvent('stopEditing',this,saveChanges,this.record,this.rowIndex);
                        return;
                    }
                    var changes = {}, r = this.record, hasChange = false;
                    var cm = this.grid.colModel, fields = this.items.items;
                    for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                        if(!cm.isHidden(i)){
                            var dindex = cm.getDataIndex(i);
                            if(!Ext.isEmpty(dindex)){
                                var oldValue = r.data[dindex];
                                var value = this.postEditValue(fields[i].getValue(), oldValue, r, dindex);
                                if(String(oldValue) !== String(value)){
                                    changes[dindex] = value;
                                    hasChange = true;
                                }
                            }
                        }
                    }
                    if(hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false){
                        r.beginEdit();
                        for(var k in changes){
                            if(changes.hasOwnProperty(k)){
                                r.set(k, changes[k]);
                            }
                        }
                        r.endEdit();
                        this.fireEvent('afteredit', this, changes, r, this.rowIndex);
                    }
                    this.hide();


                },
                verifyLayout: function(force){
                    if(this.el && (this.isVisible() || force === true)){
                        var row = this.grid.getView().getRow(this.rowIndex);
                        this.setSize(Ext.fly(row).getWidth(), Ext.isIE ? Ext.fly(row).getHeight() + (Ext.isBorderBox ? 9 : 0) : undefined);
                        var cm = this.grid.colModel, fields = this.items.items;
                        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                            if(!cm.isHidden(i)){
                                var adjust = 0;
                                if(i === 0){
                                    adjust += 0; // outer padding
                                }
                                if(i === (len - 1)){
                                    adjust += 3; // outer padding
                                } else{
                                    adjust += 1;
                                }
                                fields[i].show();
                                fields[i].setWidth(cm.getColumnWidth(i) - adjust);
                            } else{
                                fields[i].hide();
                            }
                        }
                        this.doLayout();
                        this.positionButtons();
                    }
                },
                slideHide : function(){
                    this.hide();
                },
                initFields: function(){
                    var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
                    this.removeAll(false);

                    this.editors = [];
                    for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                        var c = cm.getColumnAt(i);
                        var ed = this.getEditor(c);
                        if(!ed){
                            ed = c.displayEditor || new _.Components.fields.displayField({
                                value: ""
                            })//Ext.form.DisplayField();
                        }
                        if(i == 0){
                            ed.margins = pm('0 1 2 1');
                        } else if(i == len - 1){
                            ed.margins = pm('0 0 2 1');
                        } else{
                            ed.margins = pm('0 1 2');
                        }
                        ed.setWidth(cm.getColumnWidth(i));
                        ed.column = c;
                        if(ed.ownerCt !== this){
                            ed.on('focus', this.ensureVisible, this);
                            ed.on('specialkey', this.onKey, this);
                        }
                        this.insert(i, ed);

                        if(ed instanceof Ext.form.Field){
                            ed.msgTarget = 'qtip';
                        }
                        this.editors.push(ed);
                    }
                    this.initialized = true;

                    this.initValidator();
                },
                onKey: function(f, e){
                    if(e.getKey() === e.ENTER){
                        this.stopEditing(true);
                        e.stopPropagation();
                    }
                },
                onGridKey: function(e){
                    if(e.getKey() === e.ENTER && !this.isVisible()){
                        var r = this.grid.getSelectionModel().getSelected();
                        if(r){
                            var index = this.grid.store.indexOf(r);
                            this.startEditing(index);
                            e.stopPropagation();
                        }
                    }
                },
                ensureVisible: function(editor){
                    if(this.isVisible()){
                        this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
                    }
                },
                onRowClick: function(g, rowIndex, e){
                    if(this.clicksToEdit == 'auto'){
                        var li = this.lastClickIndex;
                        this.lastClickIndex = rowIndex;
                        if(li != rowIndex && !this.isVisible()){
                            return;
                        }
                    }
                    this.startEditing(rowIndex, false);
                    this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
                },
                onRowDblClick: function(g, rowIndex, e){
                    this.startEditing(rowIndex, false);
                    this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
                },
                initButtons : function(){

                    var btnsCfg = {
                        saveButton : {
                            ref: 'saveBtn',
                            itemId: 'saveBtn',
                            text: this.saveText || undefined,
                            width: this.minButtonWidth,
                            handler: this.stopEditing.createDelegate(this, [true])
                        },
                        cancelButton : {
                            text: this.cancelText || undefined,
                            width: this.minButtonWidth,
                            handler: this.stopEditing.createDelegate(this, [false])
                        }
                    };

                    if(btnsCfg.saveButton.text == undefined) delete btnsCfg.saveButton.text;
                    if(btnsCfg.cancelButton.text == undefined) delete btnsCfg.cancelButton.text;

                    this.saveButton = new this['saveButtonClass'](btnsCfg.saveButton);

                    this.cancelButton = new this['cancelButtonClass'](btnsCfg.cancelButton);
                },
                onRender: function(){

                    comps.containers.Panel.prototype.onRender.apply(this, arguments);
                    this.el.swallowEvent(['keydown', 'keyup', 'keypress']);

                    this.btns = new _.Components.containers.Panel({
                        baseCls: 'x-plain',
                        cls: 'x-btns',
                        //elements:'body',
                        layout: 'table',
                        //width: 250, // width must be specified for IE
                        items: [

                            this.cancelButton,
                            this.saveButton
                        ]
                    });
                    this.btns.render(this.bwrap);
                },
                afterRender: function(){
                    comps.containers.Panel.prototype.afterRender.apply(this, arguments);
                    this.positionButtons();
                    if(this.monitorValid){
                        this.startMonitoring();
                    }
                },
                onShow: function(){
                    if(this.monitorValid){
                        this.startMonitoring();
                    }
                    comps.containers.Panel.prototype.onShow.apply(this, arguments);
                },
                onHide: function(){
                    comps.containers.Panel.prototype.onHide.apply(this, arguments);
                    this.stopMonitoring();
                    this.grid.getView().focusRow(this.rowIndex);
                },
                positionButtons: function(){
                    if(this.btns){
                        var h = this.el.dom.clientHeight;
                        var view = this.grid.getView();
                        var scroll = view.scroller.dom.scrollLeft;
                        var width =  view.mainBody.getWidth();
                        var bw = this.btns.getWidth();
                        this.btns.el.shift({left: (width/2)-(bw/2)+scroll, top: h - 2, stopFx: true, duration:0.2});
                    }
                },
                preEditValue : function(r, field){
                    var value = r.data[field];
                    return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
                },
                postEditValue : function(value, originalValue, r, field){
                    return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
                },
                doFocus: function(pt){
                    if(this.isVisible()){
                        var index = 0;
                        if(pt){
                            index = this.getTargetColumnIndex(pt);
                        }
                        var cm = this.grid.getColumnModel();
                        for(var i = index||0, len = cm.getColumnCount(); i < len; i++){
                            var c = cm.getColumnAt(i);
                            if(!c.hidden && this.getEditor(c)){
                                this.getEditor(c).focus();
                                break;
                            }
                        }
                    }
                },
                getTargetColumnIndex: function(pt){
                    var grid = this.grid, v = grid.view;
                    var x = pt.left;
                    var cms = grid.colModel.config;
                    var i = 0, match = false;
                    for(var len = cms.length, c; c = cms[i]; i++){
                        if(!c.hidden){
                            if(Ext.fly(v.getHeaderCell(i)).getRegion().right >= x){
                                match = i;
                                break;
                            }
                        }
                    }
                    return match;
                },
                startMonitoring : function(){
                    if(!this.bound && this.monitorValid){
                        this.bound = true;
                        Ext.TaskMgr.start({
                            run : this.bindHandler,
                            interval : this.monitorPoll || 200,
                            scope: this
                        });
                    }
                },
                stopMonitoring : function(){
                    this.bound = false;
                    if(this.tooltip){
                        this.tooltip.hide();
                    }
                },
                isValid: function(){
                    var valid = true;
                    this.items.each(function(f){
                        if(!f.isValid(true)){
                            valid = false;
                            return false;
                        }
                    });
                    return valid;
                },
                bindHandler : function(){
                    if(!this.bound){
                        return false; // stops binding
                    }
                    var valid = this.isValid();
                    if(!valid && this.errorSummary){
                        this.showTooltip(this.getErrorText().join(''));
                    }
                    //this.saveButton.setDisabled(!valid);
                    this.fireEvent('validation', this, valid);
                },
                showTooltip: function(msg){
                    var t = this.tooltip;
                    /*if(!t){
                        t = this.tooltip = new Ext.ToolTip({
                            maxWidth: 600,
                            cls: 'errorTip',
                            width: 300,
                            title: 'Errors',
                            autoHide: false,
                            anchor: 'left',
                            anchorToTarget: true,
                            mouseOffset: [40,0]
                        });
                    }
                    t.initTarget(this.items.last().getEl());
                    if(!t.rendered){
                        t.show();
                        t.hide();
                    }
                    t.body.update(msg);
                    t.doAutoWidth();
                    //t.show();*/
                },
                getErrorText: function(){
                    var data = ['<ul>'];
                    this.items.each(function(f){
                        if(!f.isValid(true)){
                            data.push('<li>', f.activeError, '</li>');
                        }
                    });
                    data.push('</ul>');
                    return data;
                },
                onDestroy : function(){ },

                getEditor : function(){}
            },{
                objects : {
                    2 : {
                        getEditor : function(column){
                            return column.editor ? column.editor.field : null;

                        }
                    },
                    3 : {
                        getEditor : function(column){
                            return column.editable !== false ? column.editor : null;

                        }
                    }
                }
            })).getObject(_.ExtVersion),
            rowEditor : cls({
                $extend : comps.containers.Panel,
                floating: true,
                shadow: false,
                layout: 'fit',
                buttonAlign: 'center',
                cls: 'x-toolbar x-default-cmp',
                baseCls: 'x-grid-row-editor',
                elements: 'header,footer,body',
                frameWidth: 5,
                buttonPad: 3,
                clicksToEdit: 'auto',
                monitorValid: true,
                focusDelay: 1000,
                errorSummary: true,
                startValidator: false,

                validator: null,
                cancelButton : null,
                saveButton : null,
                detailButton : null,
                editDetails : false,

                saveText : null,
                cancelText : null,
                saveButtonTooltip : null,
                cancelButtonTooltip : null,
                saveButtonClass : _.Components.buttons.btnGuardar,
                cancelButtonClass : _.Components.buttons.btnCancelar,
                detailButtonClass : _.Components.buttons.btnAyuda,
                defaults: {
                    normalWidth: true
                },
                initValidator : function(){
                    if(this.startValidator){
                        this.validator = new _.FormValidator({
                            fields : this.editors,
                            buttons: [this.saveButton]
                        });
                    }
                },
                initButtons : function(){

                    var btnsCfg = {
                        saveButton : {
                            ref: 'saveBtn',
                            itemId: 'saveBtn',
                            text: this.saveText || undefined,
                            tooltip: this.saveButtonTooltip,
                            width: this.minButtonWidth,
                            key : null,
                            handler: this.stopEditing.createDelegate(this, [true])
                        },
                        cancelButton : {
                            text: this.cancelText || undefined,
                            tooltip: this.cancelButtonTooltip,
                            width: this.minButtonWidth,
                            key : null,
                            handler: this.stopEditing.createDelegate(this, [false])
                        },
                        detailButton : {
                            text: 'Detalle',
                            tooltip: this.tooltip || 'Detalle',
                            width: this.minButtonWidth,
                            handler: function() {
                                this.stopEditing(false);
                                this.fireEvent('editDetails',this.record);
                            }.createDelegate(this)
                        }
                    };

                    if(btnsCfg.saveButton.text == undefined) delete btnsCfg.saveButton.text;
                    if(btnsCfg.cancelButton.text == undefined) delete btnsCfg.cancelButton.text;

                    this.saveButton = new this['saveButtonClass'](btnsCfg.saveButton);

                    this.cancelButton = new this['cancelButtonClass'](btnsCfg.cancelButton);
                    this.detailButton = new this['detailButtonClass'](btnsCfg.detailButton);

                    this.buttonsArr = [this.cancelButton,this.saveButton,this.detailButton];

                    if(!this.editDetails){
                        this.buttonsArr.pop();
                    }
                },
                initComponent: function() {
                    this.saveChanges = this.saveChanges ? this.saveChanges : false;
                    comps.plugins.grid.rowEditor.superclass.initComponent.call(this);

                    this.initButtons();

                    this.addEvents(
                        /**
                         * @event beforeedit
                         * Fired before the row editor is activated.
                         * If the listener returns <tt>false</tt> the editor will not be activated.
                         * @param {Std.base.grid.RowEditor} roweditor This object
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'beforeedit',
                        /**
                         * @event validateedit
                         * Fired after a row is edited and passes validation.
                         * If the listener returns <tt>false</tt> changes to the record will not be set.
                         * @param {Std.base.grid.RowEditor} roweditor This object
                         * @param {Object} changes Object with changes made to the record.
                         * @param {Ext.data.Record} r The Record that was edited.
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'validateedit',
                        /**
                         * @event afteredit
                         * Fired after a row is edited and passes validation.  This event is fired
                         * after the store's update event is fired with this edit.
                         * @param {Std.base.grid.RowEditor} roweditor This object
                         * @param {Object} changes Object with changes made to the record.
                         * @param {Ext.data.Record} r The Record that was edited.
                         * @param {Number} rowIndex The rowIndex of the row just edited
                         */
                        'afteredit',
                        /**
                         * @event editorready
                         * Fired after a row is edited and sow the editor form.  This event is fired
                         * after the editor is show.
                         * @param {Std.base.grid.RowEditor} roweditor This object
                         */
                        'editorready'
                    );
                },
                init: function(grid) {
                    this.grid = grid;
                    this.ownerCt = grid;
                    if (this.clicksToEdit === 2) {
                        grid.on('rowdblclick', this.onRowDblClick, this);
                    } else {
                        grid.on('rowclick', this.onRowClick, this);
                        if (Ext.isIE) {
                            grid.on('rowdblclick', this.onRowDblClick, this);
                        }
                    }

                    // stopEditing without saving when a record is removed from Store.
                    grid.getStore().on('remove', function() {
                        if (!this.removing) {
                            this.stopEditing(false);
                        }
                        this.removing = false;
                    }, this);

                    grid.on({
                        scope: this,
                        keydown: this.onGridKey,
                        columnresize: this.verifyLayout,
                        columnmove: this.refreshFields,
                        reconfigure: this.refreshFields,
                        destroy: this.destroy,
                        bodyscroll: {
                            buffer: 250,
                            fn: this.positionButtons
                        }
                    });
                    grid.getColumnModel().on('hiddenchange', this.verifyLayout, this, {
                        delay: 1
                    });
                    grid.getView().on('refresh', this.stopEditing.createDelegate(this, []));
                    grid.getStore().on('beforeload',function(){
                        if (!this.removing) {
                            this.stopEditing(false);
                        }
                        this.removing = false;
                    },this);
                },
                refreshFields: function() {
                    this.initFields();
                    this.verifyLayout();
                },
                isDirty: function() {
                    var dirty, fields = this.items.items, len = this.items.items.length;
                    for (var i = 0; i < len; i++) {
                        var f = fields[i];
                        var f_obj = f.field;
                        var value = String((f_obj instanceof Ext.form.DateField) ? f_obj.getRawValue() : f.getValue());
                        if (String(this.values[f.id]) !== value) {
                            dirty = true;
                            return false;
                        }
                    }
                    return dirty;
                },
                startEditing: function(rowIndex, doFocus) {
                    if (this.editing && this.isDirty()) {
                        this.showTooltip('You need to commit or cancel your changes');
                        return;
                    }
                    this.editing = true;
                    if (typeof rowIndex == 'object') {
                        rowIndex = this.grid.getStore().indexOf(rowIndex);
                    }
                    if (this.fireEvent('beforeedit', this, rowIndex) !== false) {
                        var g = this.grid, view = g.getView();
                        var row = view.getRow(rowIndex);
                        var record = g.store.getAt(rowIndex);
                        this.record = record;
                        this.rowIndex = rowIndex;
                        this.values = {};
                        if (!this.rendered) {
                            this.render(view.getEditorParent());
                        }
                        var w = Ext.fly(row).getWidth();
                        this.setSize(w);
                        if (!this.initialized) {
                            this.initFields();
                        }
                        var cm = g.getColumnModel(), fields = this.items.items, f, val;

                        this.verifyLayout(true);
                        if (!this.isVisible()) {
                            this.setPagePosition(Ext.fly(row).getXY());
                        } else {
                            this.el.setXY(Ext.fly(row).getXY(), {
                                duration: 0.15
                            });
                        }
                        if (!this.isVisible()) {
                            this.show().doLayout();
                        }
                        if (doFocus !== false) {
                            this.doFocus.defer(this.focusDelay, this);
                        }
                        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                            val = this.preEditValue(record, cm.getDataIndex(i));
                            f = fields[i];
                            f.setValue(val);
                            this.values[f.id] = val || '';
                        }
                        this.fireEvent('editorready', this, rowIndex);
                    }
                },
                stopEditing: function(saveChanges) {
                    this.editing = false;
                    var changes = {}, r = this.record, hasChange = true;
                    if (!this.isVisible()) {
                        return;
                    }
                    if (saveChanges === false || !this.isValid()) {
                        if (r.is_new) {
                            this.removing = true;
                            this.grid.store.remove(r);
                            this.fireEvent('cancelarEdicion');
                        }
                        this.hide();
                        return;
                    }
                    var cm = this.grid.colModel, fields = this.items.items;
                    /*for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                     if (!cm.isHidden(i)) {
                     var dindex = cm.getDataIndex(i);
                     if (!Ext.isEmpty(dindex)) {
                     var oldValue = r.data[dindex];

                     var f_obj = fields[i].field;
                     var val = String((f_obj instanceof Ext.form.DateField) ? f_obj.getRawValue() : fields[i].getValue());

                     var value = this.postEditValue(val, oldValue, r, dindex);
                     if (String(oldValue) !== String(value)) {
                     changes[dindex] = value;
                     hasChange = true;
                     }
                     }
                     }
                     }*/
                    if (saveChanges && hasChange && this.fireEvent('validateedit', this, changes, r, this.rowIndex) !== false) {
                        r.beginEdit();
                        for (var k in changes) {
                            if (changes.hasOwnProperty(k)) {
                                r.set(k, changes[k]);
                            }
                        }
                        r.endEdit();
                        this.fireEvent('afteredit', this, changes, r, this.rowIndex);
                        r.is_new = false;
                    }
                    this.hide();
                },
                verifyLayout: function(force) {
                    if (this.el && (this.isVisible() || force === true)) {
                        var row = this.grid.getView().getRow(this.rowIndex);
                        this.setSize(Ext.fly(row).getWidth(), Ext.fly(row).getHeight() + 3);
                        var cm = this.grid.colModel, fields = this.items.items;
                        var next = 0;
                        var len = cm.getColumnCount();
                        for (var i = 0; i < len; i++) {
                            if (!cm.isHidden(i)) {
                                var adjust = 0;
                                if (i === 0) {
                                    adjust += 0; // outer padding
                                }
                                if (i === (len - 1)) {
                                    adjust += 3; // outer padding
                                } else {
                                    adjust += 1;
                                }
                                fields[i].show();

                                fields[i].setSize(cm.getColumnWidth(i) - adjust, Ext.fly(row).getHeight());
                                fields[i].getEl().setLeftTop(next, 0);
                                next = next + cm.getColumnWidth(i);


                                //fields[i].field.setWidth(cm.getColumnWidth(i) - adjust);
                                //fields[i].field.setPosition(cm.getColumnWidth(i) - adjust, 0);

                            } else {
                                fields[i].hide();
                            }
                        }
                        this.doLayout();
                        this.positionButtons();
                    }
                },
                slideHide: function() {
                    this.hide();
                },
                removeAll: function(autoDestroy) {
                    for (var i = 0; i < this.items.items.length; i++) {
                        this.remove(this.items.items[i], autoDestroy);
                    }
                    return true;
                },
                getColumnAt: function(cm, index) {
                    if (cm && cm.getColumnId(index) !== undefined && cm.getColumnId(index) !== null) {
                        return cm.getColumnById(cm.getColumnId(index));
                    }
                    return null;
                },
                getEditor: function(col) {
                    if (col && col.editor) {
                        return col.editor;
                    }
                    return null;
                },
                enableColumnEditor: function(index) {
                    var editorField = this.getCellEditor(index);
                    if (editorField) {
                        if (editorField.field && editorField.field.enable)
                            editorField.field.enable();
                        editorField.enable();
                        return true;
                    }
                    return false;
                },
                disableColumnEditor: function(index) {
                    var editorField = this.getCellEditor(index);
                    if (editorField) {
                        if (editorField.field && editorField.field.disable)
                            editorField.field.disable();
                        editorField.disable();
                        return true;
                    }
                    return false;
                },
                initFields: function() {
                    var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
                    this.removeAll(false);
                    this.editors = [];
                    for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                        var c = this.getColumnAt(cm, i);
                        var ed = this.getEditor(c);
                        if (!ed) {
                            ed = c.displayEditor || new Ext.form.Field({
                                hidden: true
                            });
                        }
                        if (i == 0) {
                            ed.margins = pm('0 1 2 1');
                        } else if (i == len - 1) {
                            ed.margins = pm('0 0 2 1');
                        } else {
                            ed.margins = pm('0 1 2');
                        }
                        ed.setSize(cm.getColumnWidth(i), 50);
                        ed.column = c;
                        if (ed.ownerCt !== this) {
                            ed.on('focus', this.ensureVisible, this);
                            ed.on('specialkey', this.onKey, this);
                        }
                        this.insert(i, ed);
                        this.editors.push(ed);
                    }
                    this.initialized = true;

                    this.initValidator();
                },
                onKey: function(f, e) {
                    if (e.getKey() === e.ENTER) {
                        this.stopEditing(true);
                        e.stopPropagation();
                    }
                },
                onGridKey: function(e) {
                    if (e.getKey() === e.ENTER && !this.isVisible()) {
                        var r = this.grid.getSelectionModel().getSelected();
                        if (r) {
                            var index = this.grid.store.indexOf(r);
                            this.startEditing(index);
                            e.stopPropagation();
                        }
                    }
                },
                ensureVisible: function(editor) {
                    if (this.isVisible()) {
                        this.grid.getView().ensureVisible(this.rowIndex, this.grid.colModel.getIndexById(editor.column.id), true);
                    }
                },
                onRowClick: function(g, rowIndex, e) {
                    /*if(!this.saveChanges)
                     this.clearInvalid();*/
                    if (this.clicksToEdit == 'auto') {
                        var li = this.lastClickIndex;
                        this.lastClickIndex = rowIndex;
                        if (li != rowIndex && !this.isVisible()) {
                            return;
                        }
                    }
                    this.startEditing(rowIndex, false);
                    this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
                },
                onRowDblClick: function(g, rowIndex, e) {
                    /*if(!this.saveChanges)
                     this.clearInvalid();*/
                    this.startEditing(rowIndex, false);
                    this.doFocus.defer(this.focusDelay, this, [e.getPoint()]);
                },
                clearInvalid: function() {
                    var store = this.grid.store;
                    for (var i = 0; i < store.getTotalCount(); i++) {
                        var rec = store.getAt(i);
                        if (rec.is_new && rec.is_valid === false) {
                            this.grid.store.remove(rec);
                        }
                    }
                    return true;
                },
                onRender: function() {
                    comps.plugins.grid.rowEditor.superclass.onRender.apply(this, arguments);
                    this.el.swallowEvent(['keydown', 'keyup', 'keypress']);

                    this.btns = new Ext.Panel({
                        //cls: 'x-btns',
                        baseCls: 'x-gridrow',
                        layout: 'table',
                        width: (this.editDetails) ? (this.minButtonWidth * 2.5) + (this.frameWidth * 3) + (this.buttonPad * 4) : (this.minButtonWidth * 1.7) + (this.frameWidth * 2) + (this.buttonPad * 4), // width must be specified for IE
                        items: this.buttonsArr
                    });
                    this.btns.render(this.bwrap);
                },
                afterRender: function() {
                    comps.plugins.grid.rowEditor.superclass.afterRender.apply(this, arguments);
                    this.positionButtons();
                    if (this.monitorValid) {
                        this.startMonitoring();
                    }
                },
                onShow: function() {
                    if (this.monitorValid) {
                        this.startMonitoring();
                    }
                    comps.plugins.grid.rowEditor.superclass.onShow.apply(this, arguments);
                },
                onHide: function() {
                    comps.plugins.grid.rowEditor.superclass.onHide.apply(this, arguments);
                    this.stopMonitoring();
                    this.grid.getView().focusRow(this.rowIndex);
                },
                positionButtons: function() {
                    if (this.btns) {
                        var h = this.el.dom.clientHeight;
                        var view = this.grid.getView();
                        var scroll = view.scroller.dom.scrollLeft;
                        var width = view.mainBody.getWidth();
                        var bw = this.btns.getSize();
                        this.btns.el.shift({
                            left: (width / 2) - (bw.width / 2) + scroll,
                            top: h - 2,
                            stopFx: true,
                            duration: 0.2
                        });
                    }
                },
                // private
                preEditValue: function(r, field) {
                    var value = r.data[field];
                    return this.autoEncode && typeof value === 'string' ? Ext.util.Format.htmlDecode(value) : value;
                },
                // private
                postEditValue: function(value, originalValue, r, field) {
                    return this.autoEncode && typeof value == 'string' ? Ext.util.Format.htmlEncode(value) : value;
                },
                doFocus: function(pt) {
                    if (this.isVisible()) {
                        var index = 0;
                        if (pt) {
                            index = this.getTargetColumnIndex(pt);
                        }
                        var cm = this.grid.getColumnModel();
                        for (var i = index || 0, len = cm.getColumnCount(); i < len; i++) {
                            var c = this.getColumnAt(cm, i);
                            if (!c.hidden && this.getEditor(c)) {
                                this.getEditor(c).focus();
                                break;
                            }
                        }
                    }
                },
                getTargetColumnIndex: function(pt) {
                    var grid = this.grid, v = grid.view;
                    var x = pt.left;
                    var cms = grid.colModel.config;
                    var i = 0, match = false;
                    for (var len = cms.length, c; c = cms[i]; i++) {
                        if (!c.hidden) {
                            if (Ext.fly(v.getHeaderCell(i)).getRegion().right >= x) {
                                match = i;
                                break;
                            }
                        }
                    }
                    return match;
                },
                startMonitoring: function() {
                    if (!this.bound && this.monitorValid) {
                        this.bound = true;
                        Ext.TaskMgr.start({
                            run: this.bindHandler,
                            interval: this.monitorPoll || 200,
                            scope: this
                        });
                    }
                },
                stopMonitoring: function() {
                    this.bound = false;
                    if (this.tooltip) {
                        this.tooltip.hide();
                    }
                },
                isValid: function() {
                    var valid = true, fields = this.items.items, len = this.items.items.length;
                    for (var i = 0; i < len; i++) {
                        var f = fields[i];
                        if (f && f.isValid && !f.isValid()) {
                            valid = false;
                            break;
                        } else if (f.field && !f.field.isValid()) {
                            valid = false;
                            break;
                        }
                    }
                    return valid;
                },
                // private
                bindHandler: function() {
                    if (!this.bound) {
                        return false; // stops binding
                    }
                    var valid = this.isValid();
                    if (!valid && this.errorSummary) {
                        //this.showTooltip(this.getErrorText().join(''));
                    }
                    //this.btns.items.items[0].setDisabled(!valid);
                    this.fireEvent('validation', this, valid);
                },
                showTooltip: function(msg) {
                    var t = this.tooltip;
                    if (!t) {
                        t = this.tooltip = new Ext.ToolTip({
                            maxWidth: 600,
                            cls: 'errorTip',
                            width: 300,
                            title: 'Errors',
                            autoHide: false,
                            anchor: 'left',
                            anchorToTarget: true,
                            mouseOffset: [40, 0]
                        });
                    }
                    t.initTarget(this.items.last().getEl());
                    if (!t.rendered) {
                        t.show();
                        t.hide();
                    }
                    t.body.update(msg);
                    t.doAutoWidth();
                    t.show();
                },
                getErrorText: function() {
                    var data = ['<ul>'], fields = this.items.items, len = this.items.items.length;
                    for (var i = 0; i < len; i++) {
                        var f = fields[i];
                        if (f && f.isValid && !f.isValid(true)) {
                            data.push('<li>', f.activeError, '</li>');
                        } else if (f.field && !f.field.isValid(true)) {
                            data.push('<li>', f.field.activeError, '</li>');
                        }
                    }
                    data.push('</ul>');
                    return data;
                },
                setCellValue: function(colIndex, value) {
                    var cm = this.grid.getColumnModel();
                    if (this.record) {
                        this.record.set(colIndex, value);
                        for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                            var c = this.getColumnAt(cm, i);
                            if (c.dataIndex == colIndex) {
                                var ed = this.getEditor(c);
                                if (ed) {
                                    ed.setValue(value);
                                }
                            }
                        }
                    }
                },
                getCellEditor: function(colIndex) {
                    var cm = this.grid.getColumnModel();
                    for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                        var c = this.getColumnAt(cm, i);
                        if (c.dataIndex == colIndex) {
                            return this.getEditor(c);
                        }
                    }
                },
                insertRow: function(index, rec, saveChange) {
                    if (this.grid.store) {
                        this.stopEditing(saveChange);
                        rec.is_new = true;
                        this.grid.store.insert(index, rec);
                        this.grid.getView().refresh();
                        this.grid.getSelectionModel().selectRow(index);
                        this.startEditing(index);
                        this.fireEvent('init_edition', this, index, rec);
                        return true;
                    }
                    return false;
                },
                addRow: function(rec, saveChange) {
                    if (this.grid.store) {
                        var pos = this.grid.store.getTotalCount();
                        return this.insertRow(pos, rec, saveChange);
                    }
                    return false;
                },
                addFirstRow: function(rec, saveChange) {
                    return this.insertRow(0, rec, saveChange);
                }
            })
        }
    };

    comps.plugins.grid.radioColumn = cls({
        $extend : comps.plugins.grid.checkColumn,
        checkRadios : function(record){
            var dtaIndex = this.dataIndex;
            this.grid.store.each(function(rec){
                if(record.id != rec.id && rec.get(dtaIndex) == true){
                    rec.set(dtaIndex,false);
                }
            });
        },
        onMouseDown: function(e, t){
            if(Ext.fly(t).hasClass(this.createId())){
                this.cancelCheck = true;
                e.stopEvent();
                var index = this.grid.getView().findRowIndex(t);
                var record = this.grid.store.getAt(index);
                var dtaIndex = this.dataIndex;


                this.checkRadios(record);

                record.set(this.dataIndex,true);
                if(typeof record.data[this.dataIndex] != 'undefined'){
                    this.observer.fireEvent('gridcheckchange', this, record.data[this.dataIndex], index);
                }

                this.grid.getView().refresh();
                this.cancelCheck = false;

            }
        },
        renderer: function(v, p, record){
            if(record.data.activo == false){
                p.css += ' x-grid3-check-col-td';
                return String.format('<div style="background-color: #e8e5e5" class="x-grid3-radio-col{0} {1}">&#160;</div>', v ? '-on' : '', this.createId());
            }
            else{
                p.css += ' x-grid3-check-col-td';
                return String.format('<div class="x-grid3-radio-col{0} {1}">&#160;</div>', v ? '-on' : '', this.createId());
            }
        },
        init: function(){
            var th = this;
            comps.plugins.grid.radioColumn.superclass.init.apply(this,arguments);
            /*this.grid.store.on('update',function(st,record){
                if(!th.cancelCheck){
                    th.cancelCheck = true;
                    th.checkRadios(record);
                    th.cancelCheck = false;
                }
            })*/
        }
    });

    comps.tree = {
        TreeNode : cls({
            $extend : Ext.tree.TreeNode,
            render: function(bulkRender){
                this.ui.render(bulkRender);
                if(!this.rendered){
                    // make sure it is registered
                    this.getOwnerTree().registerNode(this);
                    this.rendered = true;
                    if(this.expanded){
                        this.expanded = false;
                        //this.expand(false, false);
                    }
                }
            }
        })
    };

})(ExtExtend);