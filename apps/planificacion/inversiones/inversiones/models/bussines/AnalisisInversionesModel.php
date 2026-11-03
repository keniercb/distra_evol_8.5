<?php
 //die
class AnalisisInversionesModel extends ZendExt_Model
{

    //public $colors = array();

    public function controlEjecucion($params)
    {

        //print_r($params);die;
        $analisisInv = new AnalisisInversiones();
        $ejercicios = $analisisInv->buscarEjercicioAnterior($params['ejercicio']);
        $identidades = self::getIdEntidadesHijas($params['identidad']);

        $grColumna = self::grColumna($params, $analisisInv, $ejercicios, $identidades);
        $etapas = array('Ejecutado', 'Plan', 'Estimado', 'Proyectado');
//die;
        $grPuntos = self::grPuntos($params, $analisisInv, $ejercicios, $identidades);
        //die;

        $annos = array($params['ejercicio'] - 2, $params['ejercicio'] - 1, $params['ejercicio'], $params['ejercicio'] + 1);

        return array('columna' => $grColumna, 'etapas' => $etapas, 'annos' => $annos, 'puntos' => $grPuntos);
    }

    private function grColumna($params, $objAnalisisInversiones, $ejercicios, $identidades)
    {
        $ejers = array();
        //pre_r($params);die;
        $ejers[] = $ejercicios[1]['idejercicio'];
        $ejers[] = $params['idejercicio'];

        $datos = $objAnalisisInversiones->graficarControlEjecucion($identidades, $ejers);


        $datosGraficaColumnas = array();
        $datosGraficaColumnas[0]['name'] = $datos[0]['ejercicio'];
        $datosGraficaColumnas[0]['color'] = '#47545D';
        $datosGraficaColumnas[0]['data'] = array((float)$datos[0]['valor'], (float)$datos[1]['valor'], (float)$datos[2]['valor'], (float)$datos[3]['valor']);

        $datosGraficaColumnas[1]['name'] = $datos[4]['ejercicio'];
        $datosGraficaColumnas[1]['color'] = '#6BC41E';
        $datosGraficaColumnas[1]['data'] = array((float)$datos[4]['valor'], (float)$datos[5]['valor'], (float)$datos[6]['valor'], (float)$datos[7]['valor']);
        //pre_r($datosGraficaColumnas);die;
        return $datosGraficaColumnas;
    }

    private function grPuntos($params, $objAnalisisInversiones, $ejercicios, $identidades)
    {
        foreach ($ejercicios as $ejer) {
            $ejers[] = $ejer['idejercicio'];
        }
        $ejers[] = $params['idejercicio'];
        $datos = $objAnalisisInversiones->graficarControlEjecucion($identidades, $ejers);

        $datSeriePuntos[0]['name'] = 'Ejecutado';
        $datSeriePuntos[0]['color'] = '#47545D';
        $datSeriePuntos[0]['data'] = array((float)$datos[0]['valor'], (float)$datos[4]['valor'], (float)$datos[8]['valor'], (float)$datos[12]['valor']);

        $datSeriePuntos[1]['name'] = 'Estimado';
        $datSeriePuntos[1]['color'] = '#6BC41E';
        $datSeriePuntos[1]['data'] = array((float)$datos[2]['valor'], (float)$datos[6]['valor'], (float)$datos[10]['valor'], (float)$datos[14]['valor']);

        $datSeriePuntos[2]['name'] = 'Plan';
        $datSeriePuntos[2]['color'] = '#FBC5C5';
        $datSeriePuntos[2]['data'] = array((float)$datos[1]['valor'], (float)$datos[5]['valor'], (float)$datos[9]['valor'], (float)$datos[13]['valor']);

        $datSeriePuntos[3]['name'] = 'Proyección';
        $datSeriePuntos[3]['color'] = '#FD841D';
        $datSeriePuntos[3]['data'] = array((float)$datos[3]['valor'], (float)$datos[7]['valor'], (float)$datos[11]['valor'], (float)$datos[15]['valor']);

        return $datSeriePuntos;
    }

    public function formaPropiedadYMonedas($params)
    {
        $analisisInv = new AnalisisInversiones();
        //$ejercicios = $analisisInv->buscarEjercicioAnterior($params['ejercicio']);
        $identidades = self::getIdEntidadesHijas($params['identidad']);

        $grPastel = self::grPastelFpropiedad($params, $analisisInv, $identidades);
        $grColumnas = self::grColumnasFPropiedad($params, $analisisInv, $identidades);

        return array('pastel' => $grPastel, 'columnas' => $grColumnas);
    }

    private function getIdEntidadesHijas($idEntidad)
    {
        $objInversion = new InversionesModel();
        $entidadesHijas = $objInversion->cargarEntHijas($idEntidad);
        $identidades = array();
        if (empty($entidadesHijas)) {
            $identidades[] = $idEntidad;
        } else {
            foreach ($entidadesHijas as $entHija) {
                $identidades[] = $entHija['identidad'];
            }
        }
        return $identidades;
    }

    private function grPastelFpropiedad($params, $objAnalisisInversiones, $identidades)
    {
        $datos = $objAnalisisInversiones->graficarFormaPropiedad($identidades, $params['idejercicio']);

        $colors = array('#FBC5C5', '#47545D', '#D1313D', '#6BC41E', '#FD841D');

        $datosgrafica = array();
        if (!empty($datos))
            foreach ($datos as $k => $dato) {
                $datosgrafica[$k]['name'] = $dato['denominacion'];
                $datosgrafica[$k]['color'] = $colors[$k];
                $datosgrafica[$k]['y'] = (float)$dato['porciento'];

            }
        else {
            $datosgrafica[0]['name'] = (float)0;
        }

        return $datosgrafica;
    }

    private function grColumnasFPropiedad($params, $objAnalisisInversiones, $identidades)
    {
        $ejers[] = $params['idejercicio'];
        $datos = $objAnalisisInversiones->graficarFormaPropiedadPorMoneda($identidades, $params['idejercicio'], $params['ejercicio']);
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $objAnalisisInversiones->monedasPorEntidad($identidades, $selectIdMonedaentidad);
        //print_r($monedasPorEntidad);die;
        $colors = array('#D1313D', '#47545D', '#FBC5C5', '#6BC41E', '#FD841D');

        $datosgrafica = array();
        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datos as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = (float)$dato['valor'];
                    $datosgrafica[$k]['name'] = $dato['codigoiso'];
                    $datosgrafica[$k]['data'] = $valores;
                    $datosgrafica[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgrafica = array_values($datosgrafica);


        $formasPropiedad = array();
        foreach ($datos as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $formasPropiedad))
                    $formasPropiedad[] = $dato['denominacion'];
            } else {
                $formasPropiedad[] = $dato['denominacion'];
            }
        }


        return array('datosgrafica' => $datosgrafica, 'formasPropiedad' => $formasPropiedad);
    }

    public function financiamiento($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grPastel = self::grComoFinanciaPastel($identidades, $param['idejercicio'], $analisisInversion);
        $grColumnaQuien = self::grQuienFinancia($identidades, $param['idejercicio'], $param['ejercicio'], $analisisInversion);
        $grColumnaComo = self::grComoFinanciaMonedas($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('pastel' => $grPastel, 'columnas' => $grColumnaQuien, 'grComoMonedas' => $grColumnaComo);
    }

    private function grComoFinanciaPastel($identidades, $idejercicio, $analisisInversion)
    {
        $datos = $analisisInversion->graficarComoFinancia($identidades, $idejercicio);
        $colors = array('#FBC5C5', '#47545D', '#D1313D', '#6BC41E', '#FD841D');

        $datosgrafica = array();
        if (!empty($datos))
            foreach ($datos as $k => $dato) {
                $datosgrafica[$k]['name'] = $dato['como'];
                $datosgrafica[$k]['y'] = (float)$dato['porciento'];
                $datosgrafica[$k]['color'] = $colors[$k];
            }
        else {
            $datosgrafica[0]['name'] = (float)0;
        }
        return $datosgrafica;
    }

    public function grQuienFinancia($identidad, $idejercicio, $ejercicio, $analisisInversion)
    {
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $analisisInversion->monedasPorEntidad($identidad, $selectIdMonedaentidad);
        $denQuienFinancia = $analisisInversion->getQuienFinancia($identidad, $idejercicio);
        $datos = $analisisInversion->graficarQuienFinancia($identidad, $idejercicio, $ejercicio);
        $colors = array('#D1313D', '#47545D', '#FBC5C5', '#6BC41E', '#FD841D');
        $datosgrafica = array();


        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($denQuienFinancia as $quien) {
                $encuentra = false;
                foreach ($datos as $p => $dato) {

                    if ($dato['denominacion'] == $quien) {
                        if ($moneda['codigoiso'] == $dato['codigoiso']) {
                            $valorA = (float)$dato['valor'];
                            $encuentra = true;
                            break;
                        } else {
                            $encuentra = false;
                        }
                    }
                }
                if ($encuentra)
                    $valores[] = $valorA;
                else
                    $valores[] = 0;
                $datosgrafica[$k]['name'] = $moneda['codigoiso'];
                $datosgrafica[$k]['data'] = $valores;
                $datosgrafica[$k]['color'] = $colors[$k];
            }
        }
        return array('denominacion' => $denQuienFinancia, 'datosGr' => $datosgrafica);
    }


    public function inversionesMasCostosas($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grColumnas = self::grInversionesMasCostosas($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('columnas' => $grColumnas);
    }

    private function grInversionesMasCostosas($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {

        $datos = $objAnalisisInversiones->graficarInversionesMasCostosas($identidades, $idejercicio, $ejercicio);
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $objAnalisisInversiones->monedasPorEntidad($identidades, $selectIdMonedaentidad);
        $colors = array('#47545D', '#6BC41E', '#FD841D', '#D1313D', '#FBC5C5');
        $denominacionInversiones = array();
        foreach ($datos as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $denominacionInversiones))
                    $denominacionInversiones[] = $dato['denominacion'];
            } else {
                $denominacionInversiones[] = $dato['denominacion'];
            }
        }

        $datosgrafica = array();
        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($denominacionInversiones as $i => $inv) {
                $encuentra = false;
                foreach ($datos as $p => $dato) {

                    if ($dato['denominacion'] == $inv) {
                        if ($moneda['codigoiso'] == $dato['codigoiso']) {
                            $valorA = (float)$dato['valor'];
                            $encuentra = true;
                            break;
                        } else {
                            $encuentra = false;
                        }
                    }
                }
                if ($encuentra)
                    $valores[] = $valorA;
                else
                    $valores[] = 0;
                $datosgrafica[$k]['name'] = $moneda['codigoiso'];
                $datosgrafica[$k]['data'] = $valores;
                $datosgrafica[$k]['color'] = $colors[$k];
            }
        }
        return array('datosgrafica' => $datosgrafica, 'denominacionInversiones' => $denominacionInversiones);
    }

    public function equipos($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grColumnasGenerico = self::grEquiposGenericos($identidades, $param['idejercicio'], $param['ejercicio'], $analisisInversion);
        $grColumnas = self::grEquiposPlan($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);
        $grBarras = self::grEquiposAdquisiscion($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('columnasGenerico' => $grColumnasGenerico, 'columnasPlan' => $grColumnas, 'barras' => $grBarras);

    }

    private function grEquiposGenericos($identidades, $idejercicio, $ejercicio, $objAnalisisInversiones)
    {
        $datos = $objAnalisisInversiones->graficarEquiposGenericos($identidades, $idejercicio, $ejercicio);
        $equiposPrimerNivel = $objAnalisisInversiones->indicadoresEquiposPrimerNivel();
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');

        $datosgrafica = array();
        foreach ($equiposPrimerNivel as $p => $equipo) {
            $encuentra = false;
            foreach ($datos as $d => $dato) {
                if ($equipo['indpadre'] == $dato['indpadre']) {
                    $valorA = (float)$dato['cantidad'];
                    $encuentra = true;
                    break;
                }
            }
            if ($encuentra)
                $valor = $valorA;
            else
                $valor = 0;
            $datosgrafica[$p]['name'] = $equipo['equipopadre'];
            $datosgrafica[$p]['y'] = $valor;
            $datosgrafica[$p]['drilldown'] = $equipo['equipopadre'];
            $datosgrafica[$p]['color'] = $colors[$p];
        }
        return array('datosgrafica' => $datosgrafica);
    }

    private function grEquiposPlan($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarEquiposplan($identidades, $idejercicio, $ejercicio);
        $planes = $objAnalisisInversiones->planesEquipos($identidades);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');
        $datosgrafica = array();
        foreach ($planes as $p => $plan) {
            $encuentra = false;
            foreach ($datos as $d => $dato) {
                if ($plan['denominacion'] == $dato['denominacion']) {
                    $valorA = (float)$dato['cantidad'];
                    $encuentra = true;
                    break;
                }
            }
            if ($encuentra)
                $valor = $valorA;
            else
                $valor = 0;
            $datosgrafica[$p]['name'] = $plan['denominacion'];
            $datosgrafica[$p]['y'] = $valor;
            $datosgrafica[$p]['drilldown'] = $plan['denominacion'];
            $datosgrafica[$p]['color'] = $colors[$p];
        }
        return array('datosgrafica' => $datosgrafica);
    }

    private function grEquiposAdquisiscion($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarEquiposAdquisicion($identidades, $idejercicio, $ejercicio);
        $vias = $objAnalisisInversiones->viasAdquisicionEquipos();
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');
        $datosgrafica = array();
        foreach ($vias as $p => $via) {

            $encuentra = false;
            foreach ($datos as $d => $dato) {
                if ($via == $dato['denominacion']) {
                    $valorA = (float)$dato['cantidad'];
                    $encuentra = true;
                    break;
                }
            }
            if ($encuentra)
                $valor[] = $valorA;
            else
                $valor[] = 0;
        }
        $datosgrafica['name'] = 'Cantidad';
        $datosgrafica['data'] = $valor;
        $datosgrafica['color'] = $colors[0];

        return array('datosgrafica' => $datosgrafica, 'denomVias' => $vias);
    }

    public function inversionesMasEquipos($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grColumnas = self::grMasEquipos($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('columnas' => $grColumnas);
    }

    private function grMasEquipos($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarMasEquipos($identidades, $idejercicio, $ejercicio);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261', '#324F55', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

        $datosgrafica = array();
        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['y'] = (float)$dato['cantidad'];
            $datosgrafica[$k]['drilldown'] = $dato['denominacion'];
            $datosgrafica[$k]['color'] = $colors[$k];
        }

        return array('datosgrafica' => $datosgrafica);
    }


    public function inversionesPorTipo($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grPastel = self::grTipoInversion($identidades, $param['idejercicio'], $analisisInversion);
        $grColumnas = self::grTipoInversionYMonedas($identidades, $param['idejercicio'], $param['ejercicio'], $analisisInversion);

        return array('pastel' => $grPastel, 'columnas' => $grColumnas);
    }

    private function grTipoInversion($identidades, $idejercicio, $objAnalisisInversiones)
    {

        $datos = $objAnalisisInversiones->graficarInversionesPorTipo($identidades, $idejercicio);
        $colors = array('#FBC5C5', '#47545D', '#D1313D', '#6BC41E', '#FD841D');

        //print_r($datos);die;
        $datosgrafica = array();
        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['color'] = $colors[$k];
            $datosgrafica[$k]['y'] = (float)$dato['porciento'];

        }
        return $datosgrafica;

    }

    private function grTipoInversionYMonedas($identidades, $idejercicio, $ejercicio, $objAnalisisInversiones)
    {

        $datos = $objAnalisisInversiones->graficarInversionesPorTipoYMonedas($identidades, $idejercicio, $ejercicio);
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $objAnalisisInversiones->monedasPorEntidad($identidades, $selectIdMonedaentidad);
        $colors = array('#47545D', '#6BC41E', '#FD841D', '#D1313D', '#FBC5C5');

        $denominacionTipoInversiones = array();
        foreach ($datos as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $denominacionTipoInversiones))
                    $denominacionTipoInversiones[] = $dato['denominacion'];
            } else {
                $denominacionTipoInversiones[] = $dato['denominacion'];
            }
        }
        //print_r($denominacionTipoInversiones);die;

        $datosgrafica = array();
        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($denominacionTipoInversiones as $i => $inv) {
                $encuentra = false;
                foreach ($datos as $p => $dato) {

                    if ($dato['denominacion'] == $inv) {
                        if ($moneda['codigoiso'] == $dato['codigoiso']) {
                            $valorA = (float)$dato['valor'];
                            $encuentra = true;
                            break;
                        } else {
                            $encuentra = false;
                        }
                    }
                }
                if ($encuentra)
                    $valores[] = $valorA;
                else
                    $valores[] = 0;
                $datosgrafica[$k]['name'] = $moneda['codigoiso'];
                $datosgrafica[$k]['data'] = $valores;
                $datosgrafica[$k]['color'] = $colors[$k];
            }
        }


        return array('datosgrafica' => $datosgrafica, 'denominacionTipoInversiones' => $denominacionTipoInversiones);
    }


    public function inversionesPlanPreparacion($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grColumnas = self::grPlanPreparacion($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('columnasPlanP' => $grColumnas);
    }

    private function grPlanPreparacion($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarPlanPreparacion($identidades, $idejercicio, $ejercicio);
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $objAnalisisInversiones->monedasPorEntidad($identidades, $selectIdMonedaentidad);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');
        $datosgrafica = array();
        foreach ($monedasPorEntidad as $p => $moneda) {
            $encuentra = false;
            foreach ($datos as $d => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valorA = (float)$dato['valor'];
                    $encuentra = true;
                    break;
                }
            }
            if ($encuentra)
                $valor = $valorA;
            else
                $valor = 0;
            $datosgrafica[$p]['name'] = $moneda['codigoiso'];
            $datosgrafica[$p]['y'] = $valor;
            $datosgrafica[$p]['drilldown'] = $moneda['codigoiso'];
            $datosgrafica[$p]['color'] = $colors[$p];
        }

        return array('datosgrafica' => $datosgrafica);
    }

    public function EquiposOrganoSatisf($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grColumnas = self::grEquiposOrganoSatisf($identidades, $param['idejercicio'], $analisisInversion, $param['ejercicio']);

        return array('columnasPlanP' => $grColumnas);

    }

    private function grEquiposOrganoSatisf($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarEquiposOrganoSatisf($identidades, $idejercicio, $ejercicio);
        //$planes = $objAnalisisInversiones->planesEquipos($identidades);
        $organos = $objAnalisisInversiones->organosSatisface();
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');
        $datosgrafica = array();
        foreach ($organos as $p => $organo) {
            $encuentra = false;
            foreach ($datos as $d => $dato) {
                if ($organo['idorganosatisface'] == $dato['idorganosatisface']) {
                    $valorA = (float)$dato['cantidad'];
                    $encuentra = true;
                    break;
                }
            }
            if ($encuentra)
                $valor = $valorA;
            else
                $valor = 0;
            $datosgrafica[$p]['name'] = $organo['denominacion'];
            $datosgrafica[$p]['y'] = $valor;
            $datosgrafica[$p]['drilldown'] = $organo['denominacion'];
            $datosgrafica[$p]['color'] = $colors[$p];
        }
        return array('datosgrafica' => $datosgrafica);
    }


    public function equiposSectorEstrategico($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grEquiposSectorFisico = self::grEquiposSectorFisico($identidades, $param['idejercicio'], $analisisInversion);
        $grEquiposSectorMonto = self::grEquiposSectorMonto($identidades, $param['idejercicio'], $analisisInversion);
        $grEquiposOrgaSectorMonto = self::grEquiposOrganismosSectorMonto($identidades, $param['idejercicio'], $analisisInversion);

        return array('grEquiposSF' => $grEquiposSectorFisico, 'grEquiposM' => $grEquiposSectorMonto, 'grEquiposOrg' => $grEquiposOrgaSectorMonto);

    }

    public function graficarEquiposOrganoSectorEstrategico($param)
    {
        $analisisInversion = new AnalisisInversiones();
        $identidades = self::getIdEntidadesHijas($param['identidad']);
        $grEquiposOrgaSectorMonto = self::grEquiposOrganismosSectorMonto($identidades, $param['idejercicio'], $analisisInversion);

        return array('grEquiposOrg' => $grEquiposOrgaSectorMonto);
    }

    private function grEquiposSectorFisico($identidades, $idejercicio, $objAnalisisInversiones)
    {
        $datos = $objAnalisisInversiones->graficarEquiposSectorFisico($identidades, $idejercicio);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261');
        $datosgrafica = array();
        foreach ($datos as $p => $dato) {

            $datosgrafica[$p]['name'] = $dato['denominacion'];
            $datosgrafica[$p]['y'] = ($dato['cantidad'] == null) ? 0 : (double)$dato['cantidad'];
            $datosgrafica[$p]['drilldown'] = $dato['denominacion'];
            $datosgrafica[$p]['color'] = $colors[$p];
        }
        return array('datosgrafica' => $datosgrafica);
    }

    private function grEquiposSectorMonto($identidades, $idejercicio, $objAnalisisInversiones)
    {
        $datos = $objAnalisisInversiones->graficarEquiposSectorMonto($identidades, $idejercicio);
        $colors = array('#D1313D', '#47545D', '#FBC5C5', '#6BC41E', '#FD841D');

        $datosgrafica = array();
        $categorias = array();

        foreach ($datos as $k => $dato) {
            $valoresCUP[] = ($dato['valor'] == null) ? 0 : (float)$dato['valor'];
            $valoresUSD[] = ($dato['valordivisa'] == null) ? 0 : (float)$dato['valordivisa'];
            $categorias[] = $dato['denominacion'];
        }

        $datosgrafica[0]['name'] = 'CUP';
        $datosgrafica[0]['data'] = $valoresCUP;
        $datosgrafica[0]['color'] = $colors[0];

        $datosgrafica[1]['name'] = 'USD';
        $datosgrafica[1]['data'] = $valoresUSD;
        $datosgrafica[1]['color'] = $colors[1];

        return array('datosgrafica' => $datosgrafica, 'categorias' => $categorias);
    }

    private function grEquiposOrganismosSectorMonto($identidades, $idejercicio, $objAnalisisInversiones)
    {

        $datos = $objAnalisisInversiones->graficarEquiposOrganismoSectorMonto($identidades, $idejercicio);
        $sectores = $objAnalisisInversiones->sectoresEstrategicos();
        $colors = array('#D1313D', '#47545D', '#FBC5C5', '#6BC41E', '#FD841D');

        $datosgrafica = array();
        $categorias = array();
        $idcategorias = array();
        $pos = 0;
        foreach ($sectores as $s => $sector) {
            $valoresCUP = array();
            $valoresUSD = array();
            foreach ($identidades as $k => $identidad) {
                $encuentraSector = false;
                $encuentraEntidad = false;
                $valorCUP = 0;
                $valorUSD = 0;
                $denomEntidad = array();
                foreach ($datos as $d => $dato) {
                    if ($identidad == $dato['idestructuracomun']) {
                        $encuentraEntidad = true;
                        $denomEntidad['denomestructura'] = $dato['denomestructura'];
                        $denomEntidad['idestructuracomun'] = $dato['idestructuracomun'];

                        if ($sector['iddatosnomenclador'] == $dato['iddatosnomenclador']) {
                            $encuentraSector = true;
                            $valorCUP = ($dato['valor']) ? (float)$dato['valor'] : 0;
                            $valorUSD = ($dato['valordivisa']) ? (float)$dato['valordivisa'] : 0;
                            break;
                        }
                    }
                }

                if ($encuentraEntidad) {
                    if (!in_array($denomEntidad['idestructuracomun'], $idcategorias)) {
                        $categorias[] = $denomEntidad['denomestructura'];
                        $idcategorias[] = $denomEntidad['idestructuracomun'];
                    }

                    if ($encuentraSector) {
                        $valoresCUP[] = $valorCUP;
                        $valoresUSD[] = $valorUSD;

                    } else {
                        $valoresCUP[] = 0;
                        $valoresUSD[] = 0;

                    }
                }
            }

            $datosgrafica[$pos]['name'] = $sector['denominacion'] . ' CUP';
            $datosgrafica[$pos]['data'] = $valoresCUP;
            $datosgrafica[$pos]['color'] = $colors[$pos];


            $datosgrafica[$pos + 1]['name'] = $sector['denominacion'] . ' USD';
            $datosgrafica[$pos + 1]['data'] = $valoresUSD;
            $datosgrafica[$pos + 1]['color'] = $colors[$pos + 1];

            $pos = $pos + 2;
        }

        $padding = 0.3;
        $paddingInicial = 0.3;
        $placement = -0.2;
        $placementP = 0.2;
        foreach ($datosgrafica as $s => &$dato) {
            if ($s < count($datosgrafica) / 2) {
                $dato['pointPadding'] = $padding;
                $dato['pointPlacement'] = $placement;

                $padding = $padding + 0.1;
            } else {
                if ($s == count($datosgrafica) / 2)
                    $padding = $paddingInicial;
                $dato['pointPadding'] = $padding;
                $dato['pointPlacement'] = $placementP;
                //$dato['yAxis'] = 1;

                $padding = $padding + 0.1;

            }
        }

        return array('datosgrafica' => $datosgrafica, 'categorias' => $categorias);
    }

    private function grComoFinanciaMonedas($identidades, $idejercicio, $objAnalisisInversiones, $ejercicio)
    {
        $datos = $objAnalisisInversiones->graficarComoFinanciaMonedas($identidades, $idejercicio, $ejercicio);
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $objAnalisisInversiones->monedasPorEntidad($identidades, $selectIdMonedaentidad);
        $colors = array('#D1313D', '#47545D', '#FBC5C5', '#6BC41E', '#FD841D');
        //print_r($datos);die;
        $datosgrafica = array();
        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datos as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = ($dato['valor'] == null) ? 0 : (float)$dato['valor'];
                    $datosgrafica[$k]['name'] = $dato['codigoiso'];
                    $datosgrafica[$k]['data'] = $valores;
                    $datosgrafica[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgrafica = array_values($datosgrafica);

        $comoSefinancia = array();
        foreach ($datos as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['como'], $comoSefinancia))
                    $comoSefinancia[] = $dato['como'];
            } else {
                $comoSefinancia[] = $dato['como'];
            }
        }

        return array('datosgrafica' => $datosgrafica, 'categorias' => $comoSefinancia);
    }

    public function inversionesObjetivos($params)
    {
        $identidades = self::getIdEntidadesHijas($params['identidad']);
        $analisisInversion = new AnalisisInversiones();
        $datos = $analisisInversion->inversionesObjetivos($identidades, $params['ejercicio'], $params['idejercicio']);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261', '#324F55', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['y'] = (float)$dato['cantidad'];
            $datosgrafica[$k]['color'] = $colors[$k];
        }

        $datosimp = $analisisInversion->inversionesObjetivosImporte($identidades, $params['idejercicio'], $params['ejercicio']);

        $datosgraficaI = array();
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $analisisInversion->monedasPorEntidad($identidades, $selectIdMonedaentidad);

        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datosimp as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = (float)$dato['valor'];
                    $datosgraficaI[$k]['name'] = $dato['codigoiso'];
                    $datosgraficaI[$k]['data'] = $valores;
                    $datosgraficaI[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgraficaI = array_values($datosgraficaI);

        $categorias = array();
        foreach ($datosimp as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $categorias))
                    $categorias[] = $dato['denominacion'];
            } else {
                $categorias[] = $dato['denominacion'];
            }
        }
        //print_r($categorias);die;

        return array('datosgrafica' => $datosgrafica, 'datosgraficaI' => $datosgraficaI, 'objetivos' => $categorias);
    }

    public function inversionesEfecto($params)
    {
        $identidades = self::getIdEntidadesHijas($params['identidad']);
        $analisisInversion = new AnalisisInversiones();
        $datos = $analisisInversion->inversionesEfecto($identidades, $params['ejercicio'], $params['idejercicio']);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261', '#324F55', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['y'] = (float)$dato['cantidad'];
            $datosgrafica[$k]['color'] = $colors[$k];
        }

        $datosimp = $analisisInversion->inversionesEfectoImporte($identidades, $params['idejercicio'], $params['ejercicio']);

        $datosgraficaI = array();
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $analisisInversion->monedasPorEntidad($identidades, $selectIdMonedaentidad);

        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datosimp as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = (float)$dato['valor'];
                    $datosgraficaI[$k]['name'] = $dato['codigoiso'];
                    $datosgraficaI[$k]['data'] = $valores;
                    $datosgraficaI[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgraficaI = array_values($datosgraficaI);

        $categorias = array();
        foreach ($datosimp as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $categorias))
                    $categorias[] = $dato['denominacion'];
            } else {
                $categorias[] = $dato['denominacion'];
            }
        }

        return array('datosgrafica' => $datosgrafica, 'datosgraficaI' => $datosgraficaI, 'objetivos' => $categorias);
    }

    public function inversionesSectores($params)
    {
        $identidades = self::getIdEntidadesHijas($params['identidad']);
        $analisisInversion = new AnalisisInversiones();
        $datos = $analisisInversion->inversionesSectores($identidades, $params['ejercicio'], $params['idejercicio']);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261', '#324F55', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['y'] = (float)$dato['cantidad'];
            $datosgrafica[$k]['color'] = $colors[$k];
        }

        $datosimp = $analisisInversion->inversionesSectoresImporte($identidades, $params['idejercicio']);

        $datosgraficaI = array();
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $analisisInversion->monedasPorEntidad($identidades, $selectIdMonedaentidad);

        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datosimp as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = (float)$dato['valor'];
                    $datosgraficaI[$k]['name'] = $dato['codigoiso'];
                    $datosgraficaI[$k]['data'] = $valores;
                    $datosgraficaI[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgraficaI = array_values($datosgraficaI);

        $categorias = array();
        foreach ($datosimp as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $categorias))
                    $categorias[] = $dato['denominacion'];
            } else {
                $categorias[] = $dato['denominacion'];
            }
        }

        $datoscuencas = self::inversionesCuencas($params);

        return array('datosgrafica' => $datosgrafica, 'datosgraficaI' => $datosgraficaI, 'objetivos' => $categorias,
            'datosgraficaC' => $datoscuencas['datosgrafica'], 'datosgraficaIC' => $datoscuencas['datosgraficaI'], 'objetivosC' => $datoscuencas['objetivos']);
    }

    private function inversionesCuencas($params)
    {

        $identidades = self::getIdEntidadesHijas($params['identidad']);
        $analisisInversion = new AnalisisInversiones();
        $datos = $analisisInversion->inversionesCuencas($identidades, $params['ejercicio'], $params['idejercicio']);
        $colors = array('#47545D', '#6BC41E', '#FBC5C5', '#FD841D', '#FF5261', '#324F55', '#A5E7FF', '#C6E69D', '#F5D888', '#AA9F50');

        foreach ($datos as $k => $dato) {
            $datosgrafica[$k]['name'] = $dato['denominacion'];
            $datosgrafica[$k]['y'] = (float)$dato['cantidad'];
            $datosgrafica[$k]['color'] = $colors[$k];
        }

        $datosimp = $analisisInversion->inversionesCuencasImporte($identidades, $params['idejercicio']);

        $datosgraficaI = array();
        $selectIdMonedaentidad = 0;
        $monedasPorEntidad = $analisisInversion->monedasPorEntidad($identidades, $selectIdMonedaentidad);

        foreach ($monedasPorEntidad as $k => $moneda) {
            $valores = array();
            foreach ($datosimp as $p => $dato) {
                if ($moneda['codigoiso'] == $dato['codigoiso']) {
                    $valores[] = (float)$dato['valor'];
                    $datosgraficaI[$k]['name'] = $dato['codigoiso'];
                    $datosgraficaI[$k]['data'] = $valores;
                    $datosgraficaI[$k]['color'] = $colors[$k];
                }
            }
        }
        $datosgraficaI = array_values($datosgraficaI);

        $categorias = array();
        foreach ($datosimp as $p => $dato) {
            if ($p != 0) {
                if (!in_array($dato['denominacion'], $categorias))
                    $categorias[] = $dato['denominacion'];
            } else {
                $categorias[] = $dato['denominacion'];
            }
        }

        return array('datosgrafica' => $datosgrafica, 'datosgraficaI' => $datosgraficaI, 'objetivos' => $categorias);
    }

    public function getBase64fromSvg($svg, $svg2, $clean)
    {
        $svghelp = new SVGHelper($svg, $svg2, $clean);
        return $svghelp->getFileBase64();
    }

}
