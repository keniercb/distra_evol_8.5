<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class  BaseNomBaselegal extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('nom_baselegal');
        $this->hasColumn('abreviatura', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechagaceta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idbaselegal', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_configsecodena.sec_nombaselegal')
        );
        $this->hasColumn('idelementocontenido', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnivelestructural', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('numerogaceta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
 
