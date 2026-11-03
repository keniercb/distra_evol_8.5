<?php

/**
 * @package ERP-Operaciones contables
 * @category Base
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2014, XETID
 */
abstract class BaseNomConceptoOperacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_conceptooperacion');
        $this->hasColumn('idconceptooperacion', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('denominacionconcepto', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('signoconcepto', 'varchar', 1, array('notnull' => true));
    }

}
