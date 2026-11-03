<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarnomencladoresModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function AdicionarNomenclador($parametros)
    {
        $procede = 1;
        if ($parametros->idpadre) {
            //se verifica si existe el padre
            $objnompadre = Doctrine::getTable('NomNomenclador')->find(
                $parametros->idpadre
            );
            if (!isset($objnompadre->idnomenclador)) {
                $respuesta = 7;
                $procede = 0;
            }
        }
        if ($procede == 1) {
        //se verifica que no exista un nomenclador del mismo tipo, 
        //el mismo nombre y el mismo autor
            $objexistenomenclador
                = NomNomenclador::ObtenerNomencladorPorNombreTipoAuotr(
                $parametros->dennomenclador, $parametros->tiponomenclador,
                $parametros->idusuariocrea
            );
            if (isset($objexistenomenclador[0]['idnomenclador'])) {
                $respuesta = 8;
            } else {
                $objnomenclador = new NomNomenclador();
                $objnomenclador->dennomenclador = $parametros->dennomenclador;
                $objnomenclador->descnomenclador = $parametros->descnomenclador;
                $objnomenclador->fechainicio = null;
                if ($parametros->fechainicio != null) {
                    $objnomenclador->fechainicio = $parametros->fechainicio;
                }
                $objnomenclador->fechafin = null;
                if ($parametros->fechafin != null) {
                    $objnomenclador->fechafin = $parametros->fechafin;
                }
                if ($parametros->idpadre != null) {
                    $objnomenclador->idpadre = $parametros->idpadre;
                }
                $objnomenclador->activo = $this->adicionarCampoActivo(
                    $parametros->fechainicio, $parametros->fechafin
                );
                $objnomenclador->publico = $parametros->publico;
                $objnomenclador->publicoxtodos = $parametros->publicoxtodos;
                $objnomenclador->caduca = $parametros->caduca;
                $objnomenclador->tiponomenclador = $parametros->tiponomenclador;
                $objnomenclador->idusuariocrea = $parametros->idusuariocrea;
                $objnomenclador->save();
                //adiciono en algunas de sus especializaciones si es necesario
                switch ($objnomenclador->tiponomenclador) {
                    case 2:
                        $this->AdicionarCategoriaActividad(
                            $objnomenclador->idnomenclador, $parametros->color
                        );
                        break;
                    case 8:
                        $this->AdicionarTipoHoja(
                            $objnomenclador->idnomenclador, $parametros->ancho,
                            $parametros->alto
                        );
                        break;
                    case 9:
                        $this->AdicionarTipoInvolucrado(
                            $objnomenclador->idnomenclador,
                            $parametros->inicial, $parametros->incidencia
                        );
                        break;
                    case 12:
                        $this->AdicionarTipoDia(
                            $objnomenclador->idnomenclador, $parametros->color,
                            $parametros->incidencia
                        );
                        break;
                }
                //relaciono el nomenclador con los usuarios o grupos para los cuales es publico
                if ($parametros->publico) {
                    $this->PublicarNomenclador(
                        $objnomenclador->idnomenclador,
                        $parametros->arraypublicidadinsertar, array()
                    );
                }
                $respuesta = 1;
            }
        }
        return $respuesta;
    }

    public function ModificarNomenclador($parametros)
    {
        $procede = 1;
        $objnomenclador = Doctrine::getTable('NomNomenclador')->find(
            $parametros->idnomenclador
        );
        if (!isset($objnomenclador->idnomenclador)) {
            $respuesta = 3;
            $procede = 0;
        }
        if ($procede == 1) {
            $exist = 0;
            $objexistenomenclador
                = NomNomenclador::ObtenerNomencladorPorNombreTipoAuotr(
                $parametros->dennomenclador, $parametros->tiponomenclador,
                $parametros->idusuariocrea
            );
            if (isset($objexistenomenclador[0])) {
                foreach ($objexistenomenclador as $nom) {
                    if ($nom['idnomenclador'] != $objnomenclador->idnomenclador
                    ) {
                        $exist = 1;
                        $respuesta = 8;
                    }
                }
            }
            if ($exist == 0) {
                $objnomenclador->dennomenclador = $parametros->dennomenclador;
                $objnomenclador->descnomenclador = $parametros->descnomenclador;
                $objnomenclador->fechainicio = null;
                if ($parametros->fechainicio != null) {
                    $objnomenclador->fechainicio = $parametros->fechainicio;
                }
                $objnomenclador->fechafin = null;
                if ($parametros->fechafin != null) {
                    $objnomenclador->fechafin = $parametros->fechafin;
                }
                $objnomenclador->activo = $this->adicionarCampoActivo(
                    $parametros->fechainicio, $parametros->fechafin
                );
                $objnomenclador->publico = $parametros->publico;
                $objnomenclador->publicoxtodos = $parametros->publicoxtodos;
                $objnomenclador->caduca = $parametros->caduca;
                $objnomenclador->save();
                //modifico en algunas de sus especializaciones si es necesario
                switch ($objnomenclador->tiponomenclador) {
                    case 2:
                        $this->ModificarCategoriaActividad(
                            $objnomenclador->idnomenclador, $parametros->color
                        );
                        break;
                    case 8:
                        $this->ModificarTipoHoja(
                            $objnomenclador->idnomenclador, $parametros->ancho,
                            $parametros->alto
                        );
                        break;
                    case 9:
                        $this->ModificarTipoInvolucrado(
                            $objnomenclador->idnomenclador,
                            $parametros->inicial, $parametros->incidencia
                        );
                        break;
                    case 12:
                        $this->ModificarTipoDia(
                            $objnomenclador->idnomenclador, $parametros->color,
                            $parametros->incidencia
                        );
                        break;

                }
                //relaciono el nomenclador con los usuarios o grupos para los cuales es publico
                //if ($parametros->publico) {
                $this->PublicarNomenclador(
                    $objnomenclador->idnomenclador,
                    $parametros->arraypublicidadinsertar,
                    $parametros->arraypublicidadeliminar
                );
                //}
                $respuesta = 1;
            }
        }
        return $respuesta;
    }

    public function AdicionarCategoriaActividad($idnomenclador, $color)
    {
        $objCatActividad = new NomCategactividad();
        if ($color == null) {
            $color = 'FFFFFF';
        }
        $objCatActividad->color = $color;
        $objCatActividad->idnomenclador = $idnomenclador;
        $objCatActividad->save();
    }

    public function ModificarCategoriaActividad($idnomenclador, $color)
    {
        if ($color == null) {
            $color = 'FFFFFF';
        }
        $objCatActividad = Doctrine::getTable('NomCategactividad')->find(
            $idnomenclador
        );
        $objCatActividad->color = $color;
        $objCatActividad->save();
    }

    public function AdicionarTipoDia($idnomenclador, $color, $incidencia)
    {
        $objTipoDia = new NomTipoDia();
        if ($color == null) {
            $color = 'FFFFFF';
        }
        $objTipoDia->color = $color;
        $objTipoDia->incidencia = $incidencia;
        $objTipoDia->idtipodia = $idnomenclador;
        $objTipoDia->save();
    }

    public function ModificarTipoDia($idnomenclador, $color, $incidencia)
    {
        if ($color == null) {
            $color = 'FFFFFF';
        }
        $objTipoDia = Doctrine::getTable('NomTipoDia')->find(
            $idnomenclador
        );
        $objTipoDia->color = $color;
        $objTipoDia->incidencia = $incidencia;
        $objTipoDia->save();
    }

    public function AdicionarTipoHoja($idnomenclador, $ancho, $alto)
    {
        $objtipohoja = new NomTipohoja();
        $objtipohoja->ancho = $ancho;
        $objtipohoja->alto = $alto;
        $objtipohoja->idtipohoja = $idnomenclador;
        $objtipohoja->save();
    }

    public function AdicionarTipoInvolucrado(
        $idnomenclador, $inicial, $incidencia
    ) 
    {
        if ($inicial == 1) {
            NomTipoinvolucrado::ActualizarInicial();
        }
        $objtipoinvolucrado = new NomTipoinvolucrado();
        $objtipoinvolucrado->inicial = $inicial;
        $objtipoinvolucrado->incidencia = $incidencia;
        $objtipoinvolucrado->idtipoinvolucrado = $idnomenclador;
        $objtipoinvolucrado->save();
    }

    public function ModificarTipoHoja($idnomenclador, $ancho, $alto)
    {
        $objtipohoja = Doctrine::getTable('NomTipohoja')->find($idnomenclador);
        $objtipohoja->ancho = $ancho;
        $objtipohoja->alto = $alto;
        $objtipohoja->save();
    }

    public function ModificarTipoInvolucrado(
        $idnomenclador, $inicial, $incidencia
    )
    {
        if ($inicial == 1) {
            NomTipoinvolucrado::ActualizarInicial();
        }
        $objtipoinvolucrado = Doctrine::getTable('NomTipoinvolucrado')->find(
            $idnomenclador
        );
        $objtipoinvolucrado->inicial = $inicial;
        $objtipoinvolucrado->incidencia = $incidencia;
        $objtipoinvolucrado->idtipoinvolucrado = $idnomenclador;
        $objtipoinvolucrado->save();
    }

    public function PublicarNomenclador(
        $idnomenclador, $arraypublicidadinsertar, $arraypublicidadeliminar
    )
    {
        if (isset($arraypublicidadeliminar[0])) {
            foreach ($arraypublicidadeliminar as $key => $grupousuarioe) {
                if ($grupousuarioe->tipo == 0) {
                    $idgrupo = $grupousuarioe->idgrupo;
                    $existegruponom = Doctrine::getTable(
                        'DatGrupoNomNomenclador'
                    )->findByDql(
                        "idgrupo = $idgrupo AND idnomenclador = $idnomenclador"
                    );
                    if (isset($existegruponom[0]->idgrupo)
                        || $existegruponom[0]->idgrupo != ''
                    ) {
                        $existegruponom[0]->delete();
                    }
                } else {
                    if ($grupousuarioe->tipo == 2) {
                        $existeestructuranom = Doctrine::getTable(
                            'DatEstructuraNomenclador'
                        )->findByDql(
                            "idestructura = $grupousuarioe->id AND idnomenclador = $idnomenclador"
                        );
                        if (isset($existeestructuranom[0]->idnomenclador)
                            || $existeestructuranom[0]->idnomenclador != ''
                        ) {
                            $existeestructuranom[0]->delete();
                        }
                    } else {
                        $idusuario = $grupousuarioe->idusuario;
                        $existeusuarionom = Doctrine::getTable(
                            'DatUsuarioNomNomenclador'
                        )->findByDql(
                            "idusuario = $idusuario AND idnomenclador = $idnomenclador"
                        );
                        if (isset($existeusuarionom[0]->idnomenclador)
                            || $existeusuarionom[0]->idnomenclador != ''
                        ) {
                            $existeusuarionom[0]->delete();
                        }
                    }
                }
            }
        }
        if (isset($arraypublicidadinsertar[0])) {
            foreach ($arraypublicidadinsertar as $key => $grupousuario) {
                if ($grupousuario->id != 'nodo3' && $grupousuario->id != 'nodo2'
                    && $grupousuario->id != 'nodo5'
                ) {
                    if ($grupousuario->tipo == 0) {
                        $idgrupo = $grupousuario->idgrupo;
                        $existegruponom = Doctrine::getTable(
                            'DatGrupoNomNomenclador'
                        )->findByDql(
                            "idgrupo = $idgrupo AND idnomenclador = $idnomenclador"
                        );
                        if (!isset($existegruponom[0]->idgrupo)
                            || $existegruponom[0]->idgrupo == ''
                        ) {
                            $objgruponom = new DatGrupoNomNomenclador();
                            $objgruponom->idgrupo = $idgrupo;
                            $objgruponom->idnomenclador = $idnomenclador;
                            $objgruponom->save();
                        }
                    } else {
                        $idusuario = $grupousuario->idusuario;

                        if ($grupousuario->tipo == 2) {
                            $idusuario = $grupousuario->id;
                            $existeestructuranom = Doctrine::getTable(
                                'DatEstructuraNomenclador'
                            )->findByDql(
                                "idestructura = $idusuario AND idnomenclador = $idnomenclador"
                            );
                            if (!isset($existeestructuranom[0]->idnomenclador)
                                || $existeestructuranom[0]->idnomenclador == ''
                            ) {
                                $objusuarionom = new DatEstructuraNomenclador();
                                $objusuarionom->idestructura = $idusuario;
                                $objusuarionom->idnomenclador = $idnomenclador;
                                $objusuarionom->save();
                            }
                        } else {
                            $existeusuarionom = Doctrine::getTable(
                                'DatUsuarioNomNomenclador'
                            )->findByDql(
                                "idusuario = $idusuario AND idnomenclador = $idnomenclador"
                            );
                            if (!isset($existeusuarionom[0]->idnomenclador)
                                || $existeusuarionom[0]->idnomenclador == ''
                            ) {
                                $objusuarionom = new DatUsuarioNomNomenclador();
                                $objusuarionom->idusuario = $idusuario;
                                $objusuarionom->idnomenclador = $idnomenclador;
                                $objusuarionom->save();
                            }
                        }
                    }
                }
            }
        }
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
     * Para el servicio de los dem�s componentes
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
            foreach ($arrayIdNomGrupoUsuario as $keya /*=> $arr*/) {
                $idNomUsuario = $arrayIdNomGrupoUsuario[$keya]['idnomenclador'];               
                // Se crea el arreglo de Nomencladores de nivel superior por usuario
                $arrNomenUsuario
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperior(
                    $tipoNom, $idNomUsuario
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
            foreach ($arrNomenUsuario as $key/* => $array*/) {
                if ($arrNomenUsuario[$key][0]['caduca'] == 1
                    && $arrNomenUsuario[$key][0]['activo'] == 1
                ) {
                    // Captura la fecha de inicio en la que se activa el nomenclador
                    $fechaInicio = $arrNomenUsuario[$key][0]['fdesde'];
                    $fechaInicio = explode(
                        '-', $fechaInicio
                    ); 
                    $fecInicio = $fechaInicio[0] . '-' . $fechaInicio[1] . '-'
                        . $fechaInicio[2];
                    // Captura la fecha de fin en la que se desactiva el nomenclador
                    $fechaFin = $arrNomenUsuario[$key][0]['fhasta'];
                    $fechaFin = explode(
                        '-', $fechaFin
                    ); 
                    $fecFin
                        =
                        $fechaFin[0] . '-' . $fechaFin[1] . '-' . $fechaFin[2];
                    // Captura la fecha actual del servidor
                    $fechaActual = date('d/m/Y');
                    $fechaActual = explode(
                        '/', $fechaActual
                    ); 
                    $fecActual = $fechaActual[2] . '-' . $fechaActual[1] . '-'
                        . $fechaActual[0];
                    // Comparara rangos de fecha
                    if ($fecInicio <= $fecActual && $fecFin >= $fecActual) {
                        $aNomenUsuario[$j][0] = $arrNomenUsuario[$key][0];
                    }
                }
                if ($arrNomenUsuario[$key]['caduca'] == 0
                    && $arrNomenUsuario[$key]['activo'] == 1
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
        ); //NomNomenclador::dameIdGrupoPorUsuario ( $idUsuario );
        if (count($arrayGrupoDeUsuario) != 0) {
            $i = 0;
            foreach ($arrayGrupoDeUsuario as $key /*=> $arr*/) {
                $idGrupoDeUsuario = $arrayGrupoDeUsuario[$key]['idgrupo'];
                $arrayIdNomGrupo[$i] = NomNomenclador::dameIdNomPorGrupo(
                    $idGrupoDeUsuario
                );
                $i++;
            }
            foreach ($arrayIdNomGrupo as $key/* => $a*/) {
                if ($arrayIdNomGrupo[$key] != null) {
                    foreach ($arrayIdNomGrupo[$key] as $k /*=> $c*/) {
                        $aIdNomGrupo[] = $arrayIdNomGrupo[$key][$k];
                    }
                }
            }
            return $aIdNomGrupo;
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
            foreach ($arrayIdNomGrupo as $key => $idnomgrupo) {
                $idNomGrupoo = $idnomgrupo['idnomenclador'];
                // Si el nomenclador no existe en el arreglo Nomencladores de nivel superior
                //por usuario se crea el arreglo de Nomencladores de nivel superior por grupo
                $arrNomenGrupo[$i]
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperior(
                    $tipoNom, $idNomGrupoo
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
                    && $arrNomenGrupo[$key][0]['activo'] == 1
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
                    && $arrNomenGrupo[$key][0]['activo'] == 1
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
                    && $arrayNomencladores[$key]['activo'] == 1
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
                    && $arrayNomencladores[$key]['activo'] == 1
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
            foreach ($arrayNomencladores as $key/* => $nom*/) {
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
            foreach ($arrayNomencladores as $key/* => $array*/) {
                if ($arrayNomencladores[$key]['caduca'] == 1
                    && $arrayNomencladores[$key]['activo'] == 1
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
                    && $arrayNomencladores[$key]['activo'] == 1
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
        $aNomSuperiorPorUsuario
            = NomNomencladorModel::cargarNomenNivelSuperiorPorUsuarioNom(
            $tipoNom, $idUsuarioLog
        );
        $aNomSuperiorPorGrupo
            = NomNomencladorModel::cargarNomenNivelSuperiorPorGrupoNom(
            $tipoNom, $idUsuarioLog
        );
        $aNomPublicoParaTodos
            = NomNomencladorModel::cargarNomenPublicoParaTodosNom(
            $tipoNom, $publico
        );
        $aNomCreadoPorUsuario
            = NomNomencladorModel::cargarNomenCreadoPorUsuarioNom(
            $tipoNom, $idUsuarioLog
        );
        if (count($aNomSuperiorPorUsuario) != 0) {
            foreach ($aNomSuperiorPorUsuario as $k/* => $superiorU*/) {
                if ($aNomSuperiorPorUsuario[$k][0] != null) {
                    $aNomSuperiorU[] = $aNomSuperiorPorUsuario[$k][0];
                }
            }
        }
        if (count($aNomSuperiorPorGrupo) != 0) {
            $band = 0;
            foreach ($aNomSuperiorPorGrupo as $key/* => $a*/) {
                if (count($aNomSuperiorU) != 0) {
                    foreach ($aNomSuperiorU as $keyb /*=> $b*/) {
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
        $arrNomenUsuario[] = array();
        $temp[] = array();
        $arrayIdNomGrupoUsuario = NomNomenclador::dameIdNomPorUsuario(
            $idUsuario
        );
        if (count($arrayIdNomGrupoUsuario) != 0) {
            $i = 0;
            foreach ($arrayIdNomGrupoUsuario as $key /*=> $arr*/) {
                $idNomUsuario = $arrayIdNomGrupoUsuario[$key]['idnomenclador'];
                // Se crea el arreglo de Nomencladores de nivel superior por usuario
                $arrNomenUsuario[$i]
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperiorNom(
                    $tipoNom, $idNomUsuario
                );
                if (count($arrNomenUsuario[$i]) != 0) {
                    if ($arrNomenUsuario[$key][0]['idnomenclador']
                        == $arrNomenUsuario[$key][0]['_parent']
                    ) {
                        $arrNomenUsuario[$key][0]['_parent'] = null;
                    }
                    if ($tipoNom == 2) {
                        $arrNomenUsuario[$key][0]['color']
                            = $arrNomenUsuario[$key][0]['NomCategactividad']['color'];
                    }
                    $arrNomenUsuario[$key][0]['superior'] = 1;
                }                
                $i++;
            }
        }
        $j = 0;
        foreach ($arrNomenUsuario as $k /*=> $b*/) {
            if (count($arrNomenUsuario[$k]) != 0) {
                $temp[$j][0] = $arrNomenUsuario[$k][0];
                $j++;
            }
        }
        return $temp;
    }

    public function cargarNomenNivelSuperiorPorGrupoNom($tipoNom, $idUsuario)
    {
        $arrNomenGrupo[] = array();
        $temp[] = array();
        $aIdNomGrupo = NomNomencladorModel::idNomGrupo($idUsuario);
        $arrayIdNomGrupo = NomNomencladorModel::limpiarArreglo($aIdNomGrupo);
        if (count($arrayIdNomGrupo) != 0) {
            // Recorre el arrgelo de id de nomencladores por grupo
            $i = 0;
            foreach ($arrayIdNomGrupo as $key/* => $idnomgrupo*/) {
                $idNomGrupo = $arrayIdNomGrupo[$key]['idnomenclador'];
                // Si el nomenclador no existe en el arreglo Nomencladores de nivel superior
                //por usuario se crea el arreglo de Nomencladores de nivel superior por grupo
                $arrNomenGrupo[$i]
                    = NomNomenclador::GetTodosNomencladoresPorTipoNivelSuperiorNom(
                    $tipoNom, $idNomGrupo
                );
                if (count($arrNomenGrupo[$i]) != 0) {
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
                $i++;
            }
        }
        $j = 0;
        foreach ($arrNomenGrupo as $k /*=> $b*/) {
            if (count($arrNomenGrupo[$k]) != 0) {
                $temp[$j][0] = $arrNomenGrupo[$k][0];
                $j++;
            }
        }
        return $temp;
    }

    public function cargarNomenCreadoPorUsuarioNom($tipoNom, $idUsuario)
    {
        $arrayNomencladores = array();
        $temp[] = array();
        $arrayNomencladores = NomNomenclador::GetTodosNomencladoresPorTipoNom(
            $tipoNom, $idUsuario
        );
        if (count($arrayNomencladores) != 0) {
            foreach ($arrayNomencladores as $key/* => $nom*/) {
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
        $j = 0;
        foreach ($arrayNomencladores as $k /*=> $b*/) {
            if (count($arrayNomencladores[$k]) != 0) {
                $temp[$j] = $arrayNomencladores[$k];
                $j++;
            }
        }
        return $temp;
    }

    public function cargarNomenPublicoParaTodosNom($tipoNom, $publico)
    {
        $arrayNomencladores = array();
        //$aNomencladores = array();
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

    public function cargarNomencladoresNom($tipoNom, $idUsuarioLog, $filters)
    {
        $arrTodos = array();
        //$aNomSuperiorU = array();
        //$publico = 1;
        $aNomSuperiorPorUsuario
            = NomNomencladorModel::cargarNomenNivelSuperiorPorUsuarioNom(
            $tipoNom, $idUsuarioLog
        );
        $aNomSuperiorPorGrupo
            = NomNomencladorModel::cargarNomenNivelSuperiorPorGrupoNom(
            $tipoNom, $idUsuarioLog
        );
        //$aNomPublicoParaTodos = NomNomencladorModel::cargarNomenPublicoParaTodosNom($tipoNom, $publico);
        $aNomCreadoPorUsuario
            = NomNomencladorModel::cargarNomenCreadoPorUsuarioNom(
            $tipoNom, $idUsuarioLog, $filters
        );  
        /* if (count($aNomSuperiorPorUsuario) != 0) {
          foreach ($aNomSuperiorPorUsuario as $k => $superiorU) {
          if ($aNomSuperiorPorUsuario[$k][0] != null) {
          $aNomSuperiorU[] = $aNomSuperiorPorUsuario[$k][0];
          }
          }
          }
          if (count($aNomSuperiorPorGrupo) != 0) {
          $band = 0;
          foreach ($aNomSuperiorPorGrupo as $key => $a) {
          if (count($aNomSuperiorU) != 0) {
          foreach ($aNomSuperiorU as $keya => $b) {
          if ($aNomSuperiorPorGrupo[$key][0]['idnomenclador'] == $aNomSuperiorU[$key]['idnomenclador']) {
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
          if (count($aNomSuperiorPorGrupo[$key][0]) != 0)
          $aNomSuperiorU[] = $aNomSuperiorPorGrupo[$key][0];
          }
          }
          } */        
        //$arrTodos = array_merge($aNomSuperiorU, $aNomPublicoParaTodos, $aNomCreadoPorUsuario);
        if (isset($aNomSuperiorPorUsuario[0]['idnomenclador'])) {
            $arrTodos = array_merge($arrTodos, $aNomSuperiorPorUsuario);
        }
        if (isset($aNomSuperiorPorGrupo[0]['idnomenclador'])) {
            $arrTodos = array_merge($arrTodos, $aNomSuperiorPorGrupo);
        }
        if (isset($aNomCreadoPorUsuario[0]['idnomenclador'])) {
            $arrTodos = array_merge($arrTodos, $aNomCreadoPorUsuario);
        }
        //$arrTodos = array_merge( $aNomSuperiorPorUsuario, $aNomSuperiorPorGrupo, $aNomCreadoPorUsuario);
        return $arrTodos;
    }

    public function ObtenerNomencladoresCalendario(
        $idusuariosession, $tiponomenclador
    ) 
    {
        $cont = 0;
        $fechainicio = $fechafin = date('j/n/Y');
        $arraynomencladoresusuario
            = NomNomenclador::ObtenerNomencladoresCalendarioUsuario(
            $idusuariosession, $tiponomenclador, $fechainicio, $fechafin
        );
        $arraysaliente = array();
        $arraynomencladoresusuario = $this->ObtenerArregloUnico(
            $arraynomencladoresusuario, $arraysaliente
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
                    $idgrupo, $tiponomenclador, $fechainicio, $fechafin
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
                    $arraynomencladoresusuario, $arraysaliente
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
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
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
            foreach ($familia as $key => $h) {
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

    public function adicionarCampoActivo($fechaInicio, $fechaFin)
    {
        $activo = 0;
        // Captura la fecha de inicio en la que se activa el nomenclador
        $fechaInicio = explode('/', $fechaInicio);
        $fecInicio
            = $fechaInicio[2] . '-' . $fechaInicio[1] . '-' . $fechaInicio[0];
        // Captura la fecha actual del servidor
        $fechaActual = date('d/m/Y');
        $fechaActual = explode('/', $fechaActual);
        $fecActual
            = $fechaActual[2] . '-' . $fechaActual[1] . '-' . $fechaActual[0];
        if ($fechaFin == null) {
            // Comparara rangos de fecha
            if ($fecInicio > $fecActual) {
                $activo = 0;
            } else {
                $activo = 1;
            }
        } else {
            $fechaFin = explode('/', $fechaFin);
            $fecFin = $fechaFin[2] . '-' . $fechaFin[1] . '-' . $fechaFin[0];
            // Comparara rangos de fecha
            if (($fecActual >= $fecInicio && $fecActual <= $fecFin)
                || ($fecActual == $fecInicio)
                || ($fecActual == $fecFin)
            ) {
                $activo = 1;
            } else {
                $activo = 0;
            }
        }
        return $activo;
    }

    public function PublicarTodosNomencladores($parametros)
    {
        $arrayTodosNomHijos = array();
        for ($i = 0; $i < count($parametros->arrayidnomencladores); $i++) {
            $nomenclador = Doctrine::getTable('NomNomenclador')->find(
                $parametros->arrayidnomencladores[$i]
            );
            $arrayNomHijosDadoNomPadre
                = NomNomenclador::obtenerNomHijosDadoNomPadre(
                $nomenclador['ordenizq'], $nomenclador['ordender']
            );
            if (isset($arrayNomHijosDadoNomPadre[0])) {
                foreach ($arrayNomHijosDadoNomPadre as $idNomHijo) {
                    array_push($arrayTodosNomHijos, $idNomHijo['idnom']);
                }
            }
        }
        $parametros->arrayidnomencladores = array_merge(
            $parametros->arrayidnomencladores, $arrayTodosNomHijos
        );
        for ($i = 0; $i < count($parametros->arrayidnomencladores); $i++) {
            $objnomenclador = Doctrine::getTable('NomNomenclador')->find(
                $parametros->arrayidnomencladores[$i]
            );
            $objnomenclador->publico = 1;
            $objnomenclador->save();

            if ($parametros->arrayidusuarios) {
                $this->PublicarNomenclador(
                    $parametros->arrayidnomencladores[$i],
                    $parametros->arrayidusuarios, array()
                );
            }
        }
    }

    public function DespublicarTodosNomencladores($parametros)
    {
        $arrayTodosNomHijos = array();
        for ($i = 0; $i < count($parametros->arrayidnomencladores); $i++) {
            $nomenclador = Doctrine::getTable('NomNomenclador')->find(
                $parametros->arrayidnomencladores[$i]
            );
            $arrayNomHijosDadoNomPadre
                = NomNomenclador::obtenerNomHijosDadoNomPadre(
                $nomenclador['ordenizq'], $nomenclador['ordender']
            );
            if (isset($arrayNomHijosDadoNomPadre[0])) {
                foreach ($arrayNomHijosDadoNomPadre as $idNomHijo) {
                    array_push($arrayTodosNomHijos, $idNomHijo['idnom']);
                }
            }
        }
        $parametros->arrayidnomencladores = array_merge(
            $parametros->arrayidnomencladores, $arrayTodosNomHijos
        );

        for ($i = 0; $i < count($parametros->arrayidnomencladores); $i++) {
            $idnomenclador = $parametros->arrayidnomencladores[$i];
            $existeestructuranom = Doctrine::getTable(
                'DatEstructuraNomenclador'
            )->findByDql("idnomenclador = $idnomenclador");
            /* $existeestructuranom[0]->delete(); */
            $cant = count($existeestructuranom);
            $j = 0;
            while ($cant != 0) {
                $existeestructuranom[$j]->delete();
                $cant--;
                $j++;
            }

            /*************
              Despublicar nomencladores por usuarios
                                                                          *******************/
          $despublicar_nomxusuarios=self::usuariosSubordinados($parametros->idusuariocrea);

          foreach ($despublicar_nomxusuarios as $iduser){
            $existeusuarionom = Doctrine::getTable('DatUsuarioNomNomenclador')
                ->findByDql("idusuario = $iduser AND idnomenclador = $idnomenclador");
            /* $existeusuarionom[0]->delete(); */
            $cant = count($existeusuarionom);
            $j = 0;
            while ($cant != 0) {
                $existeusuarionom[$j]->delete();
                $cant--;
                $j++;
            }

          }

            /*****************************************
                                                      ***************************************/
            $existegruponom = Doctrine::getTable('DatGrupoNomNomenclador')
                ->findByDql("idnomenclador = $idnomenclador");
            $cant = count($existegruponom);
            $j = 0;
            while ($cant != 0) {
                $existegruponom[$j]->delete();
                $cant--;
                $j++;
            }
            $objnomenclador = Doctrine::getTable('NomNomenclador')->find(
                $idnomenclador
            );
            if($objnomenclador->idusuariocrea==$parametros->idusuariocrea){
              $objnomenclador->publico = 0;
              $existeusuarionom = Doctrine::getTable('DatUsuarioNomNomenclador')
                                          ->findByDql("idnomenclador = $idnomenclador");
              /* $existeusuarionom[0]->delete(); */
              $cant = count($existeusuarionom);
              $j = 0;
              while ($cant != 0) {
                $existeusuarionom[$j]->delete();
                $cant--;
                $j++;
              }
              $objnomenclador->save();
            }
        }
    }

    public function usuariosSubordinados($idusuariosession) {
        $objDatPermiso=new DatPermiso();
        $arraysubordinados = $objDatPermiso->obtenerCadenaSubordinacion(
          $idusuariosession, 0
        );
        $arraynodossubordinados = array();
        if (isset($arraysubordinados[0]['idpadre'])) {
          foreach ($arraysubordinados as $key => $subordinado) {
            array_push($arraynodossubordinados, $subordinado['idhijo']);
          }
        }
        return $arraynodossubordinados;
    }

    public function obtenerSistemas()
    {
        $cont = 0;
        $arraySistemas = [];
        $arraySistemas[$cont]['id'] = 1;
        $arraySistemas[$cont]['text']
            = '<span class="icondistra-sipac sipac-azul"></span>'
            . 'Planificaci&oacute;n de actividades';
        $arraySistemas[$cont]['titulo'] = 'Planificaci&oacute;n de actividades';
        $arraySistemas[$cont]['leaf'] = true;
        $arraySistemas[$cont]['iconCls'] = 'imagen-none';
        $arraySistemas[$cont]['tipoNomenDadoSubsistema'] = 'actividad';
        $cont++;
        $arraySistemas[$cont]['id'] = 2;
        $arraySistemas[$cont]['text']
            = '<span class="icondistra-gestionarproyecto sipac-azul"></span>'
            . 'Planificaci&oacute;n de proyecto';
        $arraySistemas[$cont]['titulo'] = 'Planificaci&oacute;n de proyecto';
        $arraySistemas[$cont]['leaf'] = true;
        $arraySistemas[$cont]['iconCls'] = 'imagen-none';
        $arraySistemas[$cont]['tipoNomenDadoSubsistema'] = 'proyecto';
        $cont++;
        /*$arraySistemas[$cont]['id'] = 3;
        $arraySistemas[$cont]['text'] = '<span class="icondistra-folder sipac-azul"></span>' . 'Planificaci&oacute;n de X';
        $arraySistemas[$cont]['titulo'] = 'Planificaci&oacute;n de X';
        $arraySistemas[$cont]['leaf'] = true;
        $arraySistemas[$cont]['iconCls'] = 'imagen-none';
        $arraySistemas[$cont]['tipoNomenDadoSubsistema'] = 'proyectos';*/
        /*$arraySist = $this->integrator->suite->CargarAreasNegocio($array = []);
        print_r($arraySist);die;*/
        return $arraySistemas;
    }
}

