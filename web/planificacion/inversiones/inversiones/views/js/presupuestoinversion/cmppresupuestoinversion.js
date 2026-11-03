/**
 * Created by Ariel on 23/04/2015.
 */
Utilidades.Cmp.Cmppresupuestoinversion = function (opciones) {
    var _this = this;
    this.usdposteriores = [];
    this.mpposteriores = [];
    this.plan_mp1_global = 0;
    this.plan_mp2_global = 0;
    this.plan_mp3_global = 0;
    this.plan_mp4_global = 0;

    this.plan_mpp1_global = 0;
    this.plan_mpp2_global = 0;
    this.plan_mpp3_global = 0;
    this.plan_mpp4_global = 0;

    this.mpposteriores_planPrep = [];
    this.usdposteriores_planPrep = [];

    this.BarraProgreso = new BarraEstado();
    this.mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });

    this.btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        text: opciones.idioma.btnGuardar,
        tooltip: opciones.idioma.btnGuardar,
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            mostrarMensaje(2, 'No se guardar\xE1n lo datos para los ejercicios Cerrados, plan-proyecci\xF3n de los Aprobados y estimado-plan-proyecci\xF3n de los Ejecutados.', _this.guardardatosPresupuesto);
        }

    });
    this.btnAjustar = new Ext.Button({
        id: 'btnAjustar',
        text: 'Ajustar',
        tooltip: 'Ajustar',
        iconCls: 'ajustar',
        disabled: true,
        handler: function () {
            _this.BarraProgreso.show('Guardando los datos...');
            var datos = [];
            _this.stPresupuesoinversion.getRange().forEach(function (record) {
                datos.push(record.data)
            });
            //console.log(opciones.ejercicio.ejercicio)

            Ext.Ajax.request({
                url: "guardarDatosPresupuestoAjuste",
                params: {
                    datos: Ext.encode(datos),
                    ejercicio: opciones.ejercicio.ejercicio,
                    ejercicios: Ext.encode(opciones.ejercicios),
                    idinversion: opciones.idinversion
                },
                callback: function (options, success, response) {
                    mostrarMensaje(1, "Los datos se han guardado satisfactoriamente.");
                    _this.stPresupuesoinversion.load();
                    _this.stTotales.load();
                    _this.BarraProgreso.hide();
                }
            });
            _this.btnAjustar.disable();
            _this.btnGuardar.disable();
        }

    });

    this.guardardatosPresupuesto = function(btn){
        if(btn == 'ok'){
            _this.BarraProgreso.show('Guardando los datos...');
            var datos = [];
            _this.stPresupuesoinversion.getRange().forEach(function (record) {
                datos.push(record.data)
            });

            Ext.Ajax.request({
                url: "guardarDatosPresupuesto",
                params: {
                    datos: Ext.encode(datos),
                    ejercicio: opciones.ejercicio.ejercicio,
                    ejercicios: Ext.encode(opciones.ejercicios),
                    idinversion: opciones.idinversion
                },
                callback: function (options, success, response) {
                    mostrarMensaje(1, "Los datos se han guardado satisfactoriamente.");
                    _this.stPresupuesoinversion.load();
                    _this.stTotales.load();
                    _this.BarraProgreso.hide();
                }
            });
            _this.btnGuardar.disable();
            _this.btnAjustar.disable();
        }

    };

    this.checkResumen = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: opciones.idioma.checkResumen,
        id: 'checkResumen',
        checked: true,
        name: 'checkResumen',
        handler: function (este, checked) {
            //_this.Resumen();
            if (checked) {
                _this.ConfigurarColumnas(1);
            }
            else {
                _this.ConfigurarColumnas(0);
            }


            // _this.cmPresupuesoinversion.headers[1][0].colspan = 3;
        }
    });


    _this.cmPresupuesoinversion = new Ext.grid.ColumnModel([
        {
            width: 300, 
            dataIndex: 'denominacion', 
            align: 'left', 
            id: 'expandirPre'
        },
        {
            width: 80,
            dataIndex: 'mppresumuesto',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'usdpresumuesto',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
            align: 'left',
            summaryType: 'sum',
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero
        },
        {
            width: 80,
            dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
            align: 'left',
            summaryType: 'sum',
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero
        },
        {
            width: 80,
            dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
            align: 'left',
            summaryType: 'sum',
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero
        },
        {
            width: 80,
            dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
            align: 'left',
            summaryType: 'sum',
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero
        },
        {
            width: 80,
            dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'plan',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'plan',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
            align: 'left',
            summaryType: 'sum',
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
            align: 'left',
            summaryType: 'sum',
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            }),
            renderer: valorCero,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'mpposterior',
            align: 'left',
            summaryType: 'sum',
            renderer: annosPosterioresMp,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'usdposterior',
            align: 'left',
            summaryType: 'sum',
            renderer: annosPosterioresUsd,
            resizable: false
        }
    ]);


    _this.cmPresupuesoinversion.headers = [
        [{header: opciones.idioma.cpmComp, rowspan: 4},
        {header: opciones.idioma.tlPres, rowspan: 3, colspan: 2}],
        [
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')' , colspan: 2},
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2},
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2}, 
            {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'),colspan: 2},
            {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
        ],
        [{align: 'left', header: opciones.idioma.cmejecutadohasta, colspan: 2},
            {align: 'left', header: opciones.idioma.estimado, colspan: 2},
            {align: 'left', header: opciones.idioma.cmplan, colspan: 2},
            {align: 'left', header: opciones.idioma.cmproyecc, colspan: 2}
        ],
        [
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


//creando el repositorio de datos
    this.stPresupuesoinversion = new Ext.data.Store({
        url: 'cargarPresupuestoInversion',
        reader: new Ext.data.JsonReader(
            {
                id: 'idcomponente',
                totalProperty: 'total',
                root: "data",
                plan: 'planPrep'
            },
            [{name: 'idetapa'},
                {name: 'denominacion'},
                {name: 'mppresumuesto'},
                {name: 'usdpresumuesto'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'estimado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'estimado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'plan'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'plan'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'plan'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'plan'},
                {name: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion'},
                {name: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion'},
                {name: 'mp' + (opciones.ejercicio.ejercicio) + 'ejecutado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio) + 'ejecutado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio) + 'estimado'},
                {name: 'usd' + (opciones.ejercicio.ejercicio) + 'estimado'},
                {name: 'mp' + (opciones.ejercicio.ejercicio) + 'plan'},
                {name: 'usd' + (opciones.ejercicio.ejercicio) + 'plan'},
                {name: 'mp' + (opciones.ejercicio.ejercicio) + 'proyeccion'},
                {name: 'usd' + (opciones.ejercicio.ejercicio) + 'proyeccion'},
                {name: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado'},
                {name: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado'},
                {name: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado'},
                {name: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado'},
                {name: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan'},
                {name: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan'},
                {name: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion'},
                {name: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion'},
                {name: 'mpposterior'},
                {name: 'usdposterior'},
                {name: 'valormp'},
                {name: 'valorusd'},
                {name: 'idejercicio'},
                {name: 'constructor'},
                {name: 'ejercicio'}]),
        listeners: {
            beforeload: function (st) {
                _this.BarraProgreso.show(opciones.idioma.lbCargando);
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.idinversion = opciones.idinversion;
                st.baseParams.limit = 20;
                st.baseParams.start = 0;
            },
            load: function () {
                _this.BarraProgreso.hide();
                _this.stTotales.load();
            }
        }
    });


    this.gpPresupuesoinversion = new Ext.grid.EditorGridPanel({
        frame: true,
        region: 'center',
        editable: true,
        master_column_id: 'expandirPre',
        autoExpandMin: 165,
        height: 400,
        split: true,
        autoScroll: true,
        stripeRows: true,
        store: _this.stPresupuesoinversion,
        viewConfig: {
            getRowClass: function (record, index) {
                if (_this.mpposteriores[index] < 0 || _this.usdposteriores[index] < 0) {
                    return 'superior';
                }
                else {
                    return '';
                }
            }
        },
        tbar: [_this.btnGuardar,_this.btnAjustar, '->', _this.checkResumen],
        //sm:smMigracion,
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        listeners: {
            afteredit: function (objeto) {
                _this.btnAjustar.enable();
                if (_this.usdposteriores[objeto.row] < 0 || _this.mpposteriores[objeto.row] < 0) {
                    _this.btnGuardar.disable();
                }
                else {
                    _this.btnGuardar.enable();
                }
                if (objeto.value === "") {
                    objeto.record.data[objeto.field] = 0;
                }
                if (objeto.record.data.constructor === 1) {
                    objeto.cancel = true;
                }
            },
            beforeedit: function (objeto) {
                if (objeto.value === "") {
                    objeto.record.data[objeto.field] = 0;
                }
                if (objeto.record.data.denominacion === 'CONST. Y MONTAJE') {
                    objeto.cancel = true;
                }

                /* var mp = objeto.field.split('mp');
                 var usd = objeto.field.split('usd');
                console.log(objeto.field)
                if (mp.length > 1) {
                    var anno = _this.separarAnno(mp[1]);
                    console.log(anno)
                    var accion = mp[1].split(anno);
                    accion = accion[1];
                }
                if (usd.length > 1) {
                    var anno = _this.separarAnno(usd[1]);
                    var accion = usd[1].split(anno);
                    accion = accion[1];

                }


                var estadoAnno = opciones.ejercicios[anno].nombreestado;


                if (estadoAnno.toLowerCase() == 'cerrado') {
                    objeto.cancel = true;
                }

                if (estadoAnno.toLowerCase() == 'ejecucion' || estadoAnno.toLowerCase() == 'aprobado') {

                    if (accion == 'plan' || accion == 'proyeccion') {
                        objeto.cancel = true;
                    }
                }*/

                /* if (objeto.record.data.constructor === 1) {
                 objeto.cancel = true;
                 }*/
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmPresupuesoinversion,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'presupuest',
            store: _this.stPresupuesoinversion,
            displayInfo: true
        })
        //[_this.ptGridpresupuestoinversion,'->', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
    });


    this.separarAnno = function (text) {
        var ejecutado = text.split('ejecutado');
        var estimado = text.split('estimado');
        var plan = text.split('plan');
        var proyeccion = text.split('proyeccion');

        if (ejecutado.length > 1)
            return ejecutado[0];
        if (estimado.length > 1)
            return estimado[0];
        if (plan.length > 1)
            return plan[0];
        if (proyeccion.length > 1)
            return proyeccion[0];
    };

    this.stTotales = new Ext.data.Store({
        url: 'cargarPresupuestoInversion',
        // autoLoad: true,
        reader: new Ext.data.JsonReader(
            {
                totalProperty: 'total',
                root: 'data'
            },
            [{name: 'idtipofinanciamiento'},
                {name: 'denominacion'},
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
                {name: 'idmonedaentidad_usd'},
                {name: 'ppmp'},
                {name: 'ppusd'},
            ]),
        listeners: {
            beforeload: function (st) {
                //      _this.BarraProgreso.show(opciones.idioma.lbCargando);
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.limit = 20;
                st.baseParams.start = 0;
                st.baseParams.idinversion = opciones.idinversion;
                // _this.stPresupuesoinversion.baseParams.idinversion = inversion.data.idinversion;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseFloat(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.ejercicio = parseFloat(opciones.ejercicio.ejercicio);
            },
            load: function (st) {
                st.removeAll();
                _this.cargarStoreTotales(_this.stPresupuesoinversion);
                //  _this.BarraProgreso.hide();
            }
        }
    });


    this.cmTotales = new Ext.grid.ColumnModel([
        {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandir', resizable: false},
        {
            width: 80,
            dataIndex: 'sumapresp_mp',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'sumapresp_usd',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false
        },
        //
        {
            width: 80,
            dataIndex: 'ejecutado_mp1',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'ejecutado_usd1',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        //                
        {
            width: 80,
            dataIndex: 'estimado_mp2',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'estimado_usd2',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        //               
        {
            width: 80,
            dataIndex: 'plan_mp3',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'plan_usd3',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        //           
        {
            width: 80,
            dataIndex: 'proyec_mp4',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        {
            width: 80,
            dataIndex: 'proyec_usd4',
            align: 'left',
            summaryType: 'sum',
            renderer: valorCero,
            resizable: false,
            editor: new Ext.form.NumberField({
                /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                 maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 regexText: 'Los valores deben ser n\xFAmeros enteros'*/
            })
        },
        //
        {
            width: 80,
            dataIndex: 'annospost_mp',
            align: 'left',
            summaryType: 'sum',
            renderer: annosPosterioresMp_planPrep,
            resizable: false
        },
        {
            width: 80,
            dataIndex: 'annospost_usd',
            align: 'left',
            summaryType: 'sum',
            renderer: annosPosterioresUsd_planPrep,
            resizable: false
        }

    ]);


    this.cmTotales.headers = [
        [
            {header: opciones.idioma.cpmComp, rowspan: 4},
            {header: 'Presupuesto', rowspan: 3, colspan: 2}
        ], [
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2},
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2},
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2},
            {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2},
            {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
        ], [
            {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
            {align: 'left', header: 'Estimado', colspan: 2},
            {align: 'left', header: 'Plan', colspan: 2},
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
        ], [
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
            {align: 'left', header: 'USD'}
        ]
    ];


    this.btn_guardar_plan = new Ext.Button({
        id: 'btn_guardar_plan',
        text: opciones.idioma.btnGuardar,
        tooltip: opciones.idioma.btnGuardar,
        iconCls: 'guardar',
        disabled: true,
        handler: function () {
            var datos = new Array();
            _this.stTotales.getRange().forEach(function (record) {
                datos.push(record.data)
            })
            _this.BarraProgreso.show('Guardando...');
            Ext.Ajax.request({
                url: "guardarDatosPlanPreparacion",
                params: {
                    datos: Ext.encode(datos),
                    idejercicio: opciones.ejercicio.idejercicio,
                    idinversion: opciones.idinversion,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseFloat(opciones.ejercicio.ejercicio) + 1),
                    planPrepMP: _this.gpTotalesPresupuestoinversion.getSelectionModel().getSelected().get('ppmp'),
                    planPrepUSD: _this.gpTotalesPresupuestoinversion.getSelectionModel().getSelected().get('ppusd')

                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    _this.stTotales.removeAll();
                    _this.stPresupuesoinversion.removeAll();
                    _this.stPresupuesoinversion.load();

                    // _this.stTotales.load();
                }
            });
        }
        //disabled: true
    });

    this.sm_TotalesPresupuesto = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function (s, i, r) {
                if (i == 1) {//segunda fila del store, es el plan de Prep quien se edita
                    columns = _this.gpTotalesPresupuestoinversion.getColumnModel();
                    for (i = 0; i < _this.gpTotalesPresupuestoinversion.getColumnModel().getColumnCount(); i++) {
                        if (i >= 3)
                            _this.gpTotalesPresupuestoinversion.getColumnModel().setEditable(i, true);
                    }
                } else {
                    columns = _this.gpTotalesPresupuestoinversion.getColumnModel();
                    for (i = 0; i < _this.gpTotalesPresupuestoinversion.getColumnModel().getColumnCount(); i++) {
                        if (i >= 3)
                            _this.gpTotalesPresupuestoinversion.getColumnModel().setEditable(i, false);
                    }
                }
            }, rowdeselect: function (s, i, r) {
                _this.btn_guardar_plan.disable();
            }
        }
    });

    this.gpTotalesPresupuestoinversion = new Ext.grid.EditorGridPanel({
        title: 'Presupuesto de la inversion totales',
        tbar: [_this.btn_guardar_plan],
        region: 'south',
        border: false,
        height: 250,
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        split: true,
        autoScroll: true,
        stripeRows: true,
        sm: _this.sm_TotalesPresupuesto,
        store: _this.stTotales,
        plugins: [new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/],
        loadMask: {
            msg: 'Cargando...'
        },
        viewConfig: {
            getRowClass: function (record, index) {
                if (_this.mpposteriores_planPrep[index] < 0 || _this.usdposteriores_planPrep[index] < 0) {
                    return 'superior';
                }
                else {
                    return '';
                }
            }
        },
        cm: _this.cmTotales,
        listeners: {
            afteredit: function (objeto) {

                if (_this.mpposteriores_planPrep[objeto.row] < 0 || _this.usdposteriores_planPrep[objeto.row] < 0) {
                    _this.btn_guardar_plan.disable();
                }
                else {
                    _this.btn_guardar_plan.enable();
                }
            },
        }
        /*,
         bbar: new Ext.PagingToolbar({
         pageSize: _this.cbpaginado.getValue(),
         id: 'presupuestoF',
         store: _this.stPresupuesofinanciero,
         displayInfo: true,
         items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
         })*/
        //[_this.ptGridpresupuestofinanciero, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
    });


    /* this.ptGridpresupuestoinversion = new Ext.PagingToolbar({
     pageSize: _this.cbpaginado.getValue(),
     store: _this.stPresupuesoinversion,
     width: 400,
     displayInfo: true
     });*/

    this.pPresupuesoinversion = new Ext.Panel({
        layout: 'fit',
        region: 'center',
        border: false,
        height: 400,
        frame: true,
        items: [_this.gpPresupuesoinversion]
    });

    this.pTotalesPresupuestoinversion = new Ext.Panel({
        title: 'Presupuesto de la inversion totales',
        layout: 'fit',
        region: 'south',
        border: false,
        height: 250,
        frame: true,
        items: [this.gpTotalesPresupuestoinversion]
    });

    this.pGeneralPresupuesoinversion = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        frame: true,
        items: [this.gpPresupuesoinversion, this.gpTotalesPresupuestoinversion]

    });

    this.ConfigurarColumnas = function (accion) {
        if (accion === 0) {
            _this.cmPresupuesoinversion = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandirPre'},
                {
                    width: 80,
                    dataIndex: 'mppresumuesto',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usdpresumuesto',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros',*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mpposterior',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: annosPosterioresMp,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usdposterior',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: annosPosterioresUsd,
                    resizable: false
                }
            ]);
            _this.cmPresupuesoinversion.headers = [
                [
                    {header: 'Componentes', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 8},
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 8},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 8},
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 8},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
                ], [
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
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ], [
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
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}
                ]
            ];

            //---------------------------------------Panel de los totales-------------------------------------------------   


            this.cmTotales = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandir', resizable: false},
                {
                    width: 80,
                    dataIndex: 'sumapresp_mp',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'sumapresp_usd',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                //
                {
                    width: 80,
                    dataIndex: 'ejecutado_mp1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'ejecutado_usd1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_mp1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_usd1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_mp1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'plan_usd1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'proyec_mp1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_usd1',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                //
                {
                    width: 80,
                    dataIndex: 'ejecutado_mp2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'ejecutado_usd2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_mp2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_usd2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_mp2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'plan_usd2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'proyec_mp2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_usd2',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                //
                {
                    width: 80,
                    dataIndex: 'ejecutado_mp3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'ejecutado_usd3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_mp3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_usd3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_mp3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_usd3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_mp3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_usd3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                //
                {
                    width: 80,
                    dataIndex: 'ejecutado_mp4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'ejecutado_usd4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_mp4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'estimado_usd4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_mp4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'plan_usd4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_mp4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                {
                    width: 80,
                    dataIndex: 'proyec_usd4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    })
                },
                //
                {
                    width: 80,
                    dataIndex: 'annospost_mp',
                    align: 'left',
                    summaryType: 'sum', /*renderer: annosPosterioresMp1,*/
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'annospost_usd',
                    align: 'left',
                    summaryType: 'sum', /*renderer: annosPosterioresUsd,*/
                    resizable: false
                }
            ]);

            this.cmTotales.headers = [
                [
                    {header: 'Componentes', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 8}, 
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 8},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 8},
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 8},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
                ], [
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
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ], [
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
                    {align: 'left', header: 'USD'},
                    {align: 'left', header: 'MP'},
                    {align: 'left', header: 'USD'}
                ]
            ];
        }
        else {
            _this.cmPresupuesoinversion = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandirPre'},
                {
                    width: 80,
                    dataIndex: 'mppresumuesto',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usdpresumuesto',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /*  maskRe: /^([0-9]+ ?[0-9]*)+$/
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (opciones.ejercicio.ejercicio) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (opciones.ejercicio.ejercicio) + 'plan',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'mpposterior',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: annosPosterioresMp,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'usdposterior',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: annosPosterioresUsd,
                    resizable: false
                }
            ]);

            _this.cmPresupuesoinversion.headers = [
                [
                    {header: 'Componentes', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2},
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2},
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ], [
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
                    {align: 'left', header: 'USD'}
                ]
            ];


            //---------------------------------------Panel de los totales-------------------------------------------------   


            this.cmTotales = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandir', resizable: false},
                {
                    width: 80,
                    dataIndex: 'sumapresp_mp',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'sumapresp_usd',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    resizable: false
                },
                //
                {
                    width: 80,
                    dataIndex: 'ejecutado_mp1',
                    align: 'left',
                    summaryType: 'sum',
                    resizable: false,
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero
                },
                {
                    width: 80,
                    dataIndex: 'ejecutado_usd1',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                //                
                {
                    width: 80,
                    dataIndex: 'estimado_mp2',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'estimado_usd2',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                //               
                {
                    width: 80,
                    dataIndex: 'plan_mp3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'plan_usd3',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    resizable: false
                },
                //           
                {
                    width: 80,
                    dataIndex: 'proyec_mp4',
                    align: 'left',
                    summaryType: 'sum',
                    renderer: valorCero,
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'proyec_usd4',
                    align: 'left',
                    summaryType: 'sum',
                    editor: new Ext.form.NumberField({
                        /* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                         maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                         regex: /^([0-9]+ ?[0-9]*)+$/,
                         regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                    }),
                    renderer: valorCero,
                    resizable: false
                },
                //
                {
                    width: 80,
                    dataIndex: 'annospost_mp',
                    align: 'left',
                    summaryType: 'sum', /*renderer: annosPosterioresMp1,*/
                    resizable: false
                },
                {
                    width: 80,
                    dataIndex: 'annospost_usd',
                    align: 'left',
                    summaryType: 'sum', /*renderer: annosPosterioresUsd,*/
                    resizable: false
                },
                //

            ]);


            this.cmTotales.headers = [
                [
                    {header: 'Componentes', rowspan: 4},
                    {header: 'Presupuesto', rowspan: 3, colspan: 2}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2},
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2},
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, colspan: 2}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
                ], [
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
                    {align: 'left', header: 'USD'}
                ]
            ];
        }
        _this.gpPresupuesoinversion.reconfigure(_this.stPresupuesoinversion, _this.cmPresupuesoinversion);
        _this.gpTotalesPresupuestoinversion.reconfigure(_this.stTotales, _this.cmTotales);
    }


    /**
     * Number.prototype.format(n, x)
     *
     * @param integer n: length of decimal
     * @param integer x: length of sections
     */
    Number.prototype.format = function (n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };

    function valorCero(v) {
        //return v;
        /*  if (!v)
         return Ext.util.Format.usMoney(0);
         else
         return Ext.util.Format.usMoney(v);*/
        valColum = !v ? 0 : v;
        return valColum;
    }


    function annosPosterioresMp(value, meta, record, rowIndex) {
        pres = (!isNaN(record.data.mppresumuesto)) ? record.data.mppresumuesto : 0;
        ejecutado = (!isNaN(parseFloat(record.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']))) ? parseFloat(record.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']) : 0;
        estimado = (!isNaN(parseFloat(record.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado']))) ? parseFloat(record.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado']) : 0;
        plan = (!isNaN(record.data['mp' + (opciones.ejercicio.ejercicio) + 'plan'])) ? parseFloat(record.data['mp' + (opciones.ejercicio.ejercicio) + 'plan']) : 0;
        proyecc = (!isNaN(parseFloat(record.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']))) ? parseFloat(record.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']) : 0;
        _this.mpposteriores[rowIndex] = pres - (ejecutado
            + estimado
            + plan
            + proyecc);
        //return  Ext.util.Format.usMoney(_this.mpposteriores[rowIndex]);
        return parseFloat(_this.mpposteriores[rowIndex]).toFixed(2);
    }


    function annosPosterioresUsd(value, meta, record, rowIndex) {
        pres = (!isNaN(parseFloat(record.data.usdpresumuesto))) ? parseFloat(record.data.usdpresumuesto) : 0;
        ejecutado = (!isNaN(parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']))) ? parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']) : 0;
        estimado = (!isNaN(parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado']))) ? parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado']) : 0;
        plan = (!isNaN(parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio) + 'plan']))) ? parseFloat(record.data['usd' + (opciones.ejercicio.ejercicio) + 'plan']) : 0;
        proyecc = (!isNaN(parseFloat(record.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']))) ? parseFloat(record.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']) : 0;
        _this.usdposteriores[rowIndex] = parseFloat(pres).toFixed(2) -  parseFloat((ejecutado
            + estimado
            + plan
            + proyecc)).toFixed(2);

        return parseFloat(_this.usdposteriores[rowIndex]).toFixed(2);
        // return Ext.util.Format.usMoney(_this.usdposteriores[rowIndex]);
    }

    function annosPosterioresMp_planPrep(value, meta, record, rowIndex) {
        valor = record.data;
        suma = !isNaN(parseFloat(valor.sumapresp_mp)) ? parseFloat(valor.sumapresp_mp) : 0;
        ejec = !isNaN(parseFloat(valor.ejecutado_mp1)) ? parseFloat(valor.ejecutado_mp1) : 0;
        estima = !isNaN(parseFloat(valor.estimado_mp2)) ? parseFloat(valor.estimado_mp2) : 0;
        plan = parseFloat(valor.plan_mp3) ? parseFloat(valor.plan_mp3) : 0;
        proyect = parseFloat(valor.proyec_mp4) ? parseFloat(valor.proyec_mp4) : 0;

        _this.mpposteriores_planPrep[rowIndex] = parseFloat(suma).toFixed(2) - parseFloat(ejec
            + estima + plan + proyect).toFixed(2);

        return parseFloat(_this.mpposteriores_planPrep[rowIndex]).toFixed(2);
    }

    function annosPosterioresUsd_planPrep(value, meta, record, rowIndex) {
        valor = record.data;
        suma = !isNaN(parseFloat(valor.sumapresp_usd)) ? parseFloat(valor.sumapresp_usd) : 0;
        ejec = !isNaN(parseFloat(valor.ejecutado_usd1)) ? parseFloat(valor.ejecutado_usd1) : 0;
        estima = !isNaN(parseFloat(valor.estimado_usd2)) ? parseFloat(valor.estimado_usd2) : 0;
        plan = !isNaN(parseFloat(valor.plan_usd3)) ? parseFloat(valor.plan_usd3) : 0;
        proyect = !isNaN(parseFloat(valor.proyec_usd4)) ? parseFloat(valor.proyec_usd4) : 0;

        _this.usdposteriores_planPrep[rowIndex] = parseFloat(suma).toFixed(2) - parseFloat(ejec
            + estima + plan + proyect).toFixed(2);

        return parseFloat(_this.usdposteriores_planPrep[rowIndex]).toFixed(2);

    }

    this.pintarFilasErrorneas = function (fila, pintar) {
        if (fila !== undefined) {
            if (pintar) {
                var backgroundcolor = 'background-color:#FFCCCC';
            }

            else {
                var backgroundcolor = 'background-color:#FFFFFF';
                for (var col = 0; col < _this.cmPresupuesoinversion.config.length; col++) {
                    Ext.get(_this.gpPresupuesoinversion.getView().getCell(fila, col)).applyStyles(backgroundcolor);
                }
            }

        }

    }

    this.cargarStoreTotales = function (store) {
        var arrayrecordstotales = [];
        arrayrecordstotales = store.getRange();
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
        var presupmpcontado = 0;
        var presupusdcontado = 0;
        for (var i = 0; i < arrayrecordstotales.length; i++) {
            recordstotales = arrayrecordstotales[i];
            //recordstotales.data.mppresumuesto;

            sumapresp_mp += parseFloat(parseFloat(recordstotales.data.mppresumuesto));
            sumapresp_usd += parseFloat(recordstotales.data.usdpresumuesto);
            //
            ejecutado_mp1 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']);
            ejecutado_usd1 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado']);
            estimado_mp1 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'estimado']);
            estimado_usd1 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'estimado']);
            plan_mp1 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'plan']);
            plan_usd1 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'plan']);
            proyec_mp1 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion']);
            proyec_usd1 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'proyeccion']);
            //
            ejecutado_mp2 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado']);
            ejecutado_usd2 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'ejecutado']);
            estimado_mp2 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado']);
            estimado_usd2 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado']);
            plan_mp2 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'plan']);
            plan_usd2 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'plan']);
            proyec_mp2 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion']);
            proyec_usd2 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'proyeccion']);
            //
            ejecutado_mp3 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio) + 'ejecutado']);
            ejecutado_usd3 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio) + 'ejecutado']);
            estimado_mp3 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio) + 'estimado']);
            estimado_usd3 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio) + 'estimado']);
            plan_mp3 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio) + 'plan']);
            plan_usd3 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio) + 'plan']);
            proyec_mp3 += parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio) + 'proyeccion']);
            proyec_usd3 += parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio) + 'proyeccion']);
            //            
            ejecutado_mp4 += parseFloat(recordstotales.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado']);
            ejecutado_usd4 += parseFloat(recordstotales.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'ejecutado']);
            estimado_mp4 += parseFloat(recordstotales.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado']);
            estimado_usd4 += parseFloat(recordstotales.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'estimado']);
            plan_mp4 += parseFloat(recordstotales.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan']);
            plan_usd4 += parseFloat(recordstotales.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'plan']);
            proyec_mp4 += parseFloat(recordstotales.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']);
            proyec_usd4 += parseFloat(recordstotales.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']);
            //
            annospost_mp += parseFloat(recordstotales.data.mppresumuesto) - (parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado'])
                + parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio - 1) + 'estimado'])
                + parseFloat(recordstotales.data['mp' + (opciones.ejercicio.ejercicio) + 'plan'])
                + parseFloat(recordstotales.data['mp' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']));
            annospost_usd += parseFloat(recordstotales.data.usdpresumuesto) - (parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 2) + 'ejecutado'])
                + parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio - 1) + 'estimado'])
                + parseFloat(recordstotales.data['usd' + (opciones.ejercicio.ejercicio) + 'plan'])
                + parseFloat(recordstotales.data['usd' + (parseFloat(opciones.ejercicio.ejercicio) + 1) + 'proyeccion']));

        }

        var record = new Ext.data.Record({
            denominacion: "Total Inversiones",
            sumapresp_mp: parseFloat(sumapresp_mp).toFixed(2),
            sumapresp_usd: parseFloat(sumapresp_usd).toFixed(2),
            //
            ejecutado_mp1: parseFloat(ejecutado_mp1).toFixed(2),
            ejecutado_usd1: parseFloat(ejecutado_usd1).toFixed(2),
            estimado_mp1: parseFloat(estimado_mp1).toFixed(2),
            estimado_usd1: parseFloat(estimado_usd1).toFixed(2),
            plan_mp1: parseFloat(plan_mp1).toFixed(2),
            plan_usd1: parseFloat(plan_usd1).toFixed(2),
            proyec_mp1: parseFloat(proyec_mp1).toFixed(2),
            proyec_usd1: parseFloat(proyec_usd1).toFixed(2),
            //
            ejecutado_mp2: parseFloat(ejecutado_mp2).toFixed(2),
            ejecutado_usd2: parseFloat(ejecutado_usd2).toFixed(2),
            estimado_mp2: parseFloat(estimado_mp2).toFixed(2),
            estimado_usd2: parseFloat(estimado_usd2).toFixed(2),
            plan_mp2: parseFloat(plan_mp2).toFixed(2),
            plan_usd2: parseFloat(plan_usd2).toFixed(2),
            proyec_mp2: parseFloat(proyec_mp2).toFixed(2),
            proyec_usd2: parseFloat(proyec_usd2).toFixed(2),
            //
            ejecutado_mp3: parseFloat(ejecutado_mp3).toFixed(2),
            ejecutado_usd3: parseFloat(ejecutado_usd3).toFixed(2),
            estimado_mp3: parseFloat(estimado_mp3).toFixed(2),
            estimado_usd3: parseFloat(estimado_usd3).toFixed(2),
            plan_mp3: parseFloat(plan_mp3).toFixed(2),
            plan_usd3: parseFloat(plan_usd3).toFixed(2),
            proyec_mp3: parseFloat(proyec_mp3).toFixed(2),
            proyec_usd3: parseFloat(proyec_usd3).toFixed(2),
            //
            ejecutado_mp4: parseFloat(ejecutado_mp4).toFixed(2),
            ejecutado_usd4: parseFloat(ejecutado_usd4).toFixed(2),
            estimado_mp4: parseFloat(estimado_mp4).toFixed(2),
            estimado_usd4: parseFloat(estimado_usd4).toFixed(2),
            plan_mp4: parseFloat(plan_mp4).toFixed(2),
            plan_usd4: parseFloat(plan_usd4).toFixed(2),
            proyec_mp4: parseFloat(proyec_mp4).toFixed(2),
            proyec_usd4: parseFloat(proyec_usd4).toFixed(2),
            //
            annospost_mp: parseFloat(annospost_mp).toFixed(2),
            annospost_usd: parseFloat(annospost_usd).toFixed(2)
            //
        });

        /*var plan_mpp1 = 0;
         var plan_mpp2 = 0;
         var plan_mpp3 = 0;
         var plan_mpp4 = 0;
         var plan_usdd1 = 0;
         var plan_usdd2 = 0;
         var plan_usdd3 = 0;
         var plan_usdd4 = 0
         var annosfinanciero_mp = 0;
         var annosfinanciero_usd = 0;
         var ejercicio = arrayrecordstotales[0].data.ejercicio;
         var valormp = arrayrecordstotales[0].data.valormp;
         var valorusd = arrayrecordstotales[0].data.valorusd;
         var sumaplan_usd = (arrayrecordstotales[0].data.valorusd === null) ? 0 : arrayrecordstotales[0].data.valorusd;
         var sumaplan_mp = (arrayrecordstotales[0].data.valormp === null) ? 0 : arrayrecordstotales[0].data.valormp;
         */

        var record1 = new Ext.data.Record(store.reader.jsonData.planPrep);
        /*var plan_mppp1 = 0;
         var plan_mppp2 = 0;
         var plan_mppp3 = 0;
         var plan_mppp4 = 0;
         var plan_usddd1 = 0;
         var plan_usddd2 = 0;
         var plan_usddd3 = 0;
         var plan_usddd4 = 0;
         var sumapres_mp = 0;
         var sumapres_usd = 0;
         var ejecutadoTolyPla_mp1 = 0;

         plan_mppp1 = plan_mp1 + plan_mpp1;
         plan_mppp2 = plan_mp2 + plan_mpp2;
         plan_mppp3 = plan_mp3 + plan_mpp3;
         plan_mppp4 = plan_mp4 + plan_mpp4;
         plan_usddd1 = plan_usd1 + plan_usdd1;
         plan_usddd2 = plan_usd2 + plan_usdd2;
         plan_usddd3 = plan_usd3 + plan_usdd3;
         plan_usddd4 = plan_usd4 + plan_usdd4;*/
        sumapres_mp = parseFloat(sumapresp_mp).toFixed(2);
        sumapres_usd = parseFloat(sumapresp_usd).toFixed(2);
        ejecutadoTolyPla_mp1 = ejecutado_mp1;


        _this.stTotales.add(record);
        _this.stTotales.add(record1);
    };
};