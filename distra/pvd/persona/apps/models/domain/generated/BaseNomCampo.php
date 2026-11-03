<?php

abstract class BaseNomCampo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.nom_campo');
        $this->hasColumn('idconcepto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipodedato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idcampo', 'numeric', null, array(
                'notnull' => false, 'primary' => true, 'sequence' => 'mod_personaproyecto.sec_campo')
        );
    }

}

