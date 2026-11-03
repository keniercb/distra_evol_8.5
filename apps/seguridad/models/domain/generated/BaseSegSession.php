<?php

/**
 * BaseSegSession
 *
 * Definición de la entidad de dominio utilizada para salvar 
 * la session en una base de datos.
 *
 * @property decimal $idsession
 * @property string $sessionid
 * @property string $session
 * @property string $usuario
 * @property string $ip
 * @property date $fecha
 * @property time $hora
 * @property decimal $idrol
 * @property decimal $idusuario
 * @property decimal $identidad
 * @property string $eliminar
 *
 * @package    Zeolides
 * @subpackage Session
 * @author     Yoandry Morejon Borbon (ymorejonb@xetid.cu)
 * @version    1.0.0
 */
abstract class BaseSegSession extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.seg_session');
        $this->hasColumn(
            'idsession', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'primary' => true,
            'sequence' => 'mod_seguridad.sec_session',
            )
        );
        $this->hasColumn(
            'sessionid', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'session', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'usuario', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
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
        $this->hasColumn(
            'fecha', 'date', null, array(
            'type' => 'date',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => true,
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
            'idrol', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'idusuario', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'identidad', 'decimal', null, array(
            'type' => 'decimal',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'eliminar', 'string', null, array(
            'type' => 'boolean',
            'fixed' => false,
            'unsigned' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEntidadSegUsuarioSegRol', array(
            'local' => 'idrol, idusuario, identidad',
            'foreign' => 'idrol, idusuario, identidad')
        );
    }

}
