<?php
/**
 * @name BaseConfImportarexcel - Clase base para acceso a datos de la configuración de importar excel.
 * @package   maestro.configuraciones
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class BaseConfImportarexcel extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_importarexcel');
        $this->hasColumn('idimportarexcel', 'numeric', null, array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_importarexcel'));
        $this->hasColumn('iddominio', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('identidad', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idelemento', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('extension', 'character varying', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('tipoconfiguracion', 'numeric', null, array ('notnull' => true,'primary' => false));
		$this->hasColumn('columnaclavebusqueda', 'character varying', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('filainicial', 'numeric', null, array ('notnull' => false,'primary' => false));
		$this->hasColumn('filafinal', 'numeric', null, array ('notnull' => false,'primary' => false));
    }
}
