<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatDocFacturaTransportacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_docfacturatransportacion');
        $this->hasColumn(
            'idfactura', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'identidadchofer', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nombrechofer', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'matriculavehiculo', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'viatransporte', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cartaporte', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bultos', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'sellos', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contenedor', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'licencia', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'bl', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpuertodestino', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'puertodestino', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'destinocomercial', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'prodgenerico', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
