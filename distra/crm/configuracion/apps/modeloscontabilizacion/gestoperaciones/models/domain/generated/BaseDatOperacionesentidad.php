<?php

/**
 * @package ERP-Operaciones contables
 * @category Base
 * @author Ing. Alejandro Mengana Pérez<amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
abstract class BaseDatOperacionesentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_operacionesentidad');
        $this->hasColumn('idoperacionesentidad', 'numeric', 19, array('notnull' => true, 'primary' => true, 
            'sequence' => 'mod_datosmaestros.sec_datoperacionesentidad'));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idnomoperaciones', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idmodelo', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('iddoc', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('signo', 'numeric', 19, array('notnull' => false));
    }

}
