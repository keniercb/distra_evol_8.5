<?php

abstract class BaseDatRetencionesAplicadasPorPersona extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_nomina.dat_retencionesaplicadasporpersona');

        $this->hasColumn('idretencionesaplicadasporpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_retencionesaplicadasporpersona'
        ));

        $this->hasColumn('idelaborarpagos', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('idpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
        $this->hasColumn('idtiporetencion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
    }

}
