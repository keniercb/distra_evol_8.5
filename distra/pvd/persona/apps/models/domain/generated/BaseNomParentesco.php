<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 3/06/16
 * Time: 13:45
 */
abstract class BaseNomParentesco extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_parentesco');
        $this->hasColumn(
            'idparentesco',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_parentesco')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
    }
}