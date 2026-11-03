<?php

/**
 * Clase base mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class BaseDatCategoriaprecioentidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_categoriaprecioentidad');
        $this->hasColumn(
            'idcategoriaprecioentidad',
            'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idcategoriaprecio',
            'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun',
            'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
