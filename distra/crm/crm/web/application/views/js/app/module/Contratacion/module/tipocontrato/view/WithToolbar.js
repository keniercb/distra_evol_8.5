Ext.define('TipoContrato.view.WithToolbar', {
    extend: 'Ext.ux.aceeditor.Panel',
    alias: 'widget.withToolbar',

    initComponent: function () {
        this.getLang();
        var me = this,
            toolbar = [
                {
                    handler: me.undo,
                    scope: me,
                    iconCls: 'icondistra-deshacer',
                    tooltip: me.etiquetas.lbundo
                },
                {
                    handler: me.redo,
                    scope: me,
                    iconCls: 'icondistra-hacer',
                    tooltip: me.etiquetas.lbredo
                },
                '->',
                {
                    iconCls: 'icondistra-configuracion',
                    tooltip: me.etiquetas.lbconfiguracion,
                    menu: {
                        xtype: 'menu',
                        plain: true,
                        items: [{
                            text: me.etiquetas.lbMostrarEspaciosEnBlanco,
                            handler: function () {
                                me.showInvisible = (me.showInvisible) ? false : true;
                                me.editor.setShowInvisibles(me.showInvisible);
                            },
                            checked: (me.showInvisible),
                            scope: me
                        },
                            {
                                text: me.etiquetas.lbPlegadoDelCodigo,
                                handler: function () {
                                    me.codeFolding = (me.codeFolding) ? false : true;
                                    me.editor.setShowFoldWidgets(me.codeFolding);
                                },
                                checked: (me.codeFolding),
                                scope: me
                            },
                            {
                                text: me.etiquetas.lbResaltarLineaActiva,
                                handler: function () {
                                    me.highlightActiveLine = (me.highlightActiveLine) ? false : true;
                                    me.editor.setHighlightActiveLine(me.highlightActiveLine);
                                },
                                checked: (me.highlightActiveLine),
                                scope: me
                            },
                            {
                                text: me.etiquetas.lbMostrarNumerosDeLinea,
                                handler: function () {
                                    me.showGutter = (me.showGutter) ? false : true;
                                    me.editor.renderer.setShowGutter(me.showGutter);
                                },
                                checked: (me.showGutter),
                                scope: me
                            },
                            {
                                text: me.etiquetas.lbResaltarPalabraSeleccionada,
                                handler: function () {
                                    me.highlightSelectedWord = (me.highlightSelectedWord) ? false : true;
                                    me.editor.setHighlightSelectedWord(me.highlightSelectedWord);
                                },
                                checked: (me.highlightSelectedWord),
                                scope: me
                            },
                            {
                                xtype: 'menuseparator'
                            },
                            Ext.create('Ext.container.Container', {
                                layout: {
                                    type: 'hbox'
                                },
                                items: [{
                                    xtype: 'menuitem',
                                    text: me.etiquetas.lbTamanhoDeFuente,
                                    handler: function () {
                                    },
                                    flex: 1,
                                    checked: (me.highlightSelectedWord),
                                    scope: me
                                },
                                    {
                                        fieldStyle: 'text-align: right',
                                        hideLabel: true,
                                        xtype: 'numberfield',
                                        value: me.fontSize,
                                        minValue: 6,
                                        maxValue: 72,
                                        width: 45,
                                        flex: 0,
                                        height: 22,
                                        plain: true,
                                        listeners: {
                                            change: function (field, value) {
                                                me.fontSize = value;
                                                me.setFontSize(me.fontSize + "px");
                                            }
                                        }
                                    }]
                            }),
                            Ext.create('Ext.container.Container', {
                                layout: {
                                    type: 'hbox'
                                },
                                width: 200,
                                items: [{
                                    xtype: 'menuitem',
                                    text: me.etiquetas.lbMargenDerecho,
                                    handler: function () {
                                    },
                                    flex: 1,
                                    checked: (me.highlightSelectedWord),
                                    scope: me
                                },
                                    {
                                        fieldStyle: 'text-align: right',
                                        hideLabel: true,
                                        xtype: 'numberfield',
                                        value: me.printMarginColumn,
                                        minValue: 1,
                                        maxValue: 200,
                                        width: 45,
                                        flex: 0,
                                        height: 22,
                                        plain: true,
                                        listeners: {
                                            change: function (field, value) {
                                                me.printMarginColumn = value;
                                                me.editor.setPrintMarginColumn(me.printMarginColumn);
                                            }
                                        }
                                    }]
                            }),
                            {
                                xtype: 'menuseparator'
                            },
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'hbox'
                                },
                                width: 240,
                                items: [{
                                    xtype: 'menuitem',
                                    text: me.etiquetas.lbTema
                                },
                                    {
                                        xtype: 'combo',
                                        mode: 'local',
                                        flex: 1,
                                        value: me.theme,
                                        triggerAction: 'all',
                                        editable: false,
                                        name: 'Theme',
                                        displayField: 'name',
                                        valueField: 'value',
                                        queryMode: 'local',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['name',
                                                'value'],
                                            data: [{
                                                value: 'ambiance',
                                                name: 'Ambiance'
                                            },
                                                {
                                                    value: 'chrome',
                                                    name: 'Chrome'
                                                },
                                                {
                                                    value: 'clouds',
                                                    name: 'Clouds'
                                                },
                                                {
                                                    value: 'clouds_midnight',
                                                    name: 'Clouds Midnight'
                                                },
                                                {
                                                    value: 'cobalt',
                                                    name: 'Cobalt'
                                                },
                                                {
                                                    value: 'crimson_editor',
                                                    name: 'Crimson Editor'
                                                },
                                                {
                                                    value: 'dawn',
                                                    name: 'Dawn'
                                                },
                                                {
                                                    value: 'dreamweaver',
                                                    name: 'Dreamweaver'
                                                },
                                                {
                                                    value: 'eclipse',
                                                    name: 'Eclipse'
                                                },
                                                {
                                                    value: 'idle_fingers',
                                                    name: 'idleFingers'
                                                },
                                                {
                                                    value: 'kr_theme',
                                                    name: 'krTheme'
                                                },
                                                {
                                                    value: 'merbivore',
                                                    name: 'Merbivore'
                                                },
                                                {
                                                    value: 'merbivore_soft',
                                                    name: 'Merbivore Soft'
                                                },
                                                {
                                                    value: 'mono_industrial',
                                                    name: 'Mono Industrial'
                                                },
                                                {
                                                    value: 'monokai',
                                                    name: 'Monokai'
                                                },
                                                {
                                                    value: 'pastel_on_dark',
                                                    name: 'Pastel on dark'
                                                },
                                                {
                                                    value: 'solarized_dark',
                                                    name: 'Solarized Dark'
                                                },
                                                {
                                                    value: 'solarized_light',
                                                    name: 'Solarized Light'
                                                },
                                                {
                                                    value: 'textmate',
                                                    name: 'TextMate'
                                                },
                                                {
                                                    value: 'twilight',
                                                    name: 'Twilight'
                                                },
                                                {
                                                    value: 'tomorrow',
                                                    name: 'Tomorrow'
                                                },
                                                {
                                                    value: 'tomorrow_night',
                                                    name: 'Tomorrow Night'
                                                },
                                                {
                                                    value: 'tomorrow_night_blue',
                                                    name: 'Tomorrow Night Blue'
                                                },
                                                {
                                                    value: 'tomorrow_night_bright',
                                                    name: 'Tomorrow Night Bright'
                                                },
                                                {
                                                    value: 'tomorrow_night_eighties',
                                                    name: 'Tomorrow Night 80s'
                                                },
                                                {
                                                    value: 'vibrant_ink',
                                                    name: 'Vibrant Ink'
                                                }]
                                        }),
                                        listeners: {
                                            change: function (field, value) {
                                                me.theme = value;
                                                me.setTheme(me.theme);
                                            }
                                        }
                                    }]
                            }]
                    }
                }];

        var wordCount = Ext.create('Ext.toolbar.TextItem', {text: 'Position: 0'}),
            lineCount = Ext.create('Ext.toolbar.TextItem', {text: 'Line: 0'});


        Ext.apply(me, {
            tbar: toolbar
        });

        me.on('editorcreated', function () {
            me.editor.selection.on("changeCursor", function (e) {
                var c = me.editor.selection.getCursor(),
                    l = c.row + 1;

                wordCount.update('Position: ' + c.column);
                lineCount.update('Line: ' + l);
            }, me);
            me.editor.on('blur', function () {
                me.up().fireEvent('blureditor');
            });
        });

        me.callParent(arguments);
    },

    saveValue: function () {
        me.editor.getSession().getValue();
    },

    pushValue: function (value) {
        me.editor.getSession().setValue(value);
    }
});