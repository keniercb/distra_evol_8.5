<?php

abstract class BaseDatEstanciaexterior extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_estanciaexterior');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cargo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpais', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmision', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipoestanciaexterior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idestanciaexterior', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_estanciaexterior')
        );
    }

}

