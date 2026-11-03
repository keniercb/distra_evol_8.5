<?php
/**
 * @name BaseConfNotificacion - Clase base de la configuración "Notificaciones".
 * @extends Doctrine_Record
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Ing. Orestes Rodríguez Lorenzo
 * @date 02/11/2017
 * @version 1.0.0
 */

class BaseConfNotificacion extends Doctrine_Record
{
    /**
     * @function setTableDefinition Definición de la tabla mod_rrhhmaestro.conf_notificacion
     * @author Ing. Orestes Rodríguez Lorenzo
     * @create 02/11/2017
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_notificacion');
        $this->hasColumn(
            'idnotificacion', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_notificacion')
        );
        $this->hasColumn('identidad', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddominio', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('servidor', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('puerto', 'numeric', 5, array('notnull' => true, 'primary' => false));
        $this->hasColumn('smtpaut', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('remitente', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombremitente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contrasena', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }
}