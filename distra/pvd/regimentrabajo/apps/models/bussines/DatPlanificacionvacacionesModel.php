<?php

class DatPlanificacionvacacionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function guardarPlanVacaciones($datos, $anno)
    {
        foreach ($datos as $key => $value) {
            $datplanvac = new DatPlanificacionvacaciones();
            $sumanno = $value->priquinenero + $value->segquinenero + $value->priquinfebrero + $value->segquinfebrero
                + $value->priquinmarzo + $value->segquinmarzo + $value->priquinabril + $value->segquinabril + $value->priquinmayo
                + $value->segquinmayo + $value->priquinjunio + $value->segquinjunio + $value->priquinjulio + $value->segquinjulio
                + $value->priquinagosto + $value->segquinagosto + $value->priquinseptiembre + $value->segquinseptiembre
                + $value->priquinoctubre + $value->segquinoctubre + $value->priquinnoviembre + $value->segquinnoviembre
                + $value->priquindiciembre + $value->segquindiciembre;
            if ($sumanno <= 30) {
                $this->eliminarPlanPersona($value->idpersona, $anno);
                $objenero = new DatPlanificacionvacaciones();
                $objenero->mes = 1;
                $objenero->priquincena = !empty($value->priquinenero) ? $value->priquinenero : null;
                $objenero->segquincena = !empty($value->segquinenero) ? $value->segquinenero : null;
                $objenero->idpersona = $value->idpersona;
                $objenero->anno = $anno;
                $objenero->save();

                $objfebrero = new DatPlanificacionvacaciones();
                $objfebrero->mes = 2;
                $objfebrero->priquincena = !empty($value->priquinfebrero) ? $value->priquinfebrero : null;
                $objfebrero->segquincena = !empty($value->segquinfebrero) ? $value->segquinfebrero : null;
                $objfebrero->idpersona = $value->idpersona;
                $objfebrero->anno = $anno;
                $objfebrero->save();

                $objmarzo = new DatPlanificacionvacaciones();
                $objmarzo->mes = 3;
                $objmarzo->priquincena = !empty($value->priquinmarzo) ? $value->priquinmarzo : null;
                $objmarzo->segquincena = !empty($value->segquinmarzo) ? $value->segquinmarzo : null;
                $objmarzo->idpersona = $value->idpersona;
                $objmarzo->anno = $anno;
                $objmarzo->save();

                $objabril = new DatPlanificacionvacaciones();
                $objabril->mes = 4;
                $objabril->priquincena = !empty($value->priquinabril) ? $value->priquinabril : null;
                $objabril->segquincena = !empty($value->segquinabril) ? $value->segquinabril : null;
                $objabril->idpersona = $value->idpersona;
                $objabril->anno = $anno;
                $objabril->save();

                $objmayo = new DatPlanificacionvacaciones();
                $objmayo->mes = 5;
                $objmayo->priquincena = !empty($value->priquinmayo) ? $value->priquinmayo : null;
                $objmayo->segquincena = !empty($value->segquinmayo) ? $value->segquinmayo : null;
                $objmayo->idpersona = $value->idpersona;
                $objmayo->anno = $anno;
                $objmayo->save();

                $objjunio = new DatPlanificacionvacaciones();
                $objjunio->mes = 6;
                $objjunio->priquincena = !empty($value->priquinjunio) ? $value->priquinjunio : null;
                $objjunio->segquincena = !empty($value->segquinjunio) ? $value->segquinjunio : null;
                $objjunio->idpersona = $value->idpersona;
                $objjunio->anno = $anno;
                $objjunio->save();

                $objjulio = new DatPlanificacionvacaciones();
                $objjulio->mes = 7;
                $objjulio->priquincena = !empty($value->priquinjulio) ? $value->priquinjulio : null;
                $objjulio->segquincena = !empty($value->segquinjulio) ? $value->segquinjulio : null;
                $objjulio->idpersona = $value->idpersona;
                $objjulio->anno = $anno;
                $objjulio->save();

                $objagosto = new DatPlanificacionvacaciones();
                $objagosto->mes = 8;
                $objagosto->priquincena = !empty($value->priquinagosto) ? $value->priquinagosto : null;
                $objagosto->segquincena = !empty($value->segquinagosto) ? $value->segquinagosto : null;
                $objagosto->idpersona = $value->idpersona;
                $objagosto->anno = $anno;
                $objagosto->save();

                $objseptiembre = new DatPlanificacionvacaciones();
                $objseptiembre->mes = 9;
                $objseptiembre->priquincena = !empty($value->priquinseptiembre) ? $value->priquinseptiembre : null;
                $objseptiembre->segquincena = !empty($value->segquinseptiembre) ? $value->segquinseptiembre : null;
                $objseptiembre->idpersona = $value->idpersona;
                $objseptiembre->anno = $anno;
                $objseptiembre->save();

                $objoctubre = new DatPlanificacionvacaciones();
                $objoctubre->mes = 10;
                $objoctubre->priquincena = !empty($value->priquinoctubre) ? $value->priquinoctubre : null;
                $objoctubre->segquincena = !empty($value->segquinoctubre) ? $value->segquinoctubre : null;
                $objoctubre->idpersona = $value->idpersona;
                $objoctubre->anno = $anno;
                $objoctubre->save();

                $objnoviembre = new DatPlanificacionvacaciones();
                $objnoviembre->mes = 11;
                $objnoviembre->priquincena = !empty($value->priquinnoviembre) ? $value->priquinnoviembre : null;
                $objnoviembre->segquincena = !empty($value->segquinnoviembre) ? $value->segquinnoviembre : null;
                $objnoviembre->idpersona = $value->idpersona;
                $objnoviembre->anno = $anno;
                $objnoviembre->save();

                $objdiciembre = new DatPlanificacionvacaciones();
                $objdiciembre->mes = 12;
                $objdiciembre->priquincena = !empty($value->priquindiciembre) ? $value->priquindiciembre : null;
                $objdiciembre->segquincena = !empty($value->segquindiciembre) ? $value->segquindiciembre : null;
                $objdiciembre->idpersona = $value->idpersona;
                $objdiciembre->anno = $anno;
                $objdiciembre->save();
                $result['cod'] = 1;
            } else {
                $result['cod'] = 3;
            }
        }

        return $result;
    }

    private function eliminarPlanPersona($idpersona, $anno)
    {
        $datplanvac = new DatPlanificacionvacaciones();
        $datplanvac->deletePlanVacacionesPersona($idpersona, $anno);
    }

    public function getVacacionesByPeriodo($idestructura,$idpersonas,$fdesde,$fhasta){
        $datAsistencia = new DatAsistencia();
        $confCalendario = new ConfCalendario();
        $datAsistenciaModel = new DatAsistenciaModel();
        $result = array();
        if (count($idpersonas) > 0) {
            $idpers = $idpersonas;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $datasistencia = new DatAsistencia();
            $PersonCargo = $datasistencia->GetDatosPersonaReporte($cargosPeople, null);
            foreach ($PersonCargo as $i => $per) {
                $idpers[] = $per['idpersona'];
            }
        }
        $asistencia = $datAsistencia->getAsistVacacionesByPeriodo($fdesde, $fhasta, $idpers);
        //print_r($asistencia);die;
        foreach ($asistencia as $k => $people){//print_r($people['fhasta']);die;
            $diaslab = 0;
            $calendario = $confCalendario->CalendarioByDateRange($people['fdesde'],$people['fhasta'],$people['idgrupodescanso'], true);
            if(!$this->existePers($people['idpersona'],$result)){
                $result[$k]['idpersona'] = $people['idpersona'];
                $result[$k]['diaslaborables'] = count($calendario);
                $result[$k]['fdesde'] = $people['fdesde'];
                $result[$k]['fhasta'] = $people['fhasta'];
            }else{

            }
        }//print_r($result);die;
        return $result;
    }

    function existePers($idpersona, $resultado)
    {
        $val = false;
        foreach ($resultado as $index => $obj) {
            if ($obj['idpersona'] == $idpersona) {
                $val = true;
            }
        }
        return $val;
    }

}