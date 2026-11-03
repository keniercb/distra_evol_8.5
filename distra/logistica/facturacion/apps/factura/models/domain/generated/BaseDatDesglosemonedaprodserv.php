<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDesglosemonedaprodserv extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_desglosemonedaprodserv');
        $this->hasColumn(
            'idesglosemonedaprodserv', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_desglosemonedaprodserv')
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'precio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idprodservicio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descuento', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
