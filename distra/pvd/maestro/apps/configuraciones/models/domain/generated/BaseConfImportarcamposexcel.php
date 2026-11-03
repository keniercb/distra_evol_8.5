<?php
/**
 * @name BaseConfImportarcamposexcel - Clase base para acceso a datos de la configuración de campos para importar excel.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfImportarcamposexcel extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_importarcamposexcel');
        $this->hasColumn('idimportarcampoexcel', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_importarcamposexcel'));
        $this->hasColumn('idimportarexcel', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idcampo', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('columnafila', 'character varying', null, array ('notnull' => false,'primary' => false));
    }
}
