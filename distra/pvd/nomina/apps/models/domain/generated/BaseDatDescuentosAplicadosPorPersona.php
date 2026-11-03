<?php

abstract class BaseDatDescuentosAplicadosPorPersona extends Doctrine_Record
{

    public function setTableDefinition()
    {

        $this->setTableName('mod_nomina.dat_descuentosaplicadosporpersona');

        $this->hasColumn('iddescuentosaplicadosporpersona', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_descuentosaplicadosporpersona'
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
        $this->hasColumn('idconceptopercepciondescuento', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false,
        ));
    }

}
