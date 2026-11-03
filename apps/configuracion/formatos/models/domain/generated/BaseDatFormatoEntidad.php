<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatFormatoEntidad extends Doctrine_Record
{

    /**
     * Constuctor de la clase
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.dat_formatoentidad');
        $this->hasColumn('idformato', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
                'idformatoentidad', 'serial', 19, array(
       'notnull' => true, 'primary' => true, 'sequence' 
                    => 'mod_datosmaestros.dat_formatoentidad_idformatoentidad'
                    )
                );
    }

}
