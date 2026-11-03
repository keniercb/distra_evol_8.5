<?php

/**
 * @name BaseDatAlimentacion - Clase base para acceso a datos de la tabla de datos para los servicios de alimentacion.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseDatServalimentacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        //Especificando la tabla
        $this->setTableName('mod_personaext.dat_servalimentacion');
        //Columna "idservalimentacion"
        $this->hasColumn(
            'idservalimentacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_servalimentacion')
        );
        //Columna "idpersona"
        $this->hasColumn(
            'idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        //Columna "idestructura"
        $this->hasColumn(
            'idestalimentacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        //Columna "idevento"
        $this->hasColumn(
            'idevento', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        //Columna "fdesde"
        $this->hasColumn(
            'fdesde', 'date', null, array('notnull' => true, 'primary' => false)
        );
        //Columna "fhasta"
        $this->hasColumn(
            'fhasta', 'date', null, array('notnull' => false, 'primary' => false)
        );
    }
}