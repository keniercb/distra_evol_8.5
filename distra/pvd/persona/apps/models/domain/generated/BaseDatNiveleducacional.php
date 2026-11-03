<?php

abstract class BaseDatNiveleducacional extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_niveleducacional');
        $this->hasColumn(
            'idniveleducacionalp', 'numeric', null, array(
                'notnull' => false, 'primary' => true,
                'sequence' => 'mod_personaext.sec_niveleducacionalp')
        );
        $this->hasColumn('idniveleducacional', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));

        $this->hasColumn('descripcion', 'varchar', null, array('notnull' => false, 'primary' => false));

        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtitulo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}