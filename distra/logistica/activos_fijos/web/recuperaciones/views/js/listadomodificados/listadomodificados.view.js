/**
 * Created by yoendy on 7/13/2016.
 */
/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.listadomodificados');
LOG.aft.listadomodificados.view = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.layout = 'border';
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadomodificados.Idioma, LOG.util.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadomodificados';

        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            handler: function () {
                _this.getReporte();
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {

                _this.dfDesde.reset();
                _this.dfHasta.reset();
                smAreas.deselectRange(0, stAreas.getTotalCount());
                _this.gridTipoOper.getSmPrincipal().deselectRange(0, _this.gridTipoOper.getStorePrincipal().getTotalCount());
            }
        }));
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id: 'idActivosPorOperacion'}));

        /*------------Fieldset Rango Fecha---------------*/

        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedoc',
            format: 'm/d/Y',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    _this.dfHasta.setMinValue(value);

                }
            }
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadoc',
            format: 'm/d/Y',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    _this.dfDesde.setMaxValue(value);

                }
            }
        });

        //this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        //this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [this.clsFecha]
        });

        /*---------------Fieldset con grid Selecionar Area de responsabilidad-------------*/

        var listaAreas = new LOG.util.List();
        var checkAreas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        checkAreas.on({
            rowselect : function (sm,i,r){
                var campos = _this.gridCampos.getStore().getRange();
                var arrayTablas = Array();
                var arrayCampos = Array();
                
                if (campos.length > 0) {
                    for (var j = 0; j < campos.length; j++) {
                        arrayCampos.push(campos[j].data.identificador);
                        arrayTablas.push(campos[j].data.nombretabla);

                    }

                } 
                // console.info(arrayTablas)
                // console.info(arrayCampos)
                let params = {
                    id : r.id,
                    arraytablas :  [arrayTablas] ,
                    arrayCampos : [arrayCampos]
                };
                let idarea = r.id;
                var mascara;
                Ext.Ajax.request({
                    url: '/logistica/activos_fijos/recuperaciones/index.php/listadomodificados/getModificados',
                    method: 'POST',
                    params: params,
                    callback: function (o, s, r) {
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        if (resp.datos.length > 0) {
                            for (let i = 0; i < campos.length; i++) {
                                if (resp.datos.includes(campos[i].data.identificador) ) {
                                    campos[i].data.color = 1;
                                }
                                
                            }
                            _this.gridCampos.getView().refresh();
                        } 
                        _this.mascara.hide(); 
                    }
                });
            },
            selectionchange: function (t) {
                _this.mascara = new Ext.LoadMask(Ext.getBody(), {
                    msg: 'Señalando campos modificados. Por favor espere...'
                });
                _this.mascara.show();
                var campos = _this.gridCampos.getStore().getRange();
                for (let i = 0; i < campos.length; i++) {
                        campos[i].data.color = 0;
                }
                _this.gridCampos.getView().refresh();
            }

        });
        listaAreas.add(checkAreas);
        listaAreas.add({
            header: _this.idioma.gcArea,
            width: 250,
            dataIndex: 'deposito',
            autoExpand: true,
            default: true
        });

        var clsAreas = LOG.util.UIManager.proccessColumns(listaAreas);
        var cmAreas = new Ext.grid.ColumnModel(clsAreas.columns);
        var smAreas = checkAreas;
        var stAreas = new Ext.data.Store({
            url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'iddeposito'
                    },
                    {
                        name: 'deposito'
                    }
                ]
            })
        });

        this.gridAreas = LOG.util.UIManager.initGrid(cmAreas, stAreas, smAreas, {
            style: '-moz-border-radius:5px',
            height: 355,
            expanded: clsAreas.expanded
        });

        this.fsSelecAreas = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecAreas,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            height: 421,
            items: [_this.gridAreas]
        });

        this.checkCampos = new Ext.form.Checkbox({
            boxLabel:_this.idioma.cgCheck
        });

        this.gridCampos = new LOG.aft.gridCampos({idioma: _this.idioma});

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2
        });
        this.clsCampo = LOG.util.UIManager.initColumnForm({ //columnForm Campo
            columnas: 2
        });
        this.clsCampo.addComponent(this.gridCampos);
        this.clsCampo.addComponent(this.checkCampos);
        this.clsCampo.getColumn(0).columnWidth = 0.8;
        this.clsCampo.getColumn(1).columnWidth = 0.2;
        this.fsSelecCampo = new Ext.form.FieldSet({ //fieldset Seleccionar Documento
            title: _this.idioma.fsSelecCampos,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            //autoHeight: true,
            height: 518,
            items: [_this.clsCampo]
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsSelecCampo);
        this.clsGeneral.addComponent(this.fsSelecAreas);
        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';
        /*this.clsSur = LOG.util.UIManager.initPanel({ //columnForm General
            region: 'south',
            layout: 'fit',
            collapsed: true,
            bodyBorder: false,
            collapseMode: 'mini',
            collapCollapsesible: true,
            hideTool: true,
            border: false,
            split: true,
            height: 300
        });*/
        this.fpCentral = LOG.util.UIManager.initPanel({ //formulario General
            id: 'idFormActivoOperacion',
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/

        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            this.fpCentral/*, _this.clsSur*/
        ];


        LOG.aft.listadomodificados.view.superclass.constructor.call(this, config);
    },
    getReporte: function () {
        var _this = this;
        var areas = _this.gridAreas.getSelectionModel().getSelections();
        var arrayAreas = "";
        var campos = _this.gridCampos.getSelectionModel().getSelections();
        var arrayTablas = Array();
        var arrayCampos = Array();

        if (areas.length > 0) {
            for (var i = 0; i < areas.length - 1; i++) {
                arrayAreas += areas[i].data.iddeposito + ",";
            }
            arrayAreas += areas[areas.length - 1].data.iddeposito;
        } else {
            mostrarMensaje(3, _this.idioma.msgSelectAreas);
            return;
        }

        if (campos.length > 0) {
            for (var j = 0; j < campos.length; j++) {
                arrayCampos.push(campos[j].data.identificador);
                arrayTablas.push(campos[j].data.nombretabla);

            }

        } else {
            mostrarMensaje(3, _this.idioma.msgSelectCampo);
            return;
        }

        /*
         * Variables globales para la dualidad de moneda
         * VARIABLES                    CONCEPTOS
         * alternativa                  True o False si existe dualidad
         * monedacontable               idmonedacontable
         * nommonedacontable            Nombre moneda contable
         * monedaalternativa            idmonedaalternativa
         * nommonedaalternativa         Nombre moneda alternativa
         * */
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: {
                        fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                        fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                        arrayidestructura: "{" + arrayAreas + "}",
                        and: (_this.checkCampos.checked)? 1 : 2,
                        idEntiadPadre:idEntiadPadre,
                        arrayCampos: (arrayCampos) ? arrayCampos.join(","): null,
                        arrayTablas: (arrayTablas) ? arrayTablas.join(","): null
                    },
                    dirMaskReports: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosPorOperacion_2_1',
                    dirReport: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosPorOperacion_2',
                    detailFirma: {}
                }
            ]
        }).view();
    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    }
});

LOG.aft.gridCampos = Ext.extend(Ext.grid.GridPanel, {

    constructor: function (config) {
        var _this = this;
        config = Ext.apply(_this, config);

        /***** obtener los campos para las columnas****/
        this.plugins = new Array();
        for (var i = 0; i < arrCampos.length; i++) {
            _this.attatchPlugin(arrCampos[i]);
        }
        this.campos = LOG.aft.RegOperativo.Campos;
        for (var i = 0; i < _this.plugins.length; i++) {//Inicializar los plugin
            _this.plugins[i].init(_this)
        }
        this.camposIndicador = _this.campos;
        this.propiedadesIndicador = {};
        for (var cmp  in _this.camposIndicador) {//guardar en la variable toda la conf de los campos
            var objeto = _this.camposIndicador[cmp];
            _this.propiedadesIndicador[objeto['dataIndex']] = objeto['header'];
        }
        var arrayData = Array();
        for (var cmp  in _this.camposIndicador) {//crear los record para el grid
            var objeto = _this.camposIndicador[cmp];
            var nombreT = "";
            if (objeto['name'] != 'nroserie') {
             if (objeto['nameplugin'] == 'Datos transporte') {
                nombreT = 'dat_movregnumericoactivotransp';
            } else if (objeto['nameplugin'] == 'Datos generales'){
                nombreT = 'dat_movregnumericoactivo';
            }
            // if (objeto['xtype'] != "datefield" && objeto['xtype'] != "combobox") {
                var ident = '';
                if(objeto['name'] == 'responsable')
                {
                    ident = 'idresponsable';
                }else if (objeto['name'] == 'ubicacion'){
                    ident = 'idubicacion';
                }else {
                    ident = (objeto['valorEnviar'])? objeto['valorEnviar']: objeto['name'];
                }
                if(alternativa) {
                    var deno = objeto['header'];
                    if(objeto.contable)
                        deno = objeto['header']+ ' ' + nommonedacontable;
                    else if(objeto.dataIndex.indexOf('alternativo') != -1)
                        deno = objeto['header']+ ' ' + nommonedaalternativa;
                    arrayData.push({
                        identificador: ident,
                        denominacion: deno,
                        nombretabla: nombreT
                    });
                } else if(objeto.dataIndex.indexOf('alternativo') == -1) {
                    arrayData.push({
                        identificador: ident,
                        denominacion: objeto['header'],
                        nombretabla: nombreT
                    });
                }

            // }
        }
        }

        this.sm = new Ext.grid.CheckboxSelectionModel({//Grid con check
            singleSelect: false
        });
        this.cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({
            header: 'N\xBA.',
            width: 30
        }), _this.sm, {
            width: 430,
            header: _this.idioma.cgCampo,
            dataIndex: 'denominacion',
             renderer: function (v, p, record) {
                if (record.data.color == 1) {
                    return '<span style="color: green">' + v + '</span>';
                }
                return v;
             }

        }
        ]);

        this.store = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                //id: "identificador"
            }, [
                {
                    name: 'identificador'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'nombretabla'
                }
            ])
        });
        this.store.loadData(arrayData);//El store será estático

        this.textBusqueda = new LOG.util.Prototipos.inputTexto({
            emptyText:_this.idioma.txtBusquedaSimple
        });
        this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
            handler:function(){
                _this.store.filter("denominacion", _this.textBusqueda.getValue());
            }
        });
        this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            handler:function(){
                _this.textBusqueda.setValue("");
                _this.store.filter("denominacion", "");
            }
        });
        this.tbar = [this.textBusqueda, '-', this.btnBuscar, '-', this.btnLimpiar];


        LOG.aft.gridCampos.superclass.constructor.call(this, config);

    },
    width: '100%',
    height: 450,
    attatchPlugin: function (plugin) {
        this.plugins.push(plugin);
    }
});