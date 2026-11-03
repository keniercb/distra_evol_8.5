<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseNomEstadosubsistema extends Doctrine_Record
{
/**
 * Cambiar la definición de la tabla
 * 
 */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_estadosubsistema');
        $this->hasColumn('idestado', 'decimal', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('estado', 'string', 100, array('fixed' => false, 'notnull' => true, 'primary' => false));
    }

}
