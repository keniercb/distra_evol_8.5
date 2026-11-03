<?php
/**
 * @author Kenier Cumba BUeno
 *         User: lester
 *         Date: 31/07/13
 *         Time: 15:26
 *         To change this template use File | Settings | File Templates.
 */

abstract class BaseDatMarcaEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_marcaentidad');
        $this->hasColumn(
            'idmarcaentidad', 'numeric', null,
            array('type'     => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_datmarcaentidad')
        );
        $this->hasColumn(
            'idmarca', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}