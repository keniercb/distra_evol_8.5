<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatFacturacontrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_facturacontrato');
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcontrato', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numero', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
