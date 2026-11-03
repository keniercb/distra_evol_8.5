<?php

abstract class BaseDatPlanconsumo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logdistribucion.dat_planconsumo');
        $this->hasColumn('idplanconsumo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('planconsumo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('politicacobertura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minimo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('maximo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaplanconsumo', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechapoliticacobertura', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaexistencia', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaminimo', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechamaximo', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('entregado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pendiente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('enproceso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

