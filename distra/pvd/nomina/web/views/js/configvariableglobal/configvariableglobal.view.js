Ext.ns('Pvd.Nomina.Configuracion.VariableGlobal');

Ext.QuickTips.init();

//Vista del componente Configurar variables globales.
Pvd.Nomina.Configuracion.VariableGlobal.Vista = {
    /**
     * Inicializar la vista.
     *
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Configurar variables globales (Tipo: Pvd.Nomina.Configuracion.VariableGlobal.Modelo).
     */
    init: function (perfil, idioma, modelo) {
        var self = this;

        //Campo para insertar el valor de la variable global.
        this.valorVariableSist = new Ext.form.TextField({
            name: 'valorvariable',
            regex: /^([1-9]+(\d*)?)+$/

            //blankText:idioma.lbErrorCampoVacio,
            /*maxLength:idioma.lbErrorCampoVacio,
             maxLengthText:idioma.lbErrorCampoVacio,
             minLength:idioma.lbErrorCampoVacio,
             minLengthText:idioma.lbErrorCampoVacio,
             maskRe:idioma.lbErrorCampoVacio,
             regex:idioma.lbErrorCampoVacio,
             regexText:idioma.lbErrorCampoVacio*/
        });

        this.valorVariableSistNum = new Ext.form.NumberField({
            name: 'valorvariable',
            allowBlank: false,
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999.9999,
            minValue: 0.0000,
            decimalPrecision: 8,
            nanText: 'Este valor es incorrecto.',
            blankText: 'Este campo es obligatorio.'
        });

        this.valorVariableEnt = new Ext.form.NumberField({
            name: 'valorvariable',
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999.9999,
            minValue: 0.0000,
            decimalPrecision: 8,
            nanText: 'Este valor es incorrecto.',
        });
        this.valorVariableCargo = new Ext.form.NumberField({
            name: 'valorvariable',
            allowDecimals: true,
            allowNegative: false,
            maxValue: 999999.9999,
            minValue: 0.0000,
            decimalPrecision: 8,
            nanText: 'Este valor es incorrecto.',
        });

        //Función auxiliar para centrar los valores del grid.
        function centrarValor(val) {
            if (val)
                return "<center>" + val + "</center>";
        }

        //Colunmodel del grid de configurar variables a nivel de sistema.
        this.cmNivelsist = [{
            header: 'idvariableglobal',
            hideable: false,
            hidden: true,
            width: 50,
            dataIndex: 'idvariableglobal'
        }
            , {
                header: 'idvariableglobalvalor',
                hideable: false,
                hidden: true,
                width: 50,
                dataIndex: 'idvariableglobalvalor'
            }
            , {header: idioma.lbColDenominacion, width: 300, fixed: true, sortable: true, dataIndex: 'denominacion'}
            , {
                header: '<center>' + idioma.lbColAbrevVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'abreviatura',
                renderer: centrarValor
            }
            , {
                header: '<center>' + idioma.lbColValorVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'valor',
                renderer: centrarValor,
                //editor: this.valorVariableSist
                editor: this.valorVariableSistNum
            }
        ];


        //Grid de configurar variables a nivel de sistema.
        this.gpNivelSist = new Ext.grid.EditorGridPanel({
            id: 'idgpNivelSist',
            title: idioma.lbTitleGpNivelSist,
            region: 'center',
            columns: this.cmNivelsist,
            stripeRows: true,
            autoScroll: true,
            border: false,
            width: '100%',
            heigth: '100%',
            clicksToEdit: 1,
            viewConfig: {forceFit: true},
            store: modelo.storeGpNivelSist,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Botón de guardar los cambios de configurar variables a nivel de sistema.
        this.btnGuardarNSist = new Ext.Button({
            id: 'idbtnGuardarNSist',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarNSist,
//            icon: perfil.dirImg+'guardar.png',
            iconCls: 'guardar',
            prevTab: 'idbtnGuardarNSist',
            nextTab: 'idbtnGuardarNSist',
        });

        this.btnAyudaVariable = new Ext.Button({
            id: 'btnAyudaVariable',
            text: 'Ayuda',
            tooltip: 'Ayuda',
//            icon: perfil.dirImg+'ayuda.png',
            iconCls: 'ayuda',
            prevTab: 'idbtnGuardarNSist',
            nextTab: 'idbtnGuardarNSist',

        });

        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.panelEstEnt = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'west',
            width: '50%',
            heigth: '100%',
            nivel: 5,
        });

        //Colunmodel del grid de configurar variables a nivel de entidad.
        this.cmNivelEnt = [{
            header: 'idvariableglobal',
            hideable: false,
            hidden: true,
            width: 50,
            dataIndex: 'idvariableglobal'
        }
            , {
                header: 'idvariableglobalvalor',
                hideable: false,
                hidden: true,
                width: 50,
                dataIndex: 'idvariableglobalvalor'
            }
            , {header: idioma.lbColDenominacion, width: 300, fixed: true, sortable: true, dataIndex: 'denominacion'}
            , {
                header: '<center>' + idioma.lbColAbrevVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'abreviatura',
                renderer: centrarValor
            }
            , {
                header: '<center>' + idioma.lbColValorVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'valor',
                renderer: centrarValor,
                editor: this.valorVariableEnt
            }
        ];


        //Grid de configurar variables a nivel de entidad.
        this.gpNivelEnt = new Ext.grid.EditorGridPanel({
            id: 'idgpNivelEnt',
            title: idioma.lbTitleGpNivelEntidad,
            region: 'center',
            columns: this.cmNivelEnt,
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            heigth: '100%',
            clicksToEdit: 1,
            viewConfig: {forceFit: true},
            store: modelo.storeGpNivelEnt,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Botón de guardar los cambios de configurar variables a nivel de entidad.
        this.btnGuardarNEnt = new Ext.Button({
            id: 'idbtnGuardarNEnt',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarNEnt,
//            icon: perfil.dirImg+'guardar.png',
            iconCls: 'guardar',
            prevTab: 'idbtnGuardarNEnt',
            nextTab: 'idbtnGuardarNEnt',
        });

        //Panel de estructura y composición que cargo hasta el nivel de cargos.
        this.panelEstCargo = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'west',
            width: '50%',
            heigth: '100%',
        });

        //Colunmodel del grid de configurar variables a nivel de cargo.
        this.cmNivelCargo = [{
            header: 'idvariableglobal',
            hideable: false,
            hidden: true,
            width: 50,
            dataIndex: 'idvariableglobal'
        }
            , {
                header: 'idvariableglobalvalor',
                hideable: false,
                hidden: true,
                width: 50,
                dataIndex: 'idvariableglobalvalor'
            }
            , {header: idioma.lbColDenominacion, width: 300, fixed: true, sortable: true, dataIndex: 'denominacion'}
            , {
                header: '<center>' + idioma.lbColAbrevVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'abreviatura',
                renderer: centrarValor
            }
            , {
                header: '<center>' + idioma.lbColValorVarGlobal + '</center>',
                fixed: true,
                width: 100,
                sortable: true,
                dataIndex: 'valor',
                renderer: centrarValor,
                editor: this.valorVariableCargo
            }
        ];


        //Grid de configurar variables a nivel de cargo.
        this.gpNivelCargo = new Ext.grid.EditorGridPanel({
            id: 'idgpNivelCargo',
            title: idioma.lbTitleGpNivelCargo,
            region: 'center',
            columns: this.cmNivelCargo,
            stripeRows: true,
            autoScroll: true,
            border: true,
            width: '50%',
            heigth: '100%',
            clicksToEdit: 1,
            viewConfig: {forceFit: true},
            store: modelo.storeGpNivelCargo,
            loadMask: {msg: idioma.lbMaskGridCargando},
        });

        //Botón de guardar los cambios de configurar variables a nivel de cargo.
        this.btnGuardarNCargo = new Ext.Button({
            id: 'idbtnGuardarNCargo',
            text: idioma.lbBtnGuardar,
            tooltip: idioma.textToolTipGuardarNCargo,
//            icon: perfil.dirImg+'guardar.png',
            iconCls: 'guardar',
            prevTab: 'idbtnGuardarNCargo',
            nextTab: 'idbtnGuardarNCargo',
        });


        //TabPanel de Configurar variables globales.
        this.tabPanelConfigVar = new Ext.TabPanel({
            id: 'idtabPanelConfigVar',
            enableTabScroll: true,
            defaults: {autoScroll: true},
            resizeTabs: true,
            border: false,
            width: '100%',
            height: '100%',
            activeTab: 0,
            frame: true,
            items: [{
                id: 'idtabsistema',
                layout: 'fit',
                title: idioma.lbTitleTabSistema,
                tbar: [this.btnGuardarNSist, '->', this.btnAyudaVariable],
                items: [this.gpNivelSist],
                keys: [
                    {
                        key: 'g',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnGuardarNSist.handler();
                        }
                    }
                ]
            }, {
                id: 'idtabentidad',
                layout: 'border',
                title: idioma.lbTitleTabEntidad,
                tbar: [this.btnGuardarNEnt],
                items: [this.panelEstEnt, this.gpNivelEnt],
                keys: [
                    {
                        key: 'g',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnGuardarNEnt.handler();
                        }
                    }
                ]
            }, {
                id: 'idtabcargo',
                layout: 'border',
                title: idioma.lbTitleTabCargo,
                tbar: [this.btnGuardarNCargo],
                items: [this.panelEstCargo, this.gpNivelCargo],
                keys: [
                    {
                        key: 'g',
                        alt: true,
                        stopEvent: true,
                        fn: function () {
                            self.btnGuardarNCargo.handler();
                        }
                    }
                ]
            }]
        });

        //Vista general de la interfaz.
        new Ext.Viewport({
            layout: 'fit',
            title: idioma.lbTitleTabCargo,
            items: [this.tabPanelConfigVar]
        });

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configvariableglobal', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];

    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.VariableGlobal.Modelo;
    modelo.init();
    //Inicializando la vista.
    var vista = Pvd.Nomina.Configuracion.VariableGlobal.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.VariableGlobal.Controlador.init(idioma, vista, modelo);
});
