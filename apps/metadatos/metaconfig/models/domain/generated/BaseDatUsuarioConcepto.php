<?php

/**
 * Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
abstract class BaseDatUsuarioConcepto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_estructuracomp.dat_usuarioconcepto');
        $this->hasColumn(
             'idusuarioconcepto', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
             'idconcepto', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
             'idusuario', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn('ver', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn(
             'adicionar', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
             'modificar', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
             'eliminar', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn('editar', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false));
        $this->hasColumn(
             'tipo', 'character varying', 255, array(
                       'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
             'deshacer', 'numeric', null, array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }
}