<?php

class DesgloseporviaadquisicionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarDesglosePorViaYOrgano($params, $start = 0, $limit = 20)
    {

        $query = new Doctrine_Query ();
        $array_params_cond = array();

//        print_r($params['filtros']);die;
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] != null) {
                    if ($datos ['field'] == 'denovia') {
                        $query->addWhere('ivo.idviaadquisicion = ' . $datos['data']['value']);
                    } elseif ($datos ['field'] == 'denominacionorg') {
                        $query->addWhere('ivo.idorganosatisface = ' . $datos['data']['value']);
                    } elseif ($datos ['field'] == 'denominacionosde') {
                        $query->addWhere(
                            '(SELECT nos_osde2.idorganosatisface FROM NomOrganosatisface nos_osde2 WHERE nos_osde2.nivelarbol = 2 and nos_osde2.idarbol = nos_emp.idarbol and (nos_osde2.ordenizq < nos_emp.ordenizq and  nos_osde2.ordender > nos_emp.ordender ) ) = '
                            . $datos['data']['value']
                        );
                    } elseif ($datos ['field'] == 'denominaciongrupo') {
                        $query->addWhere(
                            '(SELECT nos_grupo2.idorganosatisface FROM NomOrganosatisface nos_grupo2 WHERE nos_grupo2.nivelarbol = 3  and nos_grupo2.idarbol = nos_org.idarbol and (nos_grupo2.ordenizq < nos_emp.ordenizq and  nos_grupo2.ordender > nos_emp.ordender )) = '
                            . $datos['data']['value']
                        );
                    } elseif ($datos ['field'] == 'denominacionempresa') {
                        $query->addWhere('dvo.idorganosatisface = ' . $datos['data']['value']);
                    } elseif ($datos ['field'] == 'cantidad') {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        $query->addWhere("dvo.cantidad {$cond} " . $datos['data']['value']);
//                    $array_params_cond[] = $datos['data']['value'];
                    } elseif ($datos ['field'] == 'idaprobacion') {
                        if ($datos ['data'] ['value'] == 'SI') {
                            $query->addWhere('dvo.idaprobacion = 2');
                        } else {
                            if ($datos ['data'] ['value'] == 'RECTOR') {
                                $query->addWhere('dvo.idaprobacion = 3');
                            } else {
                                $query->addWhere('dvo.idaprobacion = 1');
                            }
                        }
                    }
                }
            }
        }
        $query->addSelect(
            '
                                       dvo.cantidad,
                                       dvo.idaprobacion,
                                       dvo.iddesgviaadquisorgsat,
                                       dvo.idorganosatisface'
        );
        $query->addSelect('nos_org.denominacion');
        $query->addSelect('nos_org.idorganosatisface');
        $query->addSelect('nos_emp.denominacion');
        $query->addSelect('nos_emp.nivelarbol');
        $query->addSelect(
            'ivo.idindicadorviaadquisicionorganosatisface,iv.idindicador,iv.idviaadquisicion,via.denominacion'
        );

        $query->addSelect(
            '(SELECT nos_osde1.idorganosatisface FROM NomOrganosatisface nos_osde1 WHERE nos_osde1.nivelarbol = 2 and nos_osde1.idarbol = nos_emp.idarbol and (nos_osde1.ordenizq < nos_emp.ordenizq and  nos_osde1.ordender > nos_emp.ordender ) ) as idorganosatisfaceosde'
        );
        $query->addSelect(
            '(SELECT nos_osde.denominacion FROM NomOrganosatisface nos_osde WHERE nos_osde.nivelarbol = 2 and nos_osde.idarbol = nos_emp.idarbol and (nos_osde.ordenizq < nos_emp.ordenizq and nos_osde.ordender > nos_emp.ordender )  ) as denominacionosde'
        );

        $query->addSelect(
            '(SELECT nos_grupo1.idorganosatisface FROM NomOrganosatisface nos_grupo1 WHERE nos_grupo1.nivelarbol = 3  and nos_grupo1.idarbol = nos_org.idarbol and (nos_grupo1.ordenizq < nos_emp.ordenizq and  nos_grupo1.ordender > nos_emp.ordender )) as idorganosatisfacegrupo'
        );
        $query->addSelect(
            '(SELECT nos_grupo.denominacion FROM NomOrganosatisface nos_grupo WHERE nos_grupo.nivelarbol = 3  and nos_grupo.idarbol = nos_emp.idarbol and (nos_grupo.ordenizq < nos_emp.ordenizq and  nos_grupo.ordender > nos_emp.ordender ) ) as denominaciongrupo'
        );

        $array_params_cond[] = $params['idindicador'];
        $array_params_cond[] = $params['idindicador'];
        $array_params_cond[] = $params['idindicador'];
        $array_params_cond[] = $params['idindicador'];
        $array_params_cond[] = $params['identidad'];
        $array_params_cond[] = $params['idmodelo'];
        $array_params_cond[] = $params['idejercicio'];
        $array_params_cond[] = $start;
        $array_params_cond[] = $limit;

        $query->from('DatDesgviaadquisorgsat dvo')
            ->innerJoin(
                'dvo.DatIndicadorviaadquisicionorganosatisface ivo WITH ivo.idindicadorviaadquisicionorganosatisface = dvo.idindicadorviaadquisicionorganosatisface and ivo.idindicador = ?',
                $params['idindicador']
            ) //
            ->innerJoin('ivo.DatIndicadorviaadquisicion iv')
            ->leftJoin('iv.NomViaadquisicion via ')
            ->addWhere('ivo.idindicador = ?', $params['idindicador'])
            ->addWhere('iv.idindicador = ?', $params['idindicador'])
            ->addWhere('dvo.idindicador = ? ', $params['idindicador'])
            ->addWhere('dvo.identidad = ? ', $params['identidad'])
            ->addWhere('dvo.idmodelo = ? ', $params['idmodelo'])
            ->addWhere('dvo.idejercicio = ? ', $params['idejercicio'])
            ->leftJoin('dvo.NomOrganosatisface nos_emp ')
            ->leftJoin('ivo.NomOrganosatisface nos_org ');

        $sql = $query->getSqlQuery() . " OFFSET ? LIMIT ?";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($sql, $array_params_cond); // $array_parametros
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        foreach ($data->data as $key => $value) {
            unset($data->data[$key]);
            $data->data[$key]['iddesgviaadquisorgsat'] = $value['d__iddesgviaadquisorgsat'];
            $data->data[$key]['idindicador'] = $value['d3__idindicador'];
            $data->data[$key]['idaprobacion'] = $value['d__idaprobacion'];

            $data->data[$key]['idajusteexistenciacb'] = $value['d__idajusteexistenciacb'];
            $data->data[$key]['cantidad'] = $value['d__cantidad'];
            $data->data[$key]['idindicadorviaadquisicionorganosatisface']
                = $value['d__idindicadorviaadquisicionorganosatisface'];

            $data->data[$key]['idviaadquisicion'] = $value['n__idviaadquisicion'];
            $data->data[$key]['denovia'] = $value['n__denominacion'];

            $data->data[$key]['idorganosatisfaceorg'] = $value['n3__idorganosatisface'];
            $data->data[$key]['denominacionorg'] = $value['n3__denominacion'];

            $data->data[$key]['idorganosatisfaceosde'] = $value['d__0'];
            $data->data[$key]['denominacionosde'] = $value['d__1'];

            $data->data[$key]['idorganosatisfacegrupo'] = $value['d__2'];
            $data->data[$key]['denominaciongrupo'] = $value['d__3'];

            $data->data[$key]['idorganosatisfaceempresa'] = $value['n2__idorganosatisface'];
            $data->data[$key]['denominacionempresa'] = $value['n2__denominacion'];
        }
        $data->total = $query->count();
        $query_totaldesglozado = new Doctrine_Query ();
        $query_totaldesglozado->select('SUM(dvo.cantidad) as total_desglozado')
            ->from('DatDesgviaadquisorgsat dvo')
            ->innerJoin(
                'dvo.DatIndicadorviaadquisicionorganosatisface ivo WITH ivo.idindicadorviaadquisicionorganosatisface = dvo.idindicadorviaadquisicionorganosatisface and ivo.idindicador = ?',
                $params['idindicador']
            ) //
            ->innerJoin('ivo.DatIndicadorviaadquisicion iv')
            ->addWhere('ivo.idindicador = ?', $params['idindicador'])
            ->addWhere('iv.idindicador = ?', $params['idindicador'])
            ->addWhere('dvo.idindicador = ? ', $params['idindicador'])
            ->addWhere('dvo.identidad = ? ', $params['identidad'])
            ->addWhere('dvo.idmodelo = ? ', $params['idmodelo'])
            ->addWhere('dvo.idejercicio = ? ', $params['idejercicio']);
        $data->total_desglozado = $query_totaldesglozado->execute()->toArray();
        $data->total_desglozado = $data->total_desglozado[0]['total_desglozado'];
        return $data;
    }

    public function eliminarDesglose($parametros)
    {
        if ($parametros['desgloses'][0] != null) {
            $query = Doctrine_Query::create();
            $query->delete('DatDesgviaadquisorgsat')
                //->from('DatDesgviaadquisorgsat')
                ->whereIn('iddesgviaadquisorgsat', $parametros['desgloses']);
            $query->addWhere(
                'idindicador = ? AND idmodelo=? AND identidad =? AND idejercicio=?',
                array($parametros['idindicador'], $parametros['idmodelo'], $parametros['identidad'],
                      $parametros['idejercicio'])
            );
            //$query->getSqlQuery();
            $query->execute();
        }
        return 20;
    }

    public function desglosar($parametros)
    {
        //print_r($parametros);die;
        $res = 20;
        foreach ($parametros['arraydesglose'] as $key => $value) {
            if ($value->iddesgviaadquisorgsat) {
                $objdesgvia = DatDesgviaadquisorgsat::existeElemento($value->iddesgviaadquisorgsat);
                $objdesgvia->cantidad = doubleval($value->cantidad);
                $objdesgvia->save();
            } else {
                $idorganosatisface_asoc = $value->denominacionorg;
                if ($value->denominacionempresa && $value->denominacionempresa != -1) {
                    $idorganosatisface_asoc = $value->denominacionempresa;
                } elseif ($value->denominaciongrupo && $value->denominaciongrupo != -1) {
                    $idorganosatisface_asoc = $value->denominaciongrupo;
                } elseif ($value->denominacionosde && $value->denominacionosde != -1) {
                    $idorganosatisface_asoc = $value->denominacionosde;
                }
            }
//            echo $value->denominacionorg . ' : ' . $value->denovia . ' : ' . $idorganosatisface_asoc . "/";
            if ($value->denominacionorg && $value->denovia && $idorganosatisface_asoc) {
                $idinviaorgs = DatIndicadorviaadquisicionorganosatisface::obtenerId(
                    $parametros['idindicador'], $value->denominacionorg, $value->denovia
                );

                $existedesglose = DatDesgviaadquisorgsat::existeDesglose(
                    $idinviaorgs, $parametros, $idorganosatisface_asoc
                );
                if ($existedesglose->iddesgviaadquisorgsat == null) {
                    $desgvia = new DatDesgviaadquisorgsat();
                    $desgvia->idejercicio = $parametros['idejercicio'];
                    $desgvia->identidad = $parametros['identidad'];
                    $desgvia->idindicador = $parametros['idindicador'];
                    $desgvia->idmodelo = $parametros['idmodelo'];
                    $desgvia->idindicadorviaadquisicionorganosatisface = $idinviaorgs;
                    $desgvia->idorganosatisface = $idorganosatisface_asoc;
                    $desgvia->cantidad = doubleval($value->cantidad);
                    $desgvia->idaprobacion = 1;
                    $desgvia->save();
                } else {
                    $res = 26;
//                    $objdesgvia = DatDesgviaadquisorgsat::existeElemento($existedesglose->iddesgviaadquisorgsat);
//                    $objdesgvia->cantidad = doubleval($value->cantidad);
//                    $objdesgvia->save();
                }
            }
        }
        return $res;
    }

    public function listarOS_XPorNivel($nivelarbol)
    {
        $data->data = NomOrganosatisface::obtenerOrgSatisfacePorNivel($nivelarbol);
        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['idorganosatisface'] = $valor['idorganosatisface'];
            $data->data[$indice]['denominacion'] = $valor['denominacion'];
        }
        return $data;
    }

    public function exportar($parametros)
    {

        $tituloreporte = 'DesgloseViaAdquisicion';
        $extension = '.xls';
        header("Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo . "';Charset=iso-8859-1");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-disposition: attachment; filename=" . $tituloreporte . $extension);
        header("Pragma: no-cache");
        header("Expires: 0");

        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo '<table border=1>';
        echo '<tr>';
        echo '<th colspan = 3 align=left> INDICADORES POR VIA DE ADQUISICION </th>';
        echo '</tr>';
        echo '<tr>';
        echo "<th colspan = 6 align=left> ENTIDAD:" . $parametros['entidad'] . "</th>";
        echo "<th colspan = 21 align=left> PLAN:" . $parametros['plan'] . "</th>";
        echo '</tr>';
        echo '<tr>';
        echo '<th>C&oacute;digo</th>';
        echo '<th align=left>No pieza </th>';
        echo '<th align=left>Denominaci&oacute;n</th>';
        echo '<th align=left>UM </th>';
        echo '<th align=left>Precio </th>';
        echo '<th align=left>Centro de Balance </th>';
        echo '<th align=left>Demanda</th>';
        // echo '<th align=left>Desglosado </th>';
        echo '<th align=left>Aprobado </th>';
        echo '<th align=left>Importe </th>';
        echo '<th colspan = 3 align=left>Via de Adquisicion </th>';
        echo '<th colspan = 3 align=left>Organo que satisface </th>';
        echo '<th colspan = 3 align=left>OSDE </th>';
        echo '<th colspan = 3 align=left>Grupo </th>';
        echo '<th colspan = 3 align=left>Empresa </th>';
        echo '<th colspan = 3 align=left>Cantidad </th>';
        // echo '<th align=left>Cantidad </th>';
        // echo '<th align=left>Aprobado </th>';
        echo '</tr>';
        $data = NomViaadquisicion::listarParaExportar($parametros);


        foreach ($data->data as $key => $value) {
            echo '<tr>';
            echo "<td>" . $value['codigo'] . "</td>";
            echo "<td>" . $value['numeropieza'] . "</td>";
            echo "<td>" . $value['denominacion'] . "</td>";
            echo "<td>" . $value['idumedida'] . "</td>";
            echo "<td>" . $value['precio'] . "</td>";
            echo "<td>" . $value['centrobalance'] . "</td>";
            echo "<td>" . $value['demanda'] . "</td>";
            echo "<td>" . $value['idaprobacion'] . "</td>";
            echo "<td>" . $value['importe'] . "</td>";
            echo "<td colspan = 3 >" . (($value['via']) ? $value['via'] : 'Ninguna') . "</td>";
            echo "<td colspan = 3 >" . (($value['denoorganosatisface']) ? $value['denoorganosatisface'] : 'Ninguna')
                . "</td>";
            echo "<td colspan = 3 >" . (($value['denoosde']) ? $value['denoosde'] : 'Ninguna') . "</td>";
            echo "<td colspan = 3 >" . (($value['denogrupo']) ? $value['denogrupo'] : 'Ninguna') . "</td>";
            echo "<td colspan = 3 >" . (($value['denoempresa']) ? $value['denoempresa'] : 'Ninguna') . "</td>";
            echo "<td colspan = 3 >" . (($value['cantidad']) ? $value['cantidad'] : '0') . "</td>";
            echo '</tr>';
        }

        echo '</table>';

        echo '</BODY></HTML>';
    }

    /*
     * 
      //            if(false)
      //            switch ($value['n2__nivelarbol']) {
      //                case 4:
      //
      //                    $data->data[$key]['idorganosatisfaceosde'] = $value['d__0'];
      //                    $data->data[$key]['denominacionosde'] = $value['d__1'];
      //
      //                    $data->data[$key]['idorganosatisfacegrupo'] = $value['d__2'];
      //                    $data->data[$key]['denominaciongrupo'] = $value['d__3'];
      //
      //                    $data->data[$key]['idorganosatisfaceempresa'] = $value['n2__idorganosatisface'];
      //                    $data->data[$key]['denominacionempresa'] = $value['n2__denominacion'];
      //                    break;
      //                case 3:
      //
      //                    $data->data[$key]['idorganosatisfaceosde'] = $value['d__0'];
      //                    $data->data[$key]['denominacionosde'] = $value['d__1'];
      //
      //                    $data->data[$key]['idorganosatisfacegrupo'] = $value['n2__idorganosatisface'];
      //                    $data->data[$key]['denominaciongrupo'] = $value['n2__denominacion'];
      //
      //                    $data->data[$key]['idorganosatisfaceempresa'] = "-1";
      //                    $data->data[$key]['denominacionempresa'] = "NINGUNA";
      //
      //                    break;
      //                case 2:
      //
      //                    $data->data[$key]['idorganosatisfaceosde'] = $value['n2__idorganosatisface'];
      //                    $data->data[$key]['denominacionosde'] = $value['n2__denominacion'];
      //
      //                    $data->data[$key]['idorganosatisfacegrupo'] = -1;
      //                    $data->data[$key]['denominaciongrupo'] =  "NINGUNA";
      //
      //                    $data->data[$key]['idorganosatisfaceempresa'] = -1;
      //                    $data->data[$key]['denominacionempresa'] =  "NINGUNA";
      //
      //                    break;
      //                default : //1
      //
      //                    $data->data[$key]['idorganosatisfaceosde'] = -1;
      //                    $data->data[$key]['denominacionosde'] = "NINGUNA";
      //
      //                    $data->data[$key]['idorganosatisfacegrupo'] = -1;
      //                    $data->data[$key]['denominaciongrupo'] = "NINGUNA";
      //
      //                    $data->data[$key]['idorganosatisfaceempresa'] = -1;
      //                    $data->data[$key]['denominacionempresa'] = "NINGUNA";
      //
      //                    break;
      //            }

      //        $query->addSelect('(SELECT nos_osde1.idorganosatisface FROM NomOrganosatisface nos_osde1 WHERE nos_osde1.nivelarbol = (nos_emp.nivelarbol -2) and nos_osde1.idarbol = nos_emp.idarbol and (nos_osde1.ordenizq < nos_emp.ordenizq and  nos_osde1.ordender > nos_emp.ordender ) ) as idorganosatisfaceosde');
      //        $query->addSelect('(SELECT nos_osde.denominacion FROM NomOrganosatisface nos_osde WHERE nos_osde.idarbol = nos_emp.idarbol and ( nos_osde.nivelarbol = (nos_emp.nivelarbol -2) and (nos_osde.ordenizq < nos_emp.ordenizq and nos_osde.ordender > nos_emp.ordender  ) OR ( nos_emp.nivelarbol = 2 and nos_emp.idorganosatisface = nos_osde.idorganosatisface )      )   ) as denominacionosde');
      //
      //        $query->addSelect('(SELECT nos_grupo1.idorganosatisface FROM NomOrganosatisface nos_grupo1 WHERE nos_grupo1.nivelarbol = (nos_emp.nivelarbol -1)  and nos_grupo1.idarbol = nos_org.idarbol and (nos_grupo1.ordenizq < nos_emp.ordenizq and  nos_grupo1.ordender > nos_emp.ordender )) as idorganosatisfacegrupo');
      //        $query->addSelect('(SELECT nos_grupo.denominacion FROM NomOrganosatisface nos_grupo WHERE nos_grupo.idarbol = nos_emp.idarbol ( nos_grupo.nivelarbol = (nos_emp.nivelarbol -1) and (nos_grupo.ordenizq < nos_emp.ordenizq and  nos_grupo.ordender > nos_emp.ordender ) ) OR ( nos_emp.nivelarbol = 2 and nos_emp.idorganosatisface = nos_grupo.idorganosatisface )    ) as denominaciongrupo');


      ////        $query->addSelect('(SELECT nos_osde1.idorganosatisface FROM NomOrganosatisface nos_osde1 WHERE nos_osde1.nivelarbol = (nos_emp.nivelarbol -2)  and nos_osde1.idarbol = nos_emp.idarbol and (nos_osde1.ordenizq < nos_emp.ordenizq and  nos_osde1.ordender > nos_emp.ordender ) ) as idorganosatisfaceosde');
      //        $query->addSelect('(SELECT nos_osde.denominacion FROM NomOrganosatisface nos_osde WHERE
      //            ( nos_osde.nivelarbol = (nos_emp.nivelarbol - 2) and nos_osde.idarbol = nos_emp.idarbol and (nos_osde.ordenizq < nos_emp.ordenizq and nos_osde.ordender > nos_emp.ordender )
      //            ) ) OR ( nos_osde.nivelarbol = nos_emp.nivelarbol and nos_osde.idorganosatisface = nos_emp.idorganosatisface ) )) ) as denominacionosde');
      ////nos_osde.nivelarbol = nos_emp.nivelarbol
      //////nos_osde.idorganosatisface = nos_emp.idorganosatisface
      ////        $query->addSelect('(SELECT nos_grupo1.idorganosatisface FROM NomOrganosatisface nos_grupo1 WHERE nos_grupo1.nivelarbol = (nos_emp.nivelarbol -1)  and nos_grupo1.idarbol = nos_org.idarbol and (nos_grupo1.ordenizq < nos_emp.ordenizq and  nos_grupo1.ordender > nos_emp.ordender )) as idorganosatisfacegrupo');
      //        $query->addSelect('(SELECT nos_grupo.denominacion FROM NomOrganosatisface nos_grupo WHERE nos_grupo.nivelarbol = (nos_emp.nivelarbol -1) and (nos_grupo.idorganosatisface <> nos_grupo.idarbol)  and nos_grupo.idarbol = nos_emp.idarbol and (nos_grupo.ordenizq < nos_emp.ordenizq and  nos_grupo.ordender > nos_emp.ordender ) ) as denominaciongrupo');
     */
}

//fin clase