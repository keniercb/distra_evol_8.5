<?php

abstract class BaseDatTrasladoUeb extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.dat_trasladoueb');;
        $this->hasColumn(
            'idtraslado', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_trasladoueb')
        );
        $this->hasColumn('idpersona', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsituacionlaboral', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idueb', 'numeric', array('notnull' => true, 'primary' => false));
    }
}