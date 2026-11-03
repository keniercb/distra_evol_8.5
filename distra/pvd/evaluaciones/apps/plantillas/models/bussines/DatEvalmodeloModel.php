<?php

class DatEvalmodeloModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalmodelo $DatEvalmodelo) {
        $DatEvalmodelo->save();
    }

    public function Actualizar(DatEvalmodelo $DatEvalmodelo) {
        try {
            $DatEvalmodelo->save();
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getModelo($idmodelo) {
        return $DatEvalmodelo = Doctrine::getTable('DatEvalmodelo')->find($idmodelo);
    }

    public function Eliminar($idmodelo) {
        $DatEvalmodelo = $this->getModelo($idmodelo);
        $DatEvalmodelo->delete();
    }

    public function existeModelo($denom, $idplanilla) {
        $existe = DatEvalmodelo::ExisteModelo($denom, $idplanilla);
        if ($existe)
            return true;
        return false;
    }

    public function modeloEnUso($idmodelo) {
        $uso = DatEvalmodelo::ModeloEnUso($idmodelo);
        if ($uso)
            return true;
        return false;
    }

    //Devuelve los hechos asociados a un modelo matem�tico.
    public function GetHechosPorModelo($idmodelo) {
        $objHecho = new DatEvalhecho();
        $hechos = $objHecho->getAllHechosByModelo($idmodelo);
        $arrIdexpresionmatematica = array();
        foreach ($hechos as $r) {
            $arrIdexpresionmatematica[] = $r['idexpresionmatematica'];
        }
        if (count($arrIdexpresionmatematica) > 0) {
            $formulas = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica($arrIdexpresionmatematica);
            foreach ($hechos as &$r) {
                foreach ($formulas as $formula) {
                    if ($r['idexpresionmatematica'] == $formula['idexpresionmatematica']) {
                        $r['denomformula'] = $formula['denominacion'];
                        $r['expresionamostrar'] = $formula['expresionamostrar'];
                    }
                }
            }
            return $hechos;
        } else {
            return array();
        }
    }
    //Devuelve todas las planillas activas con filtro
    public function CantPlanillasActivas(){
        $sql = "SELECT COUNT(pev.idplanilla)
				FROM mod_evaluaciones.dat_evalplanillasevaluativas pev
                WHERE pev.idestado=1";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        return $result;
    }

}

