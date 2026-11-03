<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatProdFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_prodfactura');
        $this->hasColumn(
            'idprodfactura', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datprodfactura')
        );
        $this->hasColumn(
            'idmovimiento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciobase', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'factorconvercion', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importefactmn', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importefactalt', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadfactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'referencia', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'referenciaalt', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'importe', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciofactura', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'mediatotal', 'numeric', null, array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}
