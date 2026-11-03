Ext.QuickTips.init();
Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
UCID.portal.cargarEtiquetas('modelos', cargarInterfaz);
//---------------------------------------------------------Variables---------------------------------------------------------------------
var btnAdicionarMod, btnModificarMod, btnHabilitar, btnEliminarMod, btnAyuda, btnAdicionarHech,
    btnEliminarHech, btnAceptarH, btnCancelarH, btnSubirfila, btnBajarfila, btnBuscarPLanilla,
    btnFiltrar;
var tfFiltro;
var tbModelos, st_modelo, expander, st_estado, st_estadom, estado, colummodel, ptModelo, mascaraM, mascaraH;
var st_hecho, smHechos, colummodelh, tbHechos, ptHecho, mascaraO;
var gpModelos, gpHechos, vpModelo;
var winEscala, winHecho, winFiltrarPlanillas;
var expanderesul, smResultado, gpwResultado, ptwhecho;
var st_regla, smRegla, gpwRegla, ptwregla;
var tf_escala, tfFormula, df_fecha_inicioMod, cb_EstadoMod, df_fecha_finMod, he_ModificarMod;
var tf_denominacionCrear, df_fecha_inicio_Crear, cb_Crear, df_fecha_finCrear, he_Crear;
var denomV, denomR;
var idPlanillaSeleccionada = -1;
var idModeloSeleccionado = -1;
var idEscalaSeleccionada = null;
var idescalaS = null;
var idvalorCualtS = -1;
var idexpresionmatematicaS = -1;
var filaHecho = -1;
var cambioorden = false;
var cambio = 0;
//---------------------------------------------------------Fin de variables--------------------------------------------------------------
Ext.ns('Ext.cmp.evaluacion');
Ext.cmp.evaluacion.WinGestModelo = Ext.extend(Ext.Window, {
    layout: 'fit',
    plain: true,
    modal: true,
    resizable: false,
    autoHeight: true,
    initComponent: function ()
    {
        var self = this;
        var winEscala = null;
        this.btnCancelarM = new Ext.Button({
            id: 'btncancelarmod',
            iconCls: 'cancelar',
            text: labels.lbtnCCancelarMo,
            tooltip: labels.lbToolTipCancelar,
            handler: function ()
            {
                self.close();
            }
        });
        this.btnAplicarM = new Ext.Button({
            id: 'btnaplicarmod',
            iconCls: 'aplicar',
            text: labels.lbtnCAplicarMo,
            tooltip: labels.lbToolTipAplicar,
            handler: function ()
            {
                AddMod('APLI','ADD');
            }
        });
        this.btnAceptarM = new Ext.Button({
            id: 'btnaceptarmod',
            iconCls: 'aceptar',
            text: labels.lbtnCAceptarMo,
            tooltip: labels.lbToolTipAceptar,
            handler: function ()
            {
                AddMod('ACEP',self.accion);
            },
            prevTab: this.btnAplicarM.isVisible() ? 'btnaplicarmod' : 'btncancelarmod',
            nextTab: 'tf_denominacion'
        });

        var st_estado = new Ext.data.Store({
            url: 'cargarEstados',
            reader: new Ext.data.JsonReader({
                root: 'datos', totalProperty: 'cantidad', id: 'idestado'
            }, [
                {name: 'idestado'},
                {name: 'denom'}
            ]),
            listeners: {
                load: function ()
                {
                    if (!self.recModelo) {
                        cb_Estado.setValue(0);
                        cb_Estado.disable();
                    }
                }
            }
        });
        st_estado.load();
        var tf_denominacion = new Ext.form.TextField({
            id: 'tf_denominacion',
            fieldLabel: labels.lwtfDenominacion,
            name: 'denom',
            anchor: '90%',
            allowBlank: false,
            msgTarget: 'qtip',
            maxLength: 255,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            regex: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            regexText: labels.lbInvalidBuscar,
            blankText: labels.lbCampoObl,
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                }
            },
            nextTab: 'idfechanicio',
            prevTab: 'btnaceptarmod'
        });
        var tf_escala = new Ext.form.TextField({
            id: 'idtfescala',
            readOnly: true,
            hideLabel: true,
            name: 'escala',
            anchor: '100%',
            minLength: 3,
            maxLength: 100,
            allowBlank: false,
            emptyText: labels.lbDenomEscala,
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                }
            }
        });
        var btnBuscarEscala = new Ext.Button({
            text: labels.lbtnBuscar,
            iconCls: 'buscar',
            tooltip: labels.ttpBtnBuscarEscalaCualitativa,
            style: 'margin: 8 0 0 0',
            handler: function ()
            {
                MostrarEscala();
            }
        });
        var hfIdEscala = new Ext.form.Hidden();
        var hfIdExpresionMatematica = new Ext.form.Hidden();
        var tfFormula = new Ext.form.TextField({
            id: 'tfFormula',
            hidden: true,
            disabled: true,
            readOnly: true,
            hideLabel: true,
            name: 'formula',
            anchor: '100%',
            minLength: 3,
            maxLength: 100,
            allowBlank: false,
            emptyText: labels.lbDenomFormula,
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                },
                show: function (cmp)
                {
                    cmp.setWidth('100%');
                }
            }
        });
        var btnBuscarFormula = new Ext.Button({
            text: labels.lbBtnFormula,
            iconCls: 'buscar',
            disabled: true,
            hidden: true,
            tooltip:labels.ttpBtnBuscarFormula,
            style: 'margin: 8 0 0 0',
            handler: function ()
            {
                PVD.mostrarMascara('mskloadingind', labels.lbMsgWait, labels.lbMaskLoadingInd);
                Ext.Ajax.request({
                    url: 'getlistindicadoresplanilla',
                    method: 'POST',
                    params: {
                        idplanilla: idPlanillaSeleccionada
                    },
                    callback: function (options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        var arrIndicadores = new Array();
                        Ext.each(responseData.datos, function (ind)
                        {
                            arrIndicadores.push([
                                ind.idindicador,
                                ind.denom,
                                ind.values
                            ]);
                        });

                       var objExp = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                            hideFieldDenom: false,
                            indicadores: arrIndicadores,
                            width:1300,
                            mostrarCondicionales: true,
                            idexpresionmatematica: hfIdExpresionMatematica.getValue() || -1
                        });
                        /*var objExp = new Ext.pvd.persona.formula.winEditorExpresiones({
                            title: 'Editor de expresiones matem&aacute;ticas',
                            idexpresionmatematica:  hfIdExpresionMatematica.getValue() || -1,
                            indicadores: arrIndicadores,
                            agrupado: 1,
                            campoagrupar: 'Tipo',
                            mostrarFunciones: 2,
                            mostrarCondicionales: true,
                            //operadoresMostrar: ['+', '-', '*', '/', 'pa', 'pc', 's', 'p'],
                            mostrarDenominacion: false
                        });*/

                        //  var objExp = new Ext.pvd.persona.formula.winEditorExpresiones({
//                            indicadores: responseData,
//                            idexpresionmatematica: hfIdExpresionMatematica.getValue() || -1
//                        });


                        PVD.ocultarMascara('mskloadingind');
                        objExp.show();
                        objExp.on('expresionsalvada', function (data)
                        {
                            hfIdExpresionMatematica.setValue(data.idexpresionmatematica);
                            tfFormula.setValue(data.denom);
                            objExp.close();
                        });
                    }
                });
            }
        });
        var df_fecha_inicio = new Ext.form.DateField({
            fieldLabel: labels.lwfechainicio,
            name: 'fechainicio',
            id: 'idfechanicio',
            value: new Date().format('d/m/Y'),
            anchor: '90%',
            format: 'd/m/Y',
            vtype: 'daterange',
            endDateField: 'idfechafin', // id of the end date field
            allowBlank: false
        });
        var cb_Estado = new Ext.form.ComboBox({
            fieldLabel: labels.lwcbEstado,
            id: 'idcbEstado',
            name: 'cbestado',
            store: st_estado,
            triggerAction: 'all',
            mode: 'local',
            displayField: 'denom',
            valueField: 'idestado',
            hiddenName: 'idestado',
            editable: false,
            allowBlank: false,
            blankText: labels.lwcvCombo,
            anchor: '90%',
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                }
            }
        });
        var df_fecha_fin = new Ext.form.DateField({
            fieldLabel: labels.lwfechafin,
            name: 'fechafin',
            id: 'idfechafin',
            anchor: '90%',
            format: 'd/m/Y',
            vtype: 'daterange',
            startDateField: 'idfechanicio', // id of the start date field
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                }
            }
        });
        var he_Descripcion = new Ext.form.TextArea({
            height: 100,
            anchor: '95%',
            id: 'descripCrear',
            fieldLabel: labels.lwDescripcion,
            name: 'descripcion',
            //allowBlank:false,
            //blankText: labels.lwcvDescripcion,
            listeners: {
                change: function (tf, n, o)
                {
                    cambio = 1;
                }
            }
        });
        var rEscala = new Ext.form.Radio({
            boxLabel: labels.lbRepresentarEnEscala,
            checked: true,
            anchor: '95%',
            hideLabel: true,
            name: 'showEscalaFormula',
            inputValue: 'escala',
            listeners: {
                check: function (checkbox, checked)
                {
                    tf_escala.setValue('');
                    if (checked) {
                        hfIdExpresionMatematica.setValue('');
                        tf_escala.enable();
                        tf_escala.show();
                        btnBuscarEscala.enable();
                        btnBuscarEscala.show();
                    } else {
                        tf_escala.disable();
                        tf_escala.hide();
                        btnBuscarEscala.disable();
                        btnBuscarEscala.hide();
                    }
                }
            }
        });
        var rFormula = new Ext.form.Radio({
            boxLabel: labels.lbRepresentarFormula,
            anchor: '95%',
            hideLabel: true,
            name: 'showEscalaFormula',
            inputValue: 'formula',
            listeners: {
                check: function (checkbox, checked)
                {
                    tfFormula.setValue('');
                    hfIdEscala.setValue('');
                    if (checked) {
                        tfFormula.enable();
                        tfFormula.show();
                        btnBuscarFormula.enable();
                        btnBuscarFormula.show();
                    } else {
                        tfFormula.disable();
                        tfFormula.hide();
                        btnBuscarFormula.disable();
                        btnBuscarFormula.hide();
                    }
                }
            }
        });
        this.fp = new Ext.FormPanel({
            width: 480,
            labelAlign: 'top',
            autoHeight: true,
            frame: true,
            items: [
                /*hfIdEscala, hfIdExpresionMatematica,*/ {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            anchor: '50%',
                            items: [tf_denominacion, df_fecha_inicio]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [cb_Estado, df_fecha_fin]
                        }
                    ]

                },
                he_Descripcion,
                rEscala,
                {
                    layout: 'column',
                    height: 30,
                    items: [
                        {
                            columnWidth: .75,
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            items: [tf_escala]
                        },
                        {
                            columnWidth: .25,
                            style: 'margin:-5 0 0 13',
                            layout: 'form',
                            items: [btnBuscarEscala]
                        }
                    ]

                },
                rFormula,
                {
                    layout: 'column',
                    height: 30,
                    items: [
                        {
                            columnWidth: .75,
                            style: 'margin:0 0 0 5',
                            layout: 'form',
                            items: [tfFormula]
                        },
                        {
                            columnWidth: .25,
                            style: 'margin:-5 0 0 13',
                            layout: 'form',
                            items: [btnBuscarFormula]
                        }
                    ]

                }
            ]
        });

        var st_escala = new Ext.data.Store({
            url: 'cargarEscCualitativas',
            reader: new Ext.data.JsonReader({
                id: 'idescala',
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idescala'
                },
                {
                    name: 'denom'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'desde'
                },
                {
                    name: 'hasta'
                },
                {
                    name: 'tipoescala'
                }
            ])
        });
        st_escala.load({
            params: {
                start: 0,
                limit: 15
            }
        });

        var expanderescala = new Ext.grid.RowExpander({tpl: new Ext.Template('<p><b>Descripci&oacute;n:</b> </br> {descripcion}</p>')});
        var ptwescala = new Ext.PagingToolbar({
            pageSize: 15,
            store: st_escala,
            displayInfo: true,
            displayMsg: labels.lDisplayMsg,
            emptyMsg: labels.lemptyMsg
        });
        var tfbuscarescala = new Ext.form.TextField({
            id: 'tfbuscarescala',
            hideLabel: true,
            name: 'bscala',
            minLength: 3,
            maxLength: 100,
            anchor: '99%',
            emptyText: 'Criterio a buscar…'
        });
        var btnBuscarE = new Ext.Button({
            id: 'idbtnBuscarE',
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar escala',
            handler: function ()
            {
                BuscarEscala();
            }
        });
        var btnLimpiarBuscar = new Ext.Button({
            id: 'idbtnLimpiarBuscar',
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro',
            handler: function ()
            {
                tfbuscarescala.reset();
                BuscarEscala();
            }
        });

        tfbuscarescala.on('specialkey', function (t, e)
        {
            if (e.keyCode == 13)
                BuscarEscala();
        });

        var gpEscala = new Ext.grid.GridPanel({
            id: 'gpescala',
            border: false,
            cm: new Ext.grid.ColumnModel([expanderescala, {
                id: 'expandires',
                header: "Denominaci&oacute;n de la escala",
                width: 80,
                sortable: true,
                dataIndex: 'denom'
            }, {
                header: "Idescala",
                hidden: true,
                dataIndex: 'idescala'
            }
            ]),
            stripeRows: true,
            split: true,
            autoScroll: true,
            store: st_escala,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            loadMask: {
                msg: labels.lbGridLoadMask
            },
            autoExpandColumn: 'expandires',
            plugins: expanderescala,
            region: 'center',
            tbar: ['Denominación:', tfbuscarescala, btnBuscarE, btnLimpiarBuscar],
            bbar: ptwescala
        });
        var btnCancelarEscala = new Ext.Button({
            id: 'idbtncancelarescala',
            iconCls: 'cancelar',
            text: labels.lbtnCancelarEscala,
            tooltip: labels.lbToolTipCancelar,
            handler: function ()
            {
                winEscala.hide();
                he_Descripcion.focus();
            }
        });
        var btnAceptarEscala = new Ext.Button({
            id: 'idbtnaceptarescala',
            iconCls: 'aceptar',
            text: labels.lbtnAceptarEsc,
            tooltip: labels.lbToolTipAceptar,
            handler: function ()
            {
                var record = gpEscala.getSelectionModel().getSelected();
                tf_escala.setValue(record.get('denom'));
                hfIdEscala.setValue(record.get('idescala'));
                hfIdExpresionMatematica.setValue('');
                winEscala.hide();
                he_Descripcion.focus();
            },
            prevTab: 'idbtncancelarescala'
        });

        var keyEscala = new Ext.KeyMap(Ext.getDoc(), [
            {
                key: 'b',
                alt:true,
                fn: function(){
                    if(!btnBuscarE.disabled ){
                        btnBuscarE.handler();
                    }
                }
            },{
                key: 'l',
                alt:true,
                fn: function(){
                    if(!btnLimpiarBuscar.disabled ){
                        btnLimpiarBuscar.handler();
                    }
                }
            },
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptarEscala.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelarEscala.handler();
                }
            }
        ]);

        this.items = [this.fp];
        var map = new Ext.KeyMap(Ext.getDoc(), [
            {
                key:Ext.EventObject.ENTER,
                fn:function(){
                   self.btnAceptarM.handler();
                }
            },
            {
                key:'p',
                alt:true,
                ctrl:true,
                fn:function(){
                    self.btnAplicarM.handler();
                }
            },{
                key:'x',
                alt:true,
                fn:function(){
                    self.btnCancelarM.handler();
                }
            },{
                key:'b',
                alt:true,
                fn:function(){
                   if(btnBuscarEscala.isVisible()){
                       btnBuscarEscala.handler();
                   }
                    else{
                       btnBuscarFormula.handler();
                   }
                }
            },
        ]);
        this.buttons = [this.btnCancelarM, this.btnAplicarM, this.btnAceptarM];
        Ext.cmp.evaluacion.WinGestModelo.superclass.initComponent.call(this);
        this.on('show', function (cmp)
        {
            if (self.recModelo) {
                if (self.recModelo.get('idescala') != null) {
                    rEscala.setValue(true);
                    rFormula.setValue(false);
                }
                else
                    if (self.recModelo.get('idexpresionmatematica') != null) {
                        rFormula.setValue(true);
                        rEscala.setValue(false);
                        tfFormula.setValue(self.recModelo.get('denomformula'));
                    }
                tf_denominacion.focus(false, 300);
                self.btnAplicarM.hide();

                tf_denominacion.setValue(self.recModelo.get('denom'));
                he_Descripcion.setValue(self.recModelo.get('descripcion'));
                cb_Estado.setValue(self.recModelo.get('estado'));
                tf_escala.setValue(self.recModelo.get('escala'));
                df_fecha_inicio.setValue(self.recModelo.get('fechainicio'));
                df_fecha_fin.setValue(self.recModelo.get('fechafin'));
                hfIdExpresionMatematica.setValue(self.recModelo.get('idexpresionmatematica'));
                hfIdEscala.setValue(self.recModelo.get('idescala'));
            }
        });
        function AddMod(boton,accion)
        {
            var url = '', idmodelo = null;
            if (self.recModelo) {
                idmodelo = self.recModelo.get('idmodelo');
                url = 'modificarmodelo';
            }
            else {
                url = 'adicionarmodelo';
            }

            if (self.fp.getForm().isValid()) {
                if (df_fecha_inicio.getRawValue() != df_fecha_fin.getRawValue()) {
                    PVD.mostrarMascara('mskAddmodel', 'Por favor espere', 'Guardando datos del modelo modelo matem&aacute;tico...');
                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        params: {
                            idmodelo: idmodelo,
                            idplanilla: self.idplanilla,
                            idescala: hfIdEscala.getValue(),
                            denom: tf_denominacion.getValue(),
                            descripcion: he_Descripcion.getValue(),
                            idestado: cb_Estado.getValue(),
                            fechainicio: df_fecha_inicio.getRawValue(),
                            fechafin: df_fecha_fin.getRawValue(),
                            idexpresionmatematica: hfIdExpresionMatematica.getValue(),
                            rEscala: rEscala.getValue(),
                            rFormula: rFormula.getValue()
                        },
                        callback: function (o, s, r)
                        {
                            PVD.ocultarMascara('mskAddmodel');
                            self.fireEvent('modeloSaved');
							if(accion=='ADD'){
								mostrarMensaje(1,labels.MsgModeloAddOK);
							}
							if(accion=='MOD'){
								mostrarMensaje(1,labels.MsgModeloModOK);
							}
                            if (boton == 'ACEP') {
                                self.close();
                            }
                            if (boton == 'APLI') {
                                self.fp.getForm().reset();
                                cb_Estado.setValue(0);
                            }
                        }
                    });
                } else {
					mostrarMensaje(1,labels.msgFechasIguales);
                }
            }
        }

        function MostrarEscala()
        {
            if (!winEscala) {
                winEscala = new Ext.Window({
                    title: labels.wtEscala,
                    layout: 'fit',
                    modal: true,
                    keys:keyEscala,
                    closable: true,
                    resizable: false,
                    closeAction: 'hide',
                    width: 500,
                    height: 420,
                    items: [gpEscala],
                    buttons: [btnCancelarEscala, btnAceptarEscala]
                });
            }
            winEscala.show();
            btnCancelarEscala.focus();
        }

        function BuscarEscala()
        {
            if (tfbuscarescala.getValue() != '') {
                st_escala.baseParams.query = tfbuscarescala.getValue();
                st_escala.load({params: {start: 0, limit: 15}});
            } else {
                st_escala.baseParams.query = '';
                st_escala.load({params: {start: 0, limit: 15}});
            }
        }
    }
});

function cargarInterfaz()
{
    perfil = arguments[0];
    labels = arguments[1];

    var btnAyuda = new Ext.Button({
        id: 'ayudaTP',
        text: 'Ayuda',
        tooltip: labels.ttpBtnAyuda,
        iconCls: 'ayuda',
       /* handler: function ()
        {
            var title = 'Ayuda de modelo matematico';
            var referencia = 'evaluaciones/modelos';
            help.show(title, referencia);
        },*/
        nextTab: 'idtffiltro',
        prevTab: 'btnFiltrar'
    });
    btnBuscarPLanilla = new Ext.Button({
        id: 'btnBuscarPLanilla',
        text: labels.lbtnBuscar,
        iconCls: 'buscar',
        tooltip: labels.ttpBtnBuscar,
        handler: function ()
        {
            buscarPlanillas();
        },
        nextTab: 'btnFiltrar',
        prevTab: 'idtffiltro'
    });
    btnFiltrar = new Ext.Button({
        id: 'btnFiltrar',
        text: labels.lbtnFiltrar,
        iconCls: 'filtrar',
        tooltip: labels.ttpFiltrar,
        handler: function ()
        {
            filtrarPlanillas()
        }
    });
    btnAdicionarMod = new Ext.Button({
        id: 'adicionarmod',
        text: labels.lbBtnAdicionar,
        iconCls: 'adicionar',
        tooltip: labels.lttAdicionarMo,
        handler: function ()
        {
            var win = new Ext.cmp.evaluacion.WinGestModelo({
                title: labels.ltCrear,
				accion:'ADD',
                idplanilla: gpPlanillas.getSelectionModel().getSelected().get('idplanilla'),
                listeners: {
                    modeloSaved: function ()
                    {
                        st_modelo.reload();
                    }
                }
            });
            win.show();
        }
    });
    btnModificarMod = new Ext.Button({
        id: 'modificarmod',
        text: labels.lbBtnModificar,
        iconCls: 'modificar',
        disabled: true,
        tooltip: labels.lttModificarMo,
        handler: function ()
        {
            var win = new Ext.cmp.evaluacion.WinGestModelo({
                title: labels.ltModificar,
				accion:'MOD',
                idplanilla: gpPlanillas.getSelectionModel().getSelected().get('idplanilla'),
                recModelo: gpModelos.getSelectionModel().getSelected(),
                listeners: {
                    modeloSaved: function ()
                    {
                        st_modelo.reload();
                    }
                }
            });
            win.show();
        }
    });
	btnHabilitar = new Ext.Button({
        id: 'habilitar',
        text: "Habilitar",
        iconCls: 'modificar',
        disabled: true,
        tooltip: "Poner el modelo matem&aacute;tico en estado de elaboraci&oacute;n",
        handler: function ()
        {
                var idmodelo = gpModelos.getSelectionModel().getSelected().data.idmodelo;
				var fecha = new Date().format('m/d/Y');
				if(gpModelos.getSelectionModel().getSelected().data.idestado ==1){
		        PVD.mostrarMascara('mskAddmodel', 'Por favor espere', 'Guardando datos del modelo modelo matem&aacute;tico...');
                    Ext.Ajax.request({
                        url: 'habilitarmodelo',
                        method: 'POST',
                        params: {
                            idmodelo: idmodelo,                            
                            fecha : fecha							
                        },
                        callback: function (o, s, r)
                        {   btnHabilitar.disable();
                            PVD.ocultarMascara('mskAddmodel');                         
							st_modelo.reload();
                        }
                    });
                }else
				{
				  mostrarMensaje(1,'El modelo tiene que estar en estado de desarrollo activo.');
				}
                        
                
        }
    });
	btnTraza = new Ext.Button({
        id: 'traza',
        text: "Trazas",
        iconCls: 'modificar',
        disabled: true,
        tooltip: "Acciones hechas sobre el modelo",
        handler: function ()
        {		    				
                var idmodelo = gpModelos.getSelectionModel().getSelected().data.idmodelo;
                var denom = gpModelos.getSelectionModel().getSelected().data.denom;				
                var win = new Ext.components.Evaluaciones.WinTrazas({
				title:'Trazas del modelo seleccionado: '+ denom + '.',
                idmodelo: idmodelo
				
            });
            win.show();
        }
    });
	
    btnEliminarMod = new Ext.Button({
        id: 'eliminarmod',
        text: labels.lbBtnEliminar,
        iconCls: 'eliminar',
        disabled: true,
        tooltip: labels.lttEliminarMo,
        handler: Eliminar_Modelo
    });

    btnAsociarHech = new Ext.Button({
        id: 'adicionarhech',
        text: labels.lbtnAsociarHe,
        tooltip: labels.lbToolTipAsociar,
        iconCls: 'aplicar',
        disabled: true,
        handler: function ()
        {
            VentanaHecho();
        }
    });
    btnEliminarHech = new Ext.Button({
        id: 'elimianrhech',
        text: labels.lbtnEliminarHe,
        iconCls: 'eliminar',
        disabled: true,
        tooltip: labels.lttEliminarHe,
        handler: function ()
        {
            eliminarHecho();
        }
    });
    btnAceptarH = new Ext.Button({
        iconCls: 'aceptar',
        text: labels.lbtnAceptarHecho,
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function ()
        {
            AddHecho(accionH = 'ACPH');
        }
    });
    btnAplicarH = new Ext.Button({
        id: 'btnAplicarH',
        iconCls: 'aplicar',
        text: labels.lbtnAplicarHecho,
        tooltip: 'Guardar datos y limpiar los campos',
        handler: function ()
        {
            AddHecho(accionH = 'APLH');
        }
    });
    btnCancelarH = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarHecho,
        tooltip: 'Cerrar ventana sin guardar los datos',
        handler: function ()
        {
            winHecho.hide();
            st_hecho.load({
                params: {
                    start: 0,
                    limit: 5
                }
            });
        }
    });
    btnGuardarorden = new Ext.Button({
        id: 'guardarorden',
        text: labels.lbtnGuardarOr,
        iconCls: 'guardar',
        disabled: true,
        tooltip: labels.lttGuardarO,
        handler: guardarOrden
    });
    btnSubirfila = new Ext.Button({
        id: 'subirfila',
        iconCls: 'arriba',
        disabled: true,
        tooltip: labels.lttSubirFila,
        handler: moverFilaArriba
    });
    btnBajarfila = new Ext.Button({
        id: 'bajarfila',
        iconCls: 'abajo',
        disabled: true,
        tooltip: labels.lttBajarFila,
        handler: moverFilaAbajo
    });
    expander = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> </br> {descripcion}</p>'
        )
    });
    function FiltrarReglas()
    {
        stRegla.removeAll();
        stRegla.load();
    }

    var btnCancelarDom = new Ext.Button({
        id: 'idbtncancelarfiltro',
        iconCls: 'cancelar',
        text: labels.lbtnCancelarFiltro,
        tooltip: labels.lbToolTipWinFiltrar,
        handler: function ()
        {
            pgrids.setDisabled(true);
            winFiltrarPlanillas.hide();
        },
        prevTab: 'idbtnfiltrarplanillas',
        nextTab: 'idbtnfiltrarplanillas'
    });
    var btnFiltrarDom = new Ext.Button({
        id: 'idbtnfiltrarplanillas',
        iconCls: 'aceptar',
        text: labels.lbtnBuscar,
        tooltip: labels.lbToolTipWinBuscar,
        handler: function ()
        {
            var node = tpDominio.getSelectionModel().getSelectedNode();
            stPlanillas.removeAll();
            iddominioevaluativo = node.id;
            textoBuscar = null;
            stPlanillas.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });
            pgrids.setDisabled(true);
            winFiltrarPlanillas.hide();
        },
        prevTab: 'idbtncancelarfiltro',
        nextTab: 'idbtncancelarfiltro'
    });

    function filtrarPlanillas()
    {
        if (pgrids.disabled) {
            pgrids.setDisabled(false);
        }
        if (!winFiltrarPlanillas) {
            winFiltrarPlanillas = new Ext.Window({
                title: labels.wtFiltrarPlanillas,
                layout: 'fit',
                modal: true,
                closable: true,
                resizable: false,
                closeAction: 'hide',
                autoHeight: true,
                items: [tpDominio],
                listeners: {
                    show: function (panel)
                    {
                        recurso = -1;
                        cargadorDominio.load(raizDominio);
                    }
                },
                buttons: [btnCancelarDom, btnFiltrarDom]
            });
        }
        winFiltrarPlanillas.show();
        winFiltrarPlanillas.on('show', function (cmp)
        {
            btnCancelarDom.focus(false);
        });
        winFiltrarPlanillas.on('hide', function (cmp)
        {
            btnFiltrar.focus(false);
        });
    }

    //-------------------------------------------------Arbol de Dominios--------------------------------------------------//
    var cargadorDominio, tpDominio, raizDominio, recurso = -1;
    cargadorDominio = new Ext.tree.TreeLoader({
        dataUrl: 'cargardominioEval',
        preloadChildren: true,
        baseParams: {
            iddominio: -1,
            idrecurso: -1
        },
        listeners: {
            beforeload: function (cargadorDominio, node, response)
            {
                if (node.id == 'raizDominio') {
                    cargadorDominio.baseParams.iddominio = -1;
                    cargadorDominio.baseParams.idrecurso = -1;
                } else {
                    if (node.parentNode.id == 'raizDominio') {
                        cargadorDominio.baseParams.iddominio = -1;
                        cargadorDominio.baseParams.idrecurso = node.id;
                        recurso = node.id;
                    } else {
                        cargadorDominio.baseParams.iddominio = node.id;
                        cargadorDominio.baseParams.idrecurso = recurso;
                    }

                }


            },
            load: function (cargadorDominio, node, response)
            {
                node.expand(false, false);
                btnCancelarDom.focus();
            }
        }
    });
    tpDominio = new Ext.tree.TreePanel({
        id: 'tpDominio',
        title: labels.lbgpDominios,
        //tbar: tbDominio,
        disabled: false,
        minSize: 400,
        region: 'center',
        margins: '5 5 5 0',
        animate: true,
        border: true,
        containerScroll: true,
        rootVisible: true,
        width: 380,
        height: 400,
        layout: 'fit',
        selModel: new Ext.tree.DefaultSelectionModel(),
        loader: cargadorDominio,
        autoScroll: true,
        listeners: {
            click: function (nodo, event)
            {

            }
        }
    });
    raizDominio = new Ext.tree.TreeNode({
        text: 'Dominio',
        id: 'raizDominio',
        allowDrag: false,
        allowDrop: false
    });
    tpDominio.setRootNode(raizDominio);
    //---------------------------------------------------Fin del arbol----------------------------------------------------------//
    st_modelo = new Ext.data.Store({
        url: 'cargarModelos',
        listeners: {
            'beforeload': function (thisstore, objeto)
            {
                objeto.params.idplanilla = idPlanillaSeleccionada
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idmodelo',
            root: 'datos',
            totalProperty: 'cantidad'
        }, [
            {
                name: 'idmodelo'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'idplanilla'
            },
            {
                name: 'estado'
            }
            ,
            {
                name: 'idestado'
            },
            {
                name: 'escala'
            },
            {
                name: 'idescala'
            },
            {
                name: 'idexpresionmatematica'
            },
            {
                name: 'denomformula'
            }
        ])
    });
    colummodel = [expander,
        {
            id: 'denominacion',
            header: labels.lwtfDenominacion,
            sortable: true,
            width: 150,
            dataIndex: 'denom'
        },
        {
            id: 'descripcion',
            header: 'descripcion',
            hidden: true,
            width: 150,
            dataIndex: 'descripcion'
        },
        {
            id: 'fechainicio',
            header: labels.lcmFechaInicio,
            sortable: true,
            width: 90,
            dataIndex: 'fechainicio'
        },
        {
            id: 'fechafin',
            header: labels.lcmFechafin,
            sortable: true,
            width: 90,
            dataIndex: 'fechafin'
        },
        {
            id: 'idestado',
            header: labels.lcmestado,
            sortable: true,
            width: 90,
            renderer: PintarEstado,
            dataIndex: 'estado'
        }
    ];
    ptModelo = new Ext.PagingToolbar({
        pageSize: 8,
        store: st_modelo,
        displayInfo: true,
        displayMsg: labels.lDisplayMsg,
        emptyMsg: labels.lemptyMsg
    });
    tbModelos = new Ext.Toolbar({
        id: 'tbmodelos',
        items: [btnAdicionarMod, btnModificarMod, btnHabilitar, btnTraza, btnEliminarMod]
    });
    var kmModelo = [
        {
            key: 'i',
            alt: true,
            fn: function ()
            {
                btnAdicionarMod.handler();
            }
        },
        {
            key: 'm',
            alt: true,
            fn: function ()
            {
                if (!btnModificarMod.disabled) {
                    btnModificarMod.handler();
                }
            }
        },
        {
            key: 46,
            fn: function ()
            {
                if (!btnEliminarMod.disabled) {
                    btnEliminarMod.handler();
                }
            }
        }
    ];
    gpModelos = new Ext.grid.GridPanel({
        id: 'idgpdmodelos',
        keys: kmModelo,
        title: labels.lbgpModelos,
        region: 'center',
        tbar: tbModelos,
        columns: colummodel,
        stripeRows: true,
        autoScroll: true,
        store: st_modelo,
        plugins: expander,
        autoExpandColumn: 'denominacion',
        loadMask: {
            msg: labels.lbGridLoadMaskModelo
        },
        split: true,
        bbar: ptModelo,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, row, rec)
                {
                    st_hecho.removeAll();
                    btnModificarMod.enable();
                    btnHabilitar.disable();
					btnTraza.enable();
                    btnEliminarMod.enable();
                    btnAsociarHech.enable();
                    if (rec.get('idestado') == 0) {
                        btnModificarMod.enable();
                        btnTraza.enable();						
                        btnEliminarMod.enable();
                        btnEliminarHech.show();
                        btnAddFormula.show();
                        btnModFormula.show();
                        btnDelFormula.show();
                        btnSubirfila.show();
                        btnSubirfila.disable();
                        btnBajarfila.show();
                        btnBajarfila.disable();
                        btnGuardarorden.show();
                        btnGuardarorden.disable();
                    } else {
                        btnModificarMod.disable();
						btnTraza.enable();
						btnHabilitar.enable();
                        btnEliminarMod.disable();
                        btnEliminarHech.hide();
                        btnAddFormula.hide();
                        btnModFormula.hide();
                        btnDelFormula.hide();
                        btnSubirfila.hide();
                        btnBajarfila.hide();
                        btnGuardarorden.hide();
                    }

                    if (rec.get('idexpresionmatematica') != null) {
                        btnAsociarHech.disable();
                        btnEliminarHech.disable();
                    } else {
                        idescalaS = rec.get('idescala');
                        idModeloSeleccionado = rec.get('idmodelo');
                        st_hecho.load({
                            params: {
                                start: 0,
                                limit: 5
                            }
                        });
                    }
                }
            }
        })
    });
    function Eliminar_Modelo()
    {
        mostrarMensaje(2, labels.lbMsgConfirm, function (btn)
        {
            if (btn == 'ok') {
                PVD.mostrarMascara('idEliminarmodelo', 'Eliminando...', 'Borrando datos...');
                Ext.Ajax.request({
                    url: 'eliminarmodelo',
                    method: 'POST',
                    params: {
                        idmodelo: gpModelos.getSelectionModel().getSelected().get('idmodelo')
                    },
                    callback: function (options, success, response)
                    {
                        btnEliminarMod.disable();
                        btnModificarMod.disable();
						btnHabilitar.disable();
                        btnEliminarHech.disable();
                        btnAsociarHech.disable();
                        PVD.ocultarMascara('idEliminarmodelo');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.exception == 1) {
                            mostrarMensaje(1,labels.lbConceptoEnUso);
							btnAdicionarTP.focus();
                        } else {
                            mostrarMensaje(1,labels.MsgDelModeloOK);
                            st_hecho.removeAll();
                            st_modelo.load({
                                params: {
                                    start: 0,
                                    limit: 8
                                },
                                callback: function ()
                                {
                                    gpModelos.getSelectionModel().selectFirstRow();
                                }
                            });
                        }
                    }
                });
            } else {
                btnEliminarMod.focus();
            }

        });
    }

    st_hecho = new Ext.data.Store({
        url: 'cargarHechos',
        pruneModifiedRecords: true,
        listeners: {
            'beforeload': function (thisstore, objeto)
            {
                objeto.params.idmodelo = idModeloSeleccionado
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idhecho',
            root: 'datos',
            totalProperty: 'cantidad'
        }, [
            {
                name: 'idhecho'
            },
            {
                name: 'idmodelo'
            },
            {
                name: 'idvalorescualitativos'
            },
            {
                name: 'denom'
            },
            {
                name: 'idexpresionmatematica'
            },
            {
                name: 'denomformula'
            },
            {
                name: 'orden'
            }
        ])
    });
    smHechos = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec)
            {
                var recordModelo = gpModelos.getSelectionModel().getSelected();
                if (recordModelo.get('idestado') == 0) {
                    filaHecho = row;
                    btnEliminarHech.enable();
                    btnSubirfila.enable();
                    btnBajarfila.enable();
                    if (row == 0)
                        btnSubirfila.disable();
                    if (row + 1 == st_hecho.getCount())
                        btnBajarfila.disable();
                    if (cambioorden)
                        btnGuardarorden.enable();
                } else {
                    btnSubirfila.disable();
                    btnBajarfila.disable();
                    btnGuardarorden.disable();
                }
            }
        }
    });
    colummodelh = [
        {
            id: 'expandirh',
            header: labels.lcmvalorcual,
            sortable: true,
            width: 250,
            dataIndex: 'denom'
        },
        {
            header: labels.lcmRegla,
            sortable: true,
            width: 300,
            dataIndex: 'denomformula'
        },
        {
            header: labels.lcmOrden,
            sortable: true,
            width: 90,
            dataIndex: 'orden'
        }
    ];
    ptHecho = new Ext.PagingToolbar({
        //pageSize: 25,
        store: st_hecho,
        displayInfo: true,
        displayMsg: labels.lDisplayMsghecho,
        emptyMsg: labels.lemptyMsghecho
    });
    tbHechos = new Ext.Toolbar({
        id: 'tbhechos',
        items: [btnAsociarHech, btnEliminarHech, '->', btnSubirfila, btnBajarfila, btnGuardarorden]
    });
    var kmHecho = [
        {
            key: 's',
            alt: true,
            fn: function ()
            {
                if (!btnAsociarHech.disabled) {
                    btnAsociarHech.handler();
                }
            }
        },
        {
            key: 'g',
            alt: true,
            fn: function ()
            {
                if (!btnGuardarorden.disabled && !btnGuardarorden.hidden) {
                    btnGuardarorden.handler();
                }
            }
        },
        {
            key: 46,
            fn: function ()
            {
                if (!btnEliminarHech.disabled && !btnEliminarHech.hidden) {
                    btnEliminarHech.handler();
                }
            }
        }
    ];
    gpHechos = new Ext.grid.GridPanel({
        title: labels.lgpHechos,
        keys: kmHecho,
        tbar: tbHechos,
        columns: colummodelh,
        stripeRows: true,
        autoScroll: true,
        store: st_hecho,
        autoExpandColumn: 'expandirh',
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        split: true,
        height: 255,
        region: 'south',
        bbar: ptHecho,
        sm: smHechos
    });
    //------------------------------------------------------------------Fin del grid de los hechos---------------------------------------------------------------------------------------------------

    //-----------------------------------------------------------------Ventana adicionar hechos---------------------------------------------------------------------------------------------------
    //--------------------------------------------------Grid resultado de la ventana adicionar hecho----------------

    expanderesul = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> </br> {descripcionvalcualt}</p>'
        )
    });
    st_resulthech = new Ext.data.Store({
        url: 'cargarResultado',
        listeners: {
            'beforeload': function (thisstore, objeto)
            {
                objeto.params.idescala = idescalaS
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idescalavalorescualitativos"
        }, [
            {
                name: 'idvalorescualitativos'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            }
        ])
    });
    ptwhecho = new Ext.PagingToolbar({
        pageSize: 25,
        store: st_resulthech,
        displayInfo: true,
        displayMsg: labels.lDisplayMsg,
        emptyMsg: labels.lemptyMsg,
        items: [
            '-', {
                //pressed: true,
                //enableToggle:true,
                //text: 'Show Preview',
                //cls: 'x-btn-text-icon details',
                //toggleHandler: toggleDetails
            }]
    });
    //Selection model del grid de valores resultado ( valores cualitativos  ) de la ventana Asociar hecho
    smResultado = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec)
            {
                idvalorCualtS = sm.getSelected().get('idvalorescualitativos');
                denomV = sm.getSelected().get('denom');
            }
        }
    });
    //Grid Panel para seleccionar el resultado ( valores cualitativos  ) de la ventana Asociar hecho
    gpwResultado = new Ext.grid.GridPanel({
        id: 'gpwresult',
        title: 'Resultado',
        cm: new Ext.grid.ColumnModel([expanderesul,
            {
                id: 'expandirr',
                header: labels.lbDenomResultado,
                width: 80,
                sortable: true,
                dataIndex: 'denom'
            }
            //{header:"Idmodelo",hidden: true,dataIndex: 'idmodelo'}
        ]),
        stripeRows: true,
        split: true,
        autoScroll: true,
        store: st_resulthech,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        autoExpandColumn: 'expandirr',
        plugins: expanderesul,
        minSize: 75,
        region: 'west',
        padding: '0 0 0 0',
        margins: '5 0 5 5',
        width: '60%',
        bbar: ptwhecho,
        sm: smResultado
    });
    //---------------------------------------------Fin del Grid resultado de la ventana adicionar hecho----------------------------------------------------------

    //-------------------------------------------Grid reglas de la ventana adicionar hecho------------------------------------------------------------------------
    expanderregla = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Expresi&oacute;n natural:</b><br/> {expresionamostrar}</p>'
        )
    });
    stRegla = new Ext.data.Store({
        url: 'cargarReglas',
        listeners: {
            beforeload: function (st, objeto)
            {
                st.baseParams.idmodelo = idModeloSeleccionado;
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idexpresionmatematica"
        }, [
            {
                name: 'idexpresionmatematica'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'expresionamostrar'
            },
            {
                name: 'idevalmodeloexpmatematica'
            }
        ])
    });
    //Selection Model del grid Reglas de la ventana Asociar hecho
    smRegla = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (sm, row, rec)
            {
                idexpresionmatematicaS = sm.getSelected().get('idexpresionmatematica');
                denomR = sm.getSelected().get('denom');
                btnModFormula.enable();
                btnDelFormula.enable();
            }
        }
    });
    var btnAddFormula = new Ext.Button({
        text: 'Adicionar',
        iconCls: 'adicionar',
        tooltip: labels.ttpBtnAddFormula,
        handler: function ()
        {
            PVD.mostrarMascara('mskloadingind', labels.lbMsgWait, labels.lbMaskLoadingInd);
            Ext.Ajax.request({
                url: 'getlistindicadoresplanilla',
                method: 'POST',
                params: {
                    idplanilla: idPlanillaSeleccionada
                },
                callback: function (options, success, response)
                {
                    var responseData = Ext.decode(response.responseText);
                    var arrIndicadores = new Array();
                    Ext.each(responseData.datos, function (ind)
                    {
                        arrIndicadores.push([
                            ind.idindicador,
                            ind.denom,
                            ind.values
                        ]);
                    });

                    var objExp = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                        hideFieldDenom: false,
                        indicadores: arrIndicadores,
                        mostrarCondicionales:true,
                        width:1300,
                        idexpresionmatematica: -1
                    });

                    PVD.ocultarMascara('mskloadingind');
                    objExp.show();
                    objExp.on('expresionsalvada', function (objExpMatematica)
                    {
                        PVD.mostrarMascara('mskaddexpmatematica', labels.lbMsgWait, labels.lbMaskAddModeloExpMat);
                        objExp.close();
                        Ext.Ajax.request({
                            url: 'addmodeloexpmatematica',
                            method: 'POST',
                            params: {
                                idexpresionmatematica: objExpMatematica.idexpresionmatematica,
                                idmodelo: idModeloSeleccionado
                            },
                            callback: function (options, success, response)
                            {
                                PVD.ocultarMascara('mskaddexpmatematica');
                                mostrarMensaje(1, labels.msgModeloExpMat);

                                    stRegla.load({
                                        callback: function ()
                                        {
                                            gpReglas.getSelectionModel().selectFirstRow();
                                        }
                                    });

                            }
                        });
                    });
                }
            });
        }
    });

    var btnModFormula = new Ext.Button({
        text: labels.lbBtnModificar,
        iconCls: 'modificar',
        tooltip: labels.ttpBtnModFormula,
        disabled: true,
        handler: function ()
        {
            if (gpReglas.getSelectionModel().hasSelection()) {
                Ext.Ajax.request({
                    url: 'getlistindicadoresplanilla',
                    method: 'POST',
                    params: {
                        idplanilla: idPlanillaSeleccionada
                    },
                    callback: function (options, success, response)
                    {
                        var responseData = Ext.decode(response.responseText);
                        var arrIndicadores = new Array();
                        Ext.each(responseData.datos, function (ind)
                        {
                            arrIndicadores.push([
                                ind.idindicador,
                                ind.denom,
                                ind.values,
                            ]);
                        });

                        var objExp = new Ext.pvd.persona.formula.winEditorExpresionesEvalSel({
                            hideFieldDenom: false,
                            indicadores: arrIndicadores,
                            mostrarCondicionales:true,
                            width:1300,
                            idexpresionmatematica: gpReglas.getSelectionModel().getSelected().get('idexpresionmatematica')
                        });
                        PVD.ocultarMascara('mskloadingind');
                        objExp.show();
                        objExp.on('expresionsalvada', function (idexpresionmatematica)
                        {
                            stRegla.load({
                                callback: function ()
                                {
                                    gpReglas.getSelectionModel().selectFirstRow();
                                }
                            });
                            st_hechow.load({
                                params: {
                                    start: 0,
                                    limit: 25
                                }
                            });
                            objExp.close();
                        });
                    }
                });
            }
        }
    });
    var btnDelFormula = new Ext.Button({
        text: labels.lbBtnEliminar,
        iconCls: 'eliminar',
        tooltip: labels.ttpBtnDelFormula,
        disabled: true,
        handler: function ()
        {
            if (gpReglas.getSelectionModel().hasSelection()) {
                mostrarMensaje(2, labels.lbMsgDelModeloExpMat, function (btn)
                {
                    if (btn == "ok") {
                        PVD.mostrarMascara('msgdelmodeloexpmat', labels.lbMsgWait, labels.lbMaskDelModeloExpMat);
                        var idexpresionmatematica = gpReglas.getSelectionModel().getSelected().get('idexpresionmatematica');
                        var records = st_hechow.getRange();
                        var arrIdHechos = new Array();
                        for (var i = 0; i < records.length; i++) {
                            if (records[i].get('idexpresionmatematica') == idexpresionmatematica) {
                                arrIdHechos[i] = records[i].get('idhecho');
                            }
                        }
                        Ext.Ajax.request({
                            url: 'delmodeloexpmatematica',
                            method: 'POST',
                            params: {
                                idevalmodeloexpmatematica: gpReglas.getSelectionModel().getSelected().get('idevalmodeloexpmatematica'),
                                idexpresionmatematica: idexpresionmatematica,
                                arrIdHechos: Ext.encode(arrIdHechos)
                            },
                            callback: function (options, success, response)
                            {
                                PVD.ocultarMascara('msgdelmodeloexpmat');
                                mostrarMensaje(1, labels.lbMsgModeloExpMatDeleted);

                                    stRegla.load({
                                        callback: function ()
                                        {
                                            gpReglas.getSelectionModel().selectFirstRow();
                                        }
                                    });
                                    st_hechow.load({
                                        params: {
                                            start: 0,
                                            limit: 25
                                        }
                                    });

                            }
                        });
                    }
                });
            }
        }
    });

    //Grid Panel para seleccionar reglas de la ventana Asociar hecho
    gpReglas = new Ext.grid.GridPanel({
        title: labels.ltgpRegla,
        tbar: [btnAddFormula, btnModFormula, btnDelFormula],
        columns: [expanderregla, {
            id: 'denominacion',
            header: 'Denominaci&oacute;n de la expresi&oacute;n matem&aacute;tica',
            width: 160,
            sortable: true,
            dataIndex: 'denominacion'
        }
        ],
        stripeRows: true,
        autoScroll: true,
        store: stRegla,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        autoExpandColumn: 'denominacion',
        plugins: expanderregla,
        minSize: 75,
        region: 'center',
        margins: '5 5 5 0',
        width: '50%',
        sm: smRegla
    });
    //-------------------------------------------Fin del grid de las reglas-----------------------------------------------------------------------------------------------

    //-------------------------------------------------------Grid de hechos de la ventana  hechos-------------------------------------------------------------------
    var st_hechow, gpHechosw;
    st_hechow = new Ext.data.Store({
        url: 'cargarHechos',
        listeners: {
            'beforeload': function (thisstore, objeto)
            {
                objeto.params.idmodelo = idModeloSeleccionado
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idhecho',
            root: 'datos',
            totalProperty: 'cantidad'
        }, [
            {
                name: 'idhecho'
            },
            {
                name: 'idmodelo'
            },
            {
                name: 'idvalorescualitativos'
            },
            {
                name: 'denom'
            },
            {
                name: 'idexpresionmatematica'
            },
            {
                name: 'denomformula'
            },
            {
                name: 'orden'
            }
        ])
    });
    colummodelhw = [
        {
            header: labels.lcmvalorcual,
            sortable: true,
            width: 200,
            dataIndex: 'denom'
        },
        {
            header: labels.lcmRegla,
            sortable: true,
            width: 300,
            dataIndex: 'denomformula',
            id: 'expandirhw'
        }
    ];
    //Grid panel que muestra la selección de un resultado( valor cualitativo ) con una regla.
    gpHechosw = new Ext.grid.GridPanel({
        title: labels.lgpHechos,
        columns: colummodelhw,
        stripeRows: true,
        store: st_hechow,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        margins: '0 5 5 5',
        height: 155,
        anchor: '100%',
        region: 'south',
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
    });
    var keysH = [
        {
            key: 'i',
            alt:true,
            fn: function(){
                btnAddFormula.handler();
            }
        },{
            key: 'm',
            alt:true,
            fn: function(){
                if(!btnModFormula.disabled ){
                    btnModFormula.handler();
                }
            }
        },{
            key: 46,
            fn: function(){
                if(!btnDelFormula.disabled ){
                    btnDelFormula.handler();
                }
            }
        },
        {
            key: Ext.EventObject.ENTER,
            fn: function () {
                self.btnAceptarH.handler();
            }
        },
        {
            key: 'p',
            alt: true,
            ctrl: true,
            fn: function () {
                self.btnAplicarH.handler();
            }
        },
        {
            key: 'x',
            alt: true,
            fn: function () {
                self.btnCancelarH.handler();
            }
        }
    ];
    //-------------------------------------------------------Fin del grid hechos de la ventana -----------------------------------------------------------------------
    //--------------------------------------------------------Fin del Grid reglas de la ventana adicionar hecho-----------------------------------------------------------------
    function VentanaHecho()
    {
        if (!winHecho) {
            winHecho = new Ext.Window({
                title: labels.ltwAdicionarHech,
                modal: true,
                layout: 'border',
                width: 800,
                keys:keysH,
                height: 500,
                closable: true,
                closeAction: 'hide',
                resizable: false,
                items: [gpwResultado, gpReglas, gpHechosw],
                buttons: [btnCancelarH, btnAplicarH, btnAceptarH]
            });
        }
        st_hechow.removeAll();
        st_resulthech.load({
            params: {
                start: 0,
                limit: 5
            }
        });
        st_hechow.load({
            params: {
                start: 0,
                limit: 25
            }
        });
        stRegla.load();
        winHecho.show();
        winHecho.on('hide', function (p)
        {
            btnAsociarHech.focus();
        })
        winHecho.maximize();
    }

    function AddHecho(accionH)
    {

        if (smResultado.hasSelection() && smRegla.hasSelection()) {
            PVD.mostrarMascara('idaddhecho', 'Por favor espere', 'Adicionar hecho');
            Ext.Ajax.request({
                url: 'adicionarhecho',
                method: 'POST',
                waitMsg: 'Asociando',
                params: {
                    idmodelo: idModeloSeleccionado,
                    idvalorescualitativos: idvalorCualtS,
                    idexpresionmatematica: idexpresionmatematicaS
                },
                callback: function (options, success, response)
                {
                    PVD.ocultarMascara('idaddhecho');
                    responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.result, responseData.mensaje,
                        function (btn)
                        {
                            if (accionH == 'ACPH') {
                                winHecho.hide();
                                st_hecho.removeAll();
                                st_hecho.load({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    }
                                });
                            } else {
                                st_hechow.load({
                                    params: {
                                        start: 0,
                                        limit: 5
                                    },
                                    callback: function ()
                                    {
                                        gpHechosw.getSelectionModel().selectFirstRow();
                                        gpwResultado.getSelectionModel().clearSelections();
                                        gpReglas.getSelectionModel().clearSelections();
                                    }
                                });
                            }
                        });
                }
            });
        } else {
			mostrarMensaje(1,labels.lbErrorApli);
        }
        /*if(accionH == 'APLH' || accionH == 'ACPH' && !(smResultado.hasSelection() && smRegla.hasSelection())){
         Ext.MessageBox.show({
         title: labels.lbError,
         msg: labels.lbErrorApli,
         buttons: Ext.MessageBox.OK,
         icon: Ext.MessageBox.ERROR
         });
         return;
         }*/
    }

    //-----------------------------------------------------------------Fin de ventana adicionar hechos----------------------------------------
    //-----------------------Grid de planillas---------------------//
    var muDatap, stPlanillas, ptbPlanillas, gpPlanillas, iddominioevaluativo, textoBuscar;
    tfFiltro = new Ext.form.TextField({
        id: 'idtffiltro',
        name: 'tffiltrop',
        emptyText: labels.lbEmptyTextBuscar,
        width: 130,
        minLength: 3,
        maxLength: 100,
        prevTab: 'ayudaTP',
        nextTab: 'btnBuscarPLanilla'
    });
    stPlanillas = new Ext.data.Store({
        url: 'cargarPlanillas',
        listeners: {
            'beforeload': function (thisstore, objeto)
            {
                objeto.params.iddominioevaluativo = iddominioevaluativo,
                objeto.params.texto = textoBuscar
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, [
            {
                name: 'idplanilla'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denom'
            },
            {
                name: 'descripcion'
            },
            {
                name: 'iddominioevaluativo'
            },
            {
                name: 'idestado'
            }
        ])
    });
    stPlanillas.load({
        params: {
            limit: 15,
            start: 0
        }
    });
    ptbPlanillas = new Ext.PagingToolbar({
        pageSize: 15,
        store: stPlanillas,
        displayInfo: true,
        /*displayMsg: labels.lDisplayMsg,
        emptyMsg: labels.lemptyMsg*/
    });
    var expanderPlanilla = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Descripcion:</b> {descripcion}</p>'
        )
    });
    var kmPlanilla = [
        {
            key: 'b',
            alt: true,
            fn: function ()
            {
                btnBuscarPLanilla.handler();
            }
        },
        {
            key: 'f',
            alt: true,
            fn: function ()
            {
                btnFiltrar.handler();
            }
        },
        {
            key: 'h',
            alt: true,
            fn: function ()
            {
                btnAyuda.handler();
            }
        }
    ];
    gpPlanillas = new Ext.grid.GridPanel({
        title: labels.lbPlanillas,
        keys: kmPlanilla,
        split: true,
        width: '31%',
        minSize: 185,
        collapsible: true,
        margins: '5 0 5 5',
        cmargins: '5 5 5 5',
        region: 'west',
        tbar: [tfFiltro, btnBuscarPLanilla, btnFiltrar, '->', btnAyuda],
        store: stPlanillas,
        plugins: expanderPlanilla,
        cm: new Ext.grid.ColumnModel([expanderPlanilla, {
            header: "Denominaci&oacute;n de la planilla",
            sortable: true,
            dataIndex: 'denom'
        }]),
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        }),
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        viewConfig: {
            forceFit: true
        },
        bbar: ptbPlanillas,
        listeners: {
            rowclick: function (grid, rowIndex, event)
            {
                if (pgrids.disabled)
                    pgrids.setDisabled(false);
                gpHechos.setVisible(true);
                if (Ext.getCmp('idpcontenedor').disabled)
                    Ext.getCmp('idpcontenedor').setDisabled(false);
                st_modelo.removeAll();
                idPlanillaSeleccionada = grid.getSelectionModel().getSelected().get('idplanilla');
                st_modelo.load({
                    params: {
                        start: 0,
                        limit: 8
                    }
                });
                st_hecho.removeAll();
                btnAsociarHech.disable();
            }
        }
    });
    function buscarPlanillas()
    {
        stPlanillas.removeAll();
        textoBuscar = tfFiltro.getValue();
        iddominioevaluativo = null;
        stPlanillas.load({
            params: {
                start: 0,
                limit: 15
            }
        });
    }

    //-----------------------------------------------------------------Fin del grid de planillas----------------------------------------------------------------------------//

    pgrids = new Ext.Panel({
        id: 'pgrids',
        layout: 'border',
        border: false,
        region: 'center',
        margins: '5 5 5 0',
        width: '65%',
        disabled: true,
        items: [gpModelos, gpHechos]
    });
    gpPlanillas.on('render', function (cmp)
    {
        btnBuscarPLanilla.focus(false);
    });
    vpModelo = new Ext.Viewport({
        id: 'idpcontenedor',
        layout: 'border',
        defaults: {
            split: true
        },
        items: [gpPlanillas, pgrids]
    });
    mascaraM = new Ext.LoadMask(gpModelos.getEl(), {
        msg: labels.lbEliminarMLoadMask
    });
    mascaraM.enable();
    mascaraH = new Ext.LoadMask(gpHechos.getEl(), {
        msg: labels.lbEliminarHLoadMask
    });
    mascaraH.enable();
    mascaraO = new Ext.LoadMask(gpHechos.getEl(), {
        msg: labels.lbOrdenHLoadMask
    });
    mascaraO.enable();
}

function eliminarHecho()
{
    mostrarMensaje(2, labels.lbMsgConfirmHecho, function (btn)
    {
        if (btn == 'ok') {
            mascaraH.show();
            Ext.Ajax.request({
                url: 'eliminarhecho',
                method: 'POST',
                params: {
                    idhecho: gpHechos.getSelectionModel().getSelected().get('idhecho'),
                    idexpresionmatematica: gpHechos.getSelectionModel().getSelected().get('idexpresionmatematica')
                },
                callback: function (options, success, response)
                {
                    btnEliminarHech.disable();
                    mascaraH.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.exception == 1) {
                        mostrarMensaje(1,labels.lbConceptoEnUso);
						btnAdicionarTP.focus();
                    } else {
                        mostrarMensaje(responseData.result, responseData.mensaje, function (btn)
                        {
                            st_hecho.load({
                                params: {
                                    start: 0,
                                    limit: 100
                                },
                                callback: function ()
                                {
                                    gpHechos.getSelectionModel().selectFirstRow();
                                    reordenarOrden();
                                }
                            });
                        });
                    }
                }
            });
        }
    });
}

function guardarOrden()
{
    var arrRecordM = new Array();
    var arrayM = st_hecho.getModifiedRecords();
    for (var i = 0; i < arrayM.length; i++) {
        var aux = new Array();
        aux[0] = arrayM[i].get('idhecho');
        aux[1] = arrayM[i].get('orden');
        arrRecordM[i] = aux;
    }
    mascaraO.show();
    Ext.Ajax.request({
        url: 'actualizarordenhecho',
        method: 'POST',
        params: {
            arrayVal: Ext.encode(arrRecordM)
        },
        callback: function (options, success, response)
        {
            mascaraO.hide();
            responseData = Ext.decode(response.responseText);
            mostrarMensaje(responseData.result, responseData.mensaje, function (btn)
            {
                btnGuardarorden.disable();
                st_hecho.reload({
                    params: {
                        start: 0,
                        limit: 100
                    },
                    callback: function ()
                    {
                        gpHechos.getSelectionModel().selectFirstRow();
                    }
                });
            });
        }
    });
}

function reordenarOrden()
{
    var cont = 1;
    for (var i = 0; i < st_hecho.getCount(); i++) {
        var rc = st_hecho.getAt(i);
        rc.set('orden', cont++);
    }
    guardarOrden();
}

function PintarEstado(val)
{
    if (val == "Inactivo") {
        return '<span style="color:red;font-weight:bold">' + val + '</span>';
    } else
        if (val == "Activo") {
            return '<span style="color:green;font-weight:bold">' + val + '</span>';
        }
        else
            if (val == "Elaboración") {
                return '<span style="color:blue;font-weight:bold">' + val + '</span>';
            }
    return val;
}

function moverFilaArriba()
{
    cambioorden = true;
    var recordSeleccionado = smHechos.getSelected();
    var recordAnterior = st_hecho.getAt(filaHecho - 1);
    var recordAux = recordSeleccionado;
    st_hecho.remove(recordSeleccionado);
    st_hecho.insert(filaHecho - 1, recordAux);
    recordSeleccionado.set('orden', filaHecho);
    recordAnterior.set('orden', filaHecho + 1);
    smHechos.selectPrevious();
}

function moverFilaAbajo()
{
    cambioorden = true;
    var recordSeleccionado = smHechos.getSelected();
    var ordenSelec = recordSeleccionado.get('orden');
    var recordSiguiente = st_hecho.getAt(filaHecho + 1);
    var recordAux = recordSeleccionado;
    st_hecho.remove(recordSeleccionado);
    st_hecho.insert(filaHecho + 1, recordAux);
    recordSeleccionado.set('orden', recordSiguiente.get('orden'));
    recordSiguiente.set('orden', ordenSelec);
    smHechos.selectNext();
}



