<?php
/**
 * @name BaseConfEstructuraconcepto - Clase base para acceso a datos de la configuracion de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfCategOcupacionales extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_mapeocategocup');
        $this->hasColumn('idmapeocategocup', 'numeric', null, array ('notnull' => true,'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcategocup', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcategoriareporte', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idcategoriareporteresumenmov', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}