
Utilidades.Cmp.Cmpconstructor = function(opciones) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.checkResumen = new Ext.form.Checkbox({
        hideLabel: true,
        boxLabel: 'Resumen  ',
        id: 'checkResumenConst',
        checked: true,
        name: 'checkResumenConst',
        handler: function(este, checked) {
            if (checked)
            {
                _this.ConfigurarColumnas(1);
            }
            else {
                _this.ConfigurarColumnas(0);
            }
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaconstructor',
        text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad',
        icon: perfil.dirImg + 'ayuda.png',
        iconCls: 'btn'
    });
    this.tfValorMp = new Ext.form.TextField({
        id: 'tfValorMp',
        name: 'ValorMp',
        disabled: true,
        fieldLabel: "Valor MP",
        anchor: '40%',
        decimalPrecision: 2
    });


    this.tfValorUSD = new Ext.form.TextField({
        id: 'tfValorUSD',
        name: 'ValorUSD',
        disabled: true,
        fieldLabel: "Valor USD",
        anchor: '40%',
        decimalPrecision: 2
    });
    
    this.btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        text: 'Guardar',
        tooltip: 'Guardar constructor',
        iconCls: 'guardar',
        handler: function() {
            _this.guardarDesgloseConst("GuardarValor", false);
//            mostrarMensaje(2, 'No se guardar\xE1n lo datos para los ejercicios Cerrados, plan-proyecci\xF3n de los Aprobados y estimado-plan-proyecci\xF3n de los Ejecutados.', _this.guardarDesgloseConst("GuardarValor"));
        }
    });

    this.btnAjustar = new Ext.Button({
        id: 'btnAjustar',
        text: 'Ajustar',
        tooltip: 'Ajustar constructor',
        iconCls: 'ajustar',
        handler: function() {
            _this.guardarDesgloseConst("guardarAjusteConstructor", true);
        }
    });
    
    this.guardarDesgloseConst = function(url, ajustar){
//        if(btn == 'ok'){
            arrayCons = new Array();
            records = _this.stConstructor.getModifiedRecords();
            idinversion = _this.stConstructor.getAt(0).data.idinversion;
            idetapainversion = _this.stConstructor.getAt(0).data.idetapainversion;

            _this.stConstructor.commitChanges();
            for (var i = 0; i < records.length; i++) {
                arrayCons.push(records[i].data);
            }

            _this.BarraProgreso.show('Guardando valores...');
            Ext.Ajax.request({
                method: "POST",
                url: url,
                params: {
                    valores: Ext.encode(arrayCons),
                    idejercicio: opciones.ejercicio.idejercicio,
                    identidad: opciones.identidad,
                    aaejercicio: opciones.ejercicio.ejercicio - 2,
                    aejercicio: opciones.ejercicio.ejercicio - 1,
                    pejercicio: (parseFloat(opciones.ejercicio.ejercicio) + 1),
                    idinversion: idinversion,
                    idetapainversion: idetapainversion,
                    ajustar: ajustar
                },
                callback: function(options, success, response) {

                    mostrarMensaje(1, 'Los valores se han guardado satisfactoriamente.');
                    _this.stConstructor.reload();
                    _this.BarraProgreso.hide();
                }
            });
//        }
    };

    this.Cmconstructor = new Ext.grid.ColumnModel([
        {
            width: 300, 
            dataIndex: 'denominacion', 
            align: 'left', 
            id: 'expandir', 
            sortable: true
        },
        {
            width: 80, 
            dataIndex: 'ejecutadomp1', 
            align: 'left', 
            summaryType: 'sum', 
            editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), 
            renderer: valorCero
        },
        {
            width: 80, 
            dataIndex: 'ejecutadousd1', 
            align: 'left', 
            summaryType: 'sum', 
            editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), 
            renderer: valorCero
        },
//        {
//            width: 80, 
//            dataIndex: 'estimadomp1', 
//            align: 'left', 
//            summaryType: 'sum', 
//            editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), 
//            renderer: valorCero
//        },
//        {
//            width: 80, 
//            dataIndex: 'estimadousd1', 
//            align: 'left', 
//            summaryType: 'sum', 
//            editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}),
//            renderer: valorCero
//        },
//        {width: 80, dataIndex: 'planmp1', align: 'left', summaryType: 'sum'},
//        {width: 80, dataIndex: 'planusd1', align: 'left', summaryType: 'sum'},
//        {width: 80, dataIndex: 'proyecmp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'proyecusd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'planmp2', align: 'left', summaryType: 'sum'},
//        {width: 80, dataIndex: 'planusd2', align: 'left', summaryType: 'sum'},
//        {width: 80, dataIndex: 'proyecmp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'proyecusd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'estimadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'estimadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'proyecmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'proyecusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'ejecutadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'estimadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'estimadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'planmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
//        {width: 80, dataIndex: 'planusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
//                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
//                regex: /^([0-9]+ ?[0-9]*)+$/,
//                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
    ]);
    this.Cmconstructor.headers = [
        [{header: 'Constructor', rowspan: 4}],
        [
            {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2}, 
            {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2}, 
            {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2}, 
            {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2}
        ],

        [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
            {align: 'left', header: 'Estimado', colspan: 2},
            {align: 'left', header: 'Plan', colspan: 2},
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
            /*{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
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
            {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}*/
        ],
        [
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'},
            {align: 'left', header: 'MP'},
            {align: 'left', header: 'USD'}//,
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'},
//            {align: 'left', header: 'MP'},
//            {align: 'left', header: 'USD'}
        ]


    ];

    this.stConstructor = new Ext.data.Store({
        url: 'cargarContructor',
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
        [{name: 'idconstructor'},
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
                _this.BarraProgreso.show('Cargando constructores...');
                st.baseParams.idejercicio = opciones.ejercicio.idejercicio;
                st.baseParams.identidad = opciones.identidad;
                st.baseParams.aaejercicio = opciones.ejercicio.ejercicio - 2;
                st.baseParams.aejercicio = opciones.ejercicio.ejercicio - 1;
                st.baseParams.pejercicio = (parseFloat(opciones.ejercicio.ejercicio) + 1);
                st.baseParams.limit = _this.cbpaginado.getValue();
                st.baseParams.start = 0;
            },
            load: function(st, r, o) {
                _this.BarraProgreso.hide();
                annpMp = parseFloat(st.reader.jsonData.mppresp) - parseFloat(st.reader.jsonData.mpdesg);
                annpUsd = parseFloat(st.reader.jsonData.usdpresp) - parseFloat(st.reader.jsonData.usddesg);
                annpMp1 = parseFloat(annpMp).toFixed(2);
                annpUsd1 = parseFloat(annpUsd).toFixed(2);
                _this.tfValorMp.setValue(annpMp1);
                _this.tfValorUSD.setValue(annpUsd1);

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
                _this.ptGridconstructor.pageSize = record.data.idnumpag;
                _this.ptGridconstructor.doLoad(_this.ptGridconstructor.cursor);
            }
        }
    });



    this.gpConstructor = new Ext.grid.EditorGridPanel({
        frame: true,
        disabled: false,
        editable: true,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        split: true,
        region: 'center',
        autoScroll: true,
        stripeRows: true,
        store: _this.stConstructor,
        tbar: [_this.btnGuardar, _this.btnAjustar, '->', _this.checkResumen, '-', _this.btnAyuda],
        //sm:smMigracion,
        plugins: [new Ext.ux.plugins.XGrid(), new Ext.grid.GridSummary()],
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
        cm: _this.Cmconstructor,
        bbar: new Ext.PagingToolbar({
            pageSize: _this.cbpaginado.getValue(),
            id: 'constructorid',
            store: _this.stConstructor,
            displayInfo: true,
            items: ['-', 'Resultados por p&aacute;gina : ', _this.cbpaginado, '-', 'Valor MP: ', _this.tfValorMp, '-', 'Valor USD: ', _this.tfValorUSD]
        })
                //[_this.ptGridconstructor, '->', 'Resultados por p&aacute;gina : ', _this.cbpaginado]
    });
    this.ptGridconstructor = new Ext.PagingToolbar({
        pageSize: _this.cbpaginado.getValue(),
        store: _this.stConstructor,
        width: 400,
        displayInfo: true
    });

    this.pConstructor = new Ext.Panel({
        layout: 'border',
        region: 'center',
        border: false,
        frame: true,
        items: [_this.gpConstructor]
    });

    /*  this.winConstructor = new Ext.Window({
     closable: true,
     graggable: false,
     maximized: true,
     modal: true,
     border: false,
     layout: 'border',
     closeAction: 'hide',
     width: 640,
     height: 450,
     buttons: [{
     icon: perfil.dirImg + 'cancelar.png',
     iconCls: 'btn',
     text: 'Cerrar',
     tooltip: 'Cerrar la ventana',
     handler: function() {
     _this.winConstructor.hide();
     }
     }],
     items: [_this.pConstructor]
     });*/

    this.ConfigurarColumnas = function(accion)
    {
        if (accion === 0)
        {
             this.Cmconstructor = new Ext.grid.ColumnModel([
        {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandir', sortable: true},
        {width: 80, dataIndex: 'ejecutadomp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadousd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadomp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadousd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planmp1', align: 'left', summaryType: 'sum'},
        {width: 80, dataIndex: 'planusd1', align: 'left', summaryType: 'sum'},
        {width: 80, dataIndex: 'proyecmp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecusd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planmp2', align: 'left', summaryType: 'sum'},
        {width: 80, dataIndex: 'planusd2', align: 'left', summaryType: 'sum'},
        {width: 80, dataIndex: 'proyecmp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecusd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadomp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadousd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'ejecutadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadomp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'estimadousd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'planusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
        {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
    ]);
            this.Cmconstructor.headers = [
                [{header: 'Constructor', rowspan: 4}],
                [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 8}, 
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 8}, 
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 8}, 
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 8}
                ],
                /* {header: opciones.ejercicio.ejercicio - 2, colspan: 8},
                 {header: opciones.ejercicio.ejercicio - 1, colspan: 8},
                 {header: opciones.ejercicio.ejercicio, colspan: 8},
                 {header: (parseFloat(opciones.ejercicio.ejercicio) + 1), colspan: 8},*/

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
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2}
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


            _this.Cmconstructor = new Ext.grid.ColumnModel([
                {width: 300, dataIndex: 'denominacion', align: 'left', id: 'expandir', sortable: true},
                {width: 80, dataIndex: 'ejecutadomp1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
                {width: 80, dataIndex: 'ejecutadousd1', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
                {width: 80, dataIndex: 'estimadomp2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
                {width: 80, dataIndex: 'estimadousd2', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({/* maskRe: /^([0-9]+ ?[0-9]*)+$/,
                maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                regexText: 'LosmaskRe: /^([0-9]+ ?[0-9]*)+$*/}), renderer: valorCero},
                {width: 80, dataIndex: 'planmp3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'planusd3', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'proyecmp4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                        /*maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                }), renderer: valorCero},
                {width: 80, dataIndex: 'proyecusd4', align: 'left', summaryType: 'sum', editor: new Ext.form.NumberField({
                      /*  maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([0-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'*/
                }), renderer: valorCero}

            ]);


            _this.Cmconstructor.headers = [
                [{header: 'Constructor', rowspan: 4}],
                [
                    {header: opciones.ejercicio.ejercicio - 2 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 2].nombreestado + ')', colspan: 2}, 
                    {header: opciones.ejercicio.ejercicio - 1 + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio - 1].nombreestado + ')', colspan: 2}, 
                    {header: opciones.ejercicio.ejercicio + ' (' + opciones.ejercicios[opciones.ejercicio.ejercicio].nombreestado + ')', colspan: 2}, 
                    {header: (parseFloat(opciones.ejercicio.ejercicio) + 1 + ' (' + opciones.ejercicios[parseFloat(opciones.ejercicio.ejercicio) + 1 ].nombreestado + ')'), colspan: 2}
                ],
                [{align: 'left', header: 'Total ejecutado hasta', colspan: 2},
                    {align: 'left', header: 'Estimado', colspan: 2},
                    {align: 'left', header: 'Plan', colspan: 2},
                    {align: 'left', header: 'Proyecci&oacute;n', colspan: 2},
                ],
                [
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

        _this.gpConstructor.reconfigure(_this.stConstructor, _this.Cmconstructor);
    };

    function valorCero(v) {
        if (!v)
            return 0;
        else
            return v;
    }
    this.pintarFilasErrorneas = function(fila, pintar) {
        if (fila !== undefined) {
            //_this.gpPresupuesoinversion.getView().addRowClass(fila,'superior');

            //console.log(objectrow);
            if (pintar) {
                var backgroundcolor = 'background-color:#FFCCCC';
                //for (var col = 0; col < _this.cmPresupuesoinversion.config.length; col++) {
                //console.log( Ext.get(_this.gpPresupuesoinversion.getView().getCell(0, 1)))//.applyStyles(backgroundcolor);
                //}
            }

            else {
                var backgroundcolor = 'background-color:#FFFFFF';
                for (var col = 0; col < _this.Cmconstructor.config.length; col++) {
                    Ext.get(_this.gpConstructor.getView().getCell(fila, col)).applyStyles(backgroundcolor);
                }
            }

        }

    }

};
