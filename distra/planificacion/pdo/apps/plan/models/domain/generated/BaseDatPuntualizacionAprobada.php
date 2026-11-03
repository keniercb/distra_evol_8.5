<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatPuntualizacionAprobada extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_puntualizacionaprobada');

      $this->hasColumn(
        'idpuntualizacionaprobada', 'numeric', null,
        array('notnull'  => true, 'primary' => true,
              'sequence' => 'sec_puntualizacionaprobada')
      );

        $this->hasColumn(
            'idactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idautorpunt', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
          'fechainicio', 'date', null,
          array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
          'fechafin', 'date', null,
          array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
          'horainicio', 'character varying', null,
          array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
          'horafin', 'character varying', null,
          array('notnull' => false, 'primary' => false)
        );


        $this->hasColumn(
            'fechacreacionpunt', 'TIMESTAMP', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechacontrolcambiopunt', 'TIMESTAMP', null,
            array('notnull' => true, 'primary' => false)
        );
      $this->hasColumn(
        'fechacontrolcambio', 'TIMESTAMP', null,
        array('notnull' => true, 'primary' => false)
      );

      $this->hasColumn(
        'ultima', 'numeric', null,
        array('notnull' => true, 'primary' => false)
      );

    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase


