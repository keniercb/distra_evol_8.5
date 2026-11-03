Ext.ns('Ext.Persona');
Ext.Persona.BuscadorFUC = Ext.extend(Ext.Window, {
    title: 'Buscar persona en la Ficha Unica del Ciudadano',
    layout: 'border',
    closeAction: 'hide',
    modal: true,
    width: 595,
    height: 391,
    initComponent: function () {
        var buscadorFUC = this;
        this.btnBuscarFUC = new Ext.Button({
            id: 'btnBuscarFUC',
            text: 'Buscar',
            iconCls: 'buscar',
            disabled: true,
            handler: function () {
                buscadorFUC.storeResultadoFUC.load({
                    params: {
                        identidad_numero: buscadorFUC.tfNumIdentidad.getValue(),
                        primer_nombre: buscadorFUC.tfPrimerNombre.getValue(),
                        primer_apellido: buscadorFUC.tfPrimerApellido.getValue(),
                        segundo_apellido: buscadorFUC.tfSegundoApellido.getValue(),
                        segundo_nombre: buscadorFUC.tfSegundoNombre.getValue(),
                        nombre_madre: buscadorFUC.tfNombreMadre.getValue(),
                        nombre_padre: buscadorFUC.tfNombrePadre.getValue()
                    },
                    callback: function (r, opt, succ) {
                        if (buscadorFUC.storeResultadoFUC.reader.jsonData.codigo == 2) {
                            mostrarMensaje(6, 'La persona no fue encontrada');
                        }
                        if (buscadorFUC.storeResultadoFUC.reader.jsonData.error) {
                            if (buscadorFUC.storeResultadoFUC.reader.jsonData.service)
                                mostrarMensaje(6, 'El servicio de búsqueda en la Ficha Única del Ciudadano no está disponible.');
                            else
                                mostrarMensaje(6, 'Ha ocurrido un error interno en el sistema. Por favor, contacte al administrador.');
                        }
                        else if (buscadorFUC.storeResultadoFUC.reader.jsonData[0].local) {
                            mostrarMensaje(2, 'Se han encontrado resultados para la búsqueda en la base de datos.');
                        }

                    }
                });
            }
        });

        this.btnLimpiarFUC = new Ext.Button({
            id: 'btnLimpiarFUC',
            text: 'Limpiar',
            iconCls: 'limpiar',
            disabled: true,
            handler: function () {
                buscadorFUC.resetFormulario();
            }
        });

        this.tfNumIdentidad = new Ext.form.TextField({
            name: 'identidad_numero',
            fieldLabel: 'No. de identidad',
            width: 101,
            maxLength: 11,
            minLength: 2,
            maskRe: /^([0-9\d]+ ?[0-9\d]*)+$/,
            regex: /^([0-9\d]+ ?[0-9\d]*)+$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfPrimerNombre = new Ext.form.TextField({
            name: 'primer_nombre',
            fieldLabel: 'Nombre',
            maxLength: 70,
            width: 145,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfPrimerApellido = new Ext.form.TextField({
            name: 'primer_apellido',
            fieldLabel: 'Primer apellido',
            maxLength: 70,
            width: 145,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfSegundoApellido = new Ext.form.TextField({
            name: 'segundo_apellido',
            fieldLabel: 'Segundo apellido',
            maxLength: 70,
            width: 145,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfSegundoNombre = new Ext.form.TextField({
            name: 'segundo_nombre',
            fieldLabel: 'Segundo nombre',
            width: 173,
            maxLength: 70,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfNombreMadre = new Ext.form.TextField({
            name: 'nombre_madre',
            fieldLabel: 'Nombre de la madre',
            width: 173,
            maxLength: 70,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.tfNombrePadre = new Ext.form.TextField({
            name: 'nombre_padre',
            fieldLabel: 'Nombre del padre',
            width: 173,
            maxLength: 70,
            maskRe: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            regex: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+(?:[ ¦-][a-zA-ZáéíóúÁÉÍÓÚñÑüÜçÇ.']+)*$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    buscadorFUC.validarFormulario();
                }
            }
        });

        this.fsParamAdicionales = new Ext.form.FieldSet({
            checkboxToggle: true,
            title: 'Parámetros adicionales',
            autoHeight: true,
            labelAlign: 'top',
            collapsed: true,
            layout: 'column',
            items: [
                {columnWidth: 0.33333, layout: 'form', items: this.tfSegundoNombre},
                {columnWidth: 0.33333, layout: 'form', items: this.tfNombreMadre},
                {columnWidth: 0.33333, layout: 'form', items: this.tfNombrePadre}
            ],
            listeners: {
                beforecollapse: function () {
                    buscadorFUC.setHeight(391);
                },
                beforeexpand: function () {
                    buscadorFUC.setHeight(450);
                }
            }
        });

        this.btnAceptarFUC = new Ext.Button({
            id: 'btnAceptarFUC',
            text: 'Aceptar',
            iconCls: 'aceptar',
            disabled: true
        });

        this.btnCancelarFUC = new Ext.Button({
            id: 'btnCancelarFUC',
            text: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
                buscadorFUC.hide();
            }
        });

        this.formParams = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            region: 'center',
            layout: 'form',
            width: '100%',
            autoHeight: true,
            margins: '5 5 5 5',
            items: [{
                layout: 'column',
                items: [
                    {columnWidth: 0.19, layout: 'form', items: this.tfNumIdentidad},
                    {columnWidth: 0.27, layout: 'form', items: this.tfPrimerNombre},
                    {columnWidth: 0.27, layout: 'form', items: this.tfPrimerApellido},
                    {columnWidth: 0.27, layout: 'form', items: this.tfSegundoApellido},
                    {columnWidth: 1, layout: 'form', items: [this.fsParamAdicionales]}
                ]
            }],
            buttonAlign: 'right',
            buttons: [this.btnBuscarFUC, this.btnLimpiarFUC]
        });

        this.storeResultadoFUC = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscadorfuc/buscarpersona',
            reader: new Ext.data.JsonReader(
                {root: '', id: 'id', totalProperty: ''},
                [
                    {name: 'id'},
                    {name: 'identidad_numero'},
                    {name: 'primer_nombre'},
                    {name: 'segundo_nombre'},
                    {name: 'primer_apellido'},
                    {name: 'segundo_apellido'},
                    {name: 'sexo'},
                    {name: 'nombre_madre'},
                    {name: 'nombre_padre'},
                    {name: 'direccion'},
                    {name: 'municipio_residencia_sid'},
                    {name: 'provincia_residencia_sid'},
                    {name: 'nacimiento_fecha'},
                    {name: 'fallecido'},
                    {name: 'fecha_act_rid'},
                    {name: 'fecha_act_fuc'},
                    {name: 'idpersona'},
                    {name: 'idmunres'},
                    {name: 'idprovres'},
                    {name: 'denomprovres'},
                    {name: 'denommunres'},
                    {name: 'nacimiento_municipio'},
                    {name: 'nacimiento_municipio_cod_dpa'},
                    {name: 'nacimiento_provincia'},
                    {name: 'nacimiento_provincia_cod_dpa'},
                ]
            )
        });

        this.smResultadoFUC = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (selectionModel, index, record) {
                    buscadorFUC.btnAceptarFUC.enable();
                },
                rowdeselect: function (selectionModel, index, record) {
                    buscadorFUC.btnAceptarFUC.disable();
                }
            }
        });

        this.gridResultado = new Ext.grid.GridPanel({
            region: 'south',
            store: this.storeResultadoFUC,
            sm: this.smResultadoFUC,
            loadMask: 'Cargando...',
            margins: '0 5 5 5',
            height: 213,
            buttons: [this.btnCancelarFUC, this.btnAceptarFUC],
            columns: [
                new Ext.grid.RowNumberer(),
                {header: 'No. de identidad', dataIndex: 'identidad_numero', width: 88},
                {header: 'Nombre', dataIndex: 'primer_nombre', width: 114},
                {header: 'Segundo nombre', dataIndex: 'segundo_nombre', width: 114},
                {header: 'Primer apellido', dataIndex: 'primer_apellido', width: 114},
                {header: 'Segundo apellido', dataIndex: 'segundo_apellido', width: 114}
            ]
        });

        this.items = [this.formParams, this.gridResultado];

        this.validarFormulario = function () {
            buscadorFUC.activaBtnLimpiar();
            var valido = false;
            var ci = buscadorFUC.tfNumIdentidad.getValue();
            if (ci.length != 0) {
                (buscadorFUC.validarCI(buscadorFUC.tfNumIdentidad.getValue())) ? buscadorFUC.btnBuscarFUC.enable() : buscadorFUC.btnBuscarFUC.disable();
            } else {
                (buscadorFUC.calcularPeso() > 7 && ci.length == 0) ? buscadorFUC.btnBuscarFUC.enable() : buscadorFUC.btnBuscarFUC.disable();
            }
        }

        this.validarCI = function (IDENTID) {
            //Validar número
            var reg = /^\d\d\d\d\d\d\d\d\d\d\d$/;
            if (!reg.test(IDENTID))
                return false;

            var FECHAV = IDENTID.substr(0, 6);
            var SIGLO = IDENTID.substr(6, 1);

            if (SIGLO <= 5) {
                FECHAV = "19" + FECHAV;
            } else if (SIGLO == 9) {
                FECHAV = "18" + FECHAV;
            } else {
                FECHAV = "20" + FECHAV;
            }
            var d = new Date();

            var year = parseInt(FECHAV.substr(0, 4), 10);
            var month = parseInt(FECHAV.substr(4, 2), 10) - 1;
            var day = parseInt(FECHAV.substr(6, 2), 10);
            if (year < 1800 || year > 2100 || month < 0 || month > 11 || day < 0 || day > 31)
                return false;

            d.setFullYear(year);
            d.setMonth(month, day);
            FECHAV = d;

            var TODAY = new Date();
            if (FECHAV > TODAY)
                return false;

            var ID = (IDENTID.charAt(0) * 2) + (IDENTID.charAt(1) * 1) + (IDENTID.charAt(2) * 9) + (IDENTID.charAt(3) * 8) + (IDENTID.charAt(4) * 7) + (IDENTID.charAt(5) * 6) + (IDENTID.charAt(6) * 5) + (IDENTID.charAt(7) * 4) + (IDENTID.charAt(8) * 3) + (IDENTID.charAt(9) * 2);
            ID = (10 - (ID % 10)) % 10;
            if (ID != IDENTID.charAt(10))
                return false;
            return true;
        }
        ;


        this.calcularPeso = function () {
            var peso_ci = 0;
            var peso_nombre = 0;
            var peso_snombre = 0;
            var peso_papell = 0;
            var peso_sapell = 0;
            var peso_nombremadre = 0;
            var peso_nombrepadre = 0;
            if (buscadorFUC.tfNumIdentidad.getValue().length == 2)
                peso_ci = 0.5;
            else if (buscadorFUC.tfNumIdentidad.getValue().length > 2 && buscadorFUC.tfNumIdentidad.getValue().length <= 9)
                peso_ci = buscadorFUC.tfNumIdentidad.getValue().length / 2;
            else if (buscadorFUC.tfNumIdentidad.getValue().length > 9)
                peso_ci = 10;
            if (buscadorFUC.tfPrimerNombre.getValue().length > 2)
                peso_nombre = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            if (buscadorFUC.tfPrimerApellido.getValue().length > 2)
                peso_papell = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            if (buscadorFUC.tfSegundoApellido.getValue().length > 2)
                peso_sapell = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            if (buscadorFUC.tfSegundoNombre.getValue().length > 2)
                peso_snombre = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            if (buscadorFUC.tfNombreMadre.getValue().length > 2)
                peso_nombremadre = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            if (buscadorFUC.tfNombrePadre.getValue().length > 2)
                peso_nombrepadre = buscadorFUC.tfPrimerNombre.getValue().length / 3;
            return peso_ci + peso_nombre + peso_papell + peso_papell + peso_snombre + peso_nombremadre + peso_nombrepadre;
        };

        this.activaBtnLimpiar = function () {
            if (Ext.isEmpty(buscadorFUC.tfNumIdentidad.getValue()) && Ext.isEmpty(buscadorFUC.tfPrimerNombre.getValue())
                && Ext.isEmpty(buscadorFUC.tfPrimerApellido.getValue()) && Ext.isEmpty(buscadorFUC.tfSegundoApellido.getValue())
                && Ext.isEmpty(buscadorFUC.tfSegundoNombre.getValue()) && Ext.isEmpty(buscadorFUC.tfNombreMadre.getValue())
                && Ext.isEmpty(buscadorFUC.tfNombrePadre.getValue()))
                buscadorFUC.btnLimpiarFUC.disable();
            else
                buscadorFUC.btnLimpiarFUC.enable();
        }

        this.resetFormulario = function () {
            buscadorFUC.tfNumIdentidad.reset();
            buscadorFUC.tfPrimerNombre.reset();
            buscadorFUC.tfPrimerApellido.reset();
            buscadorFUC.tfSegundoApellido.reset();
            buscadorFUC.tfSegundoNombre.reset();
            buscadorFUC.tfNombreMadre.reset();
            buscadorFUC.tfNombrePadre.reset();
            buscadorFUC.btnBuscarFUC.disable();
            buscadorFUC.btnLimpiarFUC.disable();
            buscadorFUC.storeResultadoFUC.removeAll();
            buscadorFUC.btnAceptarFUC.disable();
        };

        this.on('show', (th) => {
            th.resetFormulario();
            th.tfNumIdentidad.focus(false, true);
        });

        Ext.Persona.BuscadorFUC.superclass.initComponent.call(this);
    }
});
