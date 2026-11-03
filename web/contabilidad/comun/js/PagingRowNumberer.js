/**
 * Ext.LOG.PagingRowNumberer Extensión
 *
 * @autor Alien Fernández Fuentes
 * @version 1.0
 *
 * @Clase Ext.LOG.PagingRowNumberer
 * @extends Ext.grid.RowNumberer
 * @param {Object}
 *            config Opciones de configuración
 *
 * La Extensión se usa de la misma forma que Ext.grid.RowNumberer <code>
	cm = new Ext.grid.ColumnModel([
		new Ext.LOG.PagingRowNumberer()
	]);
 *</code>
 */

// Creando el ámbito de objetos (Ext.LOG)
if (!Ext.LOG)
	Ext.ns('Ext.LOG');

Ext.LOG.PagingRowNumberer = function(config) {
	// Llamada a la clase padre constructora
	Ext.LOG.PagingRowNumberer.superclass.constructor.call(this, config);

	/*
	 * Propiedades de PagingRowNumberer
	 */
	this.width = (this.nwidth) ? this.nwidth : 35;

} // Termina la construccion del elemento

// Extendiendo la funcionalidad
Ext.extend(Ext.LOG.PagingRowNumberer, Ext.grid.RowNumberer, {
			header : (this.header) ? this.header : 'N.\xBA',
			renderer : function(v, p, record, rowIndex, colIndex, store) {
				if (this.rowspan) {
					p.cellAttr = 'rowspan="' + this.rowspan + '"';
				}

				var so = store.lastOptions;
				var sop = so ? so.params : null;
				return ((sop && sop.start) ? sop.start : 0) + rowIndex + 1;
			}
		}); // Fin de la extension.

