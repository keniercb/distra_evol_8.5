<?php

/**
 * @name BaseNomTipodocidentidad - Clase base para acceso a datos del nomenclador de tipos de documentos de identidad.
 * @package   persona.nomencladores
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   2.1
 */
abstract class BaseNomTipodocidentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.nom_tipodocidentidad');
        $this->hasColumn(
            'idtipodocidentidad', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_tipodocidentidad')
        );
        $this->hasColumn(
            'denominacion', 'character varying', null, array(
                'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', null, array(
                'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fdesde', 'date', null, array(
                'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fhasta', 'date', null, array(
                'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'type', 'character varying', null, array(
                'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'maxcaracter', 'numeric', null, array(
                'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mincaracter', 'numeric', null, array(
                'notnull' => true, 'primary' => false)
        );
    }

}
