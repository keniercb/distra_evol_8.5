<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseDatDezglozemoneda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_dezglozemoneda');
        $this->hasColumn(
            'iddezglozemoneda', 'numeric', 19,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_datdezglozemoneda')
        );
        $this->hasColumn(
            'iddezglozemonedas', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}