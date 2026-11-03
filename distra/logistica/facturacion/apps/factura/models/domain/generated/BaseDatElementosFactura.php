<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatElementosFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_elementosfactura');
        $this->hasColumn(
            'idelementofactura', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datelementofactura')
        );
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        /*$this->hasColumn(
            'preciotarifa', 'numeric', null, array('notnull' => false, 'primary' => false)
        );*/
        $this->hasColumn(
            'importe', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciotarifabase', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciotarifaoriginal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciopromedio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
	$this->hasColumn(
            'idhito', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idprod', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadfactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denomcentrocosto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idactividadmaterial', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idunidadmedida', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'minutosactividad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
