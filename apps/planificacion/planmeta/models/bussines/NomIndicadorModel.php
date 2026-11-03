<?php

/**
 * NomIndicadorModel
 *
 *
 * @ author Dionisdel Ponce Santana
 * @ package PlanificaciÃƒÆ’Ã‚Â³n
 * @ subpackage PlanificaciÃƒÆ’Ã‚Â³n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class NomIndicadorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    function devolverDenominacionVia($arrayvia, $id) {
        foreach ($arrayvia as $via) {
            if ($via['idviaadquisicion'] == $id) {
                return $via['denominacion'];
            }
        }
    }

    function objectToArray($d) {
        if (is_object($d)) {
            // Gets the properties of the given object
            // with get_object_vars function
            $d = get_object_vars($d);
        }
        return $d;
    }

    function devolverDenominacionCB($arraycb, $id) {
        foreach ($arraycb as $cb) {
            if ($cb->idestructura == $id) {
                return $cb->denominacion;
            }
        }
    }

    function devolverDenominacionNaturaleza($arrayn, $id) {
        foreach ($arrayn as $n) {
            if ($n['iddatosnomenclador'] == $id) {
                return $n['nom_datosnomenclador_denominacion'];
            }
        }
    }

    function devolverDenominacionUM($arrayum, $id) {
        foreach ($arrayum as $um) {
            if ($um->idunidadmedida == $id) {
                return $um->nombreum;
            }
        }
    }

    function devolverOrganoSatisface($arrayorg, $id) {
        foreach ($arrayorg as $org) {
            if ($org['idorganosatisface'] == $id) {
                return $org['denominacion'];
            }
        }
    }

    public function exportarIndicadoresPHPExcel($indicadores = array()) {
        $integrator = ZendExt_IoC::getInstance();
        $vias = NomViaadquisicion::Obtener_via_adquisicion();
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $excluir = array(7, 8, 9, 10);
        $estructuras = $integrator->metadatos->DameHijosEstructura($identidad, $excluir);
        $centrobalance = $integrator->metadatos->DameEstructura($identidad);
        $naturalezas = NomDatosnomenclador::ObtenerDatosNomenclador(2);
        $organos = NomOrganosatisface::obtenerOS();
        $ums = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores.xls");
        header("Content-Transfer-Encoding: binary ");
        echo "<table border=1>\n";
        echo "<caption>INDICADORES</caption>\n";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>N&uacute;mero de pieza </th>\n"; //ver como se pone la u con tilde
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>Nivel</th>\n";
        echo "<th>Naturaleza</th>\n";
        echo "<th>Centro de Balance</th>\n";
        echo "<th>Unidad de medida</th>\n";
        echo "<th>Aprobado</th>\n";
        echo "<th>Nivel de planificaci&oacute;n</th>\n";
        echo "<th>Activado</th>\n";
        echo "<th>Via de adquisici&oacute;n</th>\n";
        echo "<th>Organo que satisface</th>\n";
        echo "<th>Precio</th>\n";
        echo "</tr>\n";
        foreach ($indicadores as $indicador) {
            $nivel = '';
            switch ($indicador['nivelarbol']) {
                case '1':
                    $nivel = 'Gen&eacute;rico';
                    break;
                case '2':
                    $nivel = 'Subgen&eacute;rico';
                    break;
                case '3':
                    $nivel = 'Espec&iacute;fico';
                    break;
                case '4':
                    $nivel = 'Surtido';
                    break;
            }
            $naturaleza = self::devolverDenominacionNaturaleza(
                            $naturalezas, $indicador['naturaleza']
            );
            $dencenbal = '';
            $denorgano = '';
            $via = '';
            $cont = 1;

            foreach ($indicador['DatIndicadorcentrobalance'] as $cen) {
                $den = self::devolverDenominacionCB(
                                $estructuras, $cen['DatEntidaddatosnomenclador']['idcentrobalance']
                );
                if (!empty($den)) {
                    $dencenbal .= $den;
                } else {
                    $dencenbal .= $centrobalance[0]->denominacion;
                }
                if ($cont < count($indicador)) {
                    $dencenbal .= ',';
                }

                $cont++;
            }
            $contDos = 1;
            foreach ($indicador['DatIndicadorviaadquisicion'] as $viaUno) {
                $idvia = $viaUno['idviaadquisicion'];
                $denvia = self::devolverDenominacionVia($vias, $idvia);
                if (!empty($denvia)) {
                    $via .= $denvia;
                }
                if ($contDos < count($vias)) {
                    $via .= ',';
                }
                $contDos++;
                if (!empty($viaUno['DatIndicadorviaadquisicionorganosatisface'])) {
                    $contUno = 1;
                    foreach (
                    $indicador['DatIndicadorviaadquisicion'][0]['DatIndicadorviaadquisicionorganosatisface']
                    as $organoArray
                    ) {
                        $oden = self::devolverOrganoSatisface(
                                        $organos, $organoArray['idorganosatisface']
                        );
                        if (!empty($oden)) {
                            $denorgano .= $oden;
                        }
                        if ($contUno < count($organoArray)) {
                            $denorgano .= ',';
                        }
                        $contUno++;
                    }
                }
            }
            $unidadmedida = self::devolverDenominacionUM(
                            $ums, $indicador['idumedida']
            );
            $aprobado = "No";
            if ($indicador['idaprobacion'] == 4) {
                $aprobado = "Si";
            }
            $nivelplanif = "No";
            if ($indicador['nivel']) {
                $nivelplanif = "Si";
            }
            $activado = "No";
            if ($indicador['estado']) {
                $activado = "Si";
            }
            echo "<tr>\n";
            echo "<td style=\"mso-number-format:'@';\">" . $indicador['codigo']
            . "</td>\n";
            echo "<td>" . $indicador['numeropieza'] . "</td>\n";
            echo "<td>" . $indicador['denominacion'] . "</td>\n";
            echo "<td>" . $nivel . "</td>\n";
            echo "<td>" . $naturaleza . "</td>\n";
            echo "<td>" . $dencenbal . "</td>\n";
            echo "<td>" . $unidadmedida . "</td>\n";
            echo "<td>" . $aprobado . "</td>\n";
            echo "<td>" . $nivelplanif . "</td>\n";
            echo "<td>" . $activado . "</td>\n";
            echo "<td>" . utf8_decode($via) . "</td>\n";
            echo "<td>" . $denorgano . "</td>\n";
            echo "<td>" . $indicador['precio'] . "</td>\n";
            echo "</tr>\n";
        }
        echo "</table>\n";
    }

    public function listarIndicadoresParaExportar($filtros, $identidad, $start, $limit, $idejercicio
    ) {
        $query = Doctrine_Query::create();
        $query->from("NomIndicador ind");
        if ($filtros) {
            foreach ($filtros as $filtro) {
                if ($filtro['data']['type'] == 'string') {
                    if ($filtro['field'] == 'idcentrobalance') {
                        $query->addWhere(
                                'datnom.identidad = ?', $filtro['data']['value']
                        );
                    } else {
                        if ($filtro['field'] == 'idviaadquisicion') {
                            $query->addWhere(
                                    'viaadq.idviaadquisicion = ?', $filtro['data']['value']
                            );
                        } else {
                            if ($filtro['field'] == 'codigo') {
                                $query->addWhere(
                                        "ind." . $filtro['field'] . " LIKE '"
                                        . $filtro['data']['value'] .
                                        "%'"
                                );
                            } else {
                                if ($filtro['field'] == 'numeropieza') {
                                    $query->addWhere(
                                            "upper(ind." . $filtro['field']
                                            . ") LIKE upper('"
                                            . $filtro['data']['value'] .
                                            "%')"
                                    );
                                } else {
                                    if ($filtro['field'] == 'denominacion') {
                                        $query->addWhere(
                                                "upper(ind." . $filtro['field']
                                                . ") LIKE upper('"
                                                . $filtro['data']['value'] .
                                                "%')"
                                        );
                                    } else {
                                        if ($filtro['field'] == 'idorganosatisface'
                                        ) {
                                            $query->addWhere(
                                                    'org.idorganosatisface = ?', $filtro['data']['value']
                                            );
                                        } else {
                                            $query->addWhere(
                                                    'ind.' . $filtro['field']
                                                    . ' = ?', $filtro['data']['value']
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if ($filtro['data']['type'] == 'boolean') {
                        if ($filtro['field'] == 'estado') {
                            if ($filtro['data']['value'] == 'false') {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' <> ?', 1
                                );
                            } else {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' = ?', 1
                                );
                            }
                        } else {
                            if ($filtro['field'] == 'idaprobacion') {
                                if ($filtro['data']['value'] == 'false') {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' <> ?', 4
                                    );
                                } else {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' = ?', 4
                                    );
                                }
                            } else {
                                if ($filtro['field'] == 'nivel') {
                                    if ($filtro['data']['value'] == 'false') {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' <> ?', 1
                                        );
                                    } else {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' = ?', 1
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        if ($filtro['data']['type'] == 'numeric') {
                            if ($filtro['data']['comparison'] == 'gt') {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' > ?', $filtro['data']['value']
                                );
                            } else {
                                if ($filtro['data']['comparison'] == 'lt') {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' < ?', $filtro['data']['value']
                                    );
                                } else {
                                    if ($filtro['data']['comparison'] == 'eq') {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' = ?', $filtro['data']['value']
                                        );
                                    }
                                }
                            }
                        } else {
                            if ($filtro['data']['type'] == 'list') {
                                $query->addWhere(
                                        "ind." . $filtro['field'] . " = ?", $filtro['data']['value']
                                );
                            }
                        }
                    }
                }
            }
        }
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $excluir = array(7, 8, 9, 10);
            $datosentidad = $integrator->metadatos->DameHijosEstructura(
                    $identidad, $excluir
            );
            $ids = array();
            foreach ($datosentidad as $value) {
                array_push($ids, $value->id);
            }
            $ids = implode(",", $ids);
            if (!empty($ids)) {
                $query->addWhere(
                        'datnom.identidad = ? or datnom.identidad in (' . $ids
                        . ')', array($identidad)
                );
            } else {
                $query->addWhere('datnom.identidad = ' . $identidad);
            }
        }
        $query->addWhere('ind.idejercicio = ' . $idejercicio);
        $query->leftJoin('ind.DatIndicadorviaadquisicion viaadq')
                ->leftjoin('viaadq.NomViaadquisicion nvia')
                ->leftJoin(
                        'viaadq.DatIndicadorviaadquisicionorganosatisface ft WITH viaadq.idindicador = ft.idindicador'
                )
                ->leftJoin('ft.NomOrganosatisface org');
        $query->orderBy("ind.codigo");
        $query->innerJoin('ind.DatIndicadorcentrobalance cenbal')->innerJoin(
                'cenbal.DatEntidaddatosnomenclador datnom'
        );
        $query->addSelect(
                'ind.*,cenbal.idindicadorcentrobalance,datnom.identidaddatosnomenclador,
            datnom.identidad as idcentrobalance, viaadq.idviaadquisicion,
            ft.*,org.idorganosatisface, org.denominacion,nvia.denominacion'
        );

        $indicadores = $query->limit($limit)
                ->offset($start)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $indicadores;
    }

    public function exportarIndicadores($filtros, $idejercicio) {
        $global = ZendExt_GlobalConcept::getInstance();
        $globalEstructura = $global->Estructura;
        $identidad = $globalEstructura->idestructura;
        $denomEntidad = $globalEstructura->denominacion;
        $integrator = ZendExt_IoC::getInstance();
        $excluir = array(7, 8, 9, 10);
        $estructuras = $integrator->metadatos->DameHijosEstructura($identidad, $excluir);

        foreach ($estructuras as $estruc) {
            $estrucs[$estruc->id] = $estruc->text;
        }
        $estrucs[$identidad] = $denomEntidad;
        unset($estructuras);
        $listUms = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        foreach ($listUms as $um) {
            $ums[$um['idunidadmedida']] = $um['denominacionunidadmedida'];
        }
        unset($listUms);

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';


        echo "<table border=1>\n";
        echo "<caption>INDICADORES</caption>\n";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>N&uacute;mero de pieza </th>\n"; //ver como se pone la u con tilde
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>Nivel</th>\n";
        echo "<th>Naturaleza</th>\n";
        echo "<th>Centro de Balance</th>\n";
        echo "<th>Unidad de medida</th>\n";
        echo "<th>Aprobado</th>\n";
        echo "<th>Nivel de planificaci&oacute;n</th>\n";
        echo "<th>Activado</th>\n";
        echo "<th>Via de adquisici&oacute;n</th>\n";
        echo "<th>Organo que satisface</th>\n";
        echo "<th>Precio</th>\n";
        echo "</tr>\n";

        $indicadores = NomIndicadorModel::listarIndicadoresParaExportar_ObjectSQL(
                        $filtros, $identidad, $idejercicio
        );


        $denocbal = '';
        $denorgano = '';
        $denovia = '';
        $contador = 1;
        foreach ($indicadores as $indicador) {

            if ($indicador['idindicador'] == $indicadores[$contador]['idindicador']
            ) {
                if ($indicador['idcentrobalance'] != $indicadores[$contador]['idcentrobalance']
                ) {
                    if (!is_numeric(
                                    strpos(
                                            trim($denocbal), trim($estrucs[$indicador['idcentrobalance']])
                                    )
                            )
                    ) {
                        $denocbal .= $estrucs[$indicador['idcentrobalance']]
                                . ',';
                    }
                }
                if ($indicador['idviaadquisicion'] != $indicadores[$contador]['idviaadquisicion']
                ) {
                    if (!is_numeric(
                                    strpos(trim($denovia), trim($indicador['via']))
                            )
                    ) {
                        $denovia .= $indicador['via'] . ',';
                    }
                }
                if ($indicador['idorganosatisface'] != $indicadores[$contador]['idorganosatisface']
                ) {
                    if (!is_numeric(
                                    strpos(trim($denorgano), trim($indicador['organo']))
                            )
                    ) {
                        $denorgano .= $indicador['organo'] . ',';
                    }
                }

                $contador++;
            } else {
                $contador++;
                //esto es para verificar que el centro de balance o la via o
                // el organo que satisface ya esta en la cadena
                if (!is_numeric(
                                strpos(
                                        trim($denocbal), trim($estrucs[$indicador['idcentrobalance']])
                                )
                        )
                ) {
                    $denocbal .= $estrucs[$indicador['idcentrobalance']];
                }

                if (!is_numeric(
                                strpos(trim($denovia), trim($indicador['via']))
                        )
                ) {
                    $denovia .= $indicador['via'];
                }

                if (!is_numeric(
                                strpos(trim($denorgano), trim($indicador['organo']))
                        )
                ) {
                    $denorgano .= $indicador['organo'];
                }
                $denovia = trim($denovia, ',');
                $denocbal = trim($denocbal, ',');
                $denorgano = trim($denorgano, ',');
                //fin
                $unidadmedida = $ums[$indicador['idumedida']];

                echo "<tr>\n";
                echo "<td style=\"mso-number-format:'@';\">"
                . $indicador['codigo'] . "</td>\n";
                echo "<td>" . $indicador['numeropieza'] . "</td>\n";
                echo "<td>" . $indicador['denominacion'] . "</td>\n";
                echo "<td>" . $indicador['denomnivelarbol']
                . "</td>\n"; //echo "<td>" . $nivel . "</td>\n";
                echo "<td>" . $indicador['denomnaturaleza']
                . "</td>\n"; //echo "<td>" . $naturaleza . "</td>\n";
                echo "<td>" . $denocbal . "</td>\n";
                echo "<td>" . $unidadmedida . "</td>\n";
                echo "<td>" . $indicador['aprobacion']
                . "</td>\n"; //echo "<td>" . $aprobado . "</td>\n";
                echo "<td>" . $indicador['nivelplanificacion']
                . "</td>\n"; //echo "<td>" . $nivelplanif . "</td>\n";
                echo "<td>" . $indicador['activado']
                . "</td>\n"; //echo "<td>" . $activado . "</td>\n";
                echo "<td>" . utf8_decode($denovia) . "</td>\n";
                echo "<td>" . $denorgano . "</td>\n";
                echo "<td align = 'right'>" . $indicador['precio'] . "</td>\n";
                echo "</tr>\n";
                $denocbal = '';
                $denorgano = '';
                $denovia = '';
            }
        }

        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function exportarExelIndicadores() {
        $global = ZendExt_GlobalConcept::getInstance();
        $globalEstructura = $global->Estructura;
        $identidad = $globalEstructura->idestructura;
        $denomEntidad = $globalEstructura->denominacion;
        $integrator = ZendExt_IoC::getInstance();
        $excluir = array(7, 8, 9, 10);
        $estructuras = $integrator->metadatos->DameHijosEstructura($identidad, $excluir);
        $filtros = array();
        foreach ($estructuras as $estruc) {
            $estrucs[$estruc->idestructura] = $estruc->denominacion;
        }
        $estrucs[$identidad] = $denomEntidad;
        unset($estructuras);
        $listUms = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        foreach ($listUms as $um) {
            $ums[$um->idunidadmedida] = $um->nombreum;
        }
        unset($listUms);

        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getBorders()
                ->applyFromArray(
                        array(
                            'bottom' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getBorders()
                ->applyFromArray(
                        array(
                            'top' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getBorders()
                ->applyFromArray(
                        array(
                            'right' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getBorders()
                ->applyFromArray(
                        array(
                            'left' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getStyle('B1')->getBorders()
                ->applyFromArray(
                        array(
                            'bottom' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B1')->getBorders()
                ->applyFromArray(
                        array(
                            'top' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getStyle('B1')->getBorders()
                ->applyFromArray(
                        array(
                            'right' => array(
                                'style' => PHPExcel_Style_Border::BORDER_THIN,
                                'color' => array(
                                    'rgb' => '000000'
                                )
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(35);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension('L')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('M')->setWidth(15);

        $objPHPExcel->getActiveSheet()->SetCellValue('A1', 'Código');
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('B1', 'Número de pieza');
        $objPHPExcel->getActiveSheet()->getStyle('B1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('C1', 'Denominación');
        $objPHPExcel->getActiveSheet()->getStyle('C1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('D1', 'Nivel');
        $objPHPExcel->getActiveSheet()->getStyle('D1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('E1', 'Naturaleza');
        $objPHPExcel->getActiveSheet()->getStyle('E1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('F1', 'Centro de Balance');
        $objPHPExcel->getActiveSheet()->getStyle('F1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('G1', 'Unidad de medida');
        $objPHPExcel->getActiveSheet()->getStyle('G1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('H1', 'Aprobado');
        $objPHPExcel->getActiveSheet()->getStyle('H1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue(
                'I1', 'Nivel de planificación'
        );
        $objPHPExcel->getActiveSheet()->getStyle('I1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('J1', 'Activado');
        $objPHPExcel->getActiveSheet()->getStyle('J1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue(
                'kUno', 'Via de adquisición'
        );
        $objPHPExcel->getActiveSheet()->getStyle('kUno')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue(
                'L1', 'Organo que satisface'
        );
        $objPHPExcel->getActiveSheet()->getStyle('L1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->SetCellValue('M1', 'Precio');
        $objPHPExcel->getActiveSheet()->getStyle('M1')->getFont()
                ->applyFromArray(
                        array(
                            'name' => 'Arial',
                            'bold' => true,
                            'italic' => false,
                            'strike' => false,
                            'color' => array(
                                'rgb' => '000000'
                            )
                        )
        );
        $objPHPExcel->getActiveSheet()->setTitle('Pagina1');

        $start = 0;
        $letras = 2;
        for ($i = 1; $i < 3; $i++) {
            $indicadores = NomIndicadorModel::listarIndicadoresParaExportar_Object(
                            $filtros, $identidad, 20000, $start, false
            );
            foreach ($indicadores as $indicador) {
                $dencenbal = '';
                $denorgano = '';
                $via = '';
                if ($indicador['DatIndicadorcentrobalance'] != null) {
                    foreach ($indicador['DatIndicadorcentrobalance'] as $cen) {
                        $den = $estrucs[$cen['DatEntidaddatosnomenclador']['idcentrobalance']];
                        if (!empty($den)) {
                            if ($dencenbal == '') {
                                $dencenbal .= $den;
                            } else {
                                $dencenbal .= ', ' . $den;
                            }
                        }
                    }
                }

                if ($indicador['DatIndicadorviaadquisicion'] != null) {
                    if (!empty($indicador['DatIndicadorviaadquisicion'])) {
                        foreach (
                        $indicador['DatIndicadorviaadquisicion'] as $viaUno
                        ) {
                            $denvia = $viaUno['NomViaadquisicion']['denominacion'];
                            if (!empty($denvia)) {
                                if ($via == '') {
                                    $via .= $denvia;
                                } else {
                                    $via .= ', ' . $denvia;
                                }
                            }

                            if (!empty($viaUno['DatIndicadorviaadquisicionorganosatisface'])) {
                                $contUno = 1;
                                foreach (
                                $indicador['DatIndicadorviaadquisicion'][0]['DatIndicadorviaadquisicionorganosatisface']
                                as $organoArray
                                ) {
                                    $oden = $organoArray['NomOrganosatisface']['denominacion'];
                                    if (!empty($oden)) {
                                        if ($denorgano == '') {
                                            $denorgano .= $oden;
                                        } else {
                                            $denorgano .= ', ' . $oden;
                                        }
                                    }

                                    $contUno++;
                                }
                            }
                        }
                    }
                }
                $unidadmedida = $ums[$indicador['idumedida']];
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'A' . $letras . '', $indicador['codigo']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'B' . $letras . '', $indicador['numeropieza']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'C' . $letras . '', $indicador['denominacion']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'D' . $letras . '', $indicador['denomnivelarbol']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'E' . $letras . '', $indicador['denomnaturaleza']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'F' . $letras . '', $dencenbal
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'G' . $letras . '', $unidadmedida
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'H' . $letras . '', $indicador['aprobacion']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'I' . $letras . '', $indicador['nivelplanificacion']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'J' . $letras . '', $indicador['activado']
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'K' . $letras . '', $via
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'L' . $letras . '', $denorgano
                );
                $objPHPExcel->getActiveSheet()->SetCellValue(
                        'M' . $letras++ . '', $indicador['precio']
                );
            }
            $start = (50000 * $i) + 1;
        }
        header(
                'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        header('Content-Disposition: attachment;filename="indicadores.xlsx" ');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter(
                        $objPHPExcel, 'Excel2007'
        );
        ob_end_clean();
        echo($objWriter->save('php://output'));
        unset($objPHPExcel);
    }

    /* private function addWhereSinParams(&$where, $columCond)
      {
      $where .= " AND " . $columCond;
      } */

    public function listarIndicadoresParaExportar_ObjectSQL($filtros, $identidad, $idejercicio
    ) {
        $cadenaSelect = "";
        $cadenaJoin = "";
        $cadenaWhere = "";
        $cadenaQuery = "";


        $cadenaSelect = " SELECT ind.idindicador,ind.codigo,ind.denominacion,ind.numeropieza,ind.precio,ind.idumedida,
              dn.denominacion as denomnaturaleza,cenbal.idindicadorcentrobalance,
              datnom.identidaddatosnomenclador, datnom.identidad as idcentrobalance,
              viaadq.idviaadquisicion, org.idorganosatisface,
              va.denominacion as via, org.denominacion as organo,
              (CASE WHEN ind.idaprobacion = 4 THEN 'Aprobado' ELSE 'Desaprobado' END) as aprobacion,
              (CASE WHEN ind.nivelarbol = 1 THEN 'Genérico'
              WHEN ind.nivelarbol = 2 THEN 'Subgenérico'
              WHEN ind.nivelarbol = 3 THEN 'Específico'
              WHEN ind.nivelarbol = 4 THEN 'Surtido'
              ELSE 'Desconocido' END) as denomnivelarbol,
              (CASE WHEN nivel = 1 THEN 'Sí' ELSE 'No' END) as nivelplanificacion,
              (CASE WHEN estado = 1 THEN 'Sí' ELSE 'No' END) as activado ";


        $cadenaJoin = " FROM mod_planificacion.nom_datosnomenclador dn
                        INNER JOIN mod_planificacion.nom_indicador ind
                        ON ind.naturaleza = dn.iddatosnomenclador
                        INNER JOIN mod_planificacion.dat_indicadorcentrobalance cenbal
                        ON cenbal.idindicador=ind.idindicador
                        INNER JOIN mod_planificacion.dat_entidaddatosnomenclador datnom
                        ON datnom.identidaddatosnomenclador=cenbal.identidaddatosnomenclador
                        LEFT JOIN mod_planificacion.dat_indicadorviaadquisicion viaadq
                        ON ind.idindicador=viaadq.idindicador
                        LEFT JOIN mod_planificacion.nom_viaadquisicion va
                        ON va.idviaadquisicion=viaadq.idviaadquisicion
                        LEFT JOIN mod_planificacion.dat_indicadorviaadquisicionorganosatisface ft
                        ON viaadq.idviaadquisicion = ft.idviaadquisicion and viaadq.idindicador = ft.idindicador
                        LEFT JOIN mod_planificacion.nom_organosatisface org
                         ON org.idorganosatisface=ft.idorganosatisface
                        ";
        $cadenaWhere = " WHERE TRUE ";

        if ($filtros) {
            foreach ($filtros as $filtro) {


                if ($filtro->data->type == 'string') {
                    if ($filtro->field == 'idcentrobalance') {
                        $cadenaWhere .= "AND datnom.identidad = "
                                . $filtro->data->value . "";
                    } else {
                        if ($filtro->field == 'idviaadquisicion') {
                            $cadenaWhere .= "AND viaadq.idviaadquisicion = "
                                    . $filtro->data->value . "";
                        } else {
                            if ($filtro->field == 'codigo') {
                                $cadenaWhere .= "AND ind." . $filtro->field
                                        . " LIKE '" . $filtro->data->value . "%'";
                            } else {
                                if ($filtro->field == 'numeropieza') {
                                    $cadenaWhere .= "AND upper(ind."
                                            . $filtro->field . ") LIKE upper('"
                                            . $filtro->data->value . "%')";
                                } else {
                                    if ($filtro->field == 'denominacion') {

                                        $cadenaWhere .= "AND upper(ind."
                                                . $filtro->field . ") LIKE upper('"
                                                . $filtro->data->value .
                                                "%')";
                                    } else {
                                        if ($filtro->field == 'idorganosatisface'
                                        ) {

                                            $cadenaWhere .= "AND (org.idorganosatisface = "
                                                    . $filtro->data->value . ")";
                                        } else {

                                            $cadenaWhere .= "AND (ind. "
                                                    . $filtro->field . " = "
                                                    . $filtro->data->value . ")";
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if ($filtro->data->type == 'boolean') {
                        if ($filtro->field == 'estado') {

                            if ($filtro->data->value == 'false') {

                                $cadenaWhere .= "AND (ind. " . $filtro->field
                                        . " = 1 )";
                            } else {

                                $cadenaWhere .= "AND (ind. " . $filtro->field
                                        . " <> 1 )";
                            }
                        } else {
                            if ($filtro->field == 'idaprobacion') {
                                if ($filtro->data->value == 'false') {

                                    $cadenaWhere .= "AND (ind. "
                                            . $filtro->field . " = 4 )";
                                } else {

                                    $cadenaWhere .= "AND (ind. "
                                            . $filtro->field . " <> 4 )";
                                }
                            } else {
                                if ($filtro->field == 'nivel') {
                                    if ($filtro->data->value == 'false') {

                                        $cadenaWhere .= "AND (ind. "
                                                . $filtro->field . " = 1 )";
                                    } else {

                                        $cadenaWhere .= "AND (ind. "
                                                . $filtro->field . " <> 1 )";
                                    }
                                }
                            }
                        }
                    } else {
                        if ($filtro->data->type == 'numeric') {
                            if ($filtro->data->comparison == 'gt') {

                                $cadenaWhere .= "AND (ind. " . $filtro->field
                                        . " > " . $filtro->data->value . ")";
                            } else {
                                if ($filtro->data->comparison == 'lt') {

                                    $cadenaWhere .= "AND (ind. "
                                            . $filtro->field . " < "
                                            . $filtro->data->value . ")";
                                } else {
                                    if ($filtro->data->comparison == 'eq') {

                                        $cadenaWhere .= "AND (ind. "
                                                . $filtro->field . " = "
                                                . $filtro->data->value . ")";
                                    }
                                }
                            }
                        } else {
                            if ($filtro->data->type == 'list') {

                                $cadenaWhere .= "AND (ind. " . $filtro->field
                                        . " = " . $filtro->data->value[0] . ")";
                            }
                        }
                    }
                }
            }
        }
        $cadenaWhere .= "AND (ind.idejercicio = " . $idejercicio . ")";
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $excluir = array(7,8,9,10);
            $datosentidad = $integrator->metadatos->DameHijosEstructura(
                    $identidad,$excluir
            );
            $ids = array();
            foreach ($datosentidad as $value) {
                array_push($ids, $value->id);
            }


            $ids = implode(",", $ids);

            if (!empty($ids)) {

                $cadenaWhere .= "AND (datnom.identidad = " . $identidad
                        . " OR datnom.identidad IN ( " . $ids . " ))";
            } else {
                $cadenaWhere .= "AND datnom.identidad = " . $identidad . "";
            }
        }

        $cadenaQuery = $cadenaSelect . $cadenaJoin . $cadenaWhere
                . " ORDER BY ind.codigo ";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQuery)->fetchAll();
        return $result;
    }

    public function listarIndicadoresParaExportar_Object($filtros, $identidad, $limit, $start, $count = false
    ) {
        //$addwhere = "Where true";
        $queryDos = Doctrine_Query::create();
        //$conn = Doctrine_Manager::connection();
        $queryDos->from('NomIndicador ind');

        if (!empty($filtros)) {
            foreach ($filtros as $filtro) {
                if ($filtro->data->type == 'string' || $filtro->data->type == 'string_adaptado'
                ) {
                    if ($filtro->field == 'idcentrobalance') {
                        $queryDos->addWhere(
                                'datnom.identidad = ' . $filtro->data->value
                        );
                    } else {
                        if ($filtro->field == 'idviaadquisicion') {
                            $queryDos->addWhere(
                                    'viaadq.idviaadquisicion = '
                                    . $filtro->data->value
                            );
                        } else {
                            if ($filtro->field == 'codigo') {
                                $queryDos->addWhere(
                                        "ind." . $filtro->field . " LIKE '"
                                        . $filtro->data->value .
                                        "%'"
                                );
                            } else {
                                if ($filtro->field == 'numeropieza') {
                                    $queryDos->addWhere(
                                            "upper(ind." . $filtro->field
                                            . ") LIKE upper('"
                                            . $filtro->data->value . "%')"
                                    );
                                    /* $s = $filtro->data->value;
                                      self::addWhereSinParams(
                                      $addwhere, "upper(i.numeropieza)  LIKE  upper('%$s%') "
                                      ); */
                                } else {
                                    if ($filtro->field == 'denominacion') {

                                        $queryDos->addWhere(
                                                "upper(ind." . $filtro->field
                                                . ") LIKE upper('"
                                                . $filtro->data->value . "%')"
                                        );
                                    } else {
                                        if ($filtro->field == 'idorganosatisface'
                                        ) {
                                            $queryDos->addWhere(
                                                    'org.idorganosatisface = '
                                                    . $filtro->data->value
                                            );
                                        } else {
                                            $queryDos->addWhere(
                                                    'ind.' . $filtro->field . ' = '
                                                    . $filtro->data->value
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if ($filtro->data->type == 'boolean') {
                        if ($filtro->field == 'estado') {
                            if ($filtro->data->value || $filtro->data->value == 'true'
                            ) {
                                $queryDos->addWhere(
                                        'ind.' . $filtro->field . ' = 1'
                                );
                            } else {
                                $queryDos->addWhere(
                                        'ind.' . $filtro->field . ' <> 1'
                                );
                            }
                        } else {
                            if ($filtro->field == 'idaprobacion') {
                                if ($filtro->data->value || $filtro->data->value == 'true'
                                ) {
                                    $queryDos->addWhere(
                                            'ind.' . $filtro->field . ' = 4'
                                    );
                                } else {
                                    $queryDos->addWhere(
                                            'ind.' . $filtro->field . ' <> 4'
                                    );
                                }
                            } else {
                                if ($filtro->field == 'nivel') {
                                    if ($filtro->data->value || $filtro->data->value == 'true'
                                    ) {
                                        $queryDos->addWhere(
                                                'ind.' . $filtro->field . ' = 1'
                                        );
                                    } else {
                                        $queryDos->addWhere(
                                                'ind.' . $filtro->field . ' <> 1'
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        if ($filtro->data->type == 'numeric') {
                            if ($filtro->data->comparison == 'gt') {
                                $queryDos->addWhere(
                                        'ind.' . $filtro->field . ' > '
                                        . $filtro->data->value
                                );
                            } else {
                                if ($filtro->data->comparison == 'lt') {
                                    $queryDos->addWhere(
                                            'ind.' . $filtro->field . ' < '
                                            . $filtro->data->value
                                    );
                                } else {
                                    if ($filtro->data->comparison == 'eq') {
                                        $queryDos->addWhere(
                                                'ind.' . $filtro->field . ' = '
                                                . $filtro->data->value
                                        );
                                    }
                                }
                            }
                        } else {
                            if ($filtro->data->type == 'list') {
                                $queryDos->addWhere(
                                        "ind." . $filtro->field . " = "
                                        . $filtro->data->value[0]
                                );
                            } else {
                                if ($filtro->data->type == 'listado') {
                                    if ($filtro->field == 'idcentrobalance') {
                                        $queryDos->addWhere(
                                                'datnom.identidad = '
                                                . $filtro->data->value
                                        );
                                    } else {
                                        if ($filtro->field == 'idviaadquisicion'
                                        ) {
                                            $queryDos->addWhere(
                                                    'viaadq.idviaadquisicion = '
                                                    . $filtro->data->value
                                            );
                                        } else {
                                            $queryDos->addWhere(
                                                    'ind.' . $filtro->field . ' = '
                                                    . $filtro->data->value
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $excluir = array(7,8,9,10);
            $datosentidad = $integrator->metadatos->DameHijosEstructura(
                    $identidad,$excluir
            );
            $ids = array();
            foreach ($datosentidad as $value) {
                array_push($ids, $value->idestructura);
            }

            $ids = implode(",", $ids);

            if (!empty($ids)) {
                $queryDos->addWhere(
                        'datnom.identidad = ' . $identidad
                        . ' or datnom.identidad in (' . $ids . ')'
                );
            } else {
                $queryDos->addWhere('datnom.identidad = ' . $identidad);
            }
        }

        $queryDos->leftJoin('ind.DatIndicadorviaadquisicion viaadq')
                ->leftJoin('viaadq.NomViaadquisicion va')
                ->innerJoin(
                        'ind.NomDatosnomenclador dn on ind.naturaleza = dn.iddatosnomenclador'
                )
                ->leftJoin(
                        'viaadq.DatIndicadorviaadquisicionorganosatisface ft
                on viaadq.idviaadquisicion = ft.idviaadquisicion and viaadq.idindicador = ft.idindicador'
                )
                ->leftJoin('ft.NomOrganosatisface org');
        $queryDos->innerJoin('ind.DatIndicadorcentrobalance cenbal')
                ->innerJoin(
                        'cenbal.DatEntidaddatosnomenclador datnom'
        );

        if ($count) {
            $queryDos->select('COUNT(ind.idindicador) as cantidadIndicador');
        } else {

            $queryDos->select(
                    "ind.*, cenbal.idindicadorcentrobalance,
              datnom.identidaddatosnomenclador, datnom.identidad as idcentrobalance,
              viaadq.idviaadquisicion, ft.*,org.idorganosatisface,
              va.denominacion, org.denominacion,
              dn.denominacion as denomnaturaleza,
              (CASE WHEN idaprobacion = 4 THEN 'Aprobado' ELSE 'Desaprobado' END) as aprobacion,
              (CASE WHEN nivelarbol = 1 THEN 'Genérico'
              WHEN nivelarbol = 2 THEN 'Subgenérico'
              WHEN nivelarbol = 3 THEN 'Específico'
              WHEN nivelarbol = 4 THEN 'Surtido'
              ELSE 'Desconocido' END) as denomnivelarbol,
              (CASE WHEN nivel = 1 THEN 'Sí;' ELSE 'No' END) as nivelplanificacion,
              (CASE WHEN estado = 1 THEN 'Sí;' ELSE 'No' END) as activado"
            );
            $queryDos->orderBy("ind.codigo");
            $queryDos->offset($start);
            $queryDos->limit($limit);
        }

        $indicadores = $queryDos->fetchArray(
        );

        return $indicadores;
    }

    public function listarTotalIndicadoresParaExportar($filtros, $identidad, $idejercicio
    ) {
        $query = Doctrine_Query::create();
        $query->from('NomIndicador ind');
        if ($filtros) {
            foreach ($filtros as $filtro) {
                if ($filtro['data']['type'] == 'string') {
                    if ($filtro['field'] == 'idcentrobalance') {
                        $query->addWhere(
                                'datnom.identidad = ' . $filtro['data']['value']
                        );
                    } else {
                        if ($filtro['field'] == 'idviaadquisicion') {
                            $query->addWhere(
                                    'viaadq.idviaadquisicion = '
                                    . $filtro['data']['value']
                            );
                        } else {
                            if ($filtro['field'] == 'codigo') {
                                $query->addWhere(
                                        "ind." . $filtro['field'] . " LIKE '"
                                        . $filtro['data']['value'] .
                                        "%'"
                                );
                            } else {
                                if ($filtro['field'] == 'numeropieza') {
                                    $query->addWhere(
                                            "upper(ind." . $filtro['field']
                                            . ") LIKE upper('"
                                            . $filtro['data']['value'] .
                                            "%')"
                                    );
                                } else {
                                    if ($filtro['field'] == 'denominacion') {
                                        $query->addWhere(
                                                "upper(ind." . $filtro['field']
                                                . ") LIKE upper('"
                                                . $filtro['data']['value'] .
                                                "%')"
                                        );
                                    } else {
                                        if ($filtro['field'] == 'idorganosatisface'
                                        ) {
                                            $query->addWhere(
                                                    'org.idorganosatisface = '
                                                    . $filtro['data']['value']
                                            );
                                        } else {
                                            $query->addWhere(
                                                    'ind.' . $filtro['field']
                                                    . ' = '
                                                    . $filtro['data']['value']
                                            );
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if ($filtro['data']['type'] == 'boolean') {
                        if ($filtro['field'] == 'estado') {
                            if ($filtro['data']['value'] == 'false') {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' <> 1'
                                );
                            } else {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' = 1'
                                );
                            }
                        } else {
                            if ($filtro['field'] == 'idaprobacion') {
                                if ($filtro['data']['value'] == 'false') {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' <> 4'
                                    );
                                } else {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' = 4'
                                    );
                                }
                            } else {
                                if ($filtro['field'] == 'nivel') {
                                    if ($filtro['data']['value'] == 'false') {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' <> 1'
                                        );
                                    } else {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' = 1'
                                        );
                                    }
                                }
                            }
                        }
                    } else {
                        if ($filtro['data']['type'] == 'numeric') {
                            if ($filtro['data']['comparison'] == 'gt') {
                                $query->addWhere(
                                        'ind.' . $filtro['field'] . ' > '
                                        . $filtro['data']['value']
                                );
                            } else {
                                if ($filtro['data']['comparison'] == 'lt') {
                                    $query->addWhere(
                                            'ind.' . $filtro['field'] . ' < '
                                            . $filtro['data']['value']
                                    );
                                } else {
                                    if ($filtro['data']['comparison'] == 'eq') {
                                        $query->addWhere(
                                                'ind.' . $filtro['field'] . ' = '
                                                . $filtro['data']['value']
                                        );
                                    }
                                }
                            }
                        } else {
                            if ($filtro['data']['type'] == 'list') {
                                $query->addWhere(
                                        "ind." . $filtro['field'] . " = "
                                        . $filtro['data']['value']
                                );
                            }
                        }
                    }
                }
            }
        }
        if ($identidad) {
            $integrator = ZendExt_IoC::getInstance();
            $excluir = array(7,8,9,10);
            $datosentidad = $integrator->metadatos->DameHijosEstructura(
                    $identidad,$excluir
            );
            $ids = array();
            foreach ($datosentidad as $value) {
                array_push($ids, $value->id);
            }
            $ids = implode(",", $ids);
            if (!empty($ids)) {
                $query->addWhere(
                        'datnom.identidad = ' . $identidad .
                        ' or datnom.identidad in (' . $ids . ')'
                );
            } else {
                $query->addWhere('datnom.identidad = ' . $identidad);
            }
        }
        $query->addWhere('ind.idejercicio = ' . $idejercicio);
        $query->leftJoin('ind.DatIndicadorviaadquisicion viaadq')->leftJoin(
                'viaadq.DatIndicadorviaadquisicionorganosatisface ft
            on viaadq.idviaadquisicion = ft.idviaadquisicion and viaadq.idindicador = ft.idindicador'
        )->leftJoin('ft.NomOrganosatisface org');
        $query->innerJoin('ind.DatIndicadorcentrobalance cenbal')->innerJoin(
                'cenbal.DatEntidaddatosnomenclador datnom'
        );
        $query->addSelect('ind.idindicador')->distinct();
        //$total = $query->count();
        $sql = $query->getSqlQuery();
        $conn = Doctrine_Manager::connection();
        $total = $conn->execute($sql)->rowCount();
        return $total;
    }

    public function Insertar(NomIndicador $indicador) {
        $indicador->save();
        return $indicador->idindicador;
    }

    public function Eliminar($idindicadores, $idejercicio) {

        $indiAeliminar = array();
        foreach ($idindicadores as $value) {
            $array = array();
            ///Obtengo los indicadores hijos para cada idpadre
            $idindicadoreshijos = NomIndicador::ObtenerIdIndicadoresByOrdenes(
                            array('0' => $value)
            );

            foreach ($idindicadoreshijos as $valor) {
                $array[] = $valor['idindicador'];
            }

            //Obtengo de los indicadores hijos los que no están usandose
            $indicadoresNoEnUso = NomIndicadorModel::ObtenerIndicadoresNoEnUsoEliminar(
                            $array, $idejercicio
            );
            if (count($indicadoresNoEnUso) == count($idindicadoreshijos)) {
                $indiAeliminar[] = $value[0]; //Aqui se obtienen los indicadores que
                // cumplen con las validaciones para que se puedan eliminar.
            }
        }
        if ($indiAeliminar[0] != '') {
            $eliminando = NomIndicador::EliminarIndicador(
                            $indiAeliminar
            );
            if ($eliminando == 1) {//Se elimino correctamente
                return json_encode(array('codMsgM' => 1));
            } else {
                if ($eliminando == 0
                ) {//Estan aprobados los indicadores seleccionados y no se pueden eliminar
                    return json_encode(array('codMsgM' => 21));
                }
            }
        } else {//Cuando esta en uso en Norma y en Modelo.
            return json_encode(array('codMsgM' => 21));
        }
    }

    public function listarIndicadores($parametros, $idpadre, $idarbol, $start, $limit, $unidades, $centrobalances, $paises, $flagfiltros
    ) {
        $data = NomIndicador::listar(
                        $parametros, $idpadre, $idarbol, $start, $limit, $flagfiltros
        );
        foreach ($data->data as $key => $value) {
            $colon = '';
            $data->data[$key]['denomviaadquisicion'] = null;
            $data->data[$key]['denomorgansatisface'] = null;
            $data->data[$key]['coeficiente'] = number_format(
                    ($value['coeficiente']), '6', '.', ','
            );
            if (is_array($value['DatIndicadorviaadquisicion'])) {
                foreach ($value['DatIndicadorviaadquisicion'] as $v) {
                    $coma = '';
                    foreach ($v['DatIndicadorviaadquisicionorganosatisface'] as $d) {
                        $data->data[$key]['denomorgansatisface'] = $data->data[$key]['denomorgansatisface'] . $coma
                                . $d['NomOrganosatisface']['denominacion'];
                        $coma = ',';
                    }
                    $data->data[$key]['denomviaadquisicion'] = $data->data[$key]['denomviaadquisicion'] . $colon
                            . $v['NomViaadquisicion']['denominacion'];
                    $colon = ',';
                }
            }
            $data->data[$key]['denoum'] = '';
            foreach ($unidades as $k => $v) {
                if ($value['idumedida'][0] == $v['idunidadmedida']) {
                    $data->data[$key]['denoum'] = strtoupper(
                            $v['denominacionunidadmedida']
                    );
                    break;
                }
            }
            $data->data[$key]['denompais'] = '';
            foreach ($paises as $valueUno) {
                if ($value['idpais'] == $valueUno['idpais']) {
                    $data->data[$key]['denompais'] = $valueUno['nombrepais'];
                    break;
                }
            }
            $coma = '';
            $data->data[$key]['denocentrobalance'] = '';
            $data->data[$key]['idcentrobalance'] = '';
            foreach ($centrobalances as $vUno) {
                if ($value['DatIndicadorcentrobalance'][0]['identidaddatosnomenclador'] == $vUno['identidaddatosnomenclador'] /* && $value['nivel'] == '0' */
                ) {
                    $data->data[$key]['denocentrobalance'] = $data->data[$key]['denocentrobalance'] . $coma
                            . $vUno['denom'];
                    $data->data[$key]['idcentrobalance'] = $data->data[$key]['idcentrobalance'] . $coma
                            . $vUno['idcentrobalance'];
                    break;
                }
            }
            $idnaturaleza = $data->data [$key]['idnaturaleza'];
            $denomnat = NomDatosnomenclador::ObtenerDatosDadoIdDatosNom(
                            $idnaturaleza
            );
            $data->data[$key]['naturaleza'] = $denomnat[0]['denominacion'];
            $data->data[$key]['idmodelo'] = $value['DatIndicadormodelo'][0]['idmodelo'];
            unset($data->data [$k] ['DatIndicadorcentrobalance']);
            unset($data->data [$k] ['DatIndicadormodelo']);
            if (!$value['indicadorplanif'] && !$value['indicadornorma']) {
                $data->data[$key]['uso'] = 0;
            } else {
                $data->data[$key]['uso'] = 1;
            }
        }
        $data->data = array_values($data->data);
        if ($cont == 1) {
            $data->total = count($data->data);
        }

        return $data;
    }

    public function listarTotalIndicadores($parametros, $idpadre, $idarbol
    ) {
        $arrryTotal = NomIndicador::listarTotal(
                        $parametros, $idpadre, $idarbol
        );
        return $arrryTotal [0] ['COUNT'];
    }

    /**
     * asociarencadena
     * Elimina la cadena completa de hijos de un indicador padre
     *
     * @param 'idindicador' - identificador del indicador
     * @param 'estado' - estado del indicador (activado o desactivado)
     *
     * @return boolean, devuelve true si activa/desactiva satisfactoriamente, false en otro caso
     * */
    public function asociarencadena($idindicador, $identidad, $asociacion) {
        // busca los hijos del indicador de acuerdo a su id
        $hijos = NomIndicador::BuscarHijos($idindicador);
        if ($hijos) { // si tiene hijos
            foreach ($hijos as $h) {
                // por cada elemento de la lista invoca al mÃƒÆ’Ã‚Â©todo recursivamente
                NomIndicadorModel::asociarencadena(
                        $h ['idindicador'], $identidad, $asociacion
                );
            }
        }
        if (DatIndicadorentidad::asociar(
                        $identidad, $idindicador, $asociacion
                )
        ) {
            return true;
        } else {
            return false;
        }
    }

    //fin de la funciÃƒÆ’Ã‚Â³n asociarencadena

    /**
     * activar_desactivar_en_postorden
     * Cambia el estado (activado/desactivado) de un indicador
     *
     * @param 'idindicador' - identificador del indicador
     * @param 'estado' - estado del indicador (activado o desactivado)
     *
     * @return boolean, devuelve true si activa/desactiva satisfactoriamente, false en otro caso
     * */
    public function activar_desactivar_en_postorden($idindicadores, $estado
    ) {
        $cadenaIndicadores = "";
        foreach ($idindicadores as $ind => $val) {
            if ($ind == 0) {
                $cadenaIndicadores = $val['idindicador'];
            } else {
                $cadenaIndicadores = $cadenaIndicadores . ","
                        . $val['idindicador'];
            }
        }
        if ($estado == 0) {
            return NomIndicador::desactivar(
                            $cadenaIndicadores, $estado
            );
        } else {
            return NomIndicador::activar(
                            $cadenaIndicadores, $estado
            );
        }
    }

    //fin de la funciÃƒÆ’Ã‚Â³n activar_desactivar_en_postorden
    public function ObtenerIndicadoresNoEnUso($indicadores, $idejercicio) {
        $indicadores = implode(',', $indicadores);

        $indicadoresNoEnUso = NomIndicador::GetIndicadoresNoEnUso(
                        $indicadores, $idejercicio
        );
        return $indicadoresNoEnUso;
    }

    public function validarNormaencadena($idindicador) {
        $indi = NomIndicador::ObtenerIndicador($idindicador);
        $ordender = $indi [0] ['ordender'];
        $ordenizq = $indi [0] ['ordenizq'];

        //obtengo la familia del indicador
        $family = NomIndicador::ObtenerFamiliaDescendiente(
                        $idindicador, $ordender, $ordenizq
        );

        foreach ($family as $value) {
            // guardo todos los id en un arreglo
            $familia [] = $value ['idindicador'];
        }
        foreach ($familia as $inde => $valu) {
            //busco uno a uno si estÃƒÆ’Ã‚Â¡ en dat_planificacion
            $result = DatNorma::exiteIndicadorEnNorma($familia [$inde]);
            if ($result == true
            ) {
                $noeliminar = 1;
                break; //al primero q encuentre sale del ciclo
            }
        }
        if ($noeliminar == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function validarModeloencadena($idindicador) {
        //obtengo datos del indicador
        $indi = NomIndicador::ObtenerIndicador($idindicador);
        $ordender = $indi [0] ['ordender'];
        $ordenizq = $indi [0] ['ordenizq'];
        //obtengo la familia del indicador
        $family = NomIndicador::ObtenerFamiliaDescendiente(
                        $idindicador, $ordender, $ordenizq
        );
        foreach ($family as $value) {
            // guardo todos los id en un arreglo
            $familia [] = $value ['idindicador'];
        }

        foreach ($familia as $ind => $val) {
            //busco uno a uno si estÃƒÆ’Ã‚Â¡ en dat_planificacion
            $result = DatPlanificacion::BuscarIndP($familia [$ind]);
            if ($result == true
            ) {
                $noeliminar = 1;
                break;
            }
        }
        if ($noeliminar == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function buscarHijosPadres($izq, $der) {

        $listaHijos = NomIndicador::BuscarHijos($izq, $der);
        $listaPadres = NomIndicador::buscarPadre($izq, $der);
        $lista = array_merge($listaHijos, $listaPadres);
        return $lista;
    }

    public function chequearNivel($izq, $der, $idarbol) {
        $listaHijos = NomIndicador::BuscarHijos($izq, $der, $idarbol);

        $listaPadres = NomIndicador::buscarPadre($izq, $der, $idarbol);
        $lista = array_merge($listaHijos, $listaPadres);
        foreach ($lista as $l) {
            if ($l ['nivel'] == 1) {
                return $l ['idindicador'];
                break;
            }
        }
    }

    /**
     * aprobar_desaprobar_en_postorden
     * Cambia el estado (aprobado/desaprobado) de un indicador
     *
     * @author Yasleiny GutiÃƒÆ’Ã‚Â©rrez Machado
     *
     * @param  'idindicador' - identificador del indicador
     * @param  'estado' - estado del indicador (aprobado/desaprobado)
     *
     * @return boolean, devuelve true si aprueba/desaprueba satisfactoriamente, false en caso contrario
     * */
    public function aprobar_desaprobar_en_postorden($idindicador, $idaprobacion
    ) {
        $cadenaIndicadores = "";
        foreach ($idindicador as $ind => $val) {
            if ($ind == 0) {
                $cadenaIndicadores = $val['idindicador'];
            } else {
                $cadenaIndicadores = $cadenaIndicadores . ","
                        . $val['idindicador'];
            }
        }
        if (NomIndicador::laSuper(
                        $cadenaIndicadores, $idaprobacion
                )
        ) {
            return true;
        } else {
            return false;
        }
    }

    //fin de la funciÃƒÆ’Ã‚Â³n aprobar_desaprobar_en_postorden

    public function listIndCTEyOtrosAjustes($idindicador) {
        $datos = NomIndicador::obtenerIndCTEyOtros($idindicador);
        return $datos;
    }

    public function listarnombresViaadquisicion() {
        return NomIndicador::listarnombresViaadquisicion();
    }

    public function listarnombresorganoSatisface() {
        return NomIndicador::listarnombresorganoSatisface();
    }

    public function listarCentroBalance($integrator, $idpadre, $idindicador) {
        if ($idpadre == null || $idpadre == $idindicador) {
            $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
            $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                            $idcentrobalance
            );
        } else {
            $centrobalance = DatEntidaddatosnomenclador::getEntidadesDadoIdPadre($idpadre);
        }
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['idcentrobalance'] = $valor ['identidad'];
            $datosentidad = $integrator->metadatos->DameEstructura(
                    $valor ['identidad']
            ); //100000024
            $dat [$k] ['denom'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        return $dat;
    }

    public function comprobarIdAprobacion($idindicador) {
        if (NomIndicador::aprobacionIndicador($idindicador) >= 3) {
            return true;
        }
        return false;
    }

    public function listarIndicadoresParaTipoCodificador($params) {
        $data = NomIndicador::listarInd($params);
        $aux = array();
        foreach ($params['centrobalances'] as $vUno) {
            $aux[$vUno['idcentrobalance']] = $vUno['denom'];
        }
        foreach ($data->data as $key => $value) {
            $coma = '';
            $data->data[$key]['denocentrobalance'] = '';
            foreach ($value['DatIndicadorcentrobalance'] as $v) {
                $data->data[$key]['denocentrobalance'] .= $coma
                        . $aux[$v['DatEntidaddatosnomenclador']['identidad']];
                $coma = ',';
            }
            $coma = '';
            $suma = '';
            foreach ($value['DatDatosclasificadorindicador'] as $val) {
                $data->data[$key]['denodatoscodif'] .= $suma
                        . $val['NomDatoscodificador']['NomTipocodificador']['idtipocodificador']
                        . '---' . $val['NomDatoscodificador']['denominacion'];
                $data->data[$key]['idtipocodificador']
                        .= $coma
                        . $val['NomDatoscodificador']['NomTipocodificador']['idtipocodificador'];
                $coma = ',';
                $suma = '+';
            }
            unset($data->data[$key]['DatDatosclasificadorindicador']);
            unset($data->data[$key]['DatIndicadorcentrobalance']);
        }
        return $data;
    }

    public function listarIndicadoresParaTipoCodificadorE($params) {
        $data = NomIndicador::listarIndE($params);
        $aux = array();
        foreach ($params['centrobalances'] as $vUno) {
            $aux[$vUno['idcentrobalance']] = $vUno['denom'];
        }
        foreach ($data->data as $key => $value) {
            $coma = '';
            $data->data[$key]['denocentrobalance'] = '';
            foreach ($value['DatIndicadorcentrobalance'] as $v) {
                $data->data[$key]['denocentrobalance'] .= $coma
                        . $aux[$v['DatEntidaddatosnomenclador']['identidad']];
                $coma = ',';
            }
            $coma = '';
            foreach ($value['DatDatosclasificadorindicador'] as $val) {

                $data->data[$key]['idtipocodificador']
                        .= $coma
                        . $val['NomDatoscodificador']['NomTipocodificador']['idtipocodificador'];
                $coma = ',';
            }
        }

        return $data;
    }

    public function exportarindasoc($params) {
        switch ($params['asociado']) {
            case 1:
                $tituloreporte = 'indicadores_asociados';
                $text = 'INDICADORES ASOCIADOS';
                $colspan = 6;
                break;
            case 2:
                $tituloreporte = 'indicadores_no_asociados';
                $text = 'INDICADORES NO ASOCIADOS';
                $colspan = 4;
                break;
            default:
                $text = 'INDICADORES';
                $tituloreporte = 'todos_los_indicadores';
                $colspan = 6;
                break;
        }
        $extension = '.xls';
        header(
                "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
                . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
                "Content-disposition: attachment; filename=" . $tituloreporte
                . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<tr>\n";
        echo "<th colspan = " . $colspan . " align=left> $text </th>";
        echo "</tr>";
        echo "<tr>\n";
        echo "<th align=left>C&oacute;digo</th>\n";
        echo "<th align=left>Número de pieza</th>\n";
        echo "<th align=left>Denominaci&oacute;n </th>\n";
        echo "<th align=left>Centro de balance</th>\n";
        if ($params['asociado'] != 2) {
            echo "<th align=left>C&oacute;digo del codificador</th>\n";
            echo "<th align=left>Denominaci&oacute;n del codificador</th>\n";
        }
        echo "</tr>\n";
        ini_set(
                "max_execution_time", 600
        ); //cambiar el tiempo de espera de la peticion en el servidor a 10min
        ini_set(
                'memory_limit', '128M'
        ); //aumentar memoria del php en el servidor a 128 Mb
        $cantxpag = 10000;
        $params['start'] = 0;
        $params['limit'] = $cantxpag;
        $datos = NomIndicador::totalindicadoresE($params);
        $cantpag = (int) ($datos->total / $cantxpag);
        if (fmod($datos->total, $cantxpag) > 0) {
            $cantpag++;
        }
        //$datos = $this->listarIndicadoresParaTipoCodificador($params);
        for ($i = 0; $i < $cantpag; $i++) {
            $datos = $this->listarIndicadoresParaTipoCodificadorE($params);
            $params['start'] = $params['start'] + $cantxpag;
            if ($params['asociado'] != 2) {
                foreach ($datos->data as $key => $value) {

                    echo "<tr>\n";
                    echo "<td align=left style=\"mso-number-format:'@';\">"
                    . $value['codigo'] . "</td>\n";
                    echo "<td align=left>" . $value['numeropieza'] . "</td>\n";
                    echo "<td align=left>" . $value['denominacion'] . "</td>\n";
                    echo "<td align=left>" . $value['denocentrobalance']
                    . "</td>\n";
                    echo "<td align=left style=\"mso-number-format:'@';\">"
                    . $value['codigocodificador'] . "</td>\n";
                    echo "<td align=left>" . $value['denomcodificador']
                    . "</td>\n";
                    echo "</tr>\n";
                }
            } else {
                foreach ($datos->data as $key => $value) {
                    echo "<tr>\n";
                    echo "<td align=left style=\"mso-number-format:'@';\">"
                    . $value['codigo'] . "</td>\n";
                    echo "<td align=left>" . $value['numeropieza'] . "</td>\n";
                    echo "<td align=left>" . $value['denominacion'] . "</td>\n";
                    echo "<td align=left>" . $value['denocentrobalance']
                    . "</td>\n";
                    echo "</tr>\n";
                }
            }
        }

        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function listarIndicadores_Control_Divisa(
    $parametros, $idpadre, $idarbol, $start, $limit, $idejercicio, $nivelFiltrar
    ) {
        $data = NomIndicador::listar_Control_Divisa(
                        $parametros, $idpadre, $idarbol, $start, $limit, $idejercicio, $nivelFiltrar
        );

        return $data;
    }

    public function calcularCoeficiente($parametros) {
        $parametros['idindicador'] = implode(',', $parametros['idindicador']);
        $parametros['idindicador'] = "{" . $parametros['idindicador'] . "}";
        $arrayParametros[0] = $parametros['idindicador'];
        $arrayParametros[1] = $parametros['coeficiente'];
        $conn = Doctrine_Manager::connection();
        $query = "select * from mod_planificacion.f_actualizarprecioindxcoeficiente_modif(?,?)";
        $res = $conn->execute($query, $arrayParametros);
        $res = $res->fetchAll(PDO::FETCH_ASSOC);
        return $res[0]['f_actualizarprecioindxcoeficiente_modif'];
    }

    public function ObtenerIndicadoresNoEnUsoEliminar($indicadores, $idejercicio
    ) {

        $indicadores = implode(',', $indicadores);
        $indicadoresNoEnUso = NomIndicador::GetIndicadoresNoEnUsoEliminar(
                        $indicadores, $idejercicio
        );
        return $indicadoresNoEnUso;
    }

    public function ObtenerIdIndicadoresAprobar($params, $idaproba) {
        $idindicadoreshijos = NomIndicador::ObtenerIdIndicadoresByOrdenes(
                        $params
        );
        if ($idaproba == 1) {
            $idindicadorespadres = NomIndicador::ObtenerIdIndicadoresByIdHijos(
                            $params
            );
            $idindicadoreshijos = array_merge(
                    $idindicadoreshijos, $idindicadorespadres
            );
        }
        return $idindicadoreshijos;
    }

    public function ObtenerIdIndicadores($params, $estado) {
        //si se va a activar obtiene los hijos de los indicaores seleccionados
        //devolviendo las familias en un solo arreglo
        $idindicadoreshijos = NomIndicador::ObtenerIdIndicadoresByOrdenes(
                        $params
        );
        //si se va  a desactivar se obtienen tambien los padres hasta la raiz
        //de los indicadores seleccionados y se unen hijos y padres en un  solo arreglo
        if ($estado == 0) {
            $idindicadorespadres = NomIndicador::ObtenerIdIndicadoresByIdHijos(
                            $params
            );
            $idindicadoreshijos = array_merge(
                    $idindicadoreshijos, $idindicadorespadres
            );
        }
        return $idindicadoreshijos;
    }

    public function ValidarCentro($identidad) {
        if ($identidad != null) {
            $centrobalance = DatEntidaddatosnomenclador::getComport($identidad);
        }
        foreach ($centrobalance as $val) {
            if ($val['iddatosnomenclador'] == 1
            ) {//numero fijo en la BD para Nomdatosnomenclador
                return 'true';
            }
        }
        return 'false';
    }

    public function listarActividadesConIndicador($params) {
        $actividades = NomIndicador::listarActividadesConIndicador($params);

        $datos = array();
        $data->total = $actividades->total;
        $actividades = $actividades->data;
        foreach ($actividades as $k => $dat) {
            $datos[$k]['base'] = $dat['base'];
            $datos[$k]['norma'] = $dat['norma'];
            $datos[$k]['codigo'] = $dat['codigo'];
            $datos[$k]['denominacion'] = $dat['denominacion'];
            $datos[$k]['necesidad'] = $dat['necesidad'];
            $datos[$k]['ejercicio'] = $dat['idejercicio'];
        }

        $data->data = $datos;

        return $data;
    }

}

//fin de la clase NomIndicadorModel
