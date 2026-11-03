<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 20/06/16
 * Time: 8:52
 */
abstract class BaseNomTipoingreso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.nom_tipoingreso');
        $this->hasColumn(
            'idtipoingreso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_tipoingreso')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
    }
}