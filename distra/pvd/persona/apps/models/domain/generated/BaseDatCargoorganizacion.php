<?php

abstract class BaseDatCargoorganizacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_cargoorganizacion');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnivelorganizacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcargoorganizacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idafiliacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcargoorganizacionp', 'numeric', null, array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_personaext.sec_cargoorganizacionp')
        );
    }

}

