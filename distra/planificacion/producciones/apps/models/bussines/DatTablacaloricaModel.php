<?php

class DatTablacaloricaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatTablacalorica $DatTablacalorica) {
        $DatTablacalorica->save();
    }

    public function Actualizar(DatTablacalorica $DatTablacalorica) {
        $DatTablacalorica->save();
    }

    public function Eliminar(DatTablacalorica $DatTablacalorica) {
        $DatTablacalorica->delete();
    }

    public function listarTablacalorica($params) {
        $objDatTablacalorica = new DatTablacalorica();
        $data = $objDatTablacalorica->listarTablacalorica($params);
        return $data;
    }

    public function listarIndicadoresAddTablaCalorica($params) {
        $objDatTablacalorica = new DatTablacalorica();
        $data = $objDatTablacalorica->listarIndicadoresAddTablaCalorica($params);
        return $data;
    }

    public function listarFormulasRelacionadas($params) {
        $objDatTablacalorica = new DatTablacalorica();
        $data = $objDatTablacalorica->listarFormulasRelacionadas($params);
        return $data;
    }

    public function listarIndicadorEnLaFormula($params) {
        $objDatTablacalorica = new DatTablacalorica();
        $data = $objDatTablacalorica->listarIndicadorEnLaFormula($params);
        return $data;
    }

    public function adicionarIndicadoresTablaCalorica(array $indicadores) {
        $almacenados = array();
        foreach ($indicadores as $indicador) {
            $objDatTablacalorica = new DatTablacalorica();
            if (is_object($objDatTablacalorica)) {
                $objDatTablacalorica->idindicador = $indicador->indicador->idindicador;
                $objDatTablacalorica->cantidad = 0;
                $objDatTablacalorica->kcal = 0;
                $objDatTablacalorica->grasas = 0;
                $objDatTablacalorica->proteinas = 0;
                $objDatTablacalorica->carbohidratos = 0;
                $objDatTablacalorica->estado = 0;
                $objDatTablacalorica->enuso = 0;
                $objDatTablacalorica->save();
                $almacenados[] = $objDatTablacalorica->toArray();
            }
        }
        return $almacenados;
    }

    public function eliminarIndicadoresTablaCalorica($indicadores) {
        $objDatTablacalorica = new DatTablacalorica();
        $idindicadores_array = array();
        foreach ($indicadores as $indicador) {
            $idindicadores_array[] = $indicador->idtablacalorica;
        }
        $idindicadores = implode(',', $idindicadores_array);
        $data = $objDatTablacalorica->eliminarIndicadoresTablaCalorica($idindicadores);
        return $data;
    }

    public function actualizarIndicadoresTablaCalorica($params) {
        $data = array();
        $conn = Doctrine_Manager::connection();
        if ($params['activar'] != 'null') {
            //Para ACTIVAR
            $estado = ($params['activar'] == 'true') ? 1 : 0;
            $objDatTablacalorica = new DatTablacalorica();
            $idindicadoresSinUso_array = array();
            foreach ($params['indicadores'] as $indicador) {
                //Revisando si modifico 'estado' 
                if (($estado != $indicador->indicador->estado)) {
                    if ($indicador->indicador->enuso == 1) {
                        //SI está en uso [enuso == 1]
                        //... y reviso cómo se afectan las fórmulas relacionadas
                        $params['idtablacalorica'] = $indicador->indicador->idtablacalorica;
                        $formulas_relacionadas = self::listarFormulasRelacionadas($params);

                        foreach ($formulas_relacionadas as $formula) {
                            //Por cada fórmula relacionada
                            if ($formula['tipoporciento'] == 1) {
                                //Es porcentual
                                //Solo deshabilito la fórmula
                                DatFormula::ActualizarEstado($formula['idformula'], 0, $params['idusuario']);
                            } else {
                                //No es porcentual
                                //proporcion = kcal en la tabla / cantidad en la tabla
                                //kcal original = cantidad en formula * proporcion
                                $kcaloriginal = $formula['cantidad'] * $indicador->indicador->kcal / $indicador->indicador->cantidad;
                                //diferencia
                                if ($estado == 1) {
                                    //aumento porque activé
                                    $kcalformula = $formula['kcalformula'] + $kcaloriginal;
                                } else {
                                    //disminuyo porque desactivé
                                    $kcalformula = $formula['kcalformula'] - $kcaloriginal;
                                }
                                $data[] = $objDatTablacalorica->actualizarIndicadoresTablaCaloricaEnUso($conn, $formula, $kcalformula);
                            }
                        }
                    }
                    $idindicadoresSinUso_array[] = $indicador->indicador->idtablacalorica;
                }
            }
            $idindicadoresSinUso = implode(',', $idindicadoresSinUso_array);
            $data[] = $objDatTablacalorica->activarIndicadoresTablaCalorica($idindicadoresSinUso, $estado);
        } else {
            //Para ACTUALIZAR
            $objDatTablacalorica = new DatTablacalorica();
            foreach ($params['indicadores'] as $indicador) {
                //Revisando si el indicador está en uso
                if ($indicador->indicador->enuso == 1) {
                    //SI está en uso [enuso == 1]
                    //Revisando si modifico 'kcal' 0 'cantidad'                    
                    $indEnTablaAnterior = Doctrine::getTable('DatTablacalorica')->findByDql("idtablacalorica ={$indicador->indicador->idtablacalorica}");
                    if (($indEnTablaAnterior[0]->kcal != $indicador->indicador->kcal) || ($indEnTablaAnterior[0]->cantidad != $indicador->indicador->cantidad)) {
                        //SI se modificó
                        //... y reviso cómo se afectan las fórmulas relacionadas
                        $params['idtablacalorica'] = $indicador->indicador->idtablacalorica;
                        $formulas_relacionadas = self::listarFormulasRelacionadas($params);
                        foreach ($formulas_relacionadas as $formula) {
                            $kcalformula = 0;
                            //Por cada fórmula relacionada
                            if ($formula['tipoporciento'] == 1) {
                                //Es porcentual
                                //kcal que necesito = kcal total de la fórmula * porciento que representa el indicador
                                $kcal = $formula['kcalformula'] * $formula['porciento'] / 100;
                                //proporción de kcal = kcal que necesito / kcal del indicador
                                //cantidad que se utiliza = proporción de kcal * cantidad del indicador
                                $cantidad = $kcal / $indicador->indicador->kcal * $indicador->indicador->cantidad;
                                $data[] = $objDatTablacalorica->actualizarIndicadoresTablaCaloricaEnUsoPorcentual($conn, $indicador->indicador, $formula, $cantidad);
                            } else {
                                //No es porcentual
                                //valor original
                                //proporcion = kcal en la tabla / cantidad en la tabla
                                //kcal original = cantidad en formula * proporcion
                                $kcaloriginal = $formula['cantidad'] * $indEnTablaAnterior[0]->kcal / $indEnTablaAnterior[0]->cantidad;
                                //valor propuesto
                                //lo mismo con datos nuevos
                                $kcalPropuesto = $formula['cantidad'] * $indicador->indicador->kcal / $indicador->indicador->cantidad;
                                //diferencia
                                $kcalformula = $formula['kcalformula'] - $kcaloriginal + $kcalPropuesto;
                                $data[] = $objDatTablacalorica->actualizarIndicadoresTablaCaloricaEnUso($conn, $formula, $kcalformula);
                            }
                        }
                    }
                }
                //Actualizo sin problemas... sin importar cómo se afectan las fórmulas relacionadas
                $data[] = $objDatTablacalorica->actualizarIndicadoresTablaCalorica($conn, $indicador->indicador);
            }
        }
        return $data;
    }

    public function exportarAExcel($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps .
                "/planificacion/planmeta/views/idioma/{$idioma}/"
                . "formulatablacalorica/formulatablacalorica.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();
        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq[$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        $array_um = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        $unidades_medida = array();
        foreach ($array_um as $valorUM) {
            $unidades_medida[$valorUM['idunidadmedida']] = $valorUM['denominacionunidadmedida'];
        }
        unset($array_um);

       // echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8">Indicadores en la tabla calórica</HEAD><BODY>';

//" . utf8_decode($params['textMes']) . "   Indicadores en la tabla calórica

        echo "
          <table border=1 cellspacing=0 width=60%>
          <thead>
                <tr>
                    <td align=center colspan= 10 ><b>" . utf8_decode('Indicadores en la tabla calórica') . "</b> &nbsp;&nbsp;&nbsp;</td>
                </tr>
            </thead>
          <tr>
          <th align=left>" . utf8_decode($arrayEtiq['lbCodigo']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbDenominacion']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbDescripcion']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbUM']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbPrecio']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbCantidad']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbKcal']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbGrasas']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbProteinas']) . "</th>
          <th align=left>" . utf8_decode($arrayEtiq['lbCarbohidratos']) . "</th>
          </tr>";

        $objDatTablacalorica = new DatTablacalorica();
        $data = $objDatTablacalorica->listarTablacalorica($params);

        foreach ($data as $value) {
            echo "<tr>
             <td align=right style=\"mso-number-format:'@';\">" . $value['codigo'] . "</td>
             <td align=left style=\"mso-number-format:'@';\">" . utf8_decode($value['denominacion']) . "</td>
             <td align=left style=\"mso-number-format:'@';\">" . utf8_decode($value['descripcion']) . "</td>

             <td align=left style=\"mso-number-format:'@';\">" . utf8_decode($unidades_medida[$value['idumedida']]) . "</td>

             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['precio'] . "</td>
             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['cantidad'] . "</td>
             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['kcal'] . "</td>
             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['grasas'] . "</td>
             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['proteinas'] . "</td>
             <td align=right style=\"mso-number-format:'0.000000';\">" . $value['carbohidratos'] . "</td>
                 
             </tr>";
        }
        echo "</table>";

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores_tabla_calorica.xls");
        //header("Content-Transfer-Encoding: binary ");
        header("Content-Transfer-Encoding: utf8_decode ");
    }

}
