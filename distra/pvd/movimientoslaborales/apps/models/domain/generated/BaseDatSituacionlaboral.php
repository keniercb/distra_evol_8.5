<?php
abstract class BaseDatSituacionlaboral extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_situacionlaboral');
        $this->hasColumn('funciones', 'character varying', 20, array('notnull' => false,'primary' => false));
        $this->hasColumn('fmodmotivo', 'date', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idespcargo', 'numeric', 20, array('notnull' => false,'primary' => false));
        $this->hasColumn('noalta', 'character varying', 20, array('notnull' => false,'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('ueb', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('principal', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idtipocontrato', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idpersonaentidad', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idsituacion', 'numeric', null, array('notnull' => true,'primary' => false));
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idmotivo', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idprogramalaboral', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('idmodalidadempleo', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn('nromn', 'numeric', null, array('notnull' => false,'primary' => false));
        $this->hasColumn(
            'idsituacionlaboralp',
            'numeric',
            null,
            array('notnull' => true,'primary' => true, 'sequence' => 'mod_persona.sec_situacionlaboralp')
        );
    }
}