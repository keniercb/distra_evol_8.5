<?php 
class DatAccioncursoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAccionesCursos($idaccion, $start = 0, $limit = null)
    {
        try {
            $now = date('d/m/Y');
            $obj = new DatAccioncurso();
            $datos = $obj->getCursosByAccion($idaccion, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $val) {
                    if ($val['frdesde'] == null && $this->compararFechas($val['fdesde'], $now) > 0) {
                        $datos[$p]['estado'] = 1;//No iniciada
                    } else if (($now == $val['frdesde'] || $this->compararFechas($now, $val['frdesde']) > 0) && ($this->compararFechas($now, $val['frhasta'])> 0)|| $now == $val['frhasta']) {
                        $datos[$p]['estado'] = 2;//Terminada
                    } else if ($now == $val['frdesde'] || ($this->compararFechas($now, $val['frdesde'])> 0) && $this->compararFechas($val['fhasta'], $now)> 0 && $val['frhasta'] == null) {
                        $datos[$p]['estado'] = 3;//Iniciada
                    } else if ($val['frhasta'] == null && ($this->compararFechas($now, $val['fhasta']) > 0 || $now == $val['fhasta'])) {
                        $datos[$p]['estado'] = 4;//Atrasada por no terminar
                    } else if ($val['frdesde'] == null && ($this->compararFechas($now, $val['fdesde']) > 0 || $now == $val['fdesde'])) {
                        $datos[$p]['estado'] = 4;//Atrasada por no iniciar
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAccionescurso($idaccion);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function compararFechas($primera, $segunda)
    {
        $valoresPrimera = explode("/", $primera);
        $valoresSegunda = explode("/", $segunda);
        $diaPrimera    = $valoresPrimera[0];
        $mesPrimera  = $valoresPrimera[1];
        $anyoPrimera   = $valoresPrimera[2];
        $diaSegunda   = $valoresSegunda[0];
        $mesSegunda = $valoresSegunda[1];
        $anyoSegunda  = $valoresSegunda[2];
        $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $anyoPrimera);
        $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $anyoSegunda);
        if (!checkdate($mesPrimera, $diaPrimera, $anyoPrimera)) {
            // "La fecha ".$primera." no es v�lida";
            return 'invalid';
        }else if (!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)){
            // "La fecha ".$segunda." no es v�lida";
            return 'invalid';
        } else {
            return  $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }

    public function addCurso($idaccion, $idcurso, $descripcion, $fdesde, $fhasta, $profesor)
    {
        try {
            $existe = DatAccioncurso::existe($idaccion, $idcurso);
            if (count($existe) == 0) {
                $obj = new DatAccioncurso();
                $obj->idaccion = $idaccion;
                $obj->idcurso = $idcurso;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->frdesde = $fdesde;
                $obj->frhasta = $fhasta;
                $obj->profesor = $profesor;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 0;
        }
    }

    public function updateCurso($idaccioncurso, $idcurso, $descripcion, $fdesde, $fhasta, $profesor)
    {
        try {
            $obj = DatAccioncurso::getById($idaccioncurso);
            $existe = DatAccioncurso::existe($obj->idaccion, $idcurso);
            if (count($existe) == 0 || $existe[0]['idaccioncurso'] == $idaccioncurso) {
                $obj->idcurso = $idcurso;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->frdesde = $fdesde;
                $obj->frhasta = $fhasta;
                $obj->profesor = $profesor;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 0;
        }
    }

    public function ejecutarCurso($idaccioncurso, $frdesde, $frhasta)
    {
        try {
            $obj = DatAccioncurso::getById($idaccioncurso);
            $obj->frdesde = (empty($frdesde))?null:$frdesde;
            $obj->frhasta = (empty($frhasta))?null:$frhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteCurso($idaccioncurso)
    {
        try {
            $obj = DatAccioncurso::getById($idaccioncurso);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}