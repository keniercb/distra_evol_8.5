<?php

class DatEvalindicadoresplanillaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalindicadoresplanilla $DatEvalindicadoresplanilla) {
        $DatEvalindicadoresplanilla->save();
    }

    public function Actualizar(DatEvalindicadoresplanilla $DatEvalindicadoresplanilla) {
        $DatEvalindicadoresplanilla->save();
    }

    public function Eliminar($DatEvalindicadoresplanilla) {
        $DatEvalindicadoresplanilla->delete();
    }

    public function delete($idindicadorplanilla) {
        try {
			
            $sql= "SELECT n.idevalindicadoresevaluar as idevalindicadoresevaluar
                FROM mod_evaluaciones.dat_evalindicadoresevaluar n
                WHERE n.idindicadorplanilla = {$idindicadorplanilla}";
				
            $query = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);
			
            if($query[0]['idevalindicadoresevaluar'] !=null || $query[0]['idevalindicadoresevaluar']!=''){
                $id = $query[0]['idevalindicadoresevaluar'];
				
                $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                $sqldelete = "DELETE FROM mod_evaluaciones.dat_evalindicadoresevaluar e
                             WHERE e.idevalindicadoresevaluar = {$id} ";
                $conn->fetchAll($sqldelete);
            }
			
                $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                $sqldelete = "DELETE FROM mod_evaluaciones.dat_evalindicadoresevaluacion e
                             WHERE e.idindicadorplanilla = {$idindicadorplanilla}";
                $conn->fetchAll($sqldelete);
				
            $r->cantRowAfected = Doctrine_Query::create()
                    ->delete()
                    ->from('DatEvalindicadoresplanilla')
                    ->where('idindicadorplanilla = ?', $idindicadorplanilla)
                    ->execute();
            $r->success = true;
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {
                throw new ZendExt_Exception('CHE045');
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function updateCalculado($idindicadorplanilla, $calculado) {
        $update = Doctrine_Query::create()
                ->update('DatEvalindicadoresplanilla')
                ->set('calculado', $calculado)
                ->where('idindicadorplanilla = ?', $idindicadorplanilla)
                ->execute();
    }

}