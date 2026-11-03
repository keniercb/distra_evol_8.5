<?php

abstract class BaseDatGrupousuario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_grupousuario');
        $this->hasColumn('idgrupousuario', 'numeric', null, array ('notnull' => false,'primary' => true, 'sequence' => 'mod_persona.sec_grupousuario'));
        $this->hasColumn('idusuario', 'numeric', null, array ('notnull' => false,'primary' => true));
        $this->hasColumn('idgrupo', 'numeric', null, array ('notnull' => false,'primary' => true));
		$this->hasColumn('idpersona', 'numeric', 19, array ('notnull' => false,'primary' => true));
    }


}

