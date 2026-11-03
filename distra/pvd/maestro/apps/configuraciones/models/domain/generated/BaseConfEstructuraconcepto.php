<?php
/**
 * @name BaseConfEstructuraconcepto - Clase base para acceso a datos de la configuracion de estructuras por conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfEstructuraconcepto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_estructuraconcepto');
        $this->hasColumn('idestructconcepto', 'numeric', null, array ('notnull' => true,'primary' => true));
        $this->hasColumn('denominacion', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('agrupador', 'character varying', null, array ('notnull' => true,'primary' => false));
    }
}