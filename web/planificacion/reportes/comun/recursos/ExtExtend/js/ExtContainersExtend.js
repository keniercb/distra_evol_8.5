
/**
 * Script con los contenedores del sistema
 * requires : [
 *      _ExtBase(dev).js,
 *      ExtExtends.js
 *      *
 *  ]
 */

(function(_){

    var utils = _.Utils,
        comps = _.Components,
        cls = _.Class,
        facade = _.FacadeFactory,
        cts = comps.containers,
        grids = cts.grids = {},
        windows = cts.windows = {};

    windows.GWindow = cls({
        $extend : Ext.Window,
        $implement : _.boxComponent,
        render : function(){
            cts.windows.GWindow.superclass.render.apply(this,arguments);
            cts.windows.GWindow.$implement.render.apply(this,arguments);
        }
    });

    cts.baseFieldContainer = _.Class({
        startValidator : null,
        fields : null,
        fieldsValues : null,
        validator : null,
        vipButtons : null,
        callback : null,
        getFieldsValues : function(){
            var res = {};
            _.Utils.each(this.fields,function(fldName,fld){
                res[fldName] = fld.getValue ? fld.getValue() : null;
            });
            return res;
        },
        prepareFields : function(){
            if(this.fieldsValues !== -1){
                _.Utils.each(this.fieldsValues,function(fldName,fldValue){
                    if(this.fields[fldName] && _.Utils.isFunction(this.fields[fldName].setValue)){
                        this.fields[fldName].setValue(fldValue);
                    }
                },this);
            }
        },
        prepareButtons : function(){
            var th = this, flgVip = false;

            _.Utils.each(this.buttons,function(i,btn){
                btn.tmpFn = _.Utils.checkDataType(btn.handler,function(){});
                btn.handler = function(){
                    btn.tmpFn.call(th);
                    flgVip = false;

                    _.Utils.each(th.vipButtons,function(i,vipBtn){
                        if(vipBtn.id == btn.id){
                            flgVip = true;
                            return null;
                        }
                    });
                    if(flgVip){
                        th.callback(th.getFieldsValues());
                    }
                };
            });
        },
        initValidator : function(){
            var th = this;

            this.validator = new _.FormValidator({
                fields : (function(){
                    var res = [];
                    _.Utils.each(th.fields,function(fldName,fld){
                        res.push(fld);
                    });
                    return res;
                })(),
                buttons : this.vipButtons
            });
        },
        initComponents : function(){
            this.prepareButtons();
            this.prepareFields();
            if(this.startValidator) this.initValidator();
        },
        checkAttributes : function(){
            this.fields = _.Utils.checkDataType(this.fields,{});
            this.vipButtons = _.Utils.checkDataType(this.vipButtons,[]);
            this.startValidator = _.Utils.checkDataType(this.startValidator,true);
            this.fieldsValues = _.Utils.checkDataType(this.fieldsValues,{},-1);
            this.callback = _.Utils.checkDataType(this.callback,function(){});
        },
        constructor : function(){
            this.checkAttributes();
            this.initComponents();
        }
    });

    windows.fieldsWindows = cls({
        $extend : windows.GWindow,
        $implement : cts.baseFieldContainer,
        constructor : function(pCfg){
            var th = this,
                cfg = utils.checkDataType(pCfg,{});

            windows.fieldsWindows.superclass.constructor.call(th,cfg);
            windows.fieldsWindows.$implement.constructor.call(th,cfg);

            this.on({
                afterrender : function(pTh){
                    utils.applyButtonsKey(this.buttons,pTh);
                }
            })
        }
    });

    windows.addModWindow = cls({
        $extend : windows.fieldsWindows,
        buttonsClasses : {
            btnAceptar : comps.buttons.btnAceptar,
            btnAplicar : comps.buttons.btnAplicar,
            btnCancelar: comps.buttons.btnCancelar
        },
        getButtons : function(){
            var th = this,
                btnsClasses = th.buttonsClasses,
                fnClose = function(){
                    this.close();
                };

            return {
                btnAceptar : new btnsClasses.btnAceptar({
                    handler : fnClose
                }),
                btnAplicar : new btnsClasses.btnAplicar({
                    listeners: {
                        afterrender : function(pBtn){
                            pBtn[(th.fieldsValues === -1) ? 'show' : 'hide']();
                        }
                    }
                }),
                btnCancelar : new btnsClasses.btnCancelar({
                    handler : fnClose
                })
            };
        },
        constructor : function(pCfg){
            var th = this,
                btns = th.getButtons(),
                cfg = utils.checkDataType(pCfg,{});

            windows.addModWindow.superclass.constructor.call(th,utils.apply(cfg,{
                vipButtons : [
                    btns.btnAceptar,
                    btns.btnAplicar
                ],
                buttons : [
                    btns.btnCancelar,
                    btns.btnAplicar,
                    btns.btnAceptar
                ]
            }));

        }
    });

    grids.rowEditorGrid = cls({
        $extend : Ext.grid.EditorGridPanel,
        $implement : _.boxComponent,
        rowEditorObject : null,
        rowEditorClass : comps.plugins.grid.rowEditor,
        addButtonClass : comps.buttons.btnAdicionar,
        delButtonClass:  comps.buttons.btnEliminar,
        recordCreateObject : null,
        showAddDelButtons : true,
        addButon : null,
        delButon : null,
        showRowEditor : false,
        deleteOnEmptyRecord : false, // true si se quiere que se elimine un record que se acaba de agregar y se deja en blanco con el row editor
        insertPosition : -1, // -1 si se quiere agregar al final
        tbarButtons : null,
        extraEvents : null,

        //addButtonText: false,
        addButtonTTip: false,
        delButtonTTip: false,
        delButtonMsg: false,

        hideAddDelButtons: function(){
            this.showAddDelButtons = false;
            this.addButton.disable(true);
        },
        onAdd : function () {
            if(this.showAddDelButtons){
                var newRec = new this.recordCreateObject((function(pSelModel){
                        var res = {};

                        utils.each(pSelModel.config, function(i, v){
                            res[v.dataIndex] = "";
                        });

                        return res;
                    })(this.getColumnModel())),
                    st = this.getStore(),
                    insertPos = this.insertPosition <= st.getCount() ? this.insertPosition : -1,
                    append = insertPos == -1;

                st[(append ? 'add' : 'insert')].apply(st,(append ? [newRec] : [insertPos,newRec]));

                this.fireEvent('recordAdded',insertPos,newRec);
            }
        },
        onDel : function () {
            if(this.showAddDelButtons){
                var st = this.getStore(),
                    sm = this.getSelectionModel(),
                    record;

                if(sm instanceof Ext.grid.CellSelectionModel){
                    record = st.getAt(sm.getSelectedCell()[0]);
                }else{
                    if(sm instanceof Ext.grid.RowSelectionModel){
                        record = sm.getSelected();
                    }
                }
                if(this.noVerificarEliminar){
                    st.remove(record);
                }else{
                    var msg = '¿Está seguro que desea eliminar el elemento seleccionado?';
                    if(this.delButtonMsg){
                        msg = this.delButtonMsg;
                    }
                    mostrarMensaje(2, msg, function(btnP) {
                        if (btnP == 'ok') {
                            st.remove(record);
                        }
                    })
                }
            }
        },
        render : function(){
            grids.rowEditorGrid.superclass.render.apply(this,arguments);
            grids.rowEditorGrid.$implement.render.apply(this,arguments);
        },
        initButtons : function(){
            var th = this;

            if(th.addButtonTTip){
                this.addButton = new this.addButtonClass({
                    tooltip: 'Adicionar ' + th.addButtonTTip,
                    handler : function () {
                        th.onAdd.apply(th,arguments);
                    }
                });
            }else{
                this.addButton = new this.addButtonClass({
                    handler : function () {
                        th.onAdd.apply(th,arguments);
                    }
                });
            }

            if(th.delButtonTTip){
                this.delButon = new this.delButtonClass({
                    tooltip: 'Eliminar ' + th.delButtonTTip,
                    disabled : true,
                    handler : function () {
                        th.onDel.apply(th,arguments);
                    }
                });
            }else{
                this.delButon = new this.delButtonClass({
                    disabled : true,
                    handler : function () {
                        th.onDel.apply(th,arguments);
                    }
                });
            }

        },
        initToolbarObject : function () {
            var th = this,
                tbar = [],
                userTbar = utils.checkDataType(this.tbarButtons,[]);

            if(this.showAddDelButtons){
                tbar = tbar.concat([
                    this.addButton,
                    this.delButon
                ]);
            }
            this.tbar = new Ext.Toolbar({
                items: tbar.concat(userTbar)
            });
        },
        initRecordCreateObject : function () {
            this.recordCreateObject = new Ext.data.Record.create(this.store.fields);
        },
        initRowEditor : function () {
            var th = this,
                st = th.getStore();

            this.rowEditorObject = this.showRowEditor ? new this.rowEditorClass : null;

            //this.plugins = !this.plugins ? [this.rowEditorObject] : (utils.isArray(this.plugins) ? this.plugins.concat(this.rowEditorObject) : [this.plugins,this.rowEditorObject]);

            if(this.rowEditorObject){
                this.extraEvents.recordAdded = function (pInsPos,pRec) {
                    var i = st.findBy(function(pR){
                            return pR.id == pRec.id
                        });

                    if(i != -1){
                        pRec.recentlyAdded = true;
                        this.rowEditorObject.startEditing(i);

                    }

                };

                if(this.deleteOnEmptyRecord){
                    this.rowEditorObject.on({
                        stopEditing : function(pRowEd,pSavechanges,pRecord,pIndex){
                            if(!pSavechanges && pRecord.recentlyAdded){
                                st.remove(pRecord);
                            }
                        },
                        afteredit : function(pRowEd, changes, r){
                            r.recentlyAdded = false;
                        }
                    });
                }

                this.rowEditorObject.on({
                    afteredit : function(){
                        th.fireEvent.apply(th,(['afteredit']).concat(arguments));
                    },
                    beforeedit : function(){
                        th.fireEvent.apply(th,(['beforeedit']).concat(arguments));
                    },
                    stopEditing : function(){
                        th.fireEvent.apply(th,(['stopEditing']).concat(arguments));
                    },
                    validateedit : function(){
                        th.fireEvent.apply(th,(['validateedit']).concat(arguments));
                    }
                });
            }


        },
        initComponents : function () {
            this.extraEvents = {};
            this.initButtons();
            this.initToolbarObject();
            this.initRowEditor();
        },
        constructor : function (pCfg) {
            var th = this,
                cfg = utils.checkDataType(pCfg,{});

            utils.apply(th,cfg);

            this.plugins = ExtExtend.Utils.checkDataType(this.plugins,[]);
            this.plugins.push(new comps.plugins.grid.changesValidator);

            this.initComponents();

            grids.rowEditorGrid.superclass.constructor.call(this);

            this.initRecordCreateObject();

            this.on(Ext.apply({
                beforeedit : function(info){

                }
            },this.extraEvents));

            this.getSelectionModel().on({
                selectionchange : function(){
                    if(th.showAddDelButtons){
                        th.delButon.setDisabled(!this.hasSelection());
                    }
                }
            });
        }
    });

    grids.specialRowEditorGrid = cls({
        $extend : comps.containers.Panel,
        rowEditorObject : null,
        initRowEditorObject : function(pCfg){
            this.rowEditorObject = new grids.rowEditorGrid(pCfg);

        },
        constructor : function(pCfg){
            var th = this,
                cfg = utils.checkDataType(pCfg,{}),
                rowEditorCfg = utils.apply({},cfg);

            th.initRowEditorObject(utils.apply(rowEditorCfg,{
                width : undefined,
                height : undefined
            }));

            delete cfg.title;
            delete cfg.plugins;
            grids.specialRowEditorGrid.superclass.constructor.call(th,utils.apply(cfg,{
                tbar : th.rowEditorObject.showAddDelButtons ? th.rowEditorObject.getTopToolbar() : null,
                layout: 'fit',
                items:[
                    th.rowEditorObject
                ]
            }));
        }
    });

})(ExtExtend);