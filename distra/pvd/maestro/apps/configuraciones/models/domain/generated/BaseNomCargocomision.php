<?php
/**
 * @class BaseNomCargocomision - Clase base del nomenclador "Cargo para comisiones".
 * @extends Doctrine_Record
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Ing. Orestes Rodríguez Lorenzo
 * @date 20/10/2017
 * @modify 08/05/2018 by olorenzo Iteración de la documentación de la clase.
 * @version 1.0.0
 */

class BaseNomCargocomision extends Doctrine_Record
{
    /**
     * @function setTableDefinition - Definición de la tabla mod_rrhhmaestro.dat_comision
     * @author olorenzo
     * @create 20/10/2017
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.nom_cargocomision');
        $this->hasColumn(
            'idcargocomision', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_cargocomision')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 500, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }
}