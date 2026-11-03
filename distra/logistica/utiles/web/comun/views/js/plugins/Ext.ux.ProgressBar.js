/**
 * Ext.ux.ProgressBar
 *
 * @autor Javier González Rodríguez
 * @version 1.0
 * @clase Ext.ux.ProgressBar
 * @param {Object} config Opciones de configuración
 *
 growthColumn = new Ext.ux.ProgressBar({
				width : 60,
				align : 'right',
				textPst : '%', 
				colored : true,
				mal : 65,
				regular : 85,
				label : 'Progreso:'  
	});

 // Ponerlo en el progressbar en la derecha del toolbar
 tbar : ['->',growthColumn.getFormatLabel(),{
                text: growthColumn.getProgressBar( null | # ), 
                id : 'id',
                xtype: 'tbtext'
            }]


 // Para cambiar el valor del progressbar
 Ext.getCmp('id').setText(growthColumn.getProgressBar(86));
 *
 *
 **/

if (!Ext.ux)
    Ext.namespace('Ext.ux');

Ext.ux.ProgressBar = function (config) {
    Ext.apply(this, config);
    Ext.ux.ProgressBar.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.ProgressBar, Ext.util.Observable, {
    textPst: '%',
    colored: false,
    mal: 50,
    regular: 70,
    val: 0,
    label: '',
    getProgressBar: function (v) {
        if (!v)
            v = this.val;
        else
            v = parseFloat(v);
        var style = '';
        var textClass = (v < 55) ? 'x-progress-text-back' : 'x-progress-text-front' + (Ext.isIE6 ? '-ie6' : '');

        var text = String.format('</div><div class="x-progress-text {0}" style="width:100%;" id="{1}"><p style="font-size:13px;">{2}</p></div></div>',
            textClass, Ext.id(), v + this.textPst
        );
        text = (v < 96) ? text.substring(0, text.length - 6) : text.substr(6);

        if (this.colored == true) {
            if (v <= this.mal && v >= 0)
                style = '-red';
            if (v < this.regular && v > this.mal)
                style = '-orange';
            if (v >= this.regular && v <= 100)
                style = '-green';
            if (v > 100)
                style = '-red';
        }

        return String.format('<div class="x-progress-wrap"><div class="x-progress-inner"><div class="x-progress-bar{0}" style="width:{1}%;">{2}</div></div>', style, v, text
        );
    },
    getFormatLabel: function () {
        return String.format('<td class="x-toolbar-cell">{0}</td>', this.label);
    },
    setText: function (id, valor) {
        Ext.getCmp(id).setText(this.getProgressBar(valor));
    }

});
