<?php

/**
 * BaseSegBloqueousuario
 *
 * Clase base de la entidad seg_bloqueo.
 *
 * @property decimal $idbloqueo
 * @property string $usuario
 * @property string $ip
 * @property ModSeguridad.segBloqueo $ModSeguridad.segBloqueo
 * @property decimal $iddominio Dominio donde se genero el bloqueo.
 *
 * @package    seguridad
 * @author     Equipo de seguridad UCID
 * @version    SVN: $Id: Builder.php 6820 2009-11-30 17:27:49Z jwage $
 */
abstract class BaseSegBloqueousuario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('seg_bloqueousuario');
        $this->hasColumn(
            'idbloqueo', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'primary' => true,
            )
        );
        $this->hasColumn(
            'usuario', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'ip', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'iddominio', 'decimal', null, array(
            'ntype' => 'numeric',
            'alltypes' =>
            array(
                0 => 'decimal',
            ),
            'notnull' => true,
            'primary' => false,
            )
        );
    }

}
