<?php

abstract class BaseDatSituacionlaboral extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_situacionlaboral');
        $this->hasColumn(
            'idsituacionlaboralp', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_situacionlaboralp')
        );
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsituacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersonaentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => false, 'primary' => false));
//        $this->hasColumn('idtipocontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipocontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmotivo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('noalta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('principal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idespcargo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ueb', 'numeric', null, array('notnull' => false, 'primary' => false));
//        $this->hasColumn('area', 'character varying', 255, array('notnull' => false, 'primary' => false));
//        $this->hasColumn('cargo', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }
}