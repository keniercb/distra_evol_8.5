<?php

abstract class BaseNomPartidagasto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_nomina.nom_nivelactiveconom');

        $this->hasColumn('idnivelactiveconom', 'numeric', null, array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_nivelactiveconom'
        ));

//        $this->hasColumn( 'idtipopartidagasto', 'numeric', null, array(
//            'notnull' => true,
//            'primary' => false
//        ));

        $this->hasColumn('fechafin', 'date', null, array(
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('fechainicio', 'date', null, array(
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('descripcion', 'character varying', null, array(
            'notnull' => false,
            'primary' => false
        ));

        $this->hasColumn('denominacion', 'character varying', null, array(
            'notnull' => true,
            'primary' => false
        ));
    }

//    public function setUp(){
//
//        parent::setUp();
//
//        $this->hasMany('NomTipoPartidagasto', array(
//            'local' => 'idtipopartidagasto',
//            'foreign' => 'idtipopartidagasto'
//        ));
//    }

}

