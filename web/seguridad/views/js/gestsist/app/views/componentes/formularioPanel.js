/**
 * Created by lilianne on 29/01/15.
 */
Ext.require([
    'Ext.form.*',
    'Ext.layout.container.Column',
    'Ext.tab.Panel',
    'Ext.fx.target.Element'
]);

Ext.define('Conf.view.gestsist.formularioPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formularioPanel',

    initComponent: function() {

        Ext.define("Controlpanel.model.estado", {
            extend : 'Ext.data.Model',
            fields  : [
                {type: 'string', name : 'icon'}
            ]
        });

        var store =  Ext.create('Ext.data.Store', {
            model: 'Conf.model.ModelStoreComboBox',
            proxy   : {
            type   : 'ajax',
            url : 'cargarCmbIconFonts',
            reader : {
                type          : 'json',
                root          : 'icons'
            }},
            autoLoad: true
        });

        var combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: perfil.etiquetas.fieldLabelIcono,
            displayField: 'icon',
            width: 320,
            labelWidth: 130,
            store:store,
            queryMode: 'local',
            name: 'icono',
            id: 'icono',
            nextTab:'descripcion',
            prevTab:'denominacion',
            hiddenName: 'icono',
            editable: true,
            typeAhead: true,
            forceSelection : true,
            tpl :   '<tpl for=".">'+
            '<li class="x-boundlist-item">'+
            '<span class="icondistra-{icon}"></span>'+
            '{icon}</li></tpl>',
            maxLength : 30,
            maxLengthText : perfil.etiquetas.maxLengthText

        });

        this.id = 'formularioPanel';
        this.name = 'formularioPanel';
        this.region = 'north';
        this.frame = true;
        this.border = false;
        this.bodyStyle = 'padding:5px 5px 2px';

        this.collapsible = true;
        this.collapseMode = 'mini';
        this.collapsed = false;
        this.split = true;
        this.animCollapse = true;
        this.hideCollapseTool = true;

        this.fieldDefaults = {
            msgTarget: 'qtip',
            labelWidth: 80,
            labelAlign: 'top'
        };
        this.defaults = {
            anchor: '99.5%'
        };
        this.items = [{
            xtype:'fieldset',
            id: 'fieldsetformPanel',
            name:'fieldsetformPanel',
            title: perfil.etiquetas.titleFieldset,//'Información',
            //collapsible: true,
            defaultType: 'textfield',
            layout: 'column',
            defaults: {
                anchor: '100%',
                style: 'padding: 8px 0 0 0'
            },
            height : 130,
            //store: record,
            items :[
                {
                xtype: 'container',
                columnWidth:.2,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {anchor: '95%', enableKeyEvents: true},
                items: [{
                    fieldLabel: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
                    name:'denominacion',
                    id: 'denominacion',
                    allowBlank: false,
                    blankText: perfil.etiquetas.blankText,//'Este campo es obligatorio.',
                    regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                    regexText: perfil.etiquetas.regexText1,//"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
                    nextTab:'icono',
                    prevTab:'btnBuscarReferencia',
                    maxLength: 60,
                    maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                    listeners: {
                        keydown: function (textField,eventObject){
                            //console.log(eventObject);
                            var ok = textField.getValue().length < 60;
                            var key = eventObject.getKey();
                            //console.log(key);
                            if(key == 46){
                                //console.log(Ext.getCmp('treeDD').keyMap);
                                if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                }

                            }
                            if(key == 68 && eventObject.shiftKey){
                                console.log('entro aqui');
                                if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                            }
                            if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                textField.enableKeyEvents = true;
                                return;
                            }
                            else if(!ok){
                                eventObject.stopEvent();
                                return ;
                            }
                        }
                    }
                }, {
                    fieldLabel: perfil.etiquetas.fieldLabelAbreviatura,//'Abreviatura',
                    id: 'abreviatura',
                    name: 'abreviatura',
                    nextTab:'referencia',
                    prevTab:'visibilidad',
                    regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                    regexText: perfil.etiquetas.regexText1,//"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
                    maxLength: 50,
                    maxLengthText: perfil.etiquetas.textMaximoCaracteres,

                    minLength: 2,
                    minLengthText: perfil.etiquetas.textMinimoCaracteres,

                    listeners: {
                        keydown: function (textField,eventObject){
                            //console.log(eventObject);
                            var ok = textField.getValue().length < 50;
                            var key = eventObject.getKey();
                            //console.log(key);
                            if(key == 46){
                                //console.log(Ext.getCmp('treeDD').keyMap);
                                if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                }

                            }
                            if(key == 68 && eventObject.shiftKey){
                                //console.log('entro aqui');
                                if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                            }
                            if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                textField.enableKeyEvents = true;
                                return;
                            }
                            else if(!ok){
                                eventObject.stopEvent();
                                return ;
                            }
                        }
                    }
                }]
                },
                {
                    xtype: 'container',
                    columnWidth:.2,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: {anchor: '95%'},
                    items: [combo/*{
                        fieldLabel: perfil.etiquetas.fieldLabelIcono,//'Ícono',
                        name: 'icono',
                        regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóÁÉÍÓÚúñÑ\d\_\s]*))$/,
                        regexText: perfil.etiquetas.regexText2,//"Solo admite caracteres alfanuméricos."
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                console.log(eventObject);
                                var ok = textField.getValue().length < 255;
                                var key = eventObject.getKey();
                                console.log(key);
                                if(key == 8 || key == 46 || key == 37 || key == 39){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }
                        }*/,
                        {
                            xtype: 'container',
                            layout: 'column',
                            defaults: {anchor: '100%'},
                            id: 'refebuton',
                            //width: '100%',
                            items: [{
                                xtype: 'textfield',
                                //defaults: {anchor: '98%'},
                                columnWidth:.9,
                                id: 'referencia',
                                name: 'referencia',
                                nextTab:'btnBuscarReferencia',
                                prevTab:'abreviatura',
                                emptyText: perfil.etiquetas.cajaReferencia,//'Seleccione la referencia',
                                fieldLabel: perfil.etiquetas.fieldLabelReferencia,//'Referencia',
                                allowBlank: false,
                                blankText: perfil.etiquetas.blankText, //'Este campo es obligatorio.'
                                regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-\.\:\/]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                                regexText: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_/.:)",
                                enableKeyEvents: true,
                                maxLength: 255,
                                maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                                listeners: {
                                    keydown: function (textField,eventObject){
                                        //console.log(eventObject);
                                        var ok = textField.getValue().length < 255;
                                        var key = eventObject.getKey();
                                        //console.log(key);
                                        if(key == 46){
                                            //console.log(Ext.getCmp('treeDD').keyMap);
                                            if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                                textField.enableKeyEvents = true;
                                                return
                                            }
                                            else{
                                                Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                            }

                                        }
                                        if(key == 68 && eventObject.shiftKey){
                                            //console.log('entro aqui');
                                            if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                                textField.enableKeyEvents = true;
                                                return
                                            }
                                            else{
                                                Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                                textField.enableKeyEvents = true;
                                                return;
                                            }
                                        }
                                        if(key == 8 || key == 46 || key == 37 || key == 39 || key == 35 || key == 36){
                                            textField.enableKeyEvents = true;
                                            return;
                                        }
                                        else if(!ok){
                                            eventObject.stopEvent();
                                            return ;
                                        }
                                    }
                                }

                            },
                            {

                                xtype: 'button',
                                columnWidth:.1,
                                //defaults: {anchor: '100%'},
                                //text:'...',
                                tooltip: perfil.etiquetas.buscarReferencia,//'Buscar referencia (Alt+W)',
                                margin: '21 0 0 0',
                                nextTab:'denominacion',
                                prevTab:'referencia',
                                //style: 'padding: 2px 15px 2px 2px',
                                //style:'top: 19',
                                //styleHtmlContent: true,
                                iconCls: 'buscar',
                                id: 'btnBuscarReferencia',
                                action: 'buscarReferencia'

                            }]
                        }
                        ]
                },
                {
                    xtype: 'container',
                    columnWidth:.5,
                    layout: 'anchor',
                    defaultType: 'textarea',
                    defaults: {anchor: '98%'},
                    items: [{
                        fieldLabel: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
                        id: 'descripcion',
                        name: 'descripcion',
                        nextTab:'visibilidad',
                        prevTab:'icono',
                        maxLength: 255,
                        maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                        regex : /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-\,\.\s]*))$/,
                        regexText : perfil.etiquetas.regexValidaDescripcion,
                        height : '81%',
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 255;
                                var key = eventObject.getKey();
                                
                                //console.log(eventObject.shiftKey);
                                //console.log(eventObject.isSpecialKey());
                                if(key == 46 ){

                                    //console.log(Ext.getCmp('treeDD').keyMap);
                                    if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                        textField.enableKeyEvents = true;
                                        return
                                    }
                                    else{
                                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                    }

                                }
                                if(key == 68 && eventObject.shiftKey){
                                    //console.log('entro aqui');
                                    if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                        textField.enableKeyEvents = true;
                                        return
                                    }
                                    else{
                                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                        textField.enableKeyEvents = true;
                                        return;
                                    }
                                }
                                if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }
                    }]
                },
                {
                    xtype: 'container',
                    //width : 100,
                    columnWidth:.1,
                    layout: 'anchor',
                    defaultType: 'checkbox',//'checkboxgroup'
                    defaults: {
                        itemsAlign: 'center',
                        anchor: '100%',
                        hideEmptyLabel: false
                    },
                    style: 'padding:27px 0px 0px 5px',
                    items: [{
                        boxLabel: perfil.etiquetas.boxLabelVisibilidad,//'Visibilidad',
                        id: 'visibilidad',
                        name: 'visibilidad',
                        inputValue: 'visibilidad',
                        nextTab:'abreviatura',
                        prevTab:'descripcion'
                    }, {
                        boxLabel: perfil.etiquetas.boxLabelExterno,//'Externo',
                        id: 'externo',
                        name: 'externo',
                        style: 'padding: 7px 0px 0px 0px',
                        inputValue: 'externo',
                        nextTab:'abreviatura',
                        prevTab:'descripcion'
                    }]
                }

            ]
        }];


        this.callParent(arguments);
    }

});
