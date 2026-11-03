<?php

abstract class BaseNomCategoriaprecio extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.nom_categoriaprecio');
        $this->hasColumn(
            'idcategoriaprecio', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfacturacion.sec_nomcategoriaprecio')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'concepto', 'character varying', 1,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'conformaprecio', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'aplicartodos', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idnommonedatotal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 50,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'base', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'exentoexterior', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
