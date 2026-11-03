<?php

class DatManoObra extends Doctrine_Record
{
    public function setTableDefinition()
    {

        $this->setTableName('mod_logproduccion.dat_manoobra');
        $this->hasColumn('idmanoobra', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_logproduccion.sec_manoobra'));
        $this->hasColumn('idvaleproduccion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
      //  $this->hasOne('DatValeProduccion', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        $this->hasMany('DatValeActividad', array('local' => 'idmanoobra', 'foreign' => 'idmanoobra'));
    }
}