<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatIndicadorext extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_indicadorext');
        $this->hasColumn(
            'idindicadorext', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfacturacion.sec_indicadorext')
        );
        $this->hasColumn(
            'precio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idactividad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idelementoexterno', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoprecio', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
