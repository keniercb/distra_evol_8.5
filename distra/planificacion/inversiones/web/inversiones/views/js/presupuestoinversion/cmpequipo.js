
Utilidades.Cmp.CmpEquipo = function(opciones) {
    var _this = this;
    this.posteriores = [];
    this.arraydesglose = [];
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
        disabled: true,
        tooltip: 'Guardar equipos',
        iconCls: 'guardar',
        handler: function() {
            mostrarMensaje(2, 'No se guardar\xE1n lo datos para los ejercicios Cerrados, plan-proyecci\xF3n de los Aprobados y estimado-plan-proyecci\xF3n de los Ejecutados.', _this.guardarEquipo);
        }
    });

    this.guardarEquipo = function(btn){
        if(btn == 'ok'){
            arrayEquipos = new Array();
            records = _this.stEquipos.getModifiedRecords();
            idinversion = opciones.idinversion;
            idetapainversion = _this.stEquipos.getAt(0).data.idetapainversion;

            _this.stEquipos.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arrayEquipos.push(records[i].data);
            }
            _this.BarraProgreso.show('Guardando valores...');
            Ext.Ajax.request({
                method: "POST",
                url: "GuardarEquipos",
                params: {
                    valores: Ext.encode(arrayEquipos),
                    idejercicio: opciones.ejercicio.idejercicio,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                    idinversion: idinversion,
                    idetapainversion: idetapainversion,
                    idplan: _this.CmbPlan.getValue(),
                    plan: _this.CmbPlan.getRawValue()
                },
                callback: function(options, success, response) {
                    mostrarMensaje(1, 'Los valores se han guardado satisfactoriamente.');
                    _this.stEquipos.reload();
                    _this.BarraProgreso.hide();
                }
            });
            _this.btnGuardarEq.disable()
            _this.btnGuardarEqAjuste.disable()
        }
    }


    this.btnGuardarEqAjuste = new Ext.Button({
        id: 'btnGuardarEqAjuste',
        text: 'Ajustar',
        disabled: true,
        tooltip: 'Ajustar',
        iconCls: 'ajustar',
        handler: function() {
            arrayEquipos = new Array();
            records = _this.stEquipos.getModifiedRecords();
            idinversion = opciones.idinversion;
            idetapainversion = _this.stEquipos.getAt(0).data.idetapainversion;

            _this.stEquipos.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arrayEquipos.push(records[i].data);
            }
            _this.BarraProgreso.show('Guardando valores...');
            Ext.Ajax.request({
                method: "POST",
                url: "GuardarEquiposAjuste",
                params: {
                    valores: Ext.encode(arrayEquipos),
                    idejercicio: opciones.ejercicio.idejercicio,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                    idinversion: idinversion,
                    idetapainversion: idetapainversion,
                    idplan: _this.CmbPlan.getValue(),
                    plan: _this.CmbPlan.getRawValue()
                },
                callback: function(options, success, response) {
                    mostrarMensaje(1, 'Los valores se han guardado satisfactoriamente.');
                    _this.stEquipos.reload();
                    _this.BarraProgreso.hide();

                    _this.btnGuardarEq.disable();
                    _this.btnGuardarEqAjuste.disable();
                }
            });

        }
    });


    this.btnCalcularImporteEq = new Ext.Button({
        id: 'btnCalcularImporteEq',
        text: 'Calcular Importe',
        //disabled: true ,
        tooltip: 'Calcular Importe  del a\xF1 actual',
        iconCls: 'ver',
        handler: function() {
            /*arrayEquipos = new Array();
            records = _this.stEquipos.getModifiedRecords();*/
            idinversion = opciones.idinversion;
            //idetapainversion = _this.stEquipos.getAt(0).data.idetapainversion;

            /*_this.stEquipos.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arrayEquipos.push(records[i].data);
            }*/
            _this.BarraProgreso.show('Calculando...');
            Ext.Ajax.request({
                method: "POST",
                url: "calcularEquipos",
                params: {
                    //valores: Ext.encode(arrayEquipos),
                    idejercicio: opciones.ejercicio.idejercicio,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseInt(opciones.ejercicio.ejercicio) + 1),
                    idinversion: idinversion,
                    //idetapainversion: idetapainversion
                },
                callback: function(options, success, response) {
                   var cuerporeporte = Ext.decode(response.responseText);
                    var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                    winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                    winreporte.document.close();
                    _this.BarraProgreso.hide();
                }
            });

        }
    });

    this.cmEquipos = new Ext.grid.ColumnModel([
        {width: 500, dataIndex: 'denominacion', resizable: false, id: 'expandir', align: 'left'},
            {width: 80, dataIndex: 'precio', resizable: false, id: 'expandir', align: 'right'},
            {width: 80, dataIndex: 'preciodivisa', resizable: false, id: 'expandir', align: 'right'},
        {width: 80, dataIndex: 'adquirir', resizable: false, align: 'left'},
        {width: 80, dataIndex: 'comprar', resizable: false, align: 'left'},
        {width: 80, dataIndex: 'pais', resizable: false, align: 'left'},
        {width: 80, dataIndex: 'cantidad', resizable: false, align: 'left'},
        {width: 130, dataIndex: 'ejecutado1', resizable: false, align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'estimado2', resizable: false, align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'plan3', resizable: false, align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 80, dataIndex: 'proyec4', resizable: false, align: 'left', editor: new Ext.form.NumberField({
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'Los valores deben ser n\xFAmeros enteros'
            }), renderer: valorCero},
        {width: 100, dataIndex: 'annospos', align: 'left'/*,  renderer: annosPosteriores*/}
    ]);
    this.cmEquipos.headers = [
        [
            {header: 'Denominaci&oacute;n', rowspan: 3},
            {header: 'Precio', rowspan: 3, align: 'center'},
            {header: 'Precio divisa', rowspan: 3, align: 'center'},
            {header: 'Adquirir', rowspan: 3},
            {header: 'Comprar', rowspan: 3},
            {header: 'Pa&iacute;s', rowspan: 3},
            {header: 'Cantidad', rowspan: 3, align: 'left'}
        ], [
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 1, align: 'center'},
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 1, align: 'center'},
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 1, align: 'center'},
            {header: (parseInt(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseInt(opciones.ejercicio.ejercicio) + 1].nombreestado + ')'), colspan: 1, align: 'center'},
            {header: 'A&ntilde;os posteriores', rowspan: 2, align: 'center'}
        ], [
            {align: 'left', header: 'Total ejecutado hasta'},
            {align: 'left', header: 'Estimado'},
            {align: 'left', header: 'Plan'},
            {align: 'left', header: 'Proyecci&oacute;n'}
        ]
    ];
    this.stEquipos = new Ext.data.Store({
        url: 'cargarEquiposDesglose',
        autoload: true,
        reader: new Ext.data.JsonReader(
                {
                    id: 'idetapaequipos',
                    totalProperty: 'total',
                    root: "data"
                },
        [{name: 'idetapaequipos'},
            {name: 'cantidad'},
            {name: 'denominacion'},
            {name: 'ejecutado1'},
            {name: 'ejecutado2'},
            {name: 'ejecutado3'},
            {name: 'ejecutado4'},
            {name: 'estimado1'},
            {name: 'estimado2'},
            {name: 'estimado3'},
            {name: 'estimado4'},
            {name: 'plan1'},
            {name: 'plan2'},
            {name: 'plan3'},
            {name: 'plan4'},
            {name: 'proyec1'},
            {name: 'proyec2'},
            {name: 'proyec3'},
            {name: 'proyec4'},
            {name: 'annospos'},
            {name: 'idetapaequipoejecutado1'},
            {name: 'idetapaequipoejecutado2'},
            {name: 'idetapaequipoejecutado3'},
            {name: 'idetapaequipoejecutado4'},
            {name: 'idetapaequipoestimado1'},
            {name: 'idetapaequipoestimado2'},
            {name: 'idetapaequipoestimado3'},
            {name: 'idetapaequipoestimado4'},
            {name: 'idetapaequipoproyectado1'},
            {name: 'idetapaequipoproyectado2'},
            {name: 'idetapaequipoproyectado3'},
            {name: 'idetapaequipoproyectado4'},
            {name: 'idetapaequipoplan1'},
            {name: 'idetapaequipoplan2'},
            {name: 'idetapaequipoplan3'},
            {name: 'idetapaequipoplan4'},
            {name: 'idetapainversion'},
            {name: 'componente'},
            {name: 'idequipoplan'},
//            {name: 'modelo'},
            {name: 'adquirir'},
            {name: 'idadquisicion'},
            {name: 'precio'},
            {name: 'preciodivisa'},
            {name: 'importe'},
            {name: 'importedivisa'},
            {name: 'comprar'},
            {name: 'idcomprar'},
            {name: 'pais'},
            {name: 'idcomprarpais'},
            {name: 'denominacion'},
            {name: 'idinversion'},
            {name: 'idetapaequipoglobal'},
            {name: 'idetapainversion'}
        ]),
        listeners: {
            beforeload: function(st) {
                Ext.Ajax.timeout = 600000; //10min
                _this.BarraProgreso.show('Cargando equipos...');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.idinversion = opciones.idinversion;
                st.baseParams.componente = _this.CmbComponentes.getValue();
//                st.baseParams.modelo = _this.CmbPlan.getValue();
                st.baseParams.idequipoplan = _this.CmbPlan.getValue();
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseInt(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.ejercicio = parseInt(opciones.ejercicio.ejercicio);
                st.baseParams.limit = 20;
                st.baseParams.start = 0;
            },
            load: function(st, r, o) {
                _this.BarraProgreso.hide();
                annp = parseInt(st.reader.jsonData.presp) - parseInt(st.reader.jsonData.desg);
                annp = parseInt(st.reader.jsonData.presp) - parseInt(st.reader.jsonData.desg);
                annp1 = parseInt(annp).toFixed(2);
                annp1 = parseInt(annp).toFixed(2);


            }
        }
    });
    this.stCetapa = new Ext.data.Store({
        url: 'cargarEtapas',
        autoload: true,
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
        store: _this.stCetapa,
        valueField: 'idetapa',
        displayField: 'denominacion',
        etyText: opciones.idioma.tlSeleccione,
        triggerAction: 'all',
        fieldLabel: opciones.idioma.cpmCoEtap,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function() {
                _this.stEquipos.reload();
            }
        }
    });
    this.stCmbplan = new Ext.data.Store({
        url: '/planificacion/inversiones/index.php/inversiones/listarComboModelo',
        autoload: true,
        reader: new Ext.data.JsonReader({
            id: 'idequipoplan',
            root: 'data'
        },
        [{
                name: 'denominacion'
            }, {
                name: 'idequipoplan'
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
        valueField: 'idequipoplan',
        displayField: 'denominacion',
        etyText: opciones.idioma.tlSeleccione,
        triggerAction: 'all',
        fieldLabel: opciones.idioma.cplan,
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            select: function() {
                _this.stEquipos.reload();
            }
        }
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
        tbar: ['Componentes :', _this.CmbComponentes, '-', 'Plan :', _this.CmbPlan, _this.btnGuardarEq, _this.btnGuardarEqAjuste,_this.btnCalcularImporteEq, '->', _this.checkResumenEq, '-'/*, _this.btnAyuda*/],
        //sm:smMigracion,
        plugins: new Ext.ux.plugins.XGrid()/*, new Ext.grid.GridSummary()*/,
        listeners: {
            click: function() {

            },
            focus: function() {

            },
            afteredit: function(obj) {
                var datos = [];
                _this.stEquipos.getModifiedRecords().forEach(function(record) {
                    datos.push(record.data)
                })

                if (datos.length != 0)
                    _this.btnGuardarEq.enable()

                _this.btnGuardarEqAjuste.enable();
            }
        },
        loadMask: {
            msg: 'Cargando...'
        },
        viewConfig: {
            getRowClass: function(record, index) {
                if ((record.data.annospos < 0) || (_this.arraydesglose[0] > parseFloat(record.data.cantidad))) {
                    return  'superior';
                }
                else {
                    return '';
                }

            }
        },
        cm: _this.cmEquipos,
        bbar: new Ext.PagingToolbar({
            pageSize: 20,
            id: 'pgidequipos',
            store: _this.stEquipos,
            displayInfo: true
        })
    });
    this.ptGridequipos = new Ext.PagingToolbar({
        pageSize: 20,
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
            this.cmEquiposGen = new Ext.grid.ColumnModel([
                {width: 500, dataIndex: 'denominacion', resizable: false, id: 'expandir', align: 'left'},
                {width: 80, dataIndex: 'adquirir', resizable: false, align: 'left'},
                {width: 80, dataIndex: 'comprar', resizable: false, align: 'left'},
                {width: 80, dataIndex: 'pais', resizable: false, align: 'left'},
                {width: 70, dataIndex: 'cantidad', resizable: false, align: 'left', renderer: valorCero},
                {width: 120, dataIndex: 'ejecutado1', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'estimado1', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'plan1', resizable: false, align: 'right'},
                {width: 80, dataIndex: 'proyec1', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 120, dataIndex: 'ejecutado2', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'estimado2', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'plan2', resizable: false, align: 'right'},
                {width: 80, dataIndex: 'proyec2', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 120, dataIndex: 'ejecutado3', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'estimado3', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'plan3', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'proyec3', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 120, dataIndex: 'ejecutado4', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'estimado4', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'plan4', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'proyec4', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'right'/*, renderer: annosPosteriores*/}
            ]);



            this.cmEquiposGen.headers = [
                [
                    {header: 'Denominaci&oacute;n sdfsfsfs', rowspan: 3},
                    {header: 'Precio', rowspan: 3, align: 'center'},
                    {header: 'Precio Divisa', rowspan: 3, align: 'center'},
                    {header: 'Adquirir', rowspan: 3, align: 'center'},
                    {header: 'Comprar', rowspan: 3, align: 'center'},
                    {header: 'Pa&iacute;s', rowspan: 3, align: 'center'},
                    {header: 'Cantidad', rowspan: 3, align: 'center'}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2, colspan: 4},
                    {header: opciones.ejercicio.ejercicio - 1, colspan: 4},
                    {header: opciones.ejercicio.ejercicio, colspan: 4},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1), colspan: 4},
                    {header: 'A&ntilde;os posteriores', rowspan: 2}
                ], [
                    {align: 'right', header: 'Total ejecutado hasta'},
                    {align: 'right', header: 'Estimado'},
                    {align: 'right', header: 'Plan'},
                    {align: 'right', header: 'Proyecci&oacute;n'},
                    {align: 'right', header: 'Total ejecutado hasta'},
                    {align: 'right', header: 'Estimado'},
                    {align: 'right', header: 'Plan'},
                    {align: 'right', header: 'Proyecci&oacute;n'},
                    {align: 'right', header: 'Total ejecutado hasta'},
                    {align: 'right', header: 'Estimado'},
                    {align: 'right', header: 'Plan'},
                    {align: 'right', header: 'Proyecci&oacute;n'},
                    {align: 'right', header: 'Total ejecutado hasta'},
                    {align: 'right', header: 'Estimado'},
                    {align: 'right', header: 'Plan'},
                    {align: 'right', header: 'Proyecci&oacute;n'}
                ]
            ];
            _this.gpEquipos.reconfigure(_this.stEquipos, _this.cmEquiposGen);
        }
        else {
            this.cmEquipos = new Ext.grid.ColumnModel([
                {width: 500, dataIndex: 'denominacion', resizable: false, id: 'expandir', align: 'left'},
                {width: 80, dataIndex: 'adquirir', resizable: false, align: 'left'},
                {width: 80, dataIndex: 'comprar', resizable: false, align: 'left'},
                {width: 80, dataIndex: 'pais', resizable: false, align: 'left'},
                {width: 80, dataIndex: 'cantidad', resizable: false, align: 'right'},
                {width: 130, dataIndex: 'ejecutado1', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'estimado2', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'plan3', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 80, dataIndex: 'proyec4', resizable: false, align: 'right', editor: new Ext.form.NumberField({
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    }), renderer: valorCero},
                {width: 100, dataIndex: 'annospos', align: 'right'/*, renderer: annosPosteriores*/}
            ]);
            this.cmEquipos.headers = [
                [
                    {header: 'Denominaci&oacute;n we222323', rowspan: 3},
                    {header: 'Precio', rowspan: 3, align: 'center'},
                    {header: 'Precio Divisa', rowspan: 3, align: 'center'},
                    {header: 'Adquirir', rowspan: 3},
                    {header: 'Comprar', rowspan: 3},
                    {header: 'Pa&iacute;s', rowspan: 3},
                    {header: 'Cantidad', rowspan: 3, align: 'left'}
                ], [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 1, align: 'center'},
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 1, align: 'center'},
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 1, align: 'center'},
                    {header: (parseInt(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseInt(opciones.ejercicio.ejercicio) + 1].nombreestado + ')'), colspan: 1, align: 'center'},
                    {header: 'A&ntilde;os posteriores', rowspan: 2, align: 'center'}
                ], [
                    {align: 'left', header: 'Total ejecutado hasta'},
                    {align: 'left', header: 'Estimado'},
                    {align: 'left', header: 'Plan'},
                    {align: 'left', header: 'Proyecci&oacute;n'}
                ]
            ];
            _this.gpEquipos.reconfigure(_this.stEquipos, _this.cmEquipos);
        }


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

            //console.log(objectrow);
            if (pintar) {
                var backgroundcolor = 'background-color:#FFCCCC';
                //for (var col = 0; col < _this.cresupuesoinversion.config.length; col++) {
                //console.log( Ext.get(_this.gpPresupuesoinversion.getView().getCell(0, 1)))//.applyStyles(backgroundcolor);
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
    function sennalardesglose(record) {
        var desglose = 0;

        desglose += parseFloat(record.data.ejecutado1);
        desglose += parseFloat(record.data.estimado1);
        desglose += parseFloat(record.data.plan1);
        desglose += parseFloat(record.data.proyec1);
        //
        desglose += parseFloat(parseFloat(record.data.ejecutado2));
        desglose += parseFloat(record.data.estimado2);
        desglose += parseFloat(record.data.plan2);
        desglose += parseFloat(record.data.proyec2);
        //
        desglose += parseFloat(record.data.ejecutado3);
        desglose += parseFloat(record.data.estimado3);
        desglose += parseFloat(record.data.plan3);
        desglose += parseFloat(record.data.proyec3);
        //
        desglose += parseFloat(record.data.ejecutado4);
        desglose += parseFloat(record.data.estimado4);
        desglose += parseFloat(record.data.plan4);
        desglose += parseFloat(record.data.proyec4);

        _this.arraydesglose[0] = desglose;

        return _this.arraydesglose;
    }


};