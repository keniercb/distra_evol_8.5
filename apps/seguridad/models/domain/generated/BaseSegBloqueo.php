<?php

/**
 * BaseSegBloqueo
 *
 * Clase base de acceso a la tabla bloqueo.
 *
 * @property decimal $idbloqueo Identificador de la tabla
 * @property date $fecha Fecha en que se realizó el bloqueo.
 * @property time $hora Hora en que se realizó el bloqueo.
 * @property integer $intentos Cantidad de intentos para ser bloqueado.
 *
 * @package    seguridad
 * @author     Equipo de seguridad UCID
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
abstract class BaseSegBloqueo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_bloqueo');
        $this->hasColumn(
            'idbloqueo', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'primary' => true,
            'sequence' => 'mod_seguridad.sec_bloqueo',
            )
        );
        $this->hasColumn(
            'fecha', 'date', null, array(
            'type' => 'date',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'default' => 'now()',
            'primary' => false,
            )
        );
        $this->hasColumn(
            'hora', 'time', null, array(
            'type' => 'time',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'intento', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
    }

}
