<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatEstructurasubsist extends Doctrine_Record
{
/**
 *  Cambiar la definición de la tabla
 * 
 */
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_estructurasubsist');
        $this->hasColumn(
            'idestructurasubsist', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datestructurasubsist')
        );
        $this->hasColumn('idestado', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contabiliza', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('aperturado', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('version', 'numeric', 6, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cierra', 'numeric', 1, array('notnull' => 'false', 'default' => '1', 'primary' => 'false'));
        $this->hasColumn(
            'precedencia', 'numeric', 2, array('notnull' => 'false', 'default' => '0', 'primary' => 'false')
        );
    }

}
