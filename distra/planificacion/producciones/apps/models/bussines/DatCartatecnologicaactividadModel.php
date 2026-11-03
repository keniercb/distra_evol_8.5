<?php

class DatCartatecnologicaactividadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /* Gestionar carta tecnologica con actividad */

    public function adicionarCartaActividad($params) {
        $dn = DatCartatecnologica::listarEtapas(true);
        foreach ($params['idactividades'] as $valorIdactividad) {
            if ($params['plazos'][0] == null) {
                if ($valorIdactividad != null) {
                    $objCTAct = new DatCartatecnologicaactividad();
                    $objCTAct->idcartatecnologica = $params['idcartatecnologica'];
                    $objCTAct->idactividad = $valorIdactividad;
                    $objCTAct->plazo = 0;
                    $objCTAct->idetapa = $dn[0]['idetapa'];
                    $objCTAct->idusuario = $params['idusuario'];
                    $objCTAct->save();
                }
            } else {
                foreach ($params['plazos'] as $value) {
                    if ($valorIdactividad != null) {
                        $objCTAct = new DatCartatecnologicaactividad();
                        $objCTAct->idcartatecnologica = $params['idcartatecnologica'];
                        $objCTAct->idactividad = $valorIdactividad;
                        $objCTAct->plazo = $value;
                        $objCTAct->idetapa = $dn[0]['idetapa'];
                        $objCTAct->idusuario = $params['idusuario'];
                        $objCTAct->save();
                    }
                }
            }
        }
        return '24';
    }

    public function duplicarCartaActividad($params) {
        //$dn = DatCartatecnologica::listarEtapas(true);
        foreach ($params['cartatecnologicaactividad'] as $valorActividad) {

            /* if ($params['plazos'][0] == null) {
              if ($valorActividad != null) {
              $objCTAct = new DatCartatecnologicaactividad();
              $objCTAct->idcartatecnologica = $params['idcartatecnologica'];
              $objCTAct->idactividad = $valorActividad->idactividad;
              $objCTAct->plazo = $valorActividad->plazo;
              $objCTAct->duracion = $valorActividad->duracion;
              $objCTAct->idetapa = $valorActividad->idetapa;
              $objCTAct->save();
              }
              } else { */
            foreach ($params['plazos'] as $plazo) {
                if ($valorActividad != null) {
                    $objCTAct = new DatCartatecnologicaactividad();
                    $objCTAct->idcartatecnologica = $params['idcartatecnologica'];
                    $objCTAct->idactividad = $valorActividad->idactividad;
                    $objCTAct->plazo = $plazo;
                    $objCTAct->porciento = $valorActividad->porciento;
                    $objCTAct->duracion = $valorActividad->duracion;
                    $objCTAct->idetapa = $valorActividad->idetapa;
                    $objCTAct->idusuario = $params['idusuario'];
                    $objCTAct->save();
                }
            }
            //}
        }
        return '24';
    }

    public function modificarCartaActividad($params) {
        foreach ($params['valores'] as $value) {
            $objCartaTecAct = Doctrine::getTable('DatCartatecnologicaactividad')
                    ->find($value->idcartatecnologicaactividad);
            if ($objCartaTecAct->diacero != 1) {
                $objCartaTecAct->plazo = floatval($value->plazo);
            }
            $objCartaTecAct->duracion = floatval($value->duracion);
            $objCartaTecAct->idetapa = $value->idetapa;
            $objCartaTecAct->porciento = $value->porciento;
            $objCartaTecAct->save();
        }
        return '24';
    }

    public function modificarEtapa($params) {
        $query = Doctrine_Query::create();
        $query->update("DatCartatecnologicaactividad")
                ->set("idetapa", $params['idetapa'])
                ->whereIn("idcartatecnologicaactividad", $params['idactividades'])
                ->execute();
        return '24';
    }

    public function eliminarVariasCartaActividad(Array $cartatecnologicaActividad
    ) {
        $query = Doctrine_Query::create();
        $query->delete('DatCartatecnologicaactividad')
                ->from('DatCartatecnologicaactividad')
                ->whereIn(
                        'idcartatecnologicaactividad', $cartatecnologicaActividad
                )->execute();
        return '24';
    }

    public function duplicarVariasActividadEnCartaTec(Array $params) {
        self::duplicarCartaActividad($params);
        return '24';
    }

    public function listarEquiposDeUnaCartaTec($params) {
        return DatCartatecnologicaactividad::listarEquipoDeUnaCT($params);
    }

    public function listarActividadesDeUnaCartaTec($params) {
        return DatCartatecnologicaactividad::listarActividadesCTNoIncluidasServicio(
                        $params
        );
    }

}
