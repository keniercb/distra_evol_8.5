<?php

abstract class BaseConfCuadroBasico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.conf_cuadrobasico');

        $this->hasColumn(
            'idcuadrobasico', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_confcuadrobasico")
        );
        $this->hasColumn(
            'idindicador',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocuadrobasico',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idgrupofarmacologico',  'varchar', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idclasificacionven',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idproveedor',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idviaadquicicion',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'prioridad',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'formulamagistral',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tienecertificado',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idanno',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipounidadsalud',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipodispensacion',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpadre',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'precioventa',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'modocobro',  'numeric', null,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}
