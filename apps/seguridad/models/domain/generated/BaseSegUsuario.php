<?php

/*
 * Clase base del dominio de Usuario.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */

abstract class BaseSegUsuario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.seg_usuario');
        $this->hasColumn(
            'idusuario', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => true,
                'primary' => true,
                'sequence' => 'sec_usuario',
            )
        );

        $this->hasColumn(
            'caduca', 'date', null, array(
                'ntype' => 'date',
                'alltypes' =>
                    array(
                        0 => 'date',
                    ),
                'notnull' => false,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'nombreusuario', 'string', null, array(
                'ntype' => 'text',
                'alltypes' =>
                    array(
                        0 => 'string',
                        1 => 'clob',
                    ),
                'fixed' => false,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'contrasenna', 'string', 255, array(
                'ntype' => 'varchar',
                'alltypes' =>
                    array(
                        0 => 'string',
                    ),
                'fixed' => false,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'email', 'string', 255, array(
                'ntype' => 'varchar',
                'alltypes' =>
                    array(
                        0 => 'string',
                    ),
                'fixed' => false,
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'ip', 'string', 255, array(
                'ntype' => 'varchar',
                'alltypes' =>
                    array(
                        0 => 'string',
                    ),
                'fixed' => false,
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

        $this->hasColumn(
            'iddesktop', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'idtema', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => true,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'ididioma', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => true,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'estado', 'string', null, array(
                'ntype' => 'bpchar',
                'alltypes' =>
                    array(
                        0 => 'string',
                    ),
                'fixed' => true,
                'notnull' => true,
                'default' => '0',
                'primary' => false,
            )
        );
        $this->hasColumn(
            'perfilxml', 'string', null, array(
                'ntype' => 'text',
                'alltypes' =>
                    array(
                        0 => 'string',
                        1 => 'clob',
                    ),
                'fixed' => false,
                'notnull' => false,
                'primary' => false,
            )
        );
        $this->hasColumn(
            'accesodirecto', 'string', null, array(
                'ntype' => 'text',
                'alltypes' =>
                    array(
                        0 => 'string',
                        1 => 'clob',
                    ),
                'fixed' => false,
                'notnull' => false,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'activo', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                    array(
                        0 => 'boolean',
                    ),
                'notnull' => false,
                'default' => 'false',
                'primary' => false,
            )
        );
        $this->hasColumn(
            'idpersona', 'decimal', null, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => false,
                'primary' => false
            )
        );
        $this->hasColumn(
            'accesoconcurrente', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                    array(
                        0 => 'boolean',
                    ),
                'notnull' => false,
                'default' => 'false',
                'primary' => false,
            )
        );
        $this->hasColumn(
            'reescribirsesion', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                    array(
                        0 => 'boolean',
                    ),
                'notnull' => false,
                'default' => 'false',
                'primary' => false,
            )
        );
        $this->hasColumn(
            'mostrarentidad', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                    array(
                        0 => 'boolean',
                    ),
                'notnull' => true,
                'default' => 'true',
                'primary' => false,
            )
        );

        $this->hasColumn(
            'creadopor', 'numeric', 19, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'modificadopor', 'numeric', 19, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => false,
                'primary' => false,
            )
        );


        $this->hasColumn(
            'isadmin', 'numeric', 1, array(
                'ntype' => 'numeric',
                'alltypes' =>
                    array(
                        0 => 'decimal',
                    ),
                'notnull' => false,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'fcreado', 'date', null, array(
                'ntype' => 'date',
                'alltypes' =>
                    array(
                        0 => 'date',
                    ),
                'notnull' => true,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'fmodificado', 'date', null, array(
                'ntype' => 'date',
                'alltypes' =>
                    array(
                        0 => 'date',
                    ),
                'notnull' => false,
                'primary' => false,
            )
        );

        $this->hasColumn(
            'ultimoacceso', 'date', null, array(
                'ntype' => 'date',
                'alltypes' =>
                    array(
                        0 => 'date',
                    ),
                'notnull' => false,
                'primary' => false,
            )
        );
    }

}
