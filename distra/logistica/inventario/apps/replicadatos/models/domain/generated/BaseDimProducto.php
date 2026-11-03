<?php

abstract class BaseDimProducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.dim_producto');

        $this->hasColumn(
            'idproducto', 'numeric', null,
            array(
            'notnull' => false,
            'primary' => true
            )
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'nivel', 'numeric', null,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'umedida', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
        $this->hasColumn(
            'pais', 'character varying', 255,
            array(
            'notnull' => false,
            'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
