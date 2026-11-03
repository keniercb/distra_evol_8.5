<?php

/**
 * @package ERP-Operaciones contables
 * @category Base
 * @author Ing. Alejandro Mengana Pérez<amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
abstract class BaseNomOperaciones extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_operacion');
        $this->hasColumn('idnomoperaciones', 'numeric', 19, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_datosmaestros.sec_nomoperacionesv1'));
        $this->hasColumn('denominacion', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('codigooperacion', 'varchar', 20, array('notnull' => false));
    }

}
