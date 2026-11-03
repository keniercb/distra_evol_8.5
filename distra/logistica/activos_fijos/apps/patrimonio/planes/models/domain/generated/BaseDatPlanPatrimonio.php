<?php
/**
 * Description of BaseDatPlan
 *
 * @author rajiv
 */
class BaseDatPlanPatrimonio extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_logpatrimonio.dat_planpatrimonio');
        $this->hasColumn('idplan', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idespecialidad', 'character varying', 19, array('notnull' => true, 'primary' => false));        
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => true, 'primary' => false));        
        $this->hasColumn('ano', 'numeric', null, array('notnull' => true, 'primary' => false));       
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('plan', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idaprobadopor', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpropuestopor', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup() {
        parent::setUp();
    }

}

?>
