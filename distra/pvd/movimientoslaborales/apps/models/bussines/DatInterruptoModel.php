<?php
class DatInterruptoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getInterruptos($filtro, $fdesde, $fhasta, $idest, $idcargo, $inicio, $limite, $activo)
    {
        try {
            $obj = new DatInterrupto();
            $inst = ZendExt_IoC::getInstance();
            if ($idest == '') {
                $datos = $obj->getInterruptoByIdCargo(
                    $filtro, $fdesde, $fhasta, array($idcargo), $inicio, $limite
                );
                $cantidad = $obj->cantInterruptoIdCargo(
                    $filtro, $fdesde, $fhasta, array($idcargo)
                );
            } else {
                $cargos = $inst->metadatos->obtenerCargosEstructura(
                    $idest, true
                );
                if (count($cargos) > 0) {
                    $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                    $datos = $obj->getInterruptoByIdCargo(
                        $filtro, $fdesde, $fhasta, $idcargos, $inicio, $limite, $activo
                    );
                    $cantidad = $obj->cantInterruptoIdCargo($filtro, $fdesde, $fhasta, $idcargos, $activo);
                }
            }
            if ($cantidad == 0) {
                $datos = Array();
            }
            foreach ($datos as $r => $interr) {
                $carg = $inst->metadatos->obtenerDatosCargo($interr['idcargo']);
                $datos[$r]['cargo'] = $carg[0]['denominacion'];
                $area = $inst->metadatos->DameEstructura($interr['idarea']);
                $datos[$r]['area'] = $area[0]->denominacion;

            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getInterruptosByInterrupcion($interrupcion, $filtro, $inicio, $limite)
    {
        try {
            $obj = new DatInterrupto();
            $inst = ZendExt_IoC::getInstance();
            $datos = $obj->getInterruptoByIdInterrupcion($interrupcion, $filtro, $inicio, $limite);
            $cantidad = $obj->cantInterruptoIdInterrupcion($interrupcion, $filtro);
            if ($cantidad == 0) {
                $datos = Array();
            }
            foreach ($datos as $r => $interr) {
                $carg = $inst->metadatos->obtenerDatosCargo($interr['idcargo']);
                $datos[$r]['cargo'] = $carg[0]['denominacion'];
                $area = $inst->metadatos->DameEstructura($interr['idarea']);
                $datos[$r]['area'] = $area[0]->denominacion;

            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addInterrupto($idslp, $idinterrupcion, $fdesde, $fhasta, $reubicado, $horas, $idsit, $idcausanoreub)
    {
        //try {
            $existe = DatInterrupto::existeInterrupto($idslp);
            if (count($existe) == 0) {
                $obj = new DatInterrupto();
                $obj->idsituacionlaboralp = $idslp;
                $obj->idinterrupcion = $idinterrupcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->reubicado = ($reubicado == '')?3:$reubicado;
                $obj->horas = ($horas == '') ? null : $horas;
                $obj->idsituacionint = $idsit;
                $obj->idcausanoreubicado = ($idcausanoreub == '') ? null :$idcausanoreub;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        /*} catch (Exception $e) {
            return false;
        }*/
    }

    public function updateInterrupto($idinterrupto, $fdesde, $fhasta, $reubicado, $horas, $idsit, $idcausanoreub)
    {
        try {
            $obj = DatInterrupto::getById($idinterrupto);
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            if ($obj->reubicado != 2) {
                $obj->reubicado = ($reubicado == '')?3:$reubicado;
            }
            $obj->horas = ($horas == '') ? null : $horas;
            $obj->idsituacionint = $idsit;
            $obj->idcausanoreubicado = ($idcausanoreub == '') ? null :$idcausanoreub;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteInterrupto($idinterrupto)
    {
        try {
            $obj = DatInterrupto::getById($idinterrupto);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function terminarInterrupcion($idinterrupto, $fhasta, $reubicado)
    {
        try {
            $obj = DatInterrupto::getById($idinterrupto);
            $obj->fhasta = $fhasta;
            if ($reubicado == 1) {
                $obj->reubicado = 2;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}