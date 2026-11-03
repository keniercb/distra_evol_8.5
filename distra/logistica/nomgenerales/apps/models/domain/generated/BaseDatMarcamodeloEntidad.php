<?php
/**
 * @author Kenier Cumba BUeno
 * User: lester
 * Date: 31/07/13
 * Time: 15:26
 * To change this template use File | Settings | File Templates.
 */

abstract class BaseDatMarcamodeloEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_marcamodeloentidad');
        $this->hasColumn('idmarcamodeloentidad', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true, 'sequence' => 'sec_datmarcamodeloentidad'));
        $this->hasColumn('idmarcamodelo', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', null, array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }
}