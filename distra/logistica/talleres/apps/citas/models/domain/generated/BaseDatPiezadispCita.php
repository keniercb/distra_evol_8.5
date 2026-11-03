<?php

abstract class BaseDatPiezadispCita extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_piezadispcita');
        $this->hasColumn(
            'idpiezadispcita', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_piezadispcita')
        );
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('dias', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcita', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precioventa', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importe', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precioventaalternativo', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('importealternativo', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('existencia', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', 25, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'varchar', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

