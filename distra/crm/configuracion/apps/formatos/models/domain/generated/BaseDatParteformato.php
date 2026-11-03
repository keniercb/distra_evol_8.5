<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatParteformato extends Doctrine_Record
{

    /**
     * Constuctor de la clase
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.dat_parteformato');
        $this->hasColumn(
        'idparteformato', 'decimal', null, array(
        'notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datparteformato'
            )
                );
        $this->hasColumn('nombre', 'string', 30, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('abreviatura', 'string', 10, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('nivel', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('longitud', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformato', 'decimal', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'string', 150, array('fixed' => false, 'notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'decimal', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idconfapertura', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

}
