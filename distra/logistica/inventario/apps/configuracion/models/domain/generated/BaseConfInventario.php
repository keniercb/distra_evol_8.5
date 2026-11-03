<?php

abstract class BaseConfInventario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('conf_inventario');

        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'usarcategoria', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'usarubicacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contintegrada', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'firmadigital', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'comprobante', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'registrarcantidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
         $this->hasColumn(
            'almacen', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
//        $this->hasColumn(
//            'descuentorecargo', 'numeric', null,
//            array('notnull' => false, 'primary' => false)
//        );
        $this->hasColumn(
            'idtipotasa', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomsubordinacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'coddenominacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tarjeta', 'numeric', null,
            array('notnull' => false, 'primary' => false)  
        );
        $this->hasColumn(
            'cuadrediario', 'numeric', null,
            array('notnull' => false, 'primary' => false)  
        );
        $this->hasColumn(
            'ordenproducto', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'farmaciaintegrada', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
