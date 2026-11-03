<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatFormatopais extends Doctrine_Record
{

    /**
     * Constuctor de la clase
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.dat_formatopais');
        $this->hasColumn(
                'idformatopais', 'decimal', null, array(
                    'notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_datformatopais'
                    )
                );
        $this->hasColumn('idformato', 'decimal', null, array('notnull' => true, 'primary' => false));
    }

}
