<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class BaseNomNivelestructural extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_nivelestructural');
        $this->hasColumn('concepto', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaini', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconceptoestructural', 'numeric', 4, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconceptonivel', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idnivelestructural', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_nomnivelestructural')
        );
        $this->hasColumn('raiz', 'numeric', 1, array('notnull' => false, 'primary' => false, 'default' => 0));
        $this->hasColumn('uri', 'text', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
 
