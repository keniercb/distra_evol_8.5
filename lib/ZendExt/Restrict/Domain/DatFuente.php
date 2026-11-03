<?php
class ZendExt_Restrict_Domain_DatFuente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_actorfuente.dat_fuente');
        $this->hasColumn('descripcion', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactor', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idgradoconfiabilidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmedioinformacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipofuenteinformacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dominio', 'bit', 1, array('notnull' => true, 'primary' => false, 'default' => '1'));
    }

    public function setUp()
    {
        //$this->hasOne('NomTipofuenteinformacion', array('local'=>'idtipofuenteinformacion',
        //              'foreign'=>'idtipofuenteinformacion'));
        //$this->hasOne('NomMedioinformacion', array('local'=>'idmedioinformacion', 'foreign'=>'idmedioinformacion'));
        //$this->hasOne('NomConfiabilidad', array('local'=>'idgradoconfiabilidad', 'foreign'=>'idconfiabilidad'));
        //$this->hasOne('DatActor', array('local'=>'idactor', 'foreign'=>'idactor'));
        parent::setUp();
    }
} 
