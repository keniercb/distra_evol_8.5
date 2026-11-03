<?php

/**
 * @name BaseDatServtransportacion - Clase base para mapear la tabla de datos para los servicios de alojamiento.
 * @package   personaext
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseDatServtransportacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        //Especificando la tabla
        $this->setTableName('mod_personaext.dat_servtransportacion');
        //Columna "idservtransportacion"
        $this->hasColumn(
            'idservtransportacion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_servtransportacion')
        );
        //Columna "idpersona"
        $this->hasColumn(
            'idpersona', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        //Columna "idestructura"
        $this->hasColumn(
            'idestructuratransportacion', 'numeric', null, array('notnull' => true, 'primary' => false)
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