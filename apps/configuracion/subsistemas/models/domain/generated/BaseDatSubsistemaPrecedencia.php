<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatSubsistemaPrecedencia extends Doctrine_Record
{
/**
 *  Cambiar la definición de la tabla
 * 
 */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_subsistemaprecedencia');
        $this->hasColumn('idestructurasubsist', 'numeric', 19,array('notnull' => true, 'primary' => true));
        $this->hasColumn('idprecedente', 'numeric', 19, array('notnull' => true, 'primary' => true));
    }

}
