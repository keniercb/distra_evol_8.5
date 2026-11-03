<?php

class DatControldivisaindicadorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatControldivisaindicador($datControldivisaindicador
    )
    {
        $datControldivisaindicador->save();
    }

    public function modificardatControldivisaindicador($datControldivisaindicador
    )
    {
        $datControldivisaindicador->save();
    }

    public function eliminardatControldivisaindicador($datControldivisaindicador
    )
    {
        $datControldivisaindicador->delete();
    }

    public function listarCentroBalance($integrator, $idpadre, $idindicador)
    {
        if ($idpadre == null || $idpadre == $idindicador) {
            $idcentrobalance
                = 1; //numero fijo en la BD para Nomdatosnomenclador
            $centrobalance
                = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                    $idcentrobalance
                );
        } else {
            $centrobalance
                = DatEntidaddatosnomenclador::getEntidadesDadoIdPadre($idpadre);
        }
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['idcentrobalance'] = $valor ['identidad'];
            $datosentidad = $integrator->metadatos->DameEstructura(
                $valor ['identidad']
            ); //100000024
            $dat [$k] ['denom'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador']
                = $valor ['identidaddatosnomenclador'];
        }
        return $dat;
    }

    function Asociar($idcontroldivisa, $identidadmodelo, $orden,
        $identidad, $idejercicio
    )
    {
        $resp = 0;

        foreach ($orden as $indicadorUno) {
            $indicadores = NomIndicador::getIndporOrden(
                $indicadorUno->ordender, $indicadorUno->ordenizq
            );
            if (isset($indicadores[0])) {
                foreach ($indicadores as $indicadorHijo) {
                    $hijo = $indicadorHijo['idindicador'];
                    if (isset($identidadmodelo)) {
                        // $buscar='vino modelo';
                        $haveAsoc = Doctrine::getTable('DatControldivisaindicadormodelo')
                            ->findByDql("idindicador = $hijo and identidadmodelo=$identidadmodelo and idejercicio=$idejercicio");
                    } else {
                        //$buscar=' no vino modelo';
                        $haveAsoc = Doctrine::getTable('DatControldivisaindicadormodelo')
                            ->findByDql("idindicador = $hijo and identidadmodelo=null and idejercicio=$idejercicio");
                    }


                    if ($identidadmodelo == null) {
                        if ($haveAsoc[0]->idcontroldivisaindicadormodelo == null) {
                            $asociacion = new DatControldivisaindicadormodelo();
                            $asociacion->idindicador = $hijo;
                            $asociacion->idcontroldivisa = $idcontroldivisa;
                            $asociacion->identidadautor = $identidad;
                            $asociacion->idejercicio = $idejercicio;
                            $asociacion->save();
                            if ($identidadmodelo) {
                                $asociacion->identidadmodelo = $identidadmodelo;
                            }
                            $asociacion->save();

                            $resp = 1;
                        }
                    } else {
                        if ($identidadmodelo) {
                            //Si voy a insertar una tupla con un idcontroldivisa e idindicador que ya existen en la BD pero con distinto identidadmodelo
                            //me da error pk ahi un indice
                            if ($haveAsoc[0]->idcontroldivisaindicadormodelo == null) {
                                $asociacion = new DatControldivisaindicadormodelo();
                                $asociacion->idindicador = $hijo;
                                $asociacion->idcontroldivisa = $idcontroldivisa;
                                $asociacion->identidadmodelo = $identidadmodelo;
                                $asociacion->identidadautor = $identidad;
                                $asociacion->idejercicio = $idejercicio;
                                $asociacion->save();
                                $resp = 1;
                            } else {

                                if ($haveAsoc[0]->idcontroldivisa == $idcontroldivisa) {
                                    $haveAsoc[0]->idejercicio = $idejercicio;
                                    $haveAsoc[0]->identidadmodelo = $identidadmodelo;
                                    $haveAsoc[0]->save();
                                    $resp = 1;
                                } else {
                                    $resp = 3;
                                }
                            }
                        } else {
                            $resp = 3;
                        }
                    }
                }
            }
        }
        return $resp;
    }

    function exportarCorrelacionador($parametros){

        $cont = 0;
        $datosPintar = [];
        $indicadores = NomIndicador::ListarIndicadores();
        foreach($parametros->idindicadoresdiv as $valor) {
            $datosPintar[$cont]['codigo'] = $valor->codigoindplanif;
            $datosPintar[$cont]['denominacion'] = $valor->denominacionindplanif;
            foreach ($valor->idinddivmodelo as $ind=> $valor1) {
                $datos = Doctrine::getTable('DatControldivisaindicadormodelo')->find($valor1->idinddivmodelo);
                $datosContrDiv = Doctrine::getTable('NomControldivisa')->find($datos->idcontroldivisa);
                if($datos->identidadmodelo!=null || $datos->identidadmodelo!=""){
                    $modelo = DatEntidadmodelo::getModeloPorEntModelo($datos->identidadmodelo);
                    $datosPintar[$cont]['datos'][$ind]['plan'] = $modelo[0]['denominacion'];
                } else {
                    $datosPintar[$cont]['datos'][$ind]['plan'] = "-";
                }

                if($datosContrDiv->codigo!=null || $datosContrDiv->codigo!=""){
                    $datosPintar[$cont]['datos'][$ind]['codigoindcontroldivisa'] = $datosContrDiv->codigo;
                } else {
                    $datosPintar[$cont]['datos'][$ind]['codigoindcontroldivisa'] = "-";
                }

                if($datosContrDiv->denominacion!=null || $datosContrDiv->denominacion!=""){
                    $datosPintar[$cont]['datos'][$ind]['denomindcontroldivisa'] = $datosContrDiv->denominacion;
                } else {
                    $datosPintar[$cont]['datos'][$ind]['denomindcontroldivisa'] = "-";
                }

            }
            $cont++;
        }

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=correlacionadores.xls");
        header("Content-Transfer-Encoding: binary ");
        $datosHTML = "<table style='margin-left: 20%' border='1' cellspacing='0' cellpadding='0'>
  <tr>
    <td colspan='2' valign='top'><p align='center'>Indicador de la Planificaci&oacute;n</p></td>
    <td colspan='3' valign='top'><p align='center'>Indicador de Control de Divisa</p></td>
  </tr>
  <tr>
    <td width='113' valign='top'><p align='center'>C&oacute;digo</p></td>
    <td width='113' valign='top'><p align='center'>Denominaci&oacute;n</p></td>
    <td width='113' valign='top'><p align='center'>C&oacute;digo</p></td>
    <td width='113' valign='top'><p align='center'>Denominaci&oacute;n</p></td>
    <td width='113' valign='top'><p align='center'>Plan</p></td>
  </tr>";
        foreach($datosPintar as $valor2) {
            foreach($valor2['datos'] as $valor3) {
            $datosHTML .= "<tr>
    <td width='113' valign='top'><p>".$valor2['codigo']."</p></td>
    <td width='250' valign='top'><p>".$valor2['denominacion']."</p></td>
    <td width='113' valign='top'><p>".$valor3['codigoindcontroldivisa']."</p></td>
    <td width='250' valign='top'><p>".$valor3['denomindcontroldivisa']."</p></td>
    <td width='250' valign='top'><p>".$valor3['plan']."</p></td>
  </tr>";
        }
        }

$datosHTML.="</table>";

echo $datosHTML;
    }

    function desacociarhijos($orden)
    {
        $indicadoreshijos = NomIndicador::getIndporOrden(
            $orden->ordender, $orden->ordenizq
        );
        foreach ($indicadoreshijos as $value) {
            $eliminar = DatControldivisaindicador::GetIndByID(
                $value['idindicador']
            );
            foreach ($eliminar as $key => $value) {
                $asociacion = Doctrine::getTable(
                    'DatControldivisaindicadormodelo'
                )->find(
                    $eliminar[$key]['idcontroldivisaindicadormodelo']
                );
                $asociacion->delete();
            }
        }
    }

    function Desasociar($idcontroldivisa,
        $ordenes, $idejercicio
    )
    {
        $resp = 0;
        foreach ($ordenes as $orden) {
            $indicadoreshijos = NomIndicador::getIndporOrden(
                $orden->ordender, $orden->ordenizq
            );
            // self::desacociarhijos($orden[$key]);
            foreach ($indicadoreshijos as $value) {
                $indicadorUno = $value['idindicador'];
                $eliminar = Doctrine::getTable(
                    'DatControldivisaindicadormodelo'
                )->findByDql(
                    "idindicador = $indicadorUno and idcontroldivisa=$idcontroldivisa and idejercicio=$idejercicio"
                );
                if ($eliminar[0]->idcontroldivisaindicadormodelo != null) {
                    $eliminar[0]->delete();
                    $resp = 1;
                }

                if ($resp == 0) {
                    $resp = 3;
                }
            }
        }
        return $resp;
    }

    function AprobarDesaprobar( $aprobar,
        $rector, $ordenes, $idejercicio
    )
    {
        if ($aprobar) {
            if ($rector) {
                $aprobacion = 4;
            } else {
                $aprobacion = 3;
            }
            foreach ($ordenes as $key => $orden) {
                $indicadoreshijos = NomIndicador::getIndporOrden(
                    $orden->ordender, $orden->ordenizq
                );
                foreach ($indicadoreshijos as $value) {
                    $indicadorUno = $value['idindicador'];
                    $cambiarAprobacion = Doctrine::getTable(
                        'DatControldivisaindicadormodelo'
                    )->findByDql(
                        "idindicador = $indicadorUno"
                    );
                    foreach ($cambiarAprobacion as $aprobarchange) {
                        if ($aprobarchange->idcontroldivisaindicadormodelo
                            != null
                        ) {
                            $aprobarchange->idaprobacion = $aprobacion;
                            $aprobarchange->idejercicio = $idejercicio;
                            $aprobarchange->save();
                            $resp = 1;
                        } else {
                            $resp = 3;
                        }
                    }
                }
            }
            return $resp;
        } else {

            foreach ($ordenes as $key => $orden) {
                $indicadoreshijos = NomIndicador::getIndporOrden(
                    $orden->ordender, $orden->ordenizq
                );
                foreach ($indicadoreshijos as $value) {
                    $indicadorUno = $value['idindicador'];
                    $cambiarAprobacion = Doctrine::getTable(
                        'DatControldivisaindicadormodelo'
                    )->findByDql(
                        "idindicador = $indicadorUno"
                    );
                    foreach ($cambiarAprobacion as $aprobarchange) {
                        if ($aprobarchange->idcontroldivisaindicadormodelo
                            != null
                        ) {
                            $tb = $aprobarchange;

                            if ($tb->idaprobacion != 4) {
                                $tb->idaprobacion = 1;
                                $tb->idejercicio = $idejercicio;
                                $tb->save();
                                $resultado = 1;
                            } else {
                                if ($rector) {
                                    $tb->idaprobacion = 1;
                                    $tb->idejercicio = $idejercicio;
                                    $tb->save();
                                    $resultado = 1;
                                } else {
                                    $resultado = 3;
                                }
                            }
                        }
                    }
                }
                return $resultado;
            }
        }
    }

}


