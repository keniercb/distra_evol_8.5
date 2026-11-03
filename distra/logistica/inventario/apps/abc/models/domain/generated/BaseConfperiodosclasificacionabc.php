<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of BaseDatEstadoalmacen
 *
 * @author kenier
 */
class BaseConfperiodosclasificacionabc extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logabc.conf_periodosclasificacionabc');
        $this->hasColumn(
            'idconfperiodosclasificacionabc', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logabc.sec_conf_periodosclasificacionabc')
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('analizar', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('presupuesto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('naturalezas', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('depositos', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uebs', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cerrado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('serecalculopresupuesto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

}
