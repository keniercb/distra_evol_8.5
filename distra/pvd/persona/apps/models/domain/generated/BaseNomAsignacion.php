<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:33
 */
abstract class BaseNomAsignacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_asignacion');
        $this->hasColumn(
            'idasignacion',
            'numeric',
            null,
            array ('notnull' => false,'primary' => true, 'sequence' => 'mod_personaext.sec_asignacion')
        );
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => false,'primary' => false));
    }
}