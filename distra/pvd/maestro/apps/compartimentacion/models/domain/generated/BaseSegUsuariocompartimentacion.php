<?php
abstract class BaseSegUsuariocompartimentacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.seg_usuariocompartimentacion');
        $this->hasColumn(
            'idusuariocompartimentacion',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_usuariocompartimentacion')
        );
        $this->hasColumn('idusuario', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idcompartimentacion', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('pordefecto', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}