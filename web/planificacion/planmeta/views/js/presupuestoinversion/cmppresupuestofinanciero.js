/**
 * Created by Ariel on 23/04/2015.
 */
Utilidades.Cmp.Cmppresupuestofinanciero = function(opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.idinversion = opciones.idinverion;
    this.usdposteriores = [];
    this.mpposteriores = [];
    this.arraydesglose = [];
    this.checkResumenCF = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumenCF',
        checked: true,
        name: 'checkResumen',
        handler: function(este, checked) {
            if (checked) {
                _this.ConfigurarColumnas(1);
            } else {
                _this.ConfigurarColumnas(0);
            }
        }
    });

    this.checkResumenQF = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumenQF',
        checked: true,
        name: 'checkResumen',
        handler: function(este, checked) {
            if (checked) {
                _this.ConfigurarColumnasQF(1);
            } else {
                _this.ConfigurarColumnasQF(0);
            }
        }
    });

    this.checkResumenContado = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumenCF',
        checked: true,
        name: 'checkResumen',
        handler: function(este, checked) {
            if (checked) {
                _this.ConfigurarColumnasContado(1);
            } else {
                _this.ConfigurarColumnasContado(0);
            }
        }
    });


    _this.cmPresupuesofinanciero = new Ext.grid.ColumnModel([
        {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
        {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
        {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
    ]);

    _this.cmPresupuesofinanciero.headers = [
        [{header: 'Acreedores', rowspan: 4},
            {header: 'Presupuesto', rowspan: 3, colspan: 2}],
        [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
        [{align: 'left', header: 'Total ejecutado', colspan: 2},
            {align: 'left', header: 'Estimado', colspan: 2},
            {align: 'left', header: 'Plan', colspan: 2},
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
        ],
        [{align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'}]


    ];
//creando el repositorio de datos
    this.stPresupuesofinanciero = new Ext.data.Store({
        url: 'cargarFinanciamientoPLanInversion',
        reader: new Ext.data.JsonReader(
                {
                    id: 'idtipofinanciamiento',
                    totalProperty: 'total',
                    root: "data"
                },
        [{name: 'idtipofinanciamiento'},
            {name: 'comosefinanc'},
            //
            {name: 'sumapresp_mp'},
            {name: 'sumapresp_usd'},
            //
            {name: 'ejecutado_mp1'},
            {name: 'ejecutado_usd1'},
            {name: 'estimado_mp1'},
            {name: 'estimado_usd1'},
            {name: 'plan_mp1'},
            {name: 'plan_usd1'},
            {name: 'proyec_mp1'},
            {name: 'proyec_usd1'},
            //
            {name: 'ejecutado_mp2'},
            {name: 'ejecutado_usd2'},
            {name: 'estimado_mp2'},
            {name: 'estimado_usd2'},
            {name: 'plan_mp2'},
            {name: 'plan_usd2'},
            {name: 'proyec_mp2'},
            {name: 'proyec_usd2'},
            //
            {name: 'ejecutado_mp3'},
            {name: 'ejecutado_usd3'},
            {name: 'estimado_mp3'},
            {name: 'estimado_usd3'},
            {name: 'plan_mp3'},
            {name: 'plan_usd3'},
            {name: 'proyec_mp3'},
            {name: 'proyec_usd3'},
            //
            {name: 'ejecutado_mp4'},
            {name: 'ejecutado_usd4'},
            {name: 'estimado_mp4'},
            {name: 'estimado_usd4'},
            {name: 'plan_mp4'},
            {name: 'plan_usd4'},
            {name: 'proyec_mp4'},
            {name: 'proyec_usd4'},
            //
            {name: 'annospost_mp'},
            {name: 'annospost_usd'},
            //
            {name: 'gracia'},
            {name: 'plazoamortizacion'},
            {name: 'porcientointeres'},
            {name: 'presupmpcontado'},
            {name: 'presupusdcontado'},
            {name: 'idinversion'},
            {name: 'idmonedaentidad'},
            {name: 'idmonedaentidad_mp'},
            {name: 'idmonedaentidad_usd'}]),
        listeners: {
            beforeload: function(st) {
                _this.BarraProgreso.show('Cargando financiamiento...');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.idinversion = _this.idinversion;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
            },
            load: function(st) {
                _this.cargarStoreContAcred(st); //nuevo aqui
                _this.BarraProgreso.hide();
            }
        }
    });

    this.stcbpaginado = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [40, '40'],
            [80, '80'],
            [100, '100'],
            [200, '200'],
            [500, '500'],
            [1000, '1000']
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    this.cbpaginado = new Ext.form.ComboBox({
        value: 80,
        store: _this.stcbpaginado,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                _this.ptGridpresupuestofinanciero.pageSize = record.data.idnumpag;
                _this.ptGridpresupuestofinanciero.doLoad(_this.ptGridpresupuestofinanciero.cursor);
            }
        }
    });

    this.btnguardar = new Ext.Button({
        id: 'btnguardar',
        text: 'Guardar',
        tooltip: 'Guardar financiamiento',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn',
        disabled: true,
        handler: function() {
            _this.BarraProgreso.show('Guardando los datos...');
            var datos = new Array();
            _this.stPresupuesofinanciero.getModifiedRecords().forEach(function(record) {
                datos.push(record.data)
            })
            Ext.Ajax.request({
                url: "guardarDatosFinanciamiento",
                params: {
                    datos: Ext.encode(datos),
                    ejercicio: opciones.ejercicio.ejercicio,
                    identidad: opciones.identidad
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    _this.stPresupuesofinanciero.rejectChanges();
                    _this.stCredito.rejectChanges();
                    _this.stPresupuesofinanciero.reload();
                }

            });
        }
    });



    this.gpPresupuesofinanciero = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        split: true,
        region: 'center',
        autoScroll: true,
        stripeRows: true,
        store: _this.stPresupuesofinanciero,
        viewConfig: {
            getRowClass: function(record, index) {
                if ((_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) || (_this.arraydesglose[0] > parseInt(record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(record.data.sumapresp_usd))) {
                    return  'superior';
                }
                else {
                    return '';
                }

            }
        },
        //sm:smMigracion,
        height: 250,
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        listeners: {
            click: function() {

            },
            focus: function() {

            },
            afteredit: function(obj) {
                var datos = [];
                _this.stPresupuesofinanciero.getModifiedRecords().forEach(function(record) {
                    datos.push(record.data)
                })

                if (datos.length != 0)
                    _this.btnguardar.enable();

                // if ((_this.usdposteriores[obj.row] < 0 || _this.mpposteriores[obj.row] < 0) || (_this.arraydesglose[0] > parseInt(obj.record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(obj.record.data.sumapresp_usd))) {
                //  _this.btnguardar.disable();
                //}
                // else {
                _this.btnguardar.enable();
                // }
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmPresupuesofinanciero,
        tbar: [_this.btnguardar, '->', _this.checkResumenCF],
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginado.getValue(),
            id: 'presupuestoF',
            store: _this.stPresupuesofinanciero,
            displayInfo: true,
            items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
        })
                //[_this.ptGridpresupuestofinanciero, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
    });
    this.ptGridpresupuestofinanciero = new Ext.PagingToolbar({
        pageSize: _this.cbpaginado.getValue(),
        store: _this.stPresupuesofinanciero,
        width: 400,
        displayInfo: true
    });

    //**********************************************

    this.btnguardarcredito = new Ext.Button({
        id: 'btnguardarcredito',
        text: 'Guardar',
        tooltip: 'Guardar financiamiento',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn',
        disabled: true,
        handler: function() {
            _this.BarraProgreso.show('Guardando los datos...');
            var datos = new Array();
            _this.stCredito.getModifiedRecords().forEach(function(record) {
                datos.push(record.data)
            })
            Ext.Ajax.request({
                url: "guardarDatosAlContado",
                params: {
                    datos: Ext.encode(datos),
                    identidad: opciones.identidad,
                    ejercicio: opciones.ejercicio.ejercicio
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    //Ext.getCmp('btnguardar').disable();
                    /* _this.stCredito.reload({
                     params: {
                     idinversion: _this.idinversion,
                     idejercicio: opciones.ejercicio.idejercicio,
                     aaejercicio: opciones.ejercicio.ejercicio - 2,
                     aejercicio: opciones.ejercicio.ejercicio - 1,
                     pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                     identidad: opciones.identidad,
                     limit: _this.cbpaginado.getValue(),
                     start: 0
                     }});*/
                    // _this.stCredito.rejectChanges();

                    _this.stPresupuesofinanciero.reload();
                }

            });
        }
    });

    _this.cmCredito = new Ext.grid.ColumnModel([
        {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
        {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
        {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
    ]);

    _this.cmCredito.headers = [
        [{header: 'Acreedores', rowspan: 4},
            {header: 'Presupuesto', rowspan: 3, colspan: 2}],
        [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
        [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
            {align: 'left', header: 'Estimado', colspan: 2},
            {align: 'left', header: 'Plan', colspan: 2},
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
        ],
        [{align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'}]


    ];

//creando el repositorio de datos

    this.stCredito = new Ext.data.Store({
        url: 'cargarFinanciamientoContado',
        reader: new Ext.data.JsonReader(
                {
                    id: 'idgridcontado',
                    totalProperty: 'total',
                    root: "data"
                },
        [{name: 'idgridcontado'},
            {name: 'idinversion'},
            {name: 'comosefinanc'},
            //
            {name: 'sumapresp_mp'},
            {name: 'sumapresp_usd'},
            //
            {name: 'ejecutado_mp1'},
            {name: 'ejecutado_usd1'},
            {name: 'estimado_mp1'},
            {name: 'estimado_usd1'},
            {name: 'plan_mp1'},
            {name: 'plan_usd1'},
            {name: 'proyec_mp1'},
            {name: 'proyec_usd1'},
            //
            {name: 'ejecutado_mp2'},
            {name: 'ejecutado_usd2'},
            {name: 'estimado_mp2'},
            {name: 'estimado_usd2'},
            {name: 'plan_mp2'},
            {name: 'plan_usd2'},
            {name: 'proyec_mp2'},
            {name: 'proyec_usd2'},
            //
            {name: 'ejecutado_mp3'},
            {name: 'ejecutado_usd3'},
            {name: 'estimado_mp3'},
            {name: 'estimado_usd3'},
            {name: 'plan_mp3'},
            {name: 'plan_usd3'},
            {name: 'proyec_mp3'},
            {name: 'proyec_usd3'},
            //
            {name: 'ejecutado_mp4'},
            {name: 'ejecutado_usd4'},
            {name: 'estimado_mp4'},
            {name: 'estimado_usd4'},
            {name: 'plan_mp4'},
            {name: 'plan_usd4'},
            {name: 'proyec_mp4'},
            {name: 'proyec_usd4'},
            //
            {name: 'annospost_mp'},
            {name: 'annospost_usd'},
            //
            {name: 'gracia'},
            {name: 'plazoamortizacion'},
            {name: 'porcientointeres'},
            {name: 'presupmpcontado'},
            {name: 'presupusdcontado'},
            {name: 'idmonedaentidad'},
            {name: 'idmonedaentidad_mp'},
            {name: 'idmonedaentidad_usd'}]),
        listeners: {
            beforeload: function(st) {
                _this.BarraProgreso.show('Cargando financiamiento...');
                /*st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                 st.baseParams.identidad = opciones.identidad;
                 st.baseParams.idinversion = _this.idinversion;
                 st.baseParams.limit = _this.cbpaginado.getValue();
                 st.baseParams.start = 0;*/
            },
            load: function(st) {
                // _this.cargarStoreContAcred(_this.stPresupuesofinanciero);// se debe quitar de aqui yanila
                _this.BarraProgreso.hide();
            }
        }
    });


    /*this.stCredito = new Ext.data.SimpleStore({
     fields: [{name: 'idtipofinanciamiento'},
     {name: 'comosefinanc'},
     //
     {name: 'sumapresp_mp'},
     {name: 'sumapresp_usd'},
     //
     {name: 'ejecutado_mp1'},
     {name: 'ejecutado_usd1'},
     {name: 'estimado_mp1'},
     {name: 'estimado_usd1'},
     {name: 'plan_mp1'},
     {name: 'plan_usd1'},
     {name: 'proyec_mp1'},
     {name: 'proyec_usd1'},
     //
     {name: 'ejecutado_mp2'},
     {name: 'ejecutado_usd2'},
     {name: 'estimado_mp2'},
     {name: 'estimado_usd2'},
     {name: 'plan_mp2'},
     {name: 'plan_usd2'},
     {name: 'proyec_mp2'},
     {name: 'proyec_usd2'},
     //
     {name: 'ejecutado_mp3'},
     {name: 'ejecutado_usd3'},
     {name: 'estimado_mp3'},
     {name: 'estimado_usd3'},
     {name: 'plan_mp3'},
     {name: 'plan_usd3'},
     {name: 'proyec_mp3'},
     {name: 'proyec_usd3'},
     //
     {name: 'ejecutado_mp4'},
     {name: 'ejecutado_usd4'},
     {name: 'estimado_mp4'},
     {name: 'estimado_usd4'},
     {name: 'plan_mp4'},
     {name: 'plan_usd4'},
     {name: 'proyec_mp4'},
     {name: 'proyec_usd4'},
     //
     {name: 'annospost_mp'},
     {name: 'annospost_usd'},
     //
     {name: 'gracia'},
     {name: 'plazoamortizacion'},
     {name: 'porcientointeres'},
     {name: 'presupmpcontado'},
     {name: 'presupusdcontado'}]
     });
     //_this.stCredito.loadData(datos2);*/

    this.stcbpaginadoCred = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [40, '40'],
            [80, '80'],
            [100, '100'],
            [200, '200'],
            [500, '500'],
            [1000, '1000']
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    this.cbpaginadoCred = new Ext.form.ComboBox({
        value: 80,
        store: _this.stcbpaginadoCred,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                _this.ptGridCredito.pageSize = record.data.idnumpag;
                _this.ptGridCredito.doLoad(_this.ptGridCredito.cursor);
            }
        }
    });



    this.gpCredito = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandircredito',
        autoExpandMin: 165,
        split: true,
        region: 'north',
        autoScroll: true,
        stripeRows: true,
        store: _this.stCredito,
        height: 200,
        viewConfig: {
            getRowClass: function(record, index) {
                if ((_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) || (_this.arraydesglose[0] > parseInt(record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(record.data.sumapresp_usd))) {
                    return  'superior';
                }
                else {
                    return '';
                }
            }
        },
        //sm:smMigracion,
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        listeners: {
            click: function() {

            },
            focus: function() {

            },
            afteredit: function(obj) {
                var datos = [];
                _this.stCredito.getModifiedRecords().forEach(function(record) {
                    datos.push(record.data)
                })

                if (datos.length != 0)
                    Ext.getCmp('btnguardarcredito').enable();

                /*  if ((_this.usdposteriores[obj.row] < 0 || _this.mpposteriores[obj.row] < 0) || (_this.arraydesglose[0] > parseInt(obj.record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(obj.record.data.sumapresp_usd))) {
                 Ext.getCmp('btnguardarcredito').disable();
                 }
                 else {*/
                Ext.getCmp('btnguardarcredito').enable();
                // }
            },
            beforeedit: function(e) {
                /* if (e.record.data.depende == 0 || e.record.data.origen != 7){
                 //e.grid.store.rejectChanges();
                 e.cancel = true;
                 }*/
                if (e.row == _this.stCredito.getCount() - 1) {
                    e.cancel = true;
                }
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmCredito,
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginadoCred.getValue(),
            id: 'credito',
            store: _this.stPresupuesofinanciero, //aqui se pone el store de los acreedores pq siempre se carga abjao para hacer la suma total y mandarlo al stCredito para que se cargue
            displayInfo: true,
            items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginadoCred]
        })
                //[_this.ptGridCredito, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginadoCred]
    });
    this.ptGridCredito = new Ext.PagingToolbar({
        pageSize: _this.cbpaginadoCred.getValue(),
        store: _this.stCredito,
        width: 400,
        displayInfo: true
    });

    //tabpanel: Quien financia

    this.btnguardarQuienfinancia = new Ext.Button({
        id: 'btnguardarQuienfinancia',
        text: 'Guardar',
        tooltip: 'Guardar financiamiento',
        icon: perfil.dirImg + 'guardar.png',
        iconCls: 'btn',
        disabled: true,
        handler: function() {
            _this.BarraProgreso.show('Guardando los datos...');
            var datos = new Array();
            _this.stQuienfinancia.getModifiedRecords().forEach(function(record) {
                datos.push(record.data)
            })
            Ext.Ajax.request({
                url: "guardarDatosQuienFinancia",
                params: {
                    datos: Ext.encode(datos),
                    ejercicio: opciones.ejercicio.ejercicio,
                    identidad: opciones.identidad
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    _this.stQuienfinancia.rejectChanges();
                    _this.stQuienfinancia.reload({
                        params: {
                            idinversion: _this.idinversion,
                            idejercicio: opciones.ejercicio.idejercicio,
                            aaejercicio: opciones.ejercicio.ejercicio - 2,
                            aejercicio: opciones.ejercicio.ejercicio - 1,
                            pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                            identidad: opciones.identidad,
                            limit: _this.cbpaginado.getValue(),
                            start: 0
                        }});
                }

            });
        }
    });

    _this.cmQuienfinancia = new Ext.grid.ColumnModel([
        {width: 300, dataIndex: 'quienfinac', align: 'left', id: 'expandir'},
        {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros',
            }), renderer: valorCero, resizable: false},
        {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
        {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
    ]);

    _this.cmQuienfinancia.headers = [
        [{header: 'Quién financia', rowspan: 4},
            {header: 'Presupuesto', rowspan: 3, colspan: 2}],
        [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
        [{align: 'left', header: 'Total ejecutado', colspan: 2},
            {align: 'left', header: 'Estimado', colspan: 2},
            {align: 'left', header: 'Plan', colspan: 2},
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
        ],
        [{align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'}]


    ];

//creando el repositorio de datos
    this.stQuienfinancia = new Ext.data.Store({
        url: 'cargarFinancistas',
        reader: new Ext.data.JsonReader(
                {
                    id: 'idfinancista',
                    totalProperty: 'total',
                    root: "data"
                },
        [{name: 'idfinancista'},
            {name: 'quienfinac'},
            //
            {name: 'sumapresp_mp'},
            {name: 'sumapresp_usd'},
            //
            {name: 'ejecutado_mp1'},
            {name: 'ejecutado_usd1'},
            {name: 'estimado_mp1'},
            {name: 'estimado_usd1'},
            {name: 'plan_mp1'},
            {name: 'plan_usd1'},
            {name: 'proyec_mp1'},
            {name: 'proyec_usd1'},
            //
            {name: 'ejecutado_mp2'},
            {name: 'ejecutado_usd2'},
            {name: 'estimado_mp2'},
            {name: 'estimado_usd2'},
            {name: 'plan_mp2'},
            {name: 'plan_usd2'},
            {name: 'proyec_mp2'},
            {name: 'proyec_usd2'},
            //
            {name: 'ejecutado_mp3'},
            {name: 'ejecutado_usd3'},
            {name: 'estimado_mp3'},
            {name: 'estimado_usd3'},
            {name: 'plan_mp3'},
            {name: 'plan_usd3'},
            {name: 'proyec_mp3'},
            {name: 'proyec_usd3'},
            //
            {name: 'ejecutado_mp4'},
            {name: 'ejecutado_usd4'},
            {name: 'estimado_mp4'},
            {name: 'estimado_usd4'},
            {name: 'plan_mp4'},
            {name: 'plan_usd4'},
            {name: 'proyec_mp4'},
            {name: 'proyec_usd4'},
            //
            {name: 'annospost_mp'},
            {name: 'annospost_usd'},
            //
            {name: 'gracia'},
            {name: 'plazoamortizacion'},
            {name: 'porcientointeres'},
            {name: 'presupmpcontado'},
            {name: 'presupusdcontado'},
            {name: 'idinversion'},
            {name: 'idmonedaentidad'},
            {name: 'idmonedaentidad_mp'},
            {name: 'idmonedaentidad_usd'}]),
        listeners: {
            beforeload: function(st) {
                _this.BarraProgreso.show('Cargando financiamiento...');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.idinversion = _this.idinversion;
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
            },
            load: function(st) {
                //_this.cargarStoreContAcred(st);
                _this.BarraProgreso.hide();
            }
        }
    });

    this.stcbpaginadoQuienfinancia = new Ext.data.SimpleStore({
        fields: ['idnumpag', 'dennumpag'],
        data: [
            [10, '10'],
            [20, '20'],
            [40, '40'],
            [80, '80'],
            [100, '100'],
            [200, '200'],
            [500, '500'],
            [1000, '1000']
        ]
    });
    //combo del modo donde muestro la cantidad de elementos por paginas del grid
    this.cbpaginadoQuienfinancia = new Ext.form.ComboBox({
        value: 80,
        store: _this.stcbpaginadoQuienfinancia,
        displayField: 'dennumpag',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        hiddenName: 'idnumpag',
        valueField: 'idnumpag',
        width: 50,
        emptyText: 'Seleccionar',
        listeners: {
            select: function(cb, record, index) {
                _this.ptGridQuienfinancia.pageSize = record.data.idnumpag;
                _this.ptGridQuienfinancia.doLoad(_this.ptGridQuienfinancia.cursor);
            }
        }
    });



    this.gpQuienfinancia = new Ext.grid.EditorGridPanel({
        title: "Quién financia",
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandircredito',
        autoExpandMin: 165,
        split: true,
        region: 'center',
        autoScroll: true,
        stripeRows: true,
        store: _this.stQuienfinancia,
        viewConfig: {
            getRowClass: function(record, index) {
                if ((_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) || (_this.arraydesglose[0] > parseInt(record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(record.data.sumapresp_usd))) {
                    Ext.getCmp('btnguardarQuienfinancia').disable();
                    return  'superior';

                }
                else {
                    Ext.getCmp('btnguardarQuienfinancia').enable();
                    return '';
                }

            }
        },
        height: 190,
        //sm:smMigracion,
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        listeners: {
            click: function() {

            },
            focus: function() {

            },
            afteredit: function(obj) {
                var datos = [];
                _this.stQuienfinancia.getModifiedRecords().forEach(function(record) {
                    datos.push(record.data)
                })
                if (datos.length != 0)
                    Ext.getCmp('btnguardarQuienfinancia').enable();

                if ((_this.usdposteriores[obj.row] < 0 || _this.mpposteriores[obj.row] < 0) || (_this.arraydesglose[0] > parseInt(obj.record.data.sumapresp_mp) || _this.arraydesglose[1] > parseInt(obj.record.data.sumapresp_usd))) {
                    Ext.getCmp('btnguardarQuienfinancia').disable();
                }
                else {
                    Ext.getCmp('btnguardarQuienfinancia').enable();
                }
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmQuienfinancia,
        tbar: [_this.btnguardarQuienfinancia, '->', _this.checkResumenQF],
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginadoQuienfinancia.getValue(),
            id: 'quienfinancia',
            store: _this.stQuienfinancia,
            displayInfo: true,
            items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginadoQuienfinancia]
        })
                //[_this.ptGridQuienfinancia, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginadoQuienfinancia]
    });
    this.ptGridQuienfinancia = new Ext.PagingToolbar({
        pageSize: _this.cbpaginadoQuienfinancia.getValue(),
        store: _this.stQuienfinancia,
        width: 400,
        displayInfo: true
    });
    this.pPresupuesofinanciero = new Ext.Panel({
        title: 'Como se financia',
        layout: 'border',
        //region: 'center',
        border: false,
        frame: true,
        height: 450,
        tbar: [_this.btnguardarcredito, '->', _this.checkResumenContado],
        items: [_this.gpCredito, _this.gpPresupuesofinanciero]
    });

    this.tpFinanciero = new Ext.TabPanel({
        activeTab: 0,
        border: false,
        height: 450,
        items: [_this.pPresupuesofinanciero, _this.gpQuienfinancia]
    });

    this.pContenedordeTabPanel = new Ext.Panel({
        height: 450,
        frame: true,
        region: 'center',
        layout: 'fit',
        items: [_this.tpFinanciero]
    });


    this.Inicializar = function(financiero) {
        /*_this.winpresupuestofinanciero.setTitle('Financiamiento de la inversi&oacute;n con c&oacute;digo: <i>' + financiero.data.codigo + '</i> y denominaci&oacute;n: <i>' + financiero.data.denominacion + '</i>');
         _this.stQuienfinancia.reload({
         params: {
         idinversion: financiero.data.idinversion,
         idejercicio: opciones.ejercicio.idejercicio,
         aaejercicio: opciones.ejercicio.ejercicio - 2,
         aejercicio: opciones.ejercicio.ejercicio - 1,
         pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
         identidad: opciones.identidad,
         limit: _this.cbpaginado.getValue(),
         start: 0
         }});
         _this.stPresupuesofinanciero.reload({
         params: {
         idinversion: financiero.data.idinversion,
         idejercicio: opciones.ejercicio.idejercicio,
         aaejercicio: opciones.ejercicio.ejercicio - 2,
         aejercicio: opciones.ejercicio.ejercicio - 1,
         pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
         identidad: opciones.identidad,
         limit: _this.cbpaginado.getValue(),
         start: 0
         }});*/


        /*_this.stCredito.reload({    //comentarie estas tres cosas, en el caso de este store, para q se cargue cdo se carge los acreedores (stPresupuesofinanciero)
         params: {
         idinversion: financiero.data.idinversion,
         idejercicio: opciones.ejercicio.idejercicio,
         aaejercicio: opciones.ejercicio.ejercicio - 2,
         aejercicio: opciones.ejercicio.ejercicio - 1,
         pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
         identidad: opciones.identidad,
         limit: _this.cbpaginado.getValue(),
         start: 0
         }});*/
        /* _this.stPresupuesofinanciero.reload({
         params: {
         idinversion: financiero.data.idinversion,
         idejercicio: opciones.ejercicio.idejercicio,
         aaejercicio: opciones.ejercicio.ejercicio - 2,
         aejercicio: opciones.ejercicio.ejercicio - 1,
         pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
         identidad: opciones.identidad,
         limit: _this.cbpaginado.getValue(),
         start: 0
         }});*/
        /*_this.stCredito.reload({
         params: {
         idinversion: financiero.data.idinversion,
         idejercicio: opciones.ejercicio.idejercicio,
         aaejercicio: opciones.ejercicio.ejercicio - 2,
         aejercicio: opciones.ejercicio.ejercicio - 1,
         pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
         identidad: opciones.identidad,
         limit: _this.cbpaginado.getValue(),
         start: 0
         }});*/

        //  _this.winpresupuestofinanciero.show();
        //  _this.ConfigurarColumnasContado(1);
        //_this.ConfigurarColumnasQF(1);
        //  _this.ConfigurarColumnas(1);
        //_this.ConfigurarColumnasQF(1);

    }


    this.ConfigurarColumnas = function(accion) {
        if (accion === 0) {

            this.cmPresupuesofinanciero = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd},
                //
                {width: 100, dataIndex: 'gracia', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 100, dataIndex: 'plazoamortizacion', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 100, dataIndex: 'porcientointeres', align: 'left', summaryType: 'sum', renderer: valorCero}
            ]);

            this.cmPresupuesofinanciero.headers = [
                [{header: 'Acreedores', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 8}, {header: opciones.ejercicio.ejercicio - 1, colspan: 8},
                    {header: opciones.ejercicio.ejercicio, colspan: 8},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 8},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2},
                    {align: 'center', header: 'Gracia', rowspan: 3},
                    {align: 'center', header: 'Amortización', rowspan: 3},
                    {align: 'center', header: 'Interés', rowspan: 3}],
                [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]
            ];

        } else {

            _this.cmPresupuesofinanciero = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
            ]);

            _this.cmPresupuesofinanciero.headers = [
                [{header: 'Acreedores', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: 'Total ejecutado', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]


            ];
        }

        _this.gpPresupuesofinanciero.reconfigure(_this.stPresupuesofinanciero, _this.cmPresupuesofinanciero);
    }

    this.ConfigurarColumnasQF = function(accion) {
        if (accion == 0) {

            this.cmQuienfinancia = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'quienfinac', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros', }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros', }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false},
            ]);

            this.cmQuienfinancia.headers = [
                [{header: 'Quién financia', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 8}, {header: opciones.ejercicio.ejercicio - 1, colspan: 8}, {header: opciones.ejercicio.ejercicio, colspan: 8}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 8}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]
            ];

        } else {

            _this.cmQuienfinancia = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'quienfinac', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
            ]);

            _this.cmQuienfinancia.headers = [
                [{header: 'Quién financia', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: 'Total ejecutado', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]


            ];
        }

        _this.gpQuienfinancia.reconfigure(_this.stQuienfinancia, _this.cmQuienfinancia);
    }

    this.ConfigurarColumnasContado = function(accion) {
        if (accion == 0) {
            this.cmCredito = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'ejecutado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                //
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd},
                //
                {width: 100, dataIndex: 'gracia', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 100, dataIndex: 'plazoamortizacion', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 100, dataIndex: 'porcientointeres', align: 'left', summaryType: 'sum', renderer: valorCero}
            ]);

            this.cmCredito.headers = [
                [{header: 'Acreedores', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 8}, {header: opciones.ejercicio.ejercicio - 1, colspan: 8},
                    {header: opciones.ejercicio.ejercicio, colspan: 8},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 8},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2},
                    {align: 'center', header: 'Gracia', rowspan: 3},
                    {align: 'center', header: 'Amortización', rowspan: 3},
                    {align: 'center', header: 'Interés', rowspan: 3}],
                [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]
            ];

        } else {

            _this.cmCredito = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'comosefinanc', align: 'left', id: 'expandir'},
                {width: 80, dataIndex: 'sumapresp_mp', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'sumapresp_usd', align: 'left', summaryType: 'sum', renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_mp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'ejecutado_usd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_mp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'estimado_usd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_mp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'plan_usd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_mp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'proyec_usd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    }), renderer: valorCero, resizable: false},
                {width: 80, dataIndex: 'annospost_mp', align: 'left', summaryType: 'sum', renderer: annosPosterioresMp, resizable: false},
                {width: 80, dataIndex: 'annospost_usd', align: 'left', summaryType: 'sum', renderer: annosPosterioresUsd, resizable: false}
            ]);

            _this.cmCredito.headers = [
                [{header: 'Acreedores', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}],
                [{header: opciones.ejercicio.ejercicio - 2, colspan: 2}, {header: opciones.ejercicio.ejercicio - 1, colspan: 2}, {header: opciones.ejercicio.ejercicio, colspan: 2}, {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 2}, {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}],
                [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ],
                [{align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}]


            ];
        }

        _this.gpCredito.reconfigure(_this.stCredito, _this.cmCredito);
    }

    function valorCero(v) {
        if (!v)
            return 0;
        else
            return v;
    }

    this.cargarStoreContAcred = function(store) {
        var arrayrecordsfinan = [];
        arrayrecordsfinan = store.getRange();
        var sumapresp_mp = 0;
        var sumapresp_usd = 0;
        //
        var ejecutado_mp1 = 0;
        var ejecutado_usd1 = 0;
        var estimado_mp1 = 0;
        var estimado_usd1 = 0;
        var plan_mp1 = 0;
        var plan_usd1 = 0;
        var proyec_mp1 = 0;
        var proyec_usd1 = 0;
        //
        var ejecutado_mp2 = 0;
        var ejecutado_usd2 = 0;
        var estimado_mp2 = 0;
        var estimado_usd2 = 0;
        var plan_mp2 = 0;
        var plan_usd2 = 0;
        var proyec_mp2 = 0;
        var proyec_usd2 = 0;
        //
        var ejecutado_mp3 = 0;
        var ejecutado_usd3 = 0;
        var estimado_mp3 = 0;
        var estimado_usd3 = 0;
        var plan_mp3 = 0;
        var plan_usd3 = 0;
        var proyec_mp3 = 0;
        var proyec_usd3 = 0;
        //
        var ejecutado_mp4 = 0;
        var ejecutado_usd4 = 0;
        var estimado_mp4 = 0;
        var estimado_usd4 = 0;
        var plan_mp4 = 0;
        var plan_usd4 = 0;
        var proyec_mp4 = 0;
        var proyec_usd4 = 0;
        //
        var annospost_mp = 0;
        var annospost_usd = 0;
        //
        var gracia = 0;
        var plazoamortizacion = 0;
        var porcientointeres = 0;
        var presupmpcontado = 0;
        var presupusdcontado = 0;


        for (var i = 0; i < arrayrecordsfinan.length; i++) {
            recordsfinan = arrayrecordsfinan[i];
            //arrayfin.push(recordsfinan.data);

            sumapresp_mp += parseInt(parseInt(recordsfinan.data.sumapresp_mp));
            sumapresp_usd += parseInt(recordsfinan.data.sumapresp_usd);
            //
            ejecutado_mp1 += parseInt(recordsfinan.data.ejecutado_mp1);
            ejecutado_usd1 += parseInt(recordsfinan.data.ejecutado_usd1);
            estimado_mp1 += parseInt(recordsfinan.data.estimado_mp1);
            estimado_usd1 += parseInt(recordsfinan.data.estimado_usd1);
            plan_mp1 += parseInt(recordsfinan.data.plan_mp1);
            plan_usd1 += parseInt(recordsfinan.data.plan_usd1);
            proyec_mp1 += parseInt(recordsfinan.data.proyec_mp1);
            proyec_usd1 += parseInt(recordsfinan.data.proyec_usd1);
            //
            ejecutado_mp2 += parseInt(parseInt(recordsfinan.data.ejecutado_mp2));
            ejecutado_usd2 += parseInt(recordsfinan.data.ejecutado_usd2);
            estimado_mp2 += parseInt(recordsfinan.data.estimado_mp2);
            estimado_usd2 += parseInt(recordsfinan.data.estimado_usd2);
            plan_mp2 += parseInt(recordsfinan.data.plan_mp2);
            plan_usd2 += parseInt(recordsfinan.data.plan_usd2);
            proyec_mp2 += parseInt(recordsfinan.data.proyec_mp2);
            proyec_usd2 += parseInt(recordsfinan.data.proyec_usd2);
            //
            ejecutado_mp3 += parseInt(recordsfinan.data.ejecutado_mp3);
            ejecutado_usd3 += parseInt(recordsfinan.data.ejecutado_usd3);
            estimado_mp3 += parseInt(recordsfinan.data.estimado_mp3);
            estimado_usd3 += parseInt(recordsfinan.data.estimado_usd3);
            plan_mp3 += parseInt(recordsfinan.data.plan_mp3);
            plan_usd3 += parseInt(recordsfinan.data.plan_usd3);
            proyec_mp3 += parseInt(recordsfinan.data.proyec_mp3);
            proyec_usd3 += parseInt(recordsfinan.data.proyec_usd3);
            //
            ejecutado_mp4 += parseInt(recordsfinan.data.ejecutado_mp4);
            ejecutado_usd4 += parseInt(recordsfinan.data.ejecutado_usd4);
            estimado_mp4 += parseInt(recordsfinan.data.estimado_mp4);
            estimado_usd4 += parseInt(recordsfinan.data.estimado_usd4);
            plan_mp4 += parseInt(recordsfinan.data.plan_mp4);
            plan_usd4 += parseInt(recordsfinan.data.plan_usd4);
            proyec_mp4 += parseInt(recordsfinan.data.proyec_mp4);
            proyec_usd4 += parseInt(recordsfinan.data.proyec_usd4);
            //
            annospost_mp += parseInt(recordsfinan.data.annospost_mp);
            annospost_usd += parseInt(recordsfinan.data.annospost_usd);
            //
            gracia += parseInt(recordsfinan.data.gracia);
            plazoamortizacion += parseInt(recordsfinan.data.plazoamortizacion);
            porcientointeres += parseInt(recordsfinan.data.porcientointeres);
            presupmpcontado += parseInt(recordsfinan.data.presupmpcontado);
            presupusdcontado += parseInt(recordsfinan.data.presupusdcontado);
        }
        var record = new Ext.data.Record({
            comosefinanc: "Acreedores",
            sumapresp_mp: sumapresp_mp,
            sumapresp_usd: sumapresp_usd,
            //
            ejecutado_mp1: ejecutado_mp1,
            ejecutado_usd1: ejecutado_usd1,
            estimado_mp1: estimado_mp1,
            estimado_usd1: estimado_usd1,
            plan_mp1: plan_mp1,
            plan_usd1: plan_usd1,
            proyec_mp1: proyec_mp1,
            proyec_usd1: proyec_usd1,
            //
            ejecutado_mp2: ejecutado_mp2,
            ejecutado_usd2: ejecutado_usd2,
            estimado_mp2: estimado_mp2,
            estimado_usd2: estimado_usd2,
            plan_mp2: plan_mp2,
            plan_usd2: plan_usd2,
            proyec_mp2: proyec_mp2,
            proyec_usd2: proyec_usd2,
            //
            ejecutado_mp3: ejecutado_mp3,
            ejecutado_usd3: ejecutado_usd3,
            estimado_mp3: estimado_mp3,
            estimado_usd3: estimado_usd3,
            plan_mp3: plan_mp3,
            plan_usd3: plan_usd3,
            proyec_mp3: proyec_mp3,
            proyec_usd3: proyec_usd3,
            //
            ejecutado_mp4: ejecutado_mp4,
            ejecutado_usd4: ejecutado_usd4,
            estimado_mp4: estimado_mp4,
            estimado_usd4: estimado_usd4,
            plan_mp4: plan_mp4,
            plan_usd4: plan_usd4,
            proyec_mp4: proyec_mp4,
            proyec_usd4: proyec_usd4,
            //
            annospost_mp: annospost_mp,
            annospost_usd: annospost_usd,
            //
            gracia: gracia,
            plazoamortizacion: plazoamortizacion,
            porcientointeres: porcientointeres
        });

        var arregloAcreedor = new Array();
        arregloAcreedor.push(record.data);

        _this.stCredito.removeAll();
        _this.stCredito.reload({
            params: {
                idinversion: _this.idinversion,
                idejercicio: opciones.ejercicio.idejercicio,
                aaejercicio: opciones.ejercicio.ejercicio - 2,
                aejercicio: opciones.ejercicio.ejercicio - 1,
                pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                identidad: opciones.identidad,
                datosacreedor: Ext.encode(arregloAcreedor),
                limit: _this.cbpaginado.getValue(),
                start: 0
            }
        });
    };


    function annosPosterioresMp(value, meta, record, rowIndex) {
        _this.mpposteriores[rowIndex] = parseInt(record.data.sumapresp_mp) - (parseInt(record.data['ejecutado_mp1']) + parseInt(record.data['estimado_mp2'])
                + parseInt(record.data['plan_mp3']) + parseInt(record.data['proyec_mp4']));
        sennalardesglose(record);

        if (isNaN(_this.mpposteriores[rowIndex]))
            return 0;
        else
            return _this.usdposteriores[rowIndex];
        // return  Ext.util.Format.usMoney(_this.mpposteriores[rowIndex]);
    }

    function annosPosterioresUsd(value, meta, record, rowIndex) {
        _this.usdposteriores[rowIndex] = parseInt(record.data.sumapresp_usd) - (parseInt(record.data['ejecutado_usd1']) + parseInt(record.data['estimado_usd2'])
                + parseInt(record.data['plan_usd3']) + parseInt(record.data['proyec_usd4']));
        sennalardesglose(record);

        if (isNaN(_this.usdposteriores[rowIndex]))
            return 0;
        else
            return _this.usdposteriores[rowIndex];
        //     return Ext.util.Format.usMoney(_this.usdposteriores[rowIndex]);
    }

    function sennalardesglose(record) {
        var desglose_mp = 0;
        var desglose_usd = 0;

        desglose_mp += parseInt(record.data.ejecutado_mp1);
        desglose_usd += parseInt(record.data.ejecutado_usd1);
        desglose_mp += parseInt(record.data.estimado_mp1);
        desglose_usd += parseInt(record.data.estimado_usd1);
        desglose_mp += parseInt(record.data.plan_mp1);
        desglose_usd += parseInt(record.data.plan_usd1);
        desglose_mp += parseInt(record.data.proyec_mp1);
        desglose_usd += parseInt(record.data.proyec_usd1);
        //
        desglose_mp += parseInt(parseInt(record.data.ejecutado_mp2));
        desglose_usd += parseInt(record.data.ejecutado_usd2);
        desglose_mp += parseInt(record.data.estimado_mp2);
        desglose_usd += parseInt(record.data.estimado_usd2);
        desglose_mp += parseInt(record.data.plan_mp2);
        desglose_usd += parseInt(record.data.plan_usd2);
        desglose_mp += parseInt(record.data.proyec_mp2);
        desglose_usd += parseInt(record.data.proyec_usd2);
        //
        desglose_mp += parseInt(record.data.ejecutado_mp3);
        desglose_usd += parseInt(record.data.ejecutado_usd3);
        desglose_mp += parseInt(record.data.estimado_mp3);
        desglose_usd += parseInt(record.data.estimado_usd3);
        desglose_mp += parseInt(record.data.plan_mp3);
        desglose_usd += parseInt(record.data.plan_usd3);
        desglose_mp += parseInt(record.data.proyec_mp3);
        desglose_usd += parseInt(record.data.proyec_usd3);
        //
        desglose_mp += parseInt(record.data.ejecutado_mp4);
        desglose_usd += parseInt(record.data.ejecutado_usd4);
        desglose_mp += parseInt(record.data.estimado_mp4);
        desglose_usd += parseInt(record.data.estimado_usd4);
        desglose_mp += parseInt(record.data.plan_mp4);
        desglose_usd += parseInt(record.data.plan_usd4);
        desglose_mp += parseInt(record.data.proyec_mp4);
        desglose_usd += parseInt(record.data.proyec_usd4);

        _this.arraydesglose[0] = desglose_mp;
        _this.arraydesglose[1] = desglose_usd;

        return _this.arraydesglose;
    }

}