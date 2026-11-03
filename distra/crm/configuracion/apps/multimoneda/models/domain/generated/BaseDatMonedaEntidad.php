<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseDatMonedaEntidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_monedaentidad');
        $this->hasColumn(
            'idmonedaentidad', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_datmoneda')
        );
        $this->hasColumn(
            'idmoneda', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipomoneda', 'numeric', 1,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'dualidad', 'numeric', 1,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}