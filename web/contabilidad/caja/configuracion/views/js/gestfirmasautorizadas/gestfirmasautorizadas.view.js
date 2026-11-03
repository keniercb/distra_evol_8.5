Ext.ns('Caja.Gestfirmasautorizadas');
Caja.Gestfirmasautorizadas.PanelFirmas = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            frathis: true,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.layout = 'fit';
        this.border = false;
        this.selections = new Array();
        this.createButtons();
        this.createItems();
        this.addEvents(
            'mouseover'
        );

        this.initGlobalsKeys();
        this.initFunctions();
        this.initializeEvents(this);
        Caja.Gestfirmasautorizadas.PanelFirmas.superclass.constructor.call(this);
    },
    createButtons: function () {
        this.btnAdicionar = new Ext.Button({
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.lbTooltipBtnAdicionar,
            //icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar'
        });

        this.btnModificar = new Ext.Button({
            text: this.idioma.lbBtnModificar,
            tooltip: this.idioma.lbTooltipBtnModificar,
            disabled: true,
            //icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar'
        });

        this.btnEliminar = new Ext.Button({
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.lbTooltipBtnEliminar,
            disabled: true,
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaFirma',
            text: this.idioma.lbBtnAyuda,
            tooltip: this.idioma.lbTooltipBtnAyuda,
            //icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });
        this.tbar = [this.btnAdicionar, this.btnModificar, this.btnEliminar, '->', this.btnAyuda];
    },
    initGlobalsKeys: function () {

        this.keyMapa = new Ext.KeyMap(document, [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    this.btnAdicionar.fireEvent('click');
                }
            }, {
                key: "m",
                alt: true,
                scope: this,
                fn: function (n, e) {
                    e.preventDefault();
                    if (!this.btnModificar.disabled)
                        this.btnModificar.fireEvent('click');
                }
            }, {
                key: Ext.EventObject.DELETE,
                scope: this,
                fn: function () {
                    if (!this.btnEliminar.disabled)
                        this.btnEliminar.fireEvent('click');
                }
            }, {
                key: "h",
                alt: true,
                fn: function () {
                    this.btnAyuda.fireEvent('click');
                }
            }
        ]);
    },
    createItems: function () {
        var me = this;
        this.cmpBuscar = new Ext.Cont.SearchField({
            id: 'cmpBuscar',
            width: 200,
            //maxLength: 70,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            scope: this,
            fnOnSearch: function () {
                me.buscar(Ext.getCmp('cmpBuscar').getRawValue());
            },
            fnOnClear: function () {
                me.buscar('');
            }

        });
        this.stgridfirmas = new Ext.data.JsonStore({
            url: 'cargarfirmas',
            autoLoad: true,
            root: 'datos',
            totalProperty: 'cant',
            baseParams: {
                limit: 20,
                filter: ''
            },
            fields: ['idfirmasautorizadas', 'idpersona', 'nombre', 'cargo', 'base64img']
        });

        this.smfirmas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        this.rowaction = new Ext.grid.RowActions({
            id: 'cmprowaction',
            actions: [{
                id: 'mostrar',
                tooltip: 'Mostrar firma',
                //  icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'mostrar',
                marginLeft: 5,
                width: 5,
                height: 16
            }
            ]
        });

        this.stgridfirmas.on({
            scope: this,
            load: function (store, records, options) {
                if (records.length == 0 && Ext.getCmp('cmpBuscar').getRawValue() == '') {
                    mostrarMensaje(1, this.idioma.lbNoDatos)
                }
            }
        });


        this.gridfirmas = new Ext.grid.GridPanel({
            //id: 'idGpFirmas',
            autoExpandColumn: 'nombre',
            store: this.stgridfirmas,
            region: 'center',
            stripeRows: true,
            border: false,
            layout: 'fit',
            viewConfig: {
                forceFit: true
            },
            loadMask: true,
            sm: this.smfirmas,
            tbar: [this.cmpBuscar],
            plugins: [this.rowaction],
            columns: [
                this.smfirmas,
                {
                    hidden: true,
                    hideable: false,
                    name: 'idfirmasautorizadas'
                }, {
                    hidden: true,
                    hideable: false,
                    name: 'idpersona'
                }, {
                    id: 'nombre',
                    sortable: true,
                    header: this.idioma.lbNombrecompleto,
                    autoExpandColumn: 'nombre',
                    dataIndex: 'nombre',
                    width: (Ext.lib.Dom.getViewWidth() - 100) * 0.7

                }, {
                    id: 'cargo',
                    sortable: true,
                    header: this.idioma.lbCargo,
                    autoExpandColumn: 'cargo',
                    dataIndex: 'cargo',
                    width: (Ext.lib.Dom.getViewWidth() - 100) * 0.3

                },
                this.rowaction],
            bbar: this.paginToolBFirmas = new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: this.stgridfirmas,
                displayInfo: true,
                displayMsg: this.idioma.lbDisplayMsg,
                emptyMsg: this.idioma.lbEmptyMsg,
                firstText: this.idioma.lbPrimeraPagina,
                lastText: this.idioma.lbUltimaPagina
            })
        });

        this.items = [this.gridfirmas];
    },
    initializeEvents: function (me) {

        this.smfirmas.on({
            scope: this,
            rowselect: function (sm, rowIndex, record) {
                this.rowClick(this.smfirmas, rowIndex, record);
                this.gridfirmas.getView().addRowClass(rowIndex, "negrita");
            },
            rowdeselect: function (sm, rowIndex, record) {
                this.rowClick(sm, rowIndex, record);
                this.gridfirmas.getView().removeRowClass(rowIndex, "negrita");
            }

        });

        this.stgridfirmas.on({
            scope: this,
            beforeload: function (store, options) {
                me.btnModificar.disable();
                me.btnEliminar.disable();
                this.btnAdicionar.focus(true, 1000);
            }
        });

        this.btnAdicionar.on({
            scope: this,
            click: function (button, event) {
                this.mostrarVentana(false);
            }
        });

        this.btnModificar.on({
            scope: this,
            click: function (button, event) {
                this.mostrarVentana(true);
            }
        });
        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            me.mostrarFirma();
        });

        this.btnEliminar.on({
            scope: this,
            click: function (button, event) {
                var me = this;
                var cantSelections = this.getSelections();
                var pregEliminarFirma = (cantSelections.length > 1) ? this.idioma.lbPregDelFirmas : this.idioma.lbPregDelFirma;
                this.keyMapa.disable();
                mostrarMensaje(2, pregEliminarFirma, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.deleteFirma();
                    } else {
                        me.keyMapa.enable();
                    }
                });
            }
        });

        this.paginToolBFirmas.on({
            'beforechange': function () {
                instance = new PagingToolbarSelections({
                    'selections': me.smfirmas.getSelections(),

                    'activePage': this.getPageData().activePage
                });
                instance.saveSelectionsOnPage(me.selections);
            },
            'change': function () {
                instance = new PagingToolbarSelections({
                    'activePage': this.getPageData().activePage
                });
            }
        });

        this.gridfirmas.on({
            mouseover: function (event) {
                var t = event.getTarget();
                var v = this.getView();
                var rowIndex = v.findRowIndex(t);
                if (rowIndex !== false) { //Para que distinga bien entre 0 y false
                    var rec = me.stgridfirmas.getAt(rowIndex);
                    var src = "/contabilidad/caja/configuraciones/views/js/gestfirmasautorizadas/noimage.png";
                    if (rec.json.base64img) {
                        src = rec.json.base64img;
                        //src = 'data:image/jpg;base64,' + rec.json.base64img;
                    }
                    var name = rec.json.nombre;
                    var cargo = rec.json.cargo;
                    var html = '<table width="100%" border="0" cellspacing="0" cellpadding="1" style="text-align: center;' +
                        ' font-size: 11px">' + '<tr>' + '<td>' + '<table width="100%" border="0" cellspacing="0" cellpadding="4">' + '<tr>' + '<td width="10%" style="text-align: center; ' +
                        'vertical-align: top">' + '<span><img src="' + src + '" width="90" height="90" border="0" class="imgShadow"></span>' + '</td>' + '<td style="vertical-align:top;' +
                        ' font: normal 11.5px arial, tahoma, helvetica, sans-serif !important;"><b><span style="padding-left: 10px; padding-right: 5px;">' + name + '</span></b>';
                    if (!Ext.isEmpty(cargo)) {
                        html += '<br><br><span style="padding-left: 10px; padding-right: 5px;"><b>Cargo:</b> ' + cargo + '</span>';
                    }
                    html += '</td>' + '</tr>' + '</table>' + '</td>' + '</tr></table>';

                    new Ext.ToolTip({
                        target: t,
                        autoWidth: true,
                        autoHeight: true,
                        maxWidth: 800,
                        minWidth: 500,
                        dismissDelay: 0,
                        shadowOffset: 10,
                        showDelay: 250,
                        bodyStyle: "background-color:#FFF;padding:5px 5px 7px 5px;border: 1px solid rgba(0, 0, 79, 0.24);",
                        frame: false,
                        border: true,
                        bodyBorder: true,
                        html: html,
                        trackMouse: true
                    });
                }

            }
        });
    },
    initFunctions: function () {
        var me = this;
        this.rowClick = function (sm, rowIndex, record) {
            var selections = new Array();
            selections = sm.getSelections();
            this.btnModificar.setDisabled(selections.length !== 1);
            this.btnEliminar.setDisabled(!sm.hasSelection());
        };


        this.getSelections = function () {
            var instance = new PagingToolbarSelections({
                'selections': this.smfirmas.getSelections(),
                'activePage': this.gridfirmas.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(me.selections);
        };

        this.deleteFirma = function () {
            var me = this;
            Ext.Msg.wait(this.idioma.lbEliminando, this.idioma.lbEspere);

            var arrayIdFirma = new Array();
            var arrayFirmaSelection = this.getSelections();
            for (i = 0; i < arrayFirmaSelection.length; i++) {
                arrayIdFirma.push(arrayFirmaSelection[i].idfirmasautorizadas);
            }

            var msgSuccess = (arrayIdFirma.length > 1) ? this.idioma.msgDelFirmasOK : this.idioma.msgDelFirmaOK;

            Ext.Ajax.request({
                url: 'eliminarfirma',
                params: {
                    idfirmas: Ext.encode(arrayIdFirma)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    msgSuccess = (respuesta == -1) ? mostrarMensaje(1, msgSuccess) : mostrarMensaje(1, me.idioma.msgError);
                    Ext.MessageBox.hide();
                    me.stgridfirmas.reload();
                    me.keyMapa.enable();
                }
            });

        };

        this.mostrarVentana = function (mod) {
            this.windowFirmas = new Caja.Gestfirmasautorizadas.WindowFirmas({
                idioma: this.idioma,
                perfil: this.perfil,
                me: me,
                autoValidate: true,
                idpersona: (mod) ? this.smfirmas.getSelected().data.idpersona : '',
                idfirmasautorizadas: (mod) ? this.smfirmas.getSelected().data.idfirmasautorizadas : '',
                title: (mod) ? this.idioma.lbWdsModFirAut : this.idioma.lbWdsAddFirAut,
                listeners: {
                    // scope: this,
                    show: function (window) {
                        me.keyMapa.disable();
                        this.formfirmas.getForm().isValid();
                    },
                    close: function (window) {
                        me.keyMapa.enable();
                        me.stgridfirmas.reload();
                    }
                }

            });
            this.windowFirmas.btnAplicar.setVisible((mod) ? false : true);
            this.windowFirmas.show();
            this.windowFirmas.doLayout();
            this.windowFirmas.cbPersona.focus(true, true);

            if (mod) {
                if (this.smfirmas.getSelected()) {
                    var idpersona = this.smfirmas.getSelected().data.idpersona;
                    var nombre = this.smfirmas.getSelected().data.nombre;
                    var datosModPersona = {data: [{idpersona: idpersona, nombre: nombre}]};
                    this.windowFirmas.cbPersona.store.loadData(datosModPersona);
                    //this.windowFirmas.cbPersona.setValue(idpersona);
                    //this.windowFirmas.cbPersona.setRawValue(this.smfirmas.getSelected().data.nombre);

                    this.windowFirmas.formfirmas.getForm().loadRecord(this.smfirmas.getSelected());
                    this.windowFirmas.pfoto.setValue(this.smfirmas.getSelected().get('base64img'));
                }
            }

        };
        this.mostrarFirma = function () {
            this.WindowMostrarFirmas = new Caja.Gestfirmasautorizadas.WindowMostrarFirmas({
                idioma: this.idioma,
                perfil: this.perfil,
                me: me,
                autoValidate: true,
                nombrepersona: this.smfirmas.getSelected().data.nombre,
                img64: this.smfirmas.getSelected() ? this.smfirmas.getSelected().get('base64img') : '/contabilidad/caja/configuracion/views/js/gestfirmasautorizadas/noimage.png',
                title: this.smfirmas.getSelected().data.nombre,
                listeners: {
                    scope: this,
                    show: function (window) {
                        this.keyMapa.disable();
                    },
                    close: function (window) {
                        this.keyMapa.enable();

                    }
                }

            });
            this.WindowMostrarFirmas.show();
            this.WindowMostrarFirmas.doLayout();
        };

        this.buscar = function (filter) {
            me.stgridfirmas.baseParams.filter = filter;
            me.stgridfirmas.load({
                callback: function (record, options, success) {
                    if (record.length === 0) {
                        mostrarMensaje(1, me.idioma.lbNoDatosPorCriterio);
                    }
                }
            });
        };

    }

});

Caja.Gestfirmasautorizadas.WindowFirmas = Ext.extend(Ext.Window, {
    constructor: function (params) {
        this.id = -1;
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            closeAction: 'close',
            autoValidate: true,
            frame: true,
            modal: true,
            width: '34%',//Ancho de la ventana
            constrain: true,
            autoHeight: true,
            buttonAlign: 'right',
            me: params.me,
            idpersona: params.idpersona,
            idfirmasautorizadas: params.idfirmasautorizadas,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createButtons();
        this.initFunctions();
        this.createForm();
        this.initializeEvents(this);


        Caja.Gestfirmasautorizadas.WindowFirmas.superclass.constructor.call(this);
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: 'btnCancelar'
        });
        this.btnAplicar = new Ext.Button({
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbToolAplicar,
            //icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            id: 'btnAplicar'
        });
        this.btnAceptar = new Ext.Button({
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'btnAceptar'
        });

        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    },
    createForm: function () {
        //Nueva solucion de persona
        this.stPersona = new Ext.data.Store({
            url: 'loadPersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idpersona'
            }, {
                name: 'nombre'
            }, {
                name: 'numid'
            }, {
                name: 'cargo'
            }
            ])
        });

        this.firstElement = this.cbPersona = new Ext.form.ComboBox({
            id: 'cbPersona',
            fieldLabel: this.idioma.lbNombrecompleto,
            store: this.stPersona,
            valueField: 'idpersona',
            hiddenName: 'idpersona',
            displayField: 'nombre',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            //editable: true,
            forceSelection: true,
            allowBlank: false,
            //blankText: this.idioma.lbBlankText,
            resizable: true,
            //readOnly: false,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true
        });
        //------------------------------------------
        this.tfNombre = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            blankText: this.idioma.lbBlankText,
            fieldLabel: this.idioma.lbNombrecompleto,
            id: 'tfNombre',
            name: 'nombre',
            allowBlank: false,
            //disabled: true,
            anchor: '100%'
        });

        this.tfCargo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbCargo,
            id: 'tfCargo',
            name: 'cargo',
            allowBlank: false,
            disabled: true,
            anchor: '100%'
        });

        this.pfoto = new Ext.ux.ScreenshotField({
            center: true,
            // fieldLabel: 'Imagen',
            hideLabel: true,
            allowUpload: true,  //Para permitir cargar una img de un directorio de la pc
            name: 'foto',
            width: 144,
            height: 100,
            filetypeList: ['gif', 'jpg', 'png', 'jpeg'],
            qtip: "Click para seleccionar imagen",
            emptyUrl: '/contabilidad/caja/configuracion/views/js/gestfirmasautorizadas/noimage.png',//Img en base64 o direccion de una img fisica
            allowBlank: true
        });

        this.formfirmas = new Ext.FormPanel({
            layout: 'form',
            region: 'north',
            frame: true,
            border: false,
            labelAlign: 'top',
            trackResetOnLoad: true,
            autoHeight: true,
            width: '100%',
            items: [{
                layout: 'column',
                border: false,
                items: [{
                    xtype: 'fieldset',
                    id: 'fieldset',
                    columnWidth: .60,
                    bodyStyle: 'padding: 10px 10px 10px 10px',
                    style: '-moz-border-radius:5px',
                    //width: 500,
                    autoHeight: true,
                    layout: 'column',
                    items: [{
                        anchor: '90%',
                        columnWidth: 1,
                        layout: 'form',
                        border: false,
                        items: [/*this.tfNombre*/this.cbPersona, this.tfCargo]
                    }]
                }, {
                    columnWidth: 0.40,
                    anchor: '90%',
                    id: 'padrefoto',
                    style: 'margin-left: 0.1px',
                    layout: 'form',
                    autoHeight: true,
                    border: true,
                    // frame: true,
                    items: [this.pfoto]
                }]
            }]
        });
        this.items = this.formfirmas;
    },
    initializeEvents: function (me) {
        this.cbPersona.on({
            scope: this,
            select: function (combo, record, index) {
                if (me.me.stgridfirmas.find('idpersona', record.data.idpersona) >= 0) {
                    mostrarMensaje(1, this.idioma.lbPersonaExiste);
                    combo.clearValue();
                } else {
                    Ext.getCmp('tfCargo').setValue(record.data.cargo);
                }
                //-Valirdar q se active el button cuando cambia de paersona---
                //if(me.btnAceptar.disabled){
                //    if(combo.getValue() != record.data.idpersona){
                //        me.btnAceptar.setDisabled(false);
                //    }
                //}
            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function (button, event) {
                this.close();
            }
        });
        this.btnAplicar.on({
            scope: this,
            click: function (button, event) {
                if (this.pfoto.getRawValue() == '') {
                    mostrarMensaje(1, this.idioma.msgNoFotoFirma);
                } else {
                    this.registrarfirma(true);
                }
            }


        });
        this.btnAceptar.on({
            scope: this,
            click: function (button, event) {
                if (this.pfoto.getRawValue() == '') {
                    mostrarMensaje(1, this.idioma.msgNoFotoFirma);
                } else {
                    this.registrarfirma(false);
                }


            }
        });

        this.tfNombre.on({
            scope: this,
            focus: function () {
                this.mostrarBusquedaPersonal();
            },
            keypress: function () {
                if (e.getKey() == 13) { // Buscar con enter
                    this.mostrarBusquedaPersonal();
                }
            }
        });


    },
    initFunctions: function () {
        this.mostrarBusquedaPersonal = function () {
            scope:this;

            var _me = this;

            this.winBusPer = new Caja.Gestfirmasautorizadas.WindowBuscarPersona({
                idioma: this.idioma,
                perfil: this.perfil
            });
            this.winBusPer.on({
                scope: _me,
                selectperson: function (idpersona, nombre) {
                    _me.tfNombre.setValue(nombre);
                    _me.idpersona = idpersona;

                }
            })
            this.winBusPer.show();
            this.winBusPer.doLayout();
            this.winBusPer.setPosition(20, 10);
        };

        this.registrarfirma = function (aplicar) {
            var me = this;
            var msgSuccess = (!me.idfirmasautorizadas) ? this.idioma.msgAddFirAutOk : this.idioma.msgModdFirAutOk;

            if (!me.pfoto.isValid() || !me.tfCargo.isValid() || !me.cbPersona.isValid()) {
                return;
            }

            Ext.Msg.wait(me.idioma.lbGuardandoF, this.idioma.lbEspere);

            Ext.Ajax.request({
                url: 'registrar',
                params: {
                    //idpersona: me.idpersona,
                    idpersona: me.cbPersona.getValue(),
                    idfirmasautorizadas: me.idfirmasautorizadas,
                    cargo: me.tfCargo.getValue(),
                    base64img: me.pfoto.getValue()
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta == '-2') {
                        mostrarMensaje(1, me.idioma.msgFirAutExist);
                    } else if (respuesta == '-1') {
                        mostrarMensaje(1, msgSuccess);

                        if (!me.btnAplicar.isVisible() || !aplicar) {
                            me.close();
                            //me.me.stgridfirmas.reload();
                        }
                        else if (aplicar) {
                            me.formfirmas.getForm().reset();
                        }

                    } else if (respuesta == '-3') {
                        mostrarMensaje(1, me.idioma.msgErrorGuardando);
                    }
                    Ext.MessageBox.hide();


                }


            });

        };


    }
});
Caja.Gestfirmasautorizadas.WindowMostrarFirmas = Ext.extend(Ext.Window, {
    constructor: function (params) {
        this.id = -1;
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            closeAction: 'close',
            autoValidate: true,
            frame: true,
            modal: true,
            autowidth: true,//Ancho de la ventana
            constrain: true,
            autoHeight: true,
            buttonAlign: 'right',
            me: params.me,
            idfirmasautorizadas: params.idfirmasautorizadas,
            idioma: params.idioma,
            perfil: params.perfil,
            html: '<img id="custom" src="' + params.img64 +
            '" width="500"' +
            ' height="500" style=" left: 11px; ' +
            'top: 11px; width: 500px; height: 500px;">'
        });

        Caja.Gestfirmasautorizadas.WindowMostrarFirmas.superclass.constructor.call(this);
    }


});
Caja.Gestfirmasautorizadas.WindowBuscarPersona = Ext.extend(Ext.Window, {
    constructor: function (params) {
        this.id = -1;
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            id: 'winBusPer',
            title: 'Buscar persona',
            closeAction: 'close',
            autoValidate: true,
            frame: true,
            modal: true,
            width: 700,
            height: 490,
            constrain: true,
            closable: true,
            resizable: true,
            plain: false,
            buttonAlign: 'right',
            idioma: params.idioma,
            perfil: params.perfil
        });

        this.addEvents(
            'selectperson'
        );

        this.createButtons();
        this.createItems();
        this.initializeEvents();
        this.initFunctions(this);
        Caja.Gestfirmasautorizadas.WindowFirmas.superclass.constructor.call(this);
    },
    createButtons: function () {
        this.btnCancelarBusPer = new Ext.Button({
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            id: 'btnCancelarBusPer'
        });

        this.btnAceptarBusPer = new Ext.Button({
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar,
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            id: 'btnAceptarBusPer'

        });

        this.buttons = [this.btnCancelarBusPer, this.btnAceptarBusPer];

    },
    createItems: function () {

        this.items = [this.pBuscarPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            id: 'pBuscarPersona',
            seguridad: 0,
            limit: 15,
            start: 0
        })]
    },
    initializeEvents: function () {

        this.btnCancelarBusPer.on({
            scope: this,
            click: function (button, event) {
                this.close();
            }
        });
        this.btnAceptarBusPer.on({
            scope: this,
            click: function (button, event) {
                if (Ext.getCmp('pBuscarPersona').getSeleccion()) {
                    var idPersona = Ext.getCmp('pBuscarPersona').getSeleccion().get('idpersona');
                    var nombre = '';
                    cambio = 1;
                    if (Ext.getCmp('pBuscarPersona').getSeleccion().get('snombre')) {
                        nombre = Ext.getCmp('pBuscarPersona').getSeleccion().get('nombre') + ' ' + Ext.getCmp('pBuscarPersona').getSeleccion().get('snombre') + ' ' + Ext.getCmp('pBuscarPersona').getSeleccion().get('papel') + ' ' + Ext.getCmp('pBuscarPersona').getSeleccion().get('sapel');
                    } else {
                        nombre = Ext.getCmp('pBuscarPersona').getSeleccion().get('nombre') + ' ' + Ext.getCmp('pBuscarPersona').getSeleccion().get('papel') + ' ' + Ext.getCmp('pBuscarPersona').getSeleccion().get('sapel');
                    }

                    this.fireEvent('selectperson', idPersona, nombre);
                    this.getCargoByIdPersona(idPersona);
                }


            }
        });

    },
    initFunctions: function (me) {
        var me = me;
        this.getCargoByIdPersona = function (idPersona) {
            //lMask.show();
            Ext.Ajax.request({
                url: 'getCargoByIdPersona',
                method: 'POST',
                params: {
                    idpersona: idPersona
                },
                callback: function (options, success, response) {
                    var response = Ext.decode(response.responseText);
                    if (response == -1) {
                        Ext.getCmp('tfCargo').setValue('Sin rol');
                    } else
                        Ext.getCmp('tfCargo').setValue(response.denomcargo);

                    //  lMask.hide();
                    me.close();
                }
            });
        }
    }

});