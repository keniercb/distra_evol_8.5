<?php

/**
 *  Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseNomSubsistema extends Doctrine_Record
{

    /**
     * Cambiar la definición de la tabla
     * 
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_subsistema');
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => 'true', 'primary' => 'true'));
        $this->hasColumn('denominacion', 'character varying', 70, array('notnull' => 'true', 'primary' => 'false'));
        $this->hasColumn('uri', 'character varying', 255, array('notnull' => 'false', 'primary' => 'false'));
    }

}
