<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatServFactura extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_servfactura');
        $this->hasColumn(
            'idservfactura', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_datservfactura')
        );
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idservicio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tarifa', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tarifacontable', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
