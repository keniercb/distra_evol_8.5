<?php

//require_once __DIR__ . '/../../planmeta/models/bussines/DatPlanModel.php';

class DatPlanProduccionindustrialModel extends DatPlanModel {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Listar($identidad, $tipo, $node, $idejercicio, $identidades, $niveles = false) {
        // si tipo == 0 : devuelvo las agrupaciones
        // si tipo == 1 : devuelvo los planes

        switch ($tipo) {
            case 0:
                if ($niveles == false)
                    $arrayagrupaciones = DatPlan::getPlanesEntidad($identidad, $idejercicio, $identidades);
                if ($niveles == true)
                    $arrayagrupaciones = DatPlanProduccionindustrial::getPlanesEntidadNiv($identidad, $idejercicio, $identidades);

                if (isset($arrayagrupaciones[0])) {
                    foreach ($arrayagrupaciones as $i => $agrupacion) {
                        $arrayagrupaciones[$i]['icon'] = '/lib/ExtJS/temas/default/images/tree/folder.gif';
                        $arrayagrupaciones[$i]['qtip'] = "<p><b>Código: </b>" . $agrupacion['codigo'] . "</p>" .
                                "<p><b>Denominación: </b>" . $agrupacion['denominacion'] . "</p>" .
                                "<p><b>Descripción: </b>" . $agrupacion['descripcion'] . "</p>";
                        if ($niveles == false) {
                            if ($arrayagrupaciones[$i]['planif'] == 0) {
                                $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                            } else {
                                $arrayagrupaciones[$i]['text'] = "<b> " . $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'] . "</b>";
                            }
                        }
                        if ($niveles == true) {
                            if ($arrayagrupaciones[$i]['desglosada'] == 1)
                                $arrayagrupaciones[$i]['text'] = "<b> " . $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'] . "</b>";
                            else
                                $arrayagrupaciones[$i]['text'] = $agrupacion['denominacion'] . ' - ' . 'Cod: ' . $agrupacion['codigo'];
                        }
                    }
                }
                $elementos = $arrayagrupaciones;
                break;
            case 1:
                $arrayplanes = DatModeloProduccionindustrial::getModelosPlan($node, $identidad, $idejercicio, $identidades);
                if (isset($arrayplanes[0])) {
                    foreach ($arrayplanes as $i => $plan) {
                        if ($arrayplanes[$i]['ruta']) {
                            $ruta = explode('*', $arrayplanes[$i]['ruta']);
                            $arrayplanes[$i]['ruta'] = $ruta[1];
                            $arrayplanes[$i]['rutaids'] = $ruta[0];
                        }
                        if ($niveles == false) {
                            if ($arrayplanes[$i]['planif'] == 0)
                                $arrayplanes[$i]['text'] = $plan['denominacion'];
                            else
                                $arrayplanes[$i]['text'] = "<b> " . $plan['denominacion'] . "</b>";
                        }
                        if ($niveles == true) {
                            if ($arrayplanes[$i]['desglosada'] == 1) {
                                $arrayplanes[$i]['text'] = "<b> " . $plan['denominacion'] . "</b>";
                                $arrayplanes[$i]['menu'] = 1;
                            } else {
                                $arrayplanes[$i]['text'] = $plan['denominacion'];
                                $arrayplanes[$i]['menu'] = 0;
                            }
                        }

                        $arrayplanes[$i]['qtip'] = "<p><b>Denominación:</b> &nbsp;&nbsp;" . $plan[denominacion] . "</p>" .
                                "<p><b>Descripción:</b> &nbsp;&nbsp;" . $plan[descripcion] . "</p>" .
                                "<p><b>Tipo de Modelo:</b> &nbsp;&nbsp;" . $plan['tipomodelo'] . "</p>" .
                                "<p><b>Tipo de plan:</b> &nbsp;&nbsp;" . $ruta[1] . "</p>";
                    }
                }
                $elementos = $arrayplanes;
                break;
        }

        return $elementos;
    }

}
