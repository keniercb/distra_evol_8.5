<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseConfEstructurasubsist extends Doctrine_Record
{
    /**
     *  Cambiar la definición de la tabla
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_estructurasubsist');
        $this->hasColumn(
            'idconfsubsistema', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_confestructurasubsist')
        );
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contabiliza', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cierra', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precedencia', 'numeric', 2, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idplantilla', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

}
