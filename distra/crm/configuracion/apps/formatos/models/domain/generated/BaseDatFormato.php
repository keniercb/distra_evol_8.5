<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatFormato extends Doctrine_Record
{

    /**
     * Constuctor de la clase
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.dat_formato');
        $this->hasColumn(
        'idformato', 'decimal', null, array(
            'notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datformato'
            )
                );
        $this->hasColumn('nombre', 'string', 30, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'string', 100, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('separador', 'string', 10, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'decimal', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'decimal', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nivelpais', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsubsistema', 'decimal', null, array('notnull' => false, 'primary' => false));
    }

}
