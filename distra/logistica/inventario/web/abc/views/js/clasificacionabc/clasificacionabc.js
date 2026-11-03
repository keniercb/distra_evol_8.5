/**
 Uso:Componente para la clasificacion ABC de los productos

 * ---------------------------------------------

 * 26 de Marzo 2020 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */

Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

mostrarTipNaturalezas = function(){
    Ext.MessageBox.buttonText.ok = "Aceptar";
    Ext.Msg.show
    ({
        title:'Informaci&oacute;n',
        buttons: Ext.Msg.OK,
        msg: 'Naturalezas: ' + periodoclasificacion.naturalezas
    });
}

mostrarDetallesClasificacion = function (idclasif) {
    if(idclasif != ''){
        var mascaraD = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando detalles...'
        });
        mascaraD.show();
        Ext.Ajax.request({
            url: 'obtenerDetallesClasificacion',
            method: 'POST',
            params: {id: idclasif},
            timeout: 300000,
            callback: function (options, success, response) {
                mascaraD.hide();
                var obj = Ext.decode(response.responseText);

                    var grid = new Ext.grid.PropertyGrid({
                        height: 300,
                        width: 500,
                        region: 'center',
                        source: obj,
                        autoScroll: true,
                        border:false,
                        stripeRows:true,
                        disableSelection: true,
                        columns: [{
                            header: 'Campo',
                            width: 100,
                            dataIndex: 'name',
                            menuDisabled: true,
                            hideable: false
                        },{
                            header: 'Valor',
                            width: 400,
                            dataIndex: 'value',
                            menuDisabled: true,
                            hideable: false
                        }],
                        viewConfig: {
                            forceFit: true
                        }
                    });
                    var w = new Ext.Window({
                        title: 'Detalles',
                        layout: 'border',
                        height: 300,
                        width: 500,
                        items: [grid],
                        closeAction: 'close',
                        closable: true
                    });

                    w.show();
            }
        });

    }
}

Ext.log.abc.ClasificacionABC = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        _this.idioma = this.idioma;
        config.dirController = '/logistica/inventario/abc/index.php/clasificacionabc';
        config.urlBusquedaGridPrincipal = 'obtenerclasificacionabc';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.gridEditable = true;
        config.roweditor = false;
        config.autoShow = true;
        config.autoLoad = true;
        config.busquedaAvanzada = true;
        config.idioma = {};
        config.baseParams = {uebs :Ext.encode(auebs), idestructura: idestructura, idconf : periodoclasificacion.idconfperiodosclasificacionabc, limit: 30, start: 0};
        Ext.log.abc.ClasificacionABC.superclass.constructor.call(this, config);
        _this.textBusquedaSimple = 'Codigo del producto';

    }, 
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: 'Naturaleza',
            width: 80,
            dataIndex: 'lineaproducto',
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'C&oacute;digo',
            dataIndex: 'codigo',
            width: 140,
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'Producto',
            width: 300,
            dataIndex: 'producto',
            default: true,
            hidden: false
        });
        this.addGridColumn({
            header: 'Clasificaci&oacute;n ABC',
            width: 100,
            dataIndex: 'clasificaciontotal',
            default: true,
            hidden: false,
            align: 'center',
            renderer: function (val) {
                if (val == 'A') {
                    return '<a><b><span style="color: darkred; align-items: center">' + val + '</span></b></a>';
                } else if (val == 'B') {
                    return '<span style="color: darkblue; align-items: center;">' + val + '</span>';
                } else {
                    return '<span style="color: darkgreen; align-items: center;">' + val + '</span>';
                }
            }
        });

        for(var i = 0; i < arrUEBS.length; i++){
            this.addGridColumn({
                header: 'ABC Calculado',
                width: 100,
                dataIndex: 'c-'+arrUEBS[i].idestructura,
                default: false,
                hideable: true,
                align: 'center',
                hidden: false,
                renderer: function (val, o, record) {
                    var colIndex = _this.gpPrincipal.getColumnModel().getDataIndex(o.id);
                    var a = colIndex.split('-');
                    if (val == 'A') {
                        return '<b><span style="color: darkred; align-items: center">' + val + '</span></b>';
                    } else if (val == 'B') {
                        return '<span style="color: darkblue; align-items: center;">' + val + '</span>';
                    } else {
                        return '<span style="color: darkgreen; align-items: center;">' + val + '</span>';
                    }
                }
            });
            if(tipoestructura == 2) {

                this.addGridColumn({
                    header: 'ABC Modificado',
                    dataIndex: 'm-' + arrUEBS[i].idestructura,
                    width: 100,
                    default: false,
                    align: 'center',
                    hideable: true,
                    hidden: false,
                    editor: new Ext.form.ComboBox({
                        valueField: 'denominacion',
                        displayField: 'denominacion',
                        hiddenName: 'idclasificacionabc',
                        allowBlank: false,
                        mode: 'local',
                        anchor: '100%',
                        store: new Ext.data.SimpleStore({
                            fields:['idclasificacionabc','denominacion'],
                            data: [[1,'A'],[2,'B'],[3,'C'],[4,'NC']]
                        }),
                        blankText: 'Este campo es obligatorio',
                        readOnly: false,
                        triggerAction: 'all'
                    }),
                    renderer: function (val) {
                        if (val == 'A') {
                            return '<b><span style="color: darkred; align-items: center">' + val + '</span></b>';
                        } else if (val == 'B') {
                            return '<span style="color: darkblue; align-items: center;">' + val + '</span>';
                        } else {
                            return '<span style="color: darkgreen; align-items: center;">' + val + '</span>';
                        }
                    }
                });
            }else{
                this.addGridColumn({
                    header: 'ABC Modificado',
                    dataIndex: 'm-' + arrUEBS[i].idestructura,
                    width: 100,
                    default: false,
                    align: 'center',
                    hideable: true,
                    hidden: false,
                    renderer: function (val) {
                        if (val == 'A') {
                            return '<a><b><span style="color: darkred; align-items: center">' + val + '</span></b></a>';
                        } else if (val == 'B') {
                            return '<span style="color: darkblue; align-items: center;">' + val + '</span>';
                        } else {
                            return '<span style="color: darkgreen; align-items: center;">' + val + '</span>';
                        }
                    }
                });
            }

            this.addGridColumn({
                header: 'id-'+arrUEBS[i].idestructura,
                dataIndex: 'id-'+arrUEBS[i].idestructura,
                width: 50,
                default: false,
                align: 'center',
                hideable: false,
                hidden: true
            });
        }

        this.addGridPlugin(chgEntidades);

    },
    initDefaultButtons: function () {
        var self = this;
        this.addToolbarButton("Per&iacute;odo de clasificaci&oacute;n: ");

        this.addToolbarButton("<a href='#' onclick=mostrarTipNaturalezas()><b>"+periodoclasificacion.periodo+"</b></a>");

        this.addToolbarButton(" ");
        this.addToolbarButton("-");


        if(tipoestructura == 2) {
            this.addToolbarButton(new Ext.Button({
                    id: 'btnGuardarClasificacion',
                    iconCls: 'guardar',
                    text: 'Guardar clasificaci&oacute;n',
                    tooltip: 'Guarda la clasificaci&oacute;n ABC modificada',
                    handler: function () {
                        if (periodoclasificacion.cerrado != 1) {
                            var arrMod = self.storePrincipal.getModifiedRecords();
                            if (arrMod.length > 0) {
                                var arrPM = new Array();
                                for (var i = 0; i < arrMod.length; i++) {
                                    arrPM.push(arrMod[i].data);
                                }
                                var mascara = new Ext.LoadMask(Ext.getBody(), {
                                    msg: 'Guardando datos. Por favor espere...'
                                });
                                mascara.show();
                                Ext.Ajax.request({
                                    url: 'guardarClasificacionProductosModificados',
                                    method: 'POST',
                                    timeout: 300000,
                                    params: {
                                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                        prod: Ext.encode(arrPM),
                                        idueb: arrUEBS[0].idestructura
                                    },
                                    callback: function (options, success, response) {
                                        mascara.hide();
                                        var obj = Ext.decode(response.responseText);
                                        if (obj.codigo == 1) {
                                            mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente.');
                                            self.storePrincipal.commitChanges();
                                        } else {
                                            mostrarMensaje(3, obj.mensaje);
                                        }
                                    }
                                });
                            } else {
                                mostrarMensaje(3, 'No hay productos con su clasificaci&oacute;n modificada.');
                            }
                        } else{
                            mostrarMensaje(3, 'El per&iacute;odo a analizar est&aacute; cerrado.');
                        }
                    }

                })
            );
        }else{
            this.addToolbarButton(new Ext.Button({
                    id: 'btnClasificarProductos',
                    iconCls: 'producto',
                    text: 'Clasificar productos',
                    tooltip: 'Clasificar productos (A, B, C)',
                    handler: function () {
                        if (periodoclasificacion.cerrado != 1) {
                            mostrarMensaje(2, '¿Desea realizar la clasificaci&oacute;n A, B, C del per&iacute;odo seleccionado?', function (btn) {
                                if (btn == 'ok') {
                                    var mascarac = new Ext.LoadMask(Ext.getBody(), {
                                        msg: 'Calculando valores de los criterios ABC. Por favor espere...'
                                    });
                                    mascarac.show();
                                    Ext.Ajax.request({
                                        url: 'calcularValoresCriteriosporProductos',
                                        method: 'POST',
                                        timeout: 4000000,
                                        params: {
                                            idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                            fechainicio: periodoclasificacion.fechainicio,
                                            fechafin: periodoclasificacion.fechafin,
                                            uebs: Ext.encode(auebs)
                                        },
                                        callback: function (options, success, response) {
                                            mascarac.hide();
                                            var obj = Ext.decode(response.responseText);
                                            if (obj.codigo == 1) {
                                                var mascaraabc = new Ext.LoadMask(Ext.getBody(), {
                                                    msg: 'Clasificando los productos en ABC. Por favor espere...'
                                                });
                                                mascaraabc.show();
                                                Ext.Ajax.request({
                                                    url: 'clasificarProductosABC',
                                                    method: 'POST',
                                                    timeout: 4000000,
                                                    params: {
                                                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                                        fechainicio: periodoclasificacion.fechainicio,
                                                        fechafin: periodoclasificacion.fechafin,
                                                        uebs: Ext.encode(auebs)
                                                    },
                                                    callback: function (options, success, response) {
                                                        mascaraabc.hide();
                                                        var obj = Ext.decode(response.responseText);
                                                        if (obj.codigo == 1) {
                                                            mostrarMensaje(1, 'Los productos han sido clasificados satisfactoriamente.');
                                                            self.storePrincipal.initBaseParams.uebs = Ext.encode(auebs);
                                                            self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                                                            self.reiniciarBusqueda({
                                                                params: {
                                                                    uebs: Ext.encode(auebs),
                                                                    idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                                                    limit: 30,
                                                                    start: 0
                                                                }
                                                            });
                                                        } else {
                                                            mostrarMensaje(3, obj.mensaje);
                                                        }
                                                    }
                                                });
                                            } else {
                                                mostrarMensaje(3, obj.mensaje);
                                            }
                                        }.createDelegate(this)
                                    });
                                }
                            });

                        }else{
                            mostrarMensaje(3, 'El per&iacute;odo a analizar est&aacute; cerrado.');
                        }
                    }

                })
            );

            this.addToolbarButton(new Ext.Button({
                    id: 'btnCalcularClasificacionTotal',
                    iconCls: 'calcular',
                    text: 'Calcular clasificaci&oacute;n',
                    tooltip: 'Calcula la clasificaci&oacute;n ABC total a nivel de Entidad',
                    handler: function () {
                        if (periodoclasificacion.cerrado != 1) {
                            var mascara = new Ext.LoadMask(Ext.getBody(), {
                                msg: 'Calculando valores de los criterios ABC. Por favor espere...'
                            });
                            mascara.show();
                            Ext.Ajax.request({
                                url: 'calcularClasificacionABCTotal',
                                method: 'POST',
                                timeout: 800000,
                                params: {
                                    idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                    uebs: Ext.encode(auebs)
                                },
                                callback: function (options, success, response) {
                                    mascara.hide();
                                    var obj = Ext.decode(response.responseText);
                                    if (obj.codigo == 1) {
                                        mostrarMensaje(1, 'La clasificaci&oacute;n ABC ha sido calculada satisfactoriamente.');
                                        self.storePrincipal.initBaseParams.uebs = Ext.encode(auebs);
                                        self.storePrincipal.initBaseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;
                                        self.reiniciarBusqueda({
                                            params: {
                                                uebs: Ext.encode(auebs),
                                                idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                                limit: 30,
                                                start: 0
                                            }
                                        });
                                    } else {
                                        mostrarMensaje(3, obj.mensaje);
                                    }
                                }
                            });
                        }else{
                            mostrarMensaje(3, 'El per&iacute;odo a analizar est&aacute; cerrado.');
                        }
                    }

                })
            );
        }

        this.addToolbarButton(new Ext.Button({
                id: 'btnDetallesClasificarProductos',
                iconCls: 'detalles',
                text: 'Detalles',
                tooltip: 'Detalles de la clasificaci&oacute;n de productos en (A, B, C)',
                handler: function () {
                    var objDetalles = new Ext.log.abc.DetallesClasificacionABC({
                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                        uebs: auebs
                    });
                    objDetalles.show();
                }

            })
        );
        this.addToolbarButton(new Ext.Button({
            id: 'btnImprimir',
            iconCls: 'imprimir',
            text: 'Imprimir',
            tooltip: 'Imprimir',
            handler: function () {
                    //self.getReportes(this);
                    console.info(arrUEBS[0].idestructura);
                    this.tipoReportes = new LOG.util.Report({
                        reports: [
                            {
                                dirReport: '/distra/logistica/inventario/abc/clasificacionabc/clasificacionabcListado',
                                isList:true,
                                params: {
                                    idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                                    idestructuras:(auebs) ?"{" + auebs +"}" : idestructura,
                                    
                                }
                            }
                        ]
                    });
                    this.tipoReportes.view();
            }
            

        })
    ); 

        this.addToolbarButton("-");
        this.addToolbarButton("->");
        self.addToolbarButton(estructura);
    },
    view:function() {
        var _this = this;
        this.getPanelBusqueda().setColumns(1);
        var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
            fieldLabel: 'Clasificaci&oacute;n ABC',
            editable: true,
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenernomclasificacionabc',
            hiddenName: 'idclasificacionabc',
            valueField: 'idclasificacionabc',
            displayField: 'denominacion',
            loadingText: 'Cargando...',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local'
        }));

        var cbNaturalezas = new LOG.util.ComboBox({
            fieldLabel: 'Naturaleza',
            editable: true,
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerlineasproducto',
            hiddenName: 'idlineaproducto',
            valueField: 'idlineaproducto',
            displayField: 'lineaproducto',
            loadingText: 'Cargando...',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local'
        });
        cbNaturalezas.store.baseParams.idconf = periodoclasificacion.idconfperiodosclasificacionabc;

        fpDatosBusqueda.addComponent(cbNaturalezas);

        fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
            fieldLabel: 'Uebs',
            editable: true,
            url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerUEBsBusqueda',
            hiddenName: 'idestructura',
            valueField: 'idestructura',
            displayField: 'denominacion',
            loadingText: 'Cargando...',
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText: 'Seleccione...',
            minChars: 0,
            mode: 'local'
        }));

        fpDatosBusqueda.getColumn(0).columnWidth = 1;
        fpDatosBusqueda.getColumn(0).getComponent(0).anchor = '99%';
        fpDatosBusqueda.getColumn(0).getComponent(1).anchor = '99%';

        this.addFilterComponent(fpDatosBusqueda);

        return Ext.log.abc.ClasificacionABC.superclass.view.call(this);
    }/*,
    
    getReportes:function(parent){
        console.log(parent);
        _this = parent;
        this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/abc/clasificacionabc/clasificacionabcListado',
                    isList:true,
                    params: {
                        idconf: periodoclasificacion.idconfperiodosclasificacionabc,
                        idestructura: (_this.baseParams.uebs) ? _this.baseParams.uebs : _this.baseParams.uebs.idestructura
                    }
                }
            ]
        });
        this.tipoReportes.view();
    },*/
});


Ext.log.abc.ClasificacionABCBase = {

    init: function (idioma, perfil) {
        var _this = this;
        this.p = new Ext.log.abc.ClasificacionABC({});

        this.p.init();
        this.vista = this.p.view();

        this.vp =  new Ext.Viewport({
            layout: 'border',
            items: [this.vista]
        });
    }
};
var estructura = null;
var idestructura = null;
var arrUEBS = null;
var auebs = new Array();
var arrEntidades = new Array();
var tipoestructura = null;
var periodoclasificacion = null;
arrEntidades.push({header: ' ', align: 'center', colspan: 5});

var chgEntidades = new Ext.ux.grid.ColumnHeaderGroup({rows: [arrEntidades]});
Ext.onReady(function() {
    UCID.portal.cargarEtiquetas('clasificacionabc', function (perfil, idioma) {
        perfil = arguments[0];
        idioma = arguments[1];
        var mascara = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando uebs...'
        });
        mascara.show();
        Ext.Ajax.request({
            url: 'obtenerUEBs',
            method: 'POST',
            timeout: 300000,
            params: {
            },
            callback: function (options, success, response) {
                mascara.hide();
                var obj = Ext.decode(response.responseText);
                if(obj.codigo == 1){
                    tipoestructura = obj.tipo;
                    arrUEBS = obj.uebs;
                    for(var i = 0; i < arrUEBS.length; i++){
                        auebs.push(arrUEBS[i].idestructura);
                    }
                    estructura = obj.estructura;
                    idestructura = obj.idestructura;
                    for(var i = 0; i < arrUEBS.length; i++){
                        arrEntidades.push({header: arrUEBS[i].denominacion, align: 'center', colspan: 3});
                    }

                    periodoclasificacion = obj.periodo;
                    if(periodoclasificacion.length <= 0){
                        mostrarMensaje(3, 'No existe un per&iacute;odo de clasificaci&oacute;n a analizar.');
                        return;
                    }
                    var interfaz = Ext.log.abc.ClasificacionABCBase;
                    interfaz.init(idioma, perfil);
                }else{
                    mostrarMensaje(3, obj.mensaje);
                    return;
                }

            }
        });

    });
},true);


