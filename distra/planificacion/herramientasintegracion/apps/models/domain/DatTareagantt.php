<?php

class DatTareagantt extends BaseDatTareagantt {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatTareagantt', array('local' => 'idpadre', 'foreign' => 'idtareagantt'));
        $this->hasOne('NomUnidadtiempo', array('local' => 'idunidadtiempo', 'foreign' => 'idunidadtiempo'));
        $this->hasOne('DatEstudiogantt', array('local' => 'idestudiogantt', 'foreign' => 'idestudiogantt'));
        $this->hasMany('DatTareagantt', array('local' => 'idtareagantt', 'foreign' => 'idpadre'));
    }

    public function getByid($idtareagantt) {
        return Doctrine::getTable('DatTareagantt')->find($idtareagantt);
    }
    
    public function obtenerTarea($idestudiogantt) {
        $query = Doctrine_Query::create();
        $query->select('tg.*, '
                . '(SELECT p.denominacion FROM DatTareagantt p WHERE p.idtareagantt = tg.idpadre) as predecesora, '
                . 'ut.idunidadtiempo, ut.denominacion as unidadtiempo');
        $query->from('DatTareagantt tg');  
        $query->innerJoin('tg.NomUnidadtiempo ut');
        $query->where('tg.idestudiogantt = ?', $idestudiogantt);
        $query->orderBy('fechaini');
        return $query->execute()->toArray(); 
    }
    
    public function obtenerTareaPredecesora($addWhere) {
        $query = Doctrine_Query::create();
        $query->select('tg.*');
        $query->from('DatTareagantt tg');      
        $query->addWhere($addWhere);
        $query->orderBy('fechaini');
        return $query->execute()->toArray(); 
    }
    
    public function actualizarTareaEliminar($idtareagantt, $fechainicio, $idpadre) {
        $query = Doctrine_Query::create();
        $query->update('DatTareagantt');
        $query->set('fechaini', '?', $fechainicio);
        $query->set('idpadre', '?', $idpadre);
        $query->where("idtareagantt = ?", $idtareagantt);
        $query->execute();
    }
    
    public function obtenerTareasHijas($idpadre) {
        $query = Doctrine_Query::create();
        $query->select('tg.*');
        $query->from('DatTareagantt tg');         
        $query->where('tg.idpadre = ? and tg.idtareagantt <> tg.idpadre', $idpadre);        
        return $query->execute()->toArray(); 
    }
    
    public function buscarTarea($addWhere) {
        $query = Doctrine_Query::create();
        $query->select('tg.*, '
                . '(SELECT p.denominacion FROM DatTareagantt p WHERE p.idtareagantt = tg.idpadre) as predecesora, '
                . 'ut.idunidadtiempo, ut.denominacion as unidadtiempo');
        $query->from('DatTareagantt tg');  
        $query->innerJoin('tg.NomUnidadtiempo ut');        
        $query->addWhere($addWhere);
        return $query->execute()->toArray(); 
    }

}
