<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Jany Coto García
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class NomNomencladorModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Adicionar(NomNomenclador $nomNomenclador)
    {
        $nomNomenclador->save();
        $idNom = $nomNomenclador->idnomenclador;
        return $idNom;
    }

    public function Actualizar(NomNomenclador $nomNomenclador)
    {
        $nomNomenclador->save();
        $idNom = $nomNomenclador->idnomenclador;
        return $idNom;
    }

    public function Eliminar(NomNomenclador $nomNomenclador)
    {
        $nomNomenclador->delete();
        $idNom = $nomNomenclador->idnomenclador;
        return $idNom;
    }

    function limpiarArreglo($array)
    {
        $retorno = null;
        if ($array != null) {
            $retorno[0] = $array[0];
        }
        for ($i = 1; $i < count($array); $i++) {
            $repetido = false;
            $elemento = $array[$i];
            for ($j = 0; $j < count($retorno) && !$repetido; $j++) {
                if ($elemento == $retorno[$j]) {
                    $repetido = true;
                }
            }
            if (!$repetido) {
                $retorno[] = $elemento;
            }
        }
        return $retorno;
    }

    /*
    * Para el servicio de los demás componentes
    */
    public function cargarNomenNivelSuperiorPorUsuario($tipoNom, $idUsuario)
    {
        $arrNomenUsuario = array();
        $aNomenUsuario[] = array();
        $arrayIdNomGrupoUsuario = NomNomenclador::dameIdNomPorUsuario(
            $idUsuario
        );
        if (count($arrayIdNomGrupoUsuario) != 0) {
            $i = 0;
            foreach ($arrayIdNomGrupoUsuario as $keyb /*=> $arr*/) {
                $idNomUsuario = $arrayIdNomGrupoUsuario[$keyb]['idnomenclador'];
                // Se crea el arreglo de Nomencladores de nivel superior por usuario
                $arrNomenUsuario
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperior(
                    $tipoNom,
                    $idNomUsuario
                );
                if (count($arrNomenUsuario) != 0) {
                    foreach ($arrNomenUsuario as $key /*=> $nom*/) {
                        if ($arrNomenUsuario[$key]['idnomenclador']
                            == $arrNomenUsuario[$key]['_parent']
                        ) {
                            $arrNomenUsuario[$key]['_parent'] = null;
                        }
                        if ($tipoNom == 2) {
                            $arrNomenUsuario[$key]['color']
                                = $arrNomenUsuario[$key]['NomCategactividad']['color'];
                        }
                        $arrNomenUsuario[$key]['superior'] = 1;
                    }
                }
                $i++;
            }
        }
        if (count($arrNomenUsuario) != 0) {
            $j = 0;
            foreach ($arrNomenUsuario as $key /*=> $array*/) {
                if ($arrNomenUsuario[$key][0]['caduca'] == 1
                    && $arrNomenUsuario[$key][0]['activo'] ==
                    1
                ) {
                    // Captura la fecha de inicio en la que se activa el nomenclador
                    $fechaInicio = $arrNomenUsuario[$key][0]['fdesde'];
                    $fechaInicio = explode(
                        '-', $fechaInicio
                    ); // $numFechaInicio = $fechaInicio[0].$fechaInicio[1].$fechaInicio[2];
                    $fecInicio = $fechaInicio[0] . '-' . $fechaInicio[1] . '-'
                        . $fechaInicio[2];
                    // Captura la fecha de fin en la que se desactiva el nomenclador
                    $fechaFin = $arrNomenUsuario[$key][0]['fhasta'];
                    $fechaFin = explode(
                        '-', $fechaFin
                    ); // $numFechaFin = $fechaFin[0].$fechaFin[1].$fechaFin[2];
                    $fecFin
                        =
                        $fechaFin[0] . '-' . $fechaFin[1] . '-' . $fechaFin[2];
                    // Captura la fecha actual del servidor
                    $fechaActual = date('d/m/Y');
                    $fechaActual = explode(
                        '/', $fechaActual
                    ); //$numFechaActual = $fechaActual[2].$fechaActual[1].$fechaActual[0];
                    $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                        . $fechaActual[0];
                    // Comparara rangos de fecha
                    if ($fecInicio <= $fecActual && $fecFin >= $fecActual) {
                        $aNomenUsuario[$j][0] = $arrNomenUsuario[$key][0];
                    }
                }
                if ($arrNomenUsuario[$key]['caduca'] == 0
                    && $arrNomenUsuario[$key]['activo'] ==
                    1
                ) {
                    $aNomenUsuario[$j] = $arrNomenUsuario[$key];
                }
                $j++;
            }
        }
        return $aNomenUsuario;
    }

    public function idNomGrupo($idUsuario)
    {
        $arrayIdNomGrupo = array();
        $arrayidusuarios[0] = $idUsuario;
        $arrayGrupoDeUsuario = DatGrupoUsuario::BuscarDatosPorIdUsuario(
            $arrayidusuarios
        );
        if (isset($arrayGrupoDeUsuario[0])) {
            foreach ($arrayGrupoDeUsuario as $key => $arr) {
                $idGrupoDeUsuario = $arr['idgrupo'];
                $arrayIdgruponom = NomNomenclador::dameIdNomPorGrupo(
                    $idGrupoDeUsuario
                );
                if (isset($arrayIdgruponom[0])) {
                    foreach ($arrayIdgruponom as $idgruponom) {
                        $arrayIdNomGrupo[] = $idgruponom['idnomenclador'];
                    }
                }
            }
            return $arrayIdNomGrupo;
        }
    }

    public function cargarNomenNivelSuperiorPorGrupo($tipoNom, $idUsuario)
    {
        $arrNomenGrupo[] = array();
        $aNomenGrupo = array();
        $aIdNomGrupo = NomNomencladorModel::idNomGrupo($idUsuario);
        $arrayIdNomGrupo = NomNomencladorModel::limpiarArreglo(
            $aIdNomGrupo
        );
        if (count($arrayIdNomGrupo) != 0) {
            // Recorre el arrgelo de id de nomencladores por grupo
            $i = 0;
            foreach ($arrayIdNomGrupo as /*$key => */
                     $idnomgrupo) {
                $idNomGrupoo = $idnomgrupo['idnomenclador'];
                // Si el nomenclador no existe en el arreglo Nomencladores de nivel superior
                //por usuario se crea el arreglo de Nomencladores de nivel superior por grupo
                $arrNomenGrupo[$i]
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperior(
                    $tipoNom,
                    $idNomGrupoo
                );
                if (count($arrNomenGrupo[$i]) != 0) {
                    foreach ($arrNomenGrupo as $key /*=> $a*/) {
                        if ($arrNomenGrupo[$key][0]['idnomenclador']
                            == $arrNomenGrupo[$key][0]['_parent']
                        ) {
                            $arrNomenGrupo[$key][0]['_parent'] = null;
                        }
                        if ($tipoNom == 2) {
                            $arrNomenGrupo[$key][0]['color']
                                = $arrNomenGrupo[$key][0]['NomCategactividad']['color'];
                        }
                        $arrNomenGrupo[$key][0]['superior'] = 1;
                    }
                }
                $i++;
            }
        }
        if (count($arrNomenGrupo) != 0) {
            $j = 0;
            foreach ($arrNomenGrupo as $key /*=> $array*/) {
                if ($arrNomenGrupo[$key][0]['caduca'] == 1
                    && $arrNomenGrupo[$key][0]['activo'] ==
                    1
                ) {
                    // Captura la fecha de inicio en la que se activa el nomenclador
                    $fechaInicio = $arrNomenGrupo[$key][0]['fdesde'];
                    $fechaInicio = explode(
                        '-', $fechaInicio
                    ); // $numFechaInicio = $fechaInicio[0].$fechaInicio[1].$fechaInicio[2];
                    $fecInicio = $fechaInicio[0] . '-' . $fechaInicio[1] . '-'
                        . $fechaInicio[2];
                    // Captura la fecha de fin en la que se desactiva el nomenclador
                    $fechaFin = $arrNomenGrupo[$key][0]['fhasta'];
                    $fechaFin = explode(
                        '-', $fechaFin
                    ); // $numFechaFin = $fechaFin[0].$fechaFin[1].$fechaFin[2];
                    $fecFin
                        =
                        $fechaFin[0] . '-' . $fechaFin[1] . '-' . $fechaFin[2];
                    // Captura la fecha actual del servidor
                    $fechaActual = date('d/m/Y');
                    $fechaActual = explode(
                        '/', $fechaActual
                    ); //$numFechaActual = $fechaActual[2].$fechaActual[1].$fechaActual[0];
                    $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                        . $fechaActual[0];
                    // Comparara rangos de fecha
                    if ($fecInicio <= $fecActual && $fecFin >= $fecActual) {
                        $aNomenGrupo[] = $arrNomenGrupo[$key][0];
                    }
                }
                if ($arrNomenGrupo[$key][0]['caduca'] == 0
                    && $arrNomenGrupo[$key][0]['activo'] ==
                    1
                ) {
                    $aNomenGrupo[] = $arrNomenGrupo[$key][0];
                }
                $j++;
            }
        }
        return $aNomenGrupo;
    }

    public function cargarNomenCreadoPorUsuario($tipoNom, $idUsuario)
    {
        $arrayNomencladores = array();
        $aNomencladores = array();
        $arrayNomencladores = NomNomenclador::GetTodosNomencladoresPorTipo(
            $tipoNom, $idUsuario
        );
        if (count($arrayNomencladores) != 0) {
            foreach ($arrayNomencladores as $key /*=> $nom*/) {
                if ($arrayNomencladores[$key]['idnomenclador']
                    == $arrayNomencladores[$key]['_parent']
                ) {
                    $arrayNomencladores[$key]['_parent'] = null;
                }
                if ($tipoNom == 2) {
                    $arrayNomencladores[$key]['color']
                        = $arrayNomencladores[$key]['NomCategactividad']['color'];
                }
                $arrayNomencladores[$key]['superior'] = 0;
            }
        }
        if (count($arrayNomencladores) != 0) {
            $j = 0;
            foreach ($arrayNomencladores as $key /*=> $array*/) {
                if ($arrayNomencladores[$key]['caduca'] == 1
                    && $arrayNomencladores[$key]['activo'] ==
                    1
                ) {
                    // Captura la fecha de inicio en la que se activa el nomenclador
                    $fechaInicio = $arrayNomencladores[$key]['fdesde'];
                    $fechaInicio = explode(
                        '-', $fechaInicio
                    ); // $numFechaInicio = $fechaInicio[0].$fechaInicio[1].$fechaInicio[2];
                    $fecInicio = $fechaInicio[0] . '-' . $fechaInicio[1] . '-'
                        . $fechaInicio[2];
                    // Captura la fecha de fin en la que se desactiva el nomenclador
                    $fechaFin = $arrayNomencladores[$key]['fhasta'];
                    $fechaFin = explode(
                        '-', $fechaFin
                    ); // $numFechaFin = $fechaFin[0].$fechaFin[1].$fechaFin[2];
                    $fecFin
                        =
                        $fechaFin[0] . '-' . $fechaFin[1] . '-' . $fechaFin[2];
                    // Captura la fecha actual del servidor
                    $fechaActual = date('d/m/Y');
                    $fechaActual = explode(
                        '/', $fechaActual
                    ); //$numFechaActual = $fechaActual[2].$fechaActual[1].$fechaActual[0];
                    $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                        . $fechaActual[0];
                    // Comparara rangos de fecha
                    if ($fecInicio <= $fecActual && $fecFin >= $fecActual) {
                        $aNomencladores[$j] = $arrayNomencladores[$key];
                    }
                }
                if ($arrayNomencladores[$key]['caduca'] == 0
                    && $arrayNomencladores[$key]['activo'] ==
                    1
                ) {
                    $aNomencladores[$j] = $arrayNomencladores[$key];
                }
                $j++;
            }
        }
        return $aNomencladores;
    }

    public function cargarNomenPublicoParaTodos($tipoNom, $publico)
    {
        $arrayNomencladores = array();
        $aNomencladores = array();
        $arrayNomencladores = NomNomenclador::GetNomenPublicoParaTodos(
            $tipoNom, $publico
        );
        if (count($arrayNomencladores) != 0) {
            foreach ($arrayNomencladores as $key /*=> $nom*/) {
                if ($arrayNomencladores[$key]['idnomenclador']
                    == $arrayNomencladores[$key]['_parent']
                ) {
                    $arrayNomencladores[$key]['_parent'] = null;
                }
                if ($tipoNom == 2) {
                    $arrayNomencladores[$key]['color']
                        = $arrayNomencladores[$key]['NomCategactividad']['color'];
                }
                $arrayNomencladores[$key]['superior'] = 1;
            }
        }
        if (count($arrayNomencladores) != 0) {
            $j = 0;
            foreach ($arrayNomencladores as $key /*=> $array*/) {
                if ($arrayNomencladores[$key]['caduca'] == 1
                    && $arrayNomencladores[$key]['activo'] ==
                    1
                ) {
                    // Captura la fecha de inicio en la que se activa el nomenclador
                    $fechaInicio = $arrayNomencladores[$key]['fdesde'];
                    $fechaInicio = explode(
                        '-', $fechaInicio
                    ); // $numFechaInicio = $fechaInicio[0].$fechaInicio[1].$fechaInicio[2];
                    $fecInicio = $fechaInicio[0] . '-' . $fechaInicio[1] . '-'
                        . $fechaInicio[2];
                    // Captura la fecha de fin en la que se desactiva el nomenclador
                    $fechaFin = $arrayNomencladores[$key]['fhasta'];
                    $fechaFin = explode(
                        '-', $fechaFin
                    ); // $numFechaFin = $fechaFin[0].$fechaFin[1].$fechaFin[2];
                    $fecFin
                        =
                        $fechaFin[0] . '-' . $fechaFin[1] . '-' . $fechaFin[2];
                    // Captura la fecha actual del servidor
                    $fechaActual = date('d/m/Y');
                    $fechaActual = explode(
                        '/', $fechaActual
                    ); //$numFechaActual = $fechaActual[2].$fechaActual[1].$fechaActual[0];
                    $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                        . $fechaActual[0];
                    // Comparara rangos de fecha
                    if ($fecInicio <= $fecActual && $fecFin >= $fecActual) {
                        $aNomencladores[$j] = $arrayNomencladores[$key];
                    }
                }
                if ($arrayNomencladores[$key]['caduca'] == 0
                    && $arrayNomencladores[$key]['activo'] ==
                    1
                ) {
                    $aNomencladores[$j] = $arrayNomencladores[$key];
                }
                $j++;
            }
        }
        return $aNomencladores;
    }

    public function cargarNomencladores($tipoNom, $idUsuarioLog)
    {
        $arrTodos = array();
        $aNomSuperiorU = array();
        $publico = 1;
        $aNomSuperiorPorUsuario = NomNomencladorModel::
        cargarNomenNivelSuperiorPorUsuarioNom($tipoNom, $idUsuarioLog);
        $aNomSuperiorPorGrupo = NomNomencladorModel::
        cargarNomenNivelSuperiorPorGrupoNom($tipoNom, $idUsuarioLog);
        $aNomPublicoParaTodos
            = NomNomencladorModel::cargarNomenPublicoParaTodosNom(
            $tipoNom,
            $publico
        );
        $aNomCreadoPorUsuario
            = NomNomencladorModel::cargarNomenCreadoPorUsuarioNom(
            $tipoNom,
            $idUsuarioLog, $filters = array()
        );
        if (count($aNomSuperiorPorUsuario) != 0) {
            foreach ($aNomSuperiorPorUsuario as $k /*=> $superiorU*/) {
                if ($aNomSuperiorPorUsuario[$k][0] != null) {
                    $aNomSuperiorU[] = $aNomSuperiorPorUsuario[$k][0];
                }
            }
        }
        if (count($aNomSuperiorPorGrupo) != 0) {
            $band = 0;
            foreach ($aNomSuperiorPorGrupo as $key /*=> $a*/) {
                if (count($aNomSuperiorU) != 0) {
                    foreach ($aNomSuperiorU as $keyb => $b) {
                        if ($aNomSuperiorPorGrupo[$key][0]['idnomenclador']
                            == $aNomSuperiorU[$key]['idnomenclador']
                        ) {
                            $band = 1;
                            break;
                        }
                    }
                    if ($band == 0) {
                        if ($aNomSuperiorPorGrupo[$key][0] != null) {
                            $aNomSuperiorU[] = $aNomSuperiorPorGrupo[$key][0];
                        }
                    }
                    $band = 0;
                } else {
                    if (count($aNomSuperiorPorGrupo[$key][0]) != 0) {
                        $aNomSuperiorU[] = $aNomSuperiorPorGrupo[$key][0];
                    }
                }
            }
        }
        $arrTodos = array_merge(
            $aNomSuperiorU, $aNomPublicoParaTodos, $aNomCreadoPorUsuario
        );
        foreach ($arrTodos as $key => $arrNomen) {
            $activo = $arrTodos[$key]['activo'];
            $idNomen = $arrTodos[$key]['idnom'];
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaInicio = $arrTodos[$key]['fdesde'];
            if ($fechaInicio != null) {
                $fechaInicio = explode('/', $fechaInicio);
                $fecInicio
                    = $fechaInicio[2] . $fechaInicio[1] . $fechaInicio[0];
                // Captura la fecha actual del servidor
                $fechaActual = date('d/m/Y');
                $fechaActual = explode('/', $fechaActual);
                $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                    . $fechaActual[0];
                // Compara rangos de fecha
                if ($fecInicio == $fecActual) {
                    $activo = 1;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
        // Captura la fecha actual del servidor
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
        foreach ($arrTodos as $key => $arrNomen) {
            $activo = $arrTodos[$key]['activo'];
            $idNomen = $arrTodos[$key]['idnomenclador'];
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaFin = $arrTodos[$key]['fhasta'];
            if ($fechaFin != null) {
                $fechaFin = explode('/', $fechaFin);
                $fecFin = $fechaFin[2] . $fechaFin[1] . $fechaFin[0];
                // Comparara rangos de fecha
                if ($fecFin < $fecActual) {
                    $activo = 0;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
        if (isset($arrTodos[0])) {
            $contador = 0;
            foreach ($arrTodos as $nom) {
                if ($nom['activo'] == 1) {
                    $arrTodosfinal[$contador] = $nom;
                    $contador++;
                }
            }
        }
        return $arrTodosfinal;
    }


    public function activarNomenclador($arrayNomen)
    {
        foreach ($arrayNomen as $key /*=> $arrNomen*/) {
            $activo = $arrayNomen[$key]['activo'];
            $idNomen = $arrayNomen[$key]['idnom'];
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaInicio = $arrayNomen[$key]['fdesde'];
            if ($fechaInicio != null) {
                $fechaInicio = explode('/', $fechaInicio);
                $fecInicio
                    = $fechaInicio[2] . $fechaInicio[1] . $fechaInicio[0];
                // Captura la fecha actual del servidor
                $fechaActual = date('d/m/Y');
                $fechaActual = explode('/', $fechaActual);
                $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                    . $fechaActual[0];
                // Compara rangos de fecha
                if ($fecInicio == $fecActual) {
                    $activo = 1;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
    }

    public function desactivarNomenclador($arrayNomen)
    {
        // Captura la fecha actual del servidor
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
        foreach ($arrayNomen as $key /*=> $arrNomen*/) {
            $activo = $arrayNomen[$key]['activo'];
            $idNomen = $arrayNomen[$key]['idnomenclador'];
            // Captura la fecha de inicio en la que se activa el nomenclador
            $fechaFin = $arrayNomen[$key]['fhasta'];
            if ($fechaFin != null) {
                $fechaFin = explode('/', $fechaFin);
                $fecFin = $fechaFin[2] . $fechaFin[1] . $fechaFin[0];
                // Comparara rangos de fecha
                if ($fecFin < $fecActual) {
                    $activo = 0;
                    NomNomenclador::cambiarEstado($idNomen, $activo);
                }
            }
        }
    }

    /*
    * Para usar en nomencladores
    */
    public function cargarNomenNivelSuperiorPorUsuarioNom($tipoNom, $idUsuario)
    {
        $arraynom = array();
        $arrayIdNomGrupoUsuario = NomNomenclador::dameIdNomPorUsuario(
            $idUsuario
        );
        if (isset($arrayIdNomGrupoUsuario[0]['idnomenclador'])) {
            $i = 0;
            foreach ($arrayIdNomGrupoUsuario as /* $key =>*/
                     $nomgrupousuario) {
                $idnomenclador = $nomgrupousuario['idnomenclador'];
                $objnom = Doctrine::getTable('NomNomenclador')->find(
                    $idnomenclador
                );
                if ($objnom->tiponomenclador == $tipoNom) {
                    // Se crea el arreglo de Nomencladores de nivel superior por usuario
                    $arraynomencladores = NomNomenclador::
                    GetTodosNomencladoresPorTipoNivelSuperiorNom(
                        $tipoNom, $idnomenclador
                    );
                    if (isset($arraynomencladores[0]['idnomenclador'])) {
                        if ($arraynomencladores[0]['idnomenclador']
                            == $arraynomencladores[0]['_parent']
                        ) {
                            $arraynomencladores[0]['_parent'] = null;
                        }
                        if ($tipoNom == 2) {
                            $arraynomencladores[0]['color']
                                = $arraynomencladores[0]['NomCategactividad']['color'];
                        }
                        $arraynomencladores[0]['superior'] = 1;
                    }
                    $arraynom[] = $arraynomencladores[0];
                    $i++;
                }
            }
        }
        return $arraynom;
    }

    public function cargarNomenNivelSuperiorPorGrupoNom($tipoNom, $idUsuario)
    {
        $aIdNomGrupo = NomNomencladorModel::idNomGrupo($idUsuario);
        if (isset($aIdNomGrupo[0])) {
            // Recorre el arrgelo de id de nomencladores por grupo
            $i = 0;
            foreach ($aIdNomGrupo as /* $key =>*/
                     $idnomgrupo) {
                //$idNomGrupo = $arrayIdNomGrupo[$key]['idnomenclador'];
                // Si el nomenclador no existe en el arreglo Nomencladores de nivel superior
                //por usuario se crea el arreglo de Nomencladores de nivel superior por grupo
                $arrnomgrupos
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperiorNom(
                    $tipoNom,
                    $idnomgrupo
                );
                if (isset($arrnomgrupos[0]['idnomenclador'])) {
                    if ($arrnomgrupos[0]['idnomenclador']
                        == $arrnomgrupos[0]['_parent']
                    ) {
                        $arrnomgrupos[0]['_parent'] = null;
                    }
                    if ($tipoNom == 2) {
                        $arrnomgrupos[0]['color']
                            = $arrnomgrupos[0]['NomCategactividad']['color'];
                    }
                    $arrnomgrupos[0]['superior'] = 1;
                }
                $arraynom[] = $arrnomgrupos[0];
                $i++;
            }
        }
        return $arraynom;
    }

    public function cargarNomenCreadoPorUsuarioNom(
        $tipoNom, $idUsuario, $filters
    )
    {
        $arrayNomencladores = array();
        $arrayNomencladores = NomNomenclador::GetTodosNomencladoresPorTipoNom(
            $tipoNom,
            $idUsuario, $filters
        );
        if (isset($arrayNomencladores[0]['idnomenclador'])) {
            foreach ($arrayNomencladores as $key /*=> $nom*/) {
                if ($arrayNomencladores[$key]['idnomenclador']
                    == $arrayNomencladores[$key]['_parent']
                ) {
                    $arrayNomencladores[$key]['_parent'] = null;
                }
                if ($tipoNom == 2) {
                    $arrayNomencladores[$key]['color']
                        = $arrayNomencladores[$key]['NomCategactividad']['color'];
                }
                $arrayNomencladores[$key]['superior'] = 0;
            }
        }
        return $arrayNomencladores;
    }

    public function cargarNomenPublicoParaTodosNom($tipoNom, $publico)
    {
        $arrayNomencladores = array();
        $arrayNomencladores = NomNomenclador::GetNomenPublicoParaTodosNom(
            $tipoNom, $publico
        );
        if (count($arrayNomencladores) != 0) {
            foreach ($arrayNomencladores as $key /*=> $nom*/) {
                if ($arrayNomencladores[$key]['idnomenclador']
                    == $arrayNomencladores[$key]['_parent']
                ) {
                    $arrayNomencladores[$key]['_parent'] = null;
                }
                if ($tipoNom == 2) {
                    $arrayNomencladores[$key]['color']
                        = $arrayNomencladores[$key]['NomCategactividad']['color'];
                }
                $arrayNomencladores[$key]['superior'] = 1;
            }
        }
        return $arrayNomencladores;
    }


    /*
    * Para usar en nomemcladores
    */
    public function cargarNomencladoresNom($tipoNom, $idUsuarioLog)
    {
        $arrTodos = array();
        //$aNomSuperiorU = array();       
        $aNomSuperiorPorUsuario = NomNomencladorModel::
        cargarNomenNivelSuperiorPorUsuarioNom($tipoNom, $idUsuarioLog);
        $aNomSuperiorPorGrupo = NomNomencladorModel::
        cargarNomenNivelSuperiorPorGrupoNom($tipoNom, $idUsuarioLog);
        $aNomCreadoPorUsuario
            = NomNomencladorModel::cargarNomenCreadoPorUsuarioNom(
            $tipoNom,
            $idUsuarioLog
        );
        /*if ( count ( $aNomSuperiorPorUsuario ) != 0 ) {
        foreach ( $aNomSuperiorPorUsuario as $k=>$superiorU ) {
        if ( $aNomSuperiorPorUsuario[$k][0] != null) {
        $aNomSuperiorU[] = $aNomSuperiorPorUsuario[$k][0];
        }
        }
        }       
        if ( count( $aNomSuperiorPorGrupo ) != 0 ) {            
        $band = 0;
        foreach ( $aNomSuperiorPorGrupo as $key=>$a ) {
        if ( count ( $aNomSuperiorU ) != 0 ) {
        foreach ( $aNomSuperiorU as $key1=>$b ) {
        if( $aNomSuperiorPorGrupo[$key][0]['idnomenclador'] == $aNomSuperiorU[$key]['idnomenclador'] ) {
        $band = 1;
        break;
        }
        }
        if ( $band == 0 ) {
        if ( $aNomSuperiorPorGrupo[$key][0] != null ) {
        $aNomSuperiorU[] = $aNomSuperiorPorGrupo[$key][0];
        }
        }
        $band = 0;
        }
        else {
        if ( count ( $aNomSuperiorPorGrupo[$key][0] ) != 0 )
        $aNomSuperiorU[] = $aNomSuperiorPorGrupo[$key][0];
        }                
        }
        }*/
        //$arrTodos = array_merge( $aNomSuperiorU, $aNomPublicoParaTodos, $aNomCreadoPorUsuario);
        $arrTodos = array_merge(
            $aNomSuperiorPorUsuario, $aNomSuperiorPorGrupo,
            $aNomCreadoPorUsuario
        );
        return $arrTodos;
    }

    public function ObtenerNomencladoresCalendario(
        $idusuariosession, $tiponomenclador
    )
    {
        $cont = 0;
        $fechainicio = $fechafin = date('j/n/Y');
        $arraynomencladoresusuario = NomNomenclador::
        ObtenerNomencladoresCalendarioUsuario(
            $idusuariosession, $tiponomenclador, $fechainicio,
            $fechafin
        );
        $arraysaliente = array();
        $arraynomencladoresusuario = $this->ObtenerArregloUnico(
            $arraynomencladoresusuario,
            $arraysaliente
        );
        $arrayidusuarios[0] = $idusuariosession;
        $arraygrupos = DatGrupoUsuario::BuscarDatosPorIdUsuario(
            $arrayidusuarios
        ); //DatGrupoDatUsuario::DameGruposDadoIdUsuario ( $idusuariosession );
        if ($arraygrupos) {
            foreach ($arraygrupos as $grupo) {
                $idgrupo = $grupo['idgrupo'];
                $arraynomen[]
                    = NomNomenclador::ObtenerNomencladoresCalendarioGrupo(
                    $idgrupo, $tiponomenclador,
                    $fechainicio, $fechafin
                );
            }
            if (!$arraynomen) {
                $cont = count($arraynomencladoresusuario);
                foreach ($arraynomen as $nom) {
                    $arraynomencladoresusuario[$cont] = $nom['idnomenclador'];
                    $cont++;
                }
                $arraysaliente = array();
                $arraynomencladoresusuario = $this->ObtenerArregloUnico(
                    $arraynomencladoresusuario,
                    $arraysaliente
                );
            }
        }
        if ($arraynomencladoresusuario) {
            foreach ($arraynomencladoresusuario as $key => $nom) {
                $objnom = Doctrine::getTable('NomNomenclador')->find(
                    $nom['idnomenclador']
                );
                $nomencladores[$key]['id'] = $objnom->idnomenclador;
                $nomencladores[$key]['text'] = $objnom->dennomenclador;
                $nomencladores[$key]['idnomenclador'] = $objnom->idnomenclador;
                $nomencladores[$key]['checked'] = false;
                $nomencladores[$key]['draggable'] = false;
                $nomencladores[$key]['leaf'] = true;
                $nomencladores[$key]['iconCls'] = 'nomencladores';
            }
        }
        return $nomencladores;
    }

    public function ObtenerArregloUnico($arrayidentrante, $arrayidsaliente)
    {
        $cont = 0;
        if (isset($arrayidentrante[0])) {
            foreach ($arrayidentrante as $identrante) {
                $identra = $identrante['idnomenclador'];
                if (isset($arrayidsaliente[0])) {
                    $existe = 0;
                    $cont = count($arrayidsaliente);
                    foreach ($arrayidsaliente as $idsaliente) {
                        $idsale = $idsaliente['idnomenclador'];
                        if ($identra == $idsale) {
                            $existe = 1;
                        }
                    }
                    if ($existe == 0) {
                        $arrayidsaliente[$cont]['idnomenclador'] = $identra;
                        $cont++;
                    }
                }
                if (count($arrayidsaliente) == 0) {
                    $arrayidsaliente[$cont]['idnomenclador'] = $identra;
                    $cont++;
                }
            }
        }
        return $arrayidsaliente;
    }


    public function CambiarEstado($node, $estado)
    {
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        /*$fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];*/
        if ($estado == 1) {
            $fechainicio = date('Y-m-d');
            $fechafin = null;
        }
        if ($estado == 0) {
            $fechaActualSeg = mktime(
                0, 0, 0, $fechaActual[1], $fechaActual[0], $fechaActual[2]
            );
            $cantSegPorDia = (60 * 60 * 24);
            $fechaAyer = $fechaActualSeg - $cantSegPorDia;
            $fecAyer = date('Y-m-d', $fechaAyer);
            $fechainicio = $fecAyer;
            $fechafin = $fecAyer;
        }
        $familia = NomNomenclador::buscarFamilia($node);
        if ($familia) {
            foreach ($familia as $key/* => $h*/) {
                $idNom = $familia[$key]['idnomenclador'];
                NomNomenclador::cambiarFechaInicio($idNom, $fechainicio);
                NomNomenclador::cambiarCaduca($idNom);
                $objnom = Doctrine::getTable('NomNomenclador')->find($idNom);
                if ($objnom->idnomenclador) {
                    $objnom->fechafin = $fechafin;
                    $objnom->save();
                }
                // NomNomenclador::cambiarFechaFin ( $idNom, $fechafin );
                NomNomenclador::cambiarEstado($idNom, $estado);
            }
        } else {
            NomNomenclador::cambiarFechaInicio($node, $fechainicio);
            NomNomenclador::cambiarCaduca($node);
            $objnom = Doctrine::getTable('NomNomenclador')->find($idNom);
            if ($objnom->idnomenclador) {
                $objnom->fechafin = $fechafin;
                $objnom->save();
            }
            NomNomenclador::cambiarEstado($node, $estado);
        }
        $mensaje = 1;
        return $mensaje;
    }

  public function listarNomencladores($tipoNom, $idUsuarioLog, $filters, $idpadre, $parametros)
  {
    $cadenaSELECT = "";
    $cadenaJOIN = "";
    $cadenaWHERE = "";
    $selectTipohoja = "";
    $selectTipoinvolucrado = "";
    $joinTipohoja = "";
    $joinTipoInvolucrado = "";
    $joinCatActividad = "";
    $innerDeGrupo = "";
    $whereGrupo = "";
    $selectidnom = ($parametros->categoria == false)
      ? "nom.idnomenclador as idnom" : "nom.idnomenclador";
    $devolverPadre = ($idpadre == 0) ? "null as _parent"
      : "nom.idpadre as _parent";
    $aIdNomGrupo = DatGrupoUsuario::ObtenerArrayIdGruposPorIdUsuario(
      $idUsuarioLog
    );
    if (isset($aIdNomGrupo[0])) {
      $arrayGrupoUser = implode(',', $aIdNomGrupo);
      $innerDeGrupo
                      = " LEFT JOIN mod_objetivos.dat_grupo_nom_nomenclador dgnom
                    ON (nom.idnomenclador = dgnom.idnomenclador
                    AND dgnom.idgrupo IN ({$arrayGrupoUser})) ";
      $whereGrupo = " OR dgnom.idgrupo IN ({$arrayGrupoUser}) ";
    }
    $cadenaWHERE
      = " WHERE ((nom.idusuariocrea = {$idUsuarioLog} 
                OR dunom.idusuario={$idUsuarioLog}) {$whereGrupo} ) 
                AND nom.tiponomenclador={$tipoNom}  ";
    if ($tipoNom == 2) {
      $joinCatActividad
                      = " INNER JOIN mod_objetivos.nom_categactividad ca 
                    ON ca.idnomenclador=nom.idnomenclador ";
      $selectTipohoja = " ca.color, ";
    } else if ($tipoNom == 12) {
      $joinTipoDia
                      = " INNER JOIN mod_objetivos.nom_tipodia td
                    ON td.idtipodia=nom.idnomenclador ";
      $selectTipohoja = " td.color, 
            --td.incidencia,
            ";
    }
    else {
      if ($tipoNom == 8) {
        $joinTipohoja
                        = " INNER JOIN mod_objetivos.nom_tipohoja th 
                        ON th.idtipohoja = nom.idnomenclador ";
        $selectTipohoja = " th.alto, th.ancho,";
      } else {
        if ($tipoNom == 9) {
          $joinTipoInvolucrado
                                 = " INNER JOIN mod_objetivos.nom_tipoinvolucrado ti 
                            ON ti.idtipoinvolucrado = nom.idnomenclador ";
          $selectTipoinvolucrado = " ti.inicial, ti.incidencia,";
        }
      }
    }
    if ($idpadre) {
      $cadenaWHERE .= " AND nom.idpadre = {$idpadre} 
                AND nom.idnomenclador <> nom.idpadre";
    } else {
      if ($parametros->categoria == false) {
        $cadenaWHERE .= " AND nom.idnomenclador = nom.idpadre";
      } else {
        $cadenaWHERE .= " AND nom.activo = 1";
      }
    }
    if (is_array($filters)) {
      foreach ($filters as $campo) {
        if ($campo['field'] == 'denom') {
          $denom = $campo['data']['value'];
          $cadenaWHERE .= " AND nom.dennomenclador ILIKE '%{$denom}%'";
        } else {
          if ($campo['field'] == 'pub') {
            if ($campo['data']['value'] == 'Si') {
              $publico = 1;
            } else {
              $publico = 0;
            }
            $cadenaWHERE .= " AND nom.publico = {$publico}";
          } else {
            if ($campo['field'] == 'activo') {
              if ($campo['data']['value'] == 'Si') {
                $act = 1;
              } else {
                $act = 0;
              }
              $cadenaWHERE .= " AND nom.activo = {$act}";
            } else {
              if ($campo['field'] == 'nombreautor') {
                //encontrar el servivio que busca los usuarios por denominacion
                $cadenaWHERE .= " ";
              } else {
                if ($campo['field'] == 'fdesde') {
                  $arrayfechainicio = explode(
                    ' ', $campo['data']['value']
                  );
                  if ($campo['data']['comparison'] == 'lt') {
                    $cadenaWHERE
                      .= " AND nom.fechainicio < '"
                      . $arrayfechainicio[0] . "' ";
                  } else {
                    if ($campo['data']['comparison']
                      == 'gt'
                    ) {
                      $cadenaWHERE
                        .= " AND nom.fechainicio > '"
                        . $arrayfechainicio[0] . "' ";
                    } else {
                      if ($campo['data']['comparison'] == 'eq') {
                        $cadenaWHERE .= " AND nom.fechainicio = '"
                          . $arrayfechainicio[0] . "' ";
                      }
                    }
                  }
                } else {
                  if ($campo['field'] == 'fhasta') {
                    $arrayfechainicio = explode(' ', $campo['data']['value']);
                    if ($campo['data']['comparison'] == 'lt') {
                      $cadenaWHERE
                        .= " AND nom.fechafin < '"
                        . $arrayfechainicio[0] . "' ";
                    } else {
                      if ($campo['data']['comparison'] == 'gt') {
                        $cadenaWHERE
                          .= " AND nom.fechafin > '"
                          . $arrayfechainicio[0]
                          . "' ";
                      } else {
                        if ($campo['data']['comparison']
                          == 'eq'
                        ) {
                          $cadenaWHERE
                            .=
                            " AND nom.fechafin = '"
                            . $arrayfechainicio[0]
                            . "' ";
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    $fechaactual = "'" . date('Y-m-d') . "'";
    $cadenaSELECT = " SELECT DISTINCT CASE
                        WHEN nom.idnomenclador in (  Select idnomenclador
                        from mod_objetivos.dat_elementos_nom_nomenclador
                        INNER JOIN mod_objetivos.dat_actividades
                        ON(dat_actividades.idactividad = dat_elementos_nom_nomenclador.idelemento )
                        WHERE dat_elementos_nom_nomenclador.tiponomenclador = 5
                        AND dat_actividades.fechafin >= {$fechaactual})
                        THEN 1 else 0
                        end as enuso ,{$selectidnom}, nom.dennomenclador as denom,
                                nom.fechainicio as fdesde, 
                                nom.fechafin as fhasta, {$selectTipohoja}{$selectTipoinvolucrado}
                                nom.activo, nom.caduca, 
                                nom.descnomenclador as descrip, 
                                nom.publico as pub,
                                nom.idpadre,
                                nom.publicoxtodos as pubtodos, 
                                (( nom.ordender - nom.ordenizq) = 1) as _is_leaf,
                                {$devolverPadre}, nom.idusuariocrea as idautor ";
    $cadenaJOIN = " FROM mod_objetivos.nom_nomenclador nom
                      {$joinCatActividad}
                      {$joinTipoDia}
                      {$joinTipohoja} 
                      {$joinTipoInvolucrado}
                      LEFT JOIN mod_objetivos.dat_usuario_nom_nomenclador dunom 
                      ON (nom.idnomenclador = dunom.idnomenclador 
                      AND dunom.idusuario={$idUsuarioLog})
                      {$innerDeGrupo}";
    $cadenaQuery = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
    $cadenaQuery .= " ORDER BY denom ASC ";
    $sqlTotal = $cadenaQuery;
    if ($parametros->categoria == false ) {
      $cadenaQuery .= " OFFSET {$parametros->start} LIMIT {$parametros->limit} ";
    }
    //print_r($cadenaQuery);die;

    $conn = Doctrine_Manager::connection();
    $result->data = $conn->execute($cadenaQuery)->fetchAll(PDO::FETCH_ASSOC);
    $result->total = count($conn->execute($sqlTotal)->fetchAll(PDO::FETCH_ASSOC));
    return $result;
  }


} // fin de la clase