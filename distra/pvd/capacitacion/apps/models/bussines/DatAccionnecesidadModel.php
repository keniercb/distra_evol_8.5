<?php 
class DatAccionnecesidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getNecesidadesByAccionTodosNomen($idaccion, $idestructura)
    {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $idcargos = Array();
            if (count($cargos) > 0) {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
            }
            $obj = new DatAccionnecesidad();
            $datos = Array();
            $idpers = Array();
            if (count($idcargos)>0) {
                $personas = $obj::getIdPersonasByIdcargo($idcargos);
                if (count($personas) > 0) {
                    foreach ($personas as $y => $per) {
                        $idpers[$y] = $per['idpersona'];
                    }
                    $datos = $obj->getNecesidadesByAccionTodos($idaccion, $idpers);
                }
            }
            if (count($idcargos) == 0 || count($idpers) == 0) {
                $datos = $obj->getNecesidadesByAccionTodos($idaccion);
            }

            if (count($datos)==0) {
                $datos = Array();
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesByAccion($idaccion, $start = 0, $limit = null)
    {
        try {
            $obj = new DatAccionnecesidad();
            $datos = $obj->getNecesidadesByAccion($idaccion, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAccionNecesidades($idaccion);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDenomNecesidadesByAccion($idaccion)
    {
        try {
            $obj = new DatAccionnecesidad();
            $datos = $obj->getNecesidadesByAccion($idaccion);
            $nec = '';
            foreach ($datos as $p => $d) {
                if ($p > 0) {
                    $nec .= ', '.$d['denominacion'];
                } else {
                    $nec .= $d['denominacion'];
                }

            }
            return $nec;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addAccionNecesidad($idaccion, $arraynecesidades)
    {
        try {
            DatAccionnecesidad::eliminarByAccion($idaccion);
            foreach ($arraynecesidades as $idnecesidad) {
                $obj = new DatAccionnecesidad();
                $obj->idaccion = $idaccion;
                $obj->idnecesidad = $idnecesidad;
                $obj->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteNec($idaccionnecesidad)
    {
        try {
            $obj = DatAccionnecesidad::getById($idaccionnecesidad);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}