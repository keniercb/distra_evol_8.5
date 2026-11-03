<?php
/**
 * @name BaseConfRegistrounico - Clase base para acceso a datos de la configuracion del registro único.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfRegistrounico extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_registrounico');
        $this->hasColumn('idregistrounico', 'numeric', null, array ('notnull' => true,'primary' => true));
        $this->hasColumn('esquema', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('tabla', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('campo', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('criterio', 'character varying', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('unico', 'numeric', null, array ('notnull' => true,'primary' => false));
    }
}