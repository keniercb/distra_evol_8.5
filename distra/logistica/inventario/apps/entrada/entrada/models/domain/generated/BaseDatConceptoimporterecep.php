<?php

abstract class BaseDatConceptoimporterecep extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_conceptoimporterecep');
        $this->hasColumn(
            'idconceptorecep', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_conceptoimporterecep')
        );
        $this->hasColumn(
            'idconceptoimporte', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddocumento', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valormn', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valoralt', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valorcalculomn', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valorcalculoalt', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idproveedor', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicionpago', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrofactura', 'character varying', 15, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tasa', 'numeric', 19, array('notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}
