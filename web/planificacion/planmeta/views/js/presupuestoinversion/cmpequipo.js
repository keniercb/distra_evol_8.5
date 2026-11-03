
Utilidades.Cmp.CmpEquipo = function(opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.checkResumenEq = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumenEq',
        checked: true,
        name: 'checkResumenEq',
        handler: function(este, checked) {
            if (checked)
            {
                _this.ConfigurarColumnasEqui(1);
            }
            else {
                _this.ConfigurarColumnasEqui(0);
            }
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaequipos',
        text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });
    this.btnAdd = new Ext.Button({
        id: 'idbtnAddEquipos',
        text: opciones.idioma.tooAddEquipos,
        tooltip: opciones.idioma.btntoolAddgenr,
        icon: perfil.dirImg + 'adicionar.png',
        iconCls: 'btn'
    });
    this.btnDel = new Ext.Button({
        id: 'idbtnDelEquipos',
        text: opciones.idioma.btnEliminar,
        tooltip: opciones.idioma.btntoolDelGenl,
        icon: perfil.dirImg + 'eliminar.png',
        iconCls: 'btn'
    });
    this.btnGuardarEq = new Ext.Button({
        id: 'btnGuardarEq',
        text: 'Guardar',
        tooltip: 'Guardar equipos',
        iconCls: 'guardar',
        handler: function() {
            arrayCons = new Array();
            records = _this.stEquipos.getModifiedRecords();
            idinversion = opciones.idinversion;
            idetapainversion = _this.stEquipos.getAt(0).data.idetapainversion;

            _this.stEquipos.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arrayCons.push(records[i].data);
            }

            _this.BarraProgreso.show('Guardando valores...');
            Ext.Ajax.request({
                method: "POST",
                url: "GuardarValor",
                params: {
                    valores: Ext.encode(arrayCons),
                    idejercicio: opciones.ejercicio.idejercicio,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                    idinversion: idinversion,
                    idetapainversion: idetapainversion
                },
                callback: function(options, success, response) {

                    mostrarMensaje(1, 'Los valores se han guardado satisfactoriamente.');
                    _this.stEquipos.reload();
                    _this.BarraProgreso.hide();
                }
            });
        }
    });

    this.cmEquipos = new Ext.grid.ColumnModel([
        {width: 250, dataIndex: 'denominacion', align: 'left', id: 'otrosindicadores'},
        {width: 100, dataIndex: 'adquirir', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 100, dataIndex: 'comprar', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 100, dataIndex: 'pais', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 100, dataIndex: 'annospos', align: 'left'/*, renderer: annosPosteriores*/}
    ]);
    this.cmEquipos.headers = [
        [
            {header: 'Denominaci&oacute;n', rowspan: 3},
            {header: 'Adquirir', rowspan: 3},
            {header: 'Comprar', rowspan: 3},
            {header: 'Pa&iacute;s', rowspan: 3},
        ], [
            {header: opciones.ejercicio.ejercicio - 2, colspan: 1},
            {header: opciones.ejercicio.ejercicio - 1, colspan: 1},
            {header: opciones.ejercicio.ejercicio, colspan: 1},
            {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 1},
            {header: 'A&ntilde;os posteriores', rowspan: 2}
        ], [
            {align: 'left', header: 'Total ejecutado hasta'},
            {align: 'left', header: 'Estimado'},
            {align: 'left', header: 'Plan'},
            {align: 'left', header: 'Proyecci&oacute;n'}
        ]
    ];
    this.stEquipos = new Ext.data.Store({
        url: 'cargarEquiposDesglose',
        reader: new Ext.data.JsonReader(
                {
                    id: 'idcomponente',
                    totalProperty: 'total',
                    root: "data",
                    mppresp: "mppresp",
                    usdpresp: "usdpresp",
                    usddesg: "usddesg",
                    mpdesg: "mpdesg"
                },
        [{name: 'idetapaequipos'},
            {name: 'codigo'},
            {name: 'denominacion'},
            {name: 'ejecutadousd1'},
            {name: 'ejecutadomp1'},
            {name: 'ejecutadousd2'},
            {name: 'ejecutadomp2'},
            {name: 'ejecutadousd3'},
            {name: 'ejecutadomp3'},
            {name: 'ejecutadousd4'},
            {name: 'ejecutadomp4'},
            {name: 'estimadousd1'},
            {name: 'estimadomp1'},
            {name: 'estimadousd2'},
            {name: 'estimadomp2'},
            {name: 'estimadousd3'},
            {name: 'estimadomp3'},
            {name: 'estimadousd4'},
            {name: 'estimadomp4'},
            {name: 'planusd1'},
            {name: 'planmp1'},
            {name: 'planusd2'},
            {name: 'planmp2'},
            {name: 'planusd3'},
            {name: 'planmp3'},
            {name: 'planusd4'},
            {name: 'planmp4'},
            {name: 'proyecusd1'},
            {name: 'proyecmp1'},
            {name: 'proyecusd2'},
            {name: 'proyecmp2'},
            {name: 'proyecusd3'},
            {name: 'proyecmp3'},
            {name: 'proyecusd4'},
            {name: 'proyecmp4'},
            {name: 'mpposterior'},
            {name: 'usdposterior'},
            {name: 'proyecusd4'},
            {name: 'proyecmp4'},
            {name: 'mpposterior'},
            {name: 'idejecutado'},
            {name: 'idetapinverconsprovplanusd1'},
            {name: 'idetapinverconsprovplanmp1'},
            {name: 'idetapinverconsprovplanusd2'},
            {name: 'idetapinverconsprovplanmp2'},
            {name: 'idetapinverconsprovplanusd3'},
            {name: 'idetapinverconsprovplanmp3'},
            {name: 'idetapinverconsprovplanusd4'},
            {name: 'idetapinverconsprovplanmp4'},
            {name: 'idetapinverconsprovproyeccionusd1'},
            {name: 'idetapinverconsprovproyeccionmp1'},
            {name: 'idetapinverconsprovproyeccionusd2'},
            {name: 'idetapinverconsprovproyeccionmp2'},
            {name: 'idetapinverconsprovproyeccionusd3'},
            {name: 'idetapinverconsprovproyeccionmp3'},
            {name: 'idetapinverconsprovproyeccionusd4'},
            {name: 'idetapinverconsprovproyeccionmp4'},
            {name: 'idetapinverconsprovproyeccionusd1'},
            {name: 'idetapinverconsprovproyeccionmp1'},
            {name: 'idetapinverconsprovproyeccionusd2'},
            {name: 'idetapinverconsprovproyeccionmp2'},
            {name: 'idetapinverconsprovproyeccionusd3'},
            {name: 'idetapinverconsprovproyeccionmp3'},
            {name: 'idetapinverconsprovproyeccionusd4'},
            {name: 'idetapinverconsprovproyeccionmp4'},
            {name: 'idetapinverconsprovejecutadousd1'},
            {name: 'idetapinverconsprovejecutadomp1'},
            {name: 'idetapinverconsprovejecutadousd2'},
            {name: 'idetapinverconsprovejecutadomp2'},
            {name: 'idetapinverconsprovejecutadousd3'},
            {name: 'idetapinverconsprovejecutadomp3'},
            {name: 'idetapinverconsprovejecutadousd4'},
            {name: 'idetapinverconsprovejecutadomp4'},
            {name: 'idetapinverconsprovejecutado'},
            {name: 'idetapinverconsprovestimadousd1'},
            {name: 'idetapinverconsprovestimadomp1'},
            {name: 'idetapinverconsprovestimadousd2'},
            {name: 'idetapinverconsprovestimadomp2'},
            {name: 'idetapinverconsprovestimadousd3'},
            {name: 'idetapinverconsprovestimadomp3'},
            {name: 'idetapinverconsprovestimadousd4'},
            {name: 'idetapinverconsprovestimadomp4'},
            {name: 'idetapinverconsprov'},
            {name: 'mppresp'},
            {name: 'usdpresp'},
            {name: 'usddesg'},
            {name: 'mpdesg'},
            {name: 'idinversion'},
            {name: 'idetapainversion'},
        ]),
        listeners: {
            beforeload: function(st) {
                Ext.Ajax.timeout = 600000; //10min
                _this.BarraProgreso.show('Cargando equipos...');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
            },
            load: function(st, r, o) {
                _this.BarraProgreso.hide();
                annpMp = parseInt(st.reader.jsonData.mppresp) - parseInt(st.reader.jsonData.mpdesg);
                annpUsd = parseInt(st.reader.jsonData.usdpresp) - parseInt(st.reader.jsonData.usddesg);
                annpMp1 = parseInt(annpMp).toFixed(2);
                annpUsd1 = parseInt(annpUsd).toFixed(2);

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
                _this.ptGridequipos.pageSize = record.data.idnumpag;
                _this.ptGridequipos.doLoad(_this.ptGridequipos.cursor);
            }
        }
    });
    this.stCmpetapa = new Ext.data.Store({
        url: 'cargarEtapas',
        reader: new Ext.data.JsonReader({
            id: 'idetapa',
            root: 'data'
        },
        [{
                name: 'denominacion'
            }, {
                name: 'idetapa'
            }]),
        baseParams: {
            idejercicio: opciones.ejercicio.idejercicio,
            identidad: opciones.identidad,
            idinversion: opciones.idinversion
        }
    });
    this.CmbComponentes = new Ext.form.ComboBox({
        width: 200,
        align: 'right',
        allowBlank: false,
        mode: 'local',
        store: _this.stCmpetapa,
        valueField: 'idetapa',
        displayField: 'denominacion',
        emptyText: opciones.idioma.tlSeleccione,
        triggerAction: 'all',
        fieldLabel: opciones.idioma.cpmCompEtap,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
    });
    this.stCmbplan = new Ext.data.Store({
        url: '/planificacion/planmeta/index.php/inversiones/listarComboModelo',
        reader: new Ext.data.JsonReader({
            id: 'idmodelo',
            root: 'data'
        },
        [{
                name: 'denominacion'
            }, {
                name: 'idmodelo'
            }]),
        baseParams: {
            idejercicio: opciones.ejercicio.idejercicio,
            identidad: opciones.identidad
        }

    });
    this.CmbPlan = new Ext.form.ComboBox({
        width: 200,
        align: 'right',
        allowBlank: false,
        mode: 'local',
        store: _this.stCmbplan,
        valueField: 'idmodelo',
        displayField: 'denominacion',
        emptyText: opciones.idioma.tlSeleccione,
        triggerAction: 'all',
        fieldLabel: opciones.idioma.cpmplan,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
    });

    this.gpEquipos = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        split: true,
        region: 'center',
        autoScroll: true,
        stripeRows: true,
        store: _this.stEquipos,
        tbar: ['Componentes :', _this.CmbComponentes, '-', 'Plan :', _this.CmbPlan, '-', _this.btnAdd, '-', _this.btnDel, '-', _this.btnGuardarEq, '-', '->', _this.checkResumenEq, '-', _this.btnAyuda],
        //sm:smMigracion,
        plugins: new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/,
        listeners: {
            click: function() {

            },
            focus: function() {

            },
            afteredit: function(objeto) {
                //_this.pintarFilasErrorneas(objeto);
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        cm: _this.cmEquipos,
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginado.getValue(),
            id: 'pgidequipos',
            store: _this.stEquipos,
            displayInfo: true,
            items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
        })
                //[_this.ptGridequipos, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
    });
    this.ptGridequipos = new Ext.PagingToolbar({
        pageSize: _this.cbpaginado.getValue(),
        store: _this.stEquipos,
        width: 400,
        displayInfo: true
    });

    this.pEquipos = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        frame: true,
        items: [_this.gpEquipos]
    });

    this.ConfigurarColumnasEqui = function(accion)
    {
        if (accion === 0)
        {
            this.cmEquipos = new Ext.grid.ColumnModel([
                {width: 250, dataIndex: 'denominacion', align: 'left', id: 'otrosindicadores'},
                {width: 100, dataIndex: 'descripcion', align: 'left', id: 'descripcion'},
                {width: 100, dataIndex: 'adquirir', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'comprar', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'pais', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteestimado', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteplan', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'aanteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'antetotal', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'anteplan', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'anteproyeccion', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'actualtotal', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'actualestimado', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'actualproyeccion', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'postotal', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'posestimado', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'posplan', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'left'/*, renderer: annosPosteriores*/}
            ]);



            this.cmEquipos.headers = [
                [
                    {header: 'Denominaci&oacute;n', rowspan: 3},
                    {header: 'Adquirir', rowspan: 3},
                    {header: 'Comprar', rowspan: 3},
                    {header: 'Pa&iacute;s', rowspan: 3}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2, colspan: 4},
                    {header: opciones.ejercicio.ejercicio - 1, colspan: 4},
                    {header: opciones.ejercicio.ejercicio, colspan: 4},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 4},
                    {header: 'A&ntilde;os posteriores', rowspan: 2}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'},
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'}
                ]
            ];
        }
        else {
            this.cmEquipos = new Ext.grid.ColumnModel([
                {width: 250, dataIndex: 'denominacion', align: 'left', id: 'otrosindicadores'},
                {width: 100, dataIndex: 'adquirir', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'comprar', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'pais', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'aantetotal', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'anteestimado', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'actualplan', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'posproyeccion', align: 'left', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'left'/*, renderer: annosPosteriores*/}
            ]);
            this.cmEquipos.headers = [
                [
                    {header: 'Denominaci&oacute;n', rowspan: 3},
                    {header: 'Adquirir', rowspan: 3},
                    {header: 'Comprar', rowspan: 3},
                    {header: 'Pa&iacute;s', rowspan: 3}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2, colspan: 1},
                    {header: opciones.ejercicio.ejercicio - 1, colspan: 1},
                    {header: opciones.ejercicio.ejercicio, colspan: 1},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 1},
                    {header: 'A&ntilde;os posteriores', rowspan: 2}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'}
                ]
            ];
        }

        _this.gpEquipos.reconfigure(_this.stEquipos, _this.cmEquipos);
    };
    this.fnReturn = function() {
        return this.pEquipos;
    };
    function valorCero(v) {
        if (!v)
            return 0;
        else
            return v;
    }
    this.pintarFilasErrorneas = function(fila, pintar) {
        if (fila != undefined) {
            //_this.gpPresupuesoinversion.getView().addRowClass(fila,'superior');

            if (pintar) {
                var backgroundcolor = 'background-color:#FFCCCC';
                //for (var col = 0; col < _this.cmPresupuesoinversion.config.length; col++) {
                //}
            }

            else {
                var backgroundcolor = 'background-color:#FFFFFF';
                for (var col = 0; col < _this.cmEquipos.config.length; col++) {
                    Ext.get(_this.gpEquipos.getView().getCell(fila, col)).applyStyles(backgroundcolor);
                }
            }

        }

    }

};