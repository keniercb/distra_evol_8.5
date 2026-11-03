<?php
/**
 * @name BaseConfRegistrounico - Clase base para acceso a datos de la configuracion de los conceptos.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfConceptosNomina extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_conceptosnomina');
        $this->hasColumn('idconceptosnomina', 'numeric', null, array ('notnull' => true,'primary' => true));
        $this->hasColumn('idconcepto', 'character varying', null, array ('notnull' => true,'primary' => false));

    }
}