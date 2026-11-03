<?php

/**
 * BaseSegBloqueoip
 *
 * Clase base de la entidad seg_bloqueoip.
 *
 * @property decimal $seg_bloqueoidbloqueo
 * @property string $ip
 * @property ModSeguridad.segBloqueo $ModSeguridad.segBloqueo
 *
 * @package    seguridad
 * @author     Equipo de seguridad UCID
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
abstract class BaseSegBloqueoip extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_bloqueoip');
        $this->hasColumn(
            'idbloqueo', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'primary' => true,
            )
        );
        $this->hasColumn(
            'ip', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
    }

}
