Ext.ns('Ext.LOG.moduloExpediente');

Ext.LOG.moduloExpediente.conformarExpediente = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var _this = this;
        this.idioma = config.etiquetas,
            this.closeAction = 'close',
            this.title = this.idioma.Conformarexpediente,
            this.modal = true,
            this.collapsible = true,
            this.bodyStyle = 'padding:5px 5px 0',
            this.layout = 'border',

            this.smDocExpInmueble = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false,
                moveEditorOnEnter: false,
                listeners: {
                    'selectionchange': function(sm) {
                        sm.getCount() ? _this.btnDel.enable() : _this.btnDel.disable();
                    }
                }
            });

        this.stDocExpInmueble = new Ext.data.Store({
            url: '',
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "datos",
                id: "idinmb"
            }, _this.Record)
            /*listeners: {
             'beforeload': function() {
             stDocExpInmueble.baseParams.idinmueble = idnumeroserieactivoNumSerie;
             }
             }*/
        });

        this.btnAdd = new Ext.Button({
            id: 'add',
            icon: 'adicionar',
            iconCls: 'adicionar',
            tooltip: _this.idioma.lbbtnAdicionarExp,
            text: _this.idioma.btnAdicionar,
            handler: function() {
                var _this = this;
                _this.adicionarDocExpediente();
                // AdicionarDocexpedient(etiquetas);// se abre la ventana que lista al nomenclador de documento
            }
        }),

            this.btnDel = new Ext.Button({
                id: 'del',
                icon: 'eliminar',
                iconCls: 'eliminar',
                disabled: true,
                tooltip: _this.idioma.lbbtnEliminarExp,
                text: _this.idioma.btnEliminar,
                handler: function() {
                    mostrarMensaje(2, '\xbfEst&aacute; seguro(a) que desea eliminar el/los documento(s) seleccionado(s)del expediente?', elimina);
                    /* function elimina(btnPresionado) {
                     if (btnPresionado == 'ok') {
                     eliminar(etiquetas);
                     }
                     };*/
                    //se elimina el documento del grid de documentos del expediente del inmueble y se a;ade al grid de documentos

                }
            });

        this.Record = new Ext.data.Record.create([{
            name: 'idexpediente',
            mapping: 'idexpediente'
        }, {
            name: 'descripcion',
            mapping: 'descripcion'
        }, {
            name: 'culminacion',
            mapping: 'culminacion'
        }, {
            name: 'idtabla',
            mapping: 'idtabla'
        }]);

        this.pDatos = new Ext.Panel({
            region: 'north',
            height: 120,
            //frame: true,
            layout: 'border',
            width: 700,
            items: [{
                xtype: 'panel',
                region: 'center',
                frame: true,
                width: 150,
                height: 150,
                items: [{
                    xtype: 'fieldset',
                    title: _this.idioma.lbDatosMedio,
                    layout: 'column',
                    style: '-moz-border-radius:5px',
                    height: 100,
                    items: [{
                        columnWidth: .25, //caso == 'modulopatrimonio' ? .35 : .15,

                        items: [{
                            html: _this.idioma.lbHtml2,
                        },{
                            html: ' <br>',
                        },{
                            html: _this.idioma.lbHtml3
                        }, {
                            html: ' <br>',
                        },{
                            html: _this.idioma.lbHtml1
                        }]
                    }, /*{
                     columnWidth: .60,
                     items: [{
                     html: "<p><div id='divdescripcion'>" + descripcion + "</div></p>"
                     }, {
                     html: "<p><div id='divninvent'>" + nroinventario + "</div></p>"
                     }, {
                     html: "<p><div id='divvalor'>" + '$' + valor + "</div></p>"
                     }]
                     }*/]
                }
                ]
            }, {
                xtype: 'panel',
                item: 'Peast',
                width: 360,
                height: 360,
                //hidden: true,//caso == 'modulopatrimonio' ? false : true,
                disable: false, //caso == 'modulopatrimonio' ? false : true,
                //hideCollapseTool: true,//caso == 'modulopatrimonio' ? false : true,
                //collapsible: false,//caso == 'modulopatrimonio' ? true : false,
                //collapseMode: 'mini',
                //autoScroll: false,
                ///animCollapse: false,//caso == 'modulopatrimonio' ? true : false,
                frame: true,
                //animate: false,//caso == 'modulopatrimonio' ? true : false,
                //split: true,//caso == 'modulopatrimonio' ? true : false,
                //collapsed: true,//caso == 'modulopatrimonio' ? false : true,
                region: 'east',
                items: [{
                    xtype: 'fieldset',
                    title: _this.idioma.lbDetalles,
                    height: 100,
                    items: [{
                        layout: 'column',
                        border: false,
                        items: [{
                            columnWidth: .60,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [{
                                xtype: 'combo',
                                width: 160,
                                fieldLabel: _this.idioma.lbRegimen,
                                name: 'tipoinmueble',
                                id: 'tipoinmueble',
                                tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
                                hiddenName: 'idnomregimen',
                                valueField: 'idnomregimen',
                                displayField: 'descripcion',
                                //value: (datosregistrogeneral != 0 && datosregistrogeneral[2].registrogeneral != 0) ? datosregistrogeneral[0][0].tipoinmueble : perfil.etiquetas.lbSeleccione,
                                // store: stregimen,
                                autoCreate: true,
                                typeAhead: true,
                                triggerAction: 'all',
                                editable: false,
                                mode: 'local',
                                allowBlank: false,
                                emptyText: _this.idioma.lbSeleccione,
                                /*    listeners: {
                                 'beforeselect': function(combo, store, index) {
                                 if (index == 0 || index == 1) {
                                 Ext.getCmp('edificio').enable();
                                 Ext.getCmp('regcontable').enable();
                                 datosregistrogeneral[1] != undefined?Ext.getCmp('adic').disable():'';
                                 Ext.getCmp('add').enable();
                                 Ext.getCmp('del').disable();
                                 datosregistrogeneral[2].registrogeneral != 0 ? Ext.getCmp('insc').enable() : Ext.getCmp('insc').disable();
                                 } else {
                                 if (index == 5 || index == 6) {
                                 Ext.getCmp('edificio').disable();
                                 Ext.getCmp('regcontable').disable();
                                 Ext.getCmp('insc').disable();
                                 datosregistrogeneral[1] != undefined?Ext.getCmp('adic').disable():'';
                                 Ext.getCmp('add').disable();
                                 Ext.getCmp('del').disable();
                                 } else {
                                 if (index == 3) {
                                 Ext.getCmp('insc').disable();
                                 Ext.getCmp('edificio').disable();
                                 Ext.getCmp('regcontable').enable();
                                 datosregistrogeneral[1] != undefined?Ext.getCmp('adic').enable():'';
                                 Ext.getCmp('add').enable();
                                 Ext.getCmp('del').disable();
                                 } else {
                                 if (index == 2 || index == 4) {
                                 Ext.getCmp('edificio').disable();
                                 Ext.getCmp('regcontable').enable();
                                 datosregistrogeneral[1] != undefined?Ext.getCmp('adic').disable():'';
                                 Ext.getCmp('add').enable();
                                 Ext.getCmp('del').disable();
                                 datosregistrogeneral[2].registrogeneral != 0 ? Ext.getCmp('insc').enable() : Ext.getCmp('insc').disable();
                                 } else {
                                 Ext.getCmp('insc').enable();
                                 Ext.getCmp('edificio').enable();
                                 Ext.getCmp('regcontable').enable();
                                 datosregistrogeneral[1] != undefined?Ext.getCmp('adic').enable():'';
                                 Ext.getCmp('add').enable();
                                 Ext.getCmp('del').enable();
                                 datosregistrogeneral[2].registrogeneral != 0 ? Ext.getCmp('insc').enable() : Ext.getCmp('insc').disable();
                                 }
                                 }
                                 }
                                 }
                                 }

                                 }*/
                            }]
                        }, {
                            columnWidth: .40,
                            layout: 'form',
                            items: [{
                                xtype: 'checkbox',
                                boxLabel: _this.idioma.lbEdificio,
                                hideLabel: true,
                                name: 'edificio',
                                id: 'edificio',
                                // checked: (datosregistrogeneral != 0 && datosregistrogeneral[2].registrogeneral == 1 && (datosregistrogeneral[0][0].tipoinmueble == 'Vivienda vinculada' || datosregistrogeneral[0][0].tipoinmueble == 'Vivienda medio básico')) ? datosregistrogeneral[0][0].edificio == 1 ? 1 : 0 : 0

                            }, {
                                xtype: 'checkbox',
                                boxLabel: _this.idioma.lbRegistroCont,
                                hideLabel: true,
                                name: 'regcontable',
                                id: 'regcontable',
                                // checked: (datosregistrogeneral != 0 && datosregistrogeneral[2].registrogeneral == 1) ? datosregistrogeneral[0][0].registrocontable == 1 ? 1 : 0 : 1

                            }]
                        }]
                    }]

                }]
            }]
        });

        this.gpDocExpInmueble = new Ext.grid.GridPanel({
            region: 'center',
            store: _this.stDocExpInmueble,
            loadMask: true,
            columns: [_this.smDocExpInmueble, new Ext.LOG.PagingRowNumberer(), {
                id: 'descripcion',
                header: _this.idioma.lbHederDescp,
                width: 200,
                sortable: false,
                tooltip: 'Nombre del documento que pertenece al expediente administrativo',
                dataIndex: 'descripcion'
            }, {
                id: 'culmina',
                header: _this.idioma.lbCulminacion,
                width: 70,
                dataIndex: 'culminacion',
                align: 'center',
                tooltip: 'Indica el documento que define la culminaci&oacute;n del expediente administrativo',
                // renderer: Culminacion
            }],
            autoExpandColumn: 'descripcion',
            sm: _this.smDocExpInmueble,
            width: 350,
            height: 315,
            frame: true,
            title: _this.idioma.lbTitleDocExpInmueble,
            tbar: [_this.btnAdd, _this.btnDel/*, btnAdc, btnInc*/],
            /* bbar: new Ext.PagingToolbar({
             pageSize: 20,
             //store: stDocExpInmueble,
             displayInfo: true,
             displayMsg: _this.idioma.lbPagin1,
             emptyMsg: _this.idioma.lbResulPagin
             }),*/
            /*listeners: {
             'rowclick': function(grid, rowIndex, e) {
             if (rowIndexOld != rowIndex) {
             rowIndexOld = rowIndex;
             }
             var sm = grid.getSelectionModel();
             var record = sm.getSelected();
             setContenido(id_pg_atributos_dinamicos, niveles_a_subir, record.get('idtabla'), idnumeroserieactivoNumSerie, 'p', record.get('idexpediente'));
             if (collap == 1) {
             Ext.getCmp(id_pg_atributos_dinamicos).toggleCollapse(true);
             collap = 0;
             } else {
             Ext.getCmp(id_pg_atributos_dinamicos).collapse();
             collap = 1;
             }
             }            
             }*/
        });

        this.gpPropertyGrid = new Ext.grid.PropertyGrid({
            id: 'id_pg_atributos_dinamicos',
            frame:true,
            height:240,
            width: 300,
            title: 'Poner el titulo',
            hideCollapseTool: true,
            collapsible: true,
            collapseMode:'mini',
            autoScroll:true,
            animCollapse:true,
            animate: false,
            split: true,
            collapsed: true,
            titleCollapse : true,
            region: 'east',
            useSplitTips :true,
            tbar: [{
                id : 'hola',
                iconCls : 'guardar',
                icon : perfil.dirImg + 'guardar.png',
                text : 'Guardar',
                tooltip : 'etiq_aft_nom_aft.lbTtBtnGuardarAtrib',
                handler : function() {
                    /* var record =  gpDocExpInmueble.getSelectionModel().getSelected();
                     guardarDatosPropertyGridAtributosDinamicos(niveles_a_subir, -1 , 'p',record.get('idexpediente'),Ext.getCmp(id_pg_atributos_dinamicos).getSource());
                     */ }
            }],
            listeners: {
                /*'evento' : function(checked, campo){
                 Ext.getCmp(id_pg_atributos_dinamicos). startEditing(0,1);
                 }*/
            }/*,
             keys:[new Ext.KeyMap(document, {
             key: Ext.EventObject.ENTER,
             fn: function(){
             var record =  gpDocExpInmueble.getSelectionModel().getSelected();
             guardarDatosPropertyGridAtributosDinamicos(niveles_a_subir, -1 , 'p',record.get('idexpediente'),Ext.getCmp(id_pg_atributos_dinamicos).getSource());
             },
             scope: this
             })]*/
        })

        this.items = [this.pDatos, this.gpDocExpInmueble,this.gpPropertyGrid];

        Ext.LOG.moduloExpediente.conformarExpediente.superclass.constructor.apply(this, arguments);
    },
    adicionarDocExpediente:function(){
        var _this = this;
        this.winDocexpediente = new Ext.Window({
            closeAction: 'fit',
            title: '_this.idioma.btnConformarexpediente',
            modal: true,
            collapsible: true,
            bodyStyle: 'padding:5px 5px 0',
            layout: 'border',
            items: [


            ], //grid con 4 columnas, No. Descripcion, Culminacion y un check column para selexccionar el/los documentos a annadir
            buttons: [{
                icon: 'cancelar',
                iconCls: 'cancelar',
                text: 'perfil.etiquetas.lbTextCancelar',
                tooltip:'perfil.etiquetas.lbTextCancelar',
                handler: function() {
                    //winDocexpediente.close();
                }
            }, {
                icon: 'aceptar',
                iconCls: 'aceptar',
                text: 'perfil.etiquetas.lbTextAceptar',
                tooltip:'perfil.etiquetas.lbTextAceptar',
                handler: function() {
                    //adicionar();
                    // winDocexpediente.close();
                }
            }]
        });

        this.winDocexpediente.show();
        // stDocExpediente.load({params: {start: 0, limit: 10}});
    }

});


