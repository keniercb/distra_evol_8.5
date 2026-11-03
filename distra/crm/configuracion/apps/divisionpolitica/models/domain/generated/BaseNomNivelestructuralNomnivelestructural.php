<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class BaseNomNivelestructuralNomnivelestructural extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_nivelestructuralnomnivelestructural');
        $this->hasColumn('idorigen', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddestino', 'numeric', 19, array('notnull' => true, 'primary' => true));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
 