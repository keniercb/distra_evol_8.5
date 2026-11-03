<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:01
 */
abstract class BaseNomSubcategoriaprecio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.nom_subcategoriaprecio');
        $this->hasColumn(
            'idsubcategoria', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfacturacion.sec_subcategoriaprecio')
        );
        $this->hasColumn(
            'idcategoria', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcategoriapadre', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prioridad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'parentpath', 'ltree', null,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }
}
