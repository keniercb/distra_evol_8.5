<?php


abstract class BaseCierreNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_cierrenomina');

        $this->hasColumn('idperiodo', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_cierrenomina'
        ));

        $this->hasColumn('identidad', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));
        $this->hasColumn('cuenta', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,

        ));
        $this->hasColumn('tipopago', 'character varying', 15, array(
            'type' => 'character varying',
            'length' => 15,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('estado', 'character varying', 19, array(
            'type' => 'character varying',
            'length' => 19 ,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('debitocont', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('creditocont', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('debitonomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('creditonomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('importecont', 'numeric', 19, array(
            'type' => 'numeric',
            'length' =>19 ,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('diferenciaimporte', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('importenomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' =>19 ,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('acumuladocont', 'numeric', 19, array(
            'type' => 'numeric',
            'length' =>19 ,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('acumuladonomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' =>19 ,
            'notnull' => true,
            'primary' => false,
        ));


    }
}