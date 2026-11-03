<?php

abstract class BaseDatDireccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_direccion');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('oficial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('direccion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmunicipio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprovincia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpais', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'iddireccion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_direccion')
        );
    }

}

