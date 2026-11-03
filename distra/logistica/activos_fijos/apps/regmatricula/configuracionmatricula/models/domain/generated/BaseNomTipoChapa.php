<?php

abstract class BaseNomTipoChapa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.nom_tipochapa');
        $this->hasColumn('idtipochapa', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'sec_nomtipochapa'));
        $this->hasColumn('denominacion', 'character varying', 60, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

}

//fin clase
?>

