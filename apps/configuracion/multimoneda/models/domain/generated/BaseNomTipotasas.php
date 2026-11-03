<?php
/**  
 * @package    Configuración
 * @subpackage Multimoneda/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0-0
 */
abstract class BaseNomTipotasas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_tipotasa');
        $this->hasColumn(
            'idtipotasa', 'integer', 4,
            array('unsigned' => false, 'autoincrement' => true,
                  'notnull'  => true, 'primary' => true)
        );
        $this->hasColumn(
            'nombretipotasa', 'string', 255,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
