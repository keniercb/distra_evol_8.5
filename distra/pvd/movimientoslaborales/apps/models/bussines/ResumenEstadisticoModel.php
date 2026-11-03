<?php

/**
 * @name ResumenEstadisticoModel - Clase de lógica de negocio del resumen estadístico del análisis de información.
 * @package movimientoslaborales.
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @version 1.0
 */
class ResumenEstadisticoModel extends ZendExt_Model
{
    /**
     * @method ResumenEstadisticoModel - Constructor de la clase.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function ResumenEstadisticoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * @method getResumenEstadistico - Función que devuelve el resumen estadístico del personal contratado.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getResumenEstadistico($idestructura)
    {
        //Se obtiene la estrutura de acceso al sistema para establecer el filtro de la búsqueda por defecto
        $estructFiltlo = $_SESSION['Zeolides']['entidad']->idestructura;
        //Si se envian una estructura por parámetro se establece el nuevo filtro para la búsqueda.
        if (!empty($idestructura)) {
            $estructFiltlo = $idestructura;
        }
        //Se obtiene el resumen de la cantidad de trabajadores por sexo.
        $resSexo = DatPersonaentidad::getTotalPorSexo($estructFiltlo);
        //Se obtiene el resumen de la cantidad de trabajadores por tipo de contrato.
        $resCont = ResumenEstadisticoModel::getResumenPorContratos($estructFiltlo);
        //Se obtiene el resumen de la cantidad de trabajadores por situación laboral.
        $resSit = DatSituacionlaboral::getTotalPorSituacion($estructFiltlo);
        //Se obtiene el resumen de la cantidad de trabajadores por edades
        $resEdades = ResumenEstadisticoModel::getResumenPorEdades($estructFiltlo);
        return array_merge($resSexo, $resCont, $resSit, $resEdades);
    }

    /**
     * @method getResumenPorContratos - Función que devuelve el resumen estadistico por tipos de contratos.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico por tipos de contratos.
     * @author Orestes Rodríguez Lorenzo.
     */
    private function getResumenPorContratos($idestructura)
    {
        $res = DatSituacionlaboral::getTotalPorContrato($idestructura);

        //Declaración de arreglos para agrupar el resultado por tipos de contratos.
        //Indeterminados
        $indeterminados = array(array(
            'agrupador' => 'Distribución de trabajadores por tipos de contrato',
            'tipo' => 2,
            'indicador' => 'Indeterminados',
            'cantidad' => 0
        ));
        //Determinados
        $determinados = array(array(
            'agrupador' => 'Distribución de trabajadores por tipos de contrato',
            'tipo' => 2,
            'indicador' => 'Determinados',
            'cantidad' => 0
        ));
        //Eventuales
        $eventuales = array(array(
            'agrupador' => 'Distribución de trabajadores por tipos de contrato',
            'tipo' => 2,
            'indicador' => 'Eventuales',
            'cantidad' => 0
        ));
        //Se clasifica el resultado según el tipo de contrato. (Determinado, Indeterminado)
        foreach ($res as $v) {
            if ($v['tipo'] == 0) { //Contratos indeterminados
                $v['tipo'] = 3; //Tipo 3 para determinar la forma de visualización del dato.
                array_push($indeterminados, $v); //Llenando el arreglo de indeterminados
                $indeterminados[0]['cantidad'] += $v['cantidad']; //Autosuma para el subagrupador
            } else if ($v['tipo'] == 1) { //Contratos Determinados
                $v['tipo'] = 3; //Tipo 3 para determinar la forma de visualización del dato.
                array_push($determinados, $v); //Llenando el arreglo de determinados
                $determinados[0]['cantidad'] += $v['cantidad']; //Autosuma para el subagrupador
            } else {
                $v['tipo'] = 3; //Tipo 3 para determinar la forma de visualización del dato.
                array_push($eventuales, $v); //Llenando el arreglo de determinados
                $eventuales[0]['cantidad'] += $v['cantidad']; //Autosuma para el subagrupador
            }
        }
        //Se agrupa el resultado en un solo arreglo.
        $arrTodos = array_merge($indeterminados, $determinados, $eventuales);
        return $arrTodos;
    }

    /**
     * @method getResumenPorEdades - Función que devuelve el resumen estadistico por edades.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico por edades.
     * @author Orestes Rodríguez Lorenzo.
     */
    private function getResumenPorEdades($idestructura)
    {
        //Se obtiene el resumen de la cantidad de trabajadores por edades.
        $res = DatPersonaentidad::getTotalPorEdades($idestructura);
        //Se define la constante que se empleará como agrupador en el arreglo.
        $agrupador = 'Distribución de trabajadores por edades';

        $sql = "SELECT *
                FROM
                  mod_rrhhmaestro.conf_rangoedades
                  where idestructura = $idestructura order by orden ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rrayedades = $conn->fetchAll($sql);

        if (!empty($rrayedades)) {
            $edades = array();
            foreach ($rrayedades as $k => $edad) {
                $edades[$k]['agrupador'] = $agrupador;
                $edades[$k]['tipo'] = 0;
                $edades[$k]['indicador'] = $edad['denominacion'];
                $edades[$k]['cantidad'] = 0;
                $edades[$k]['valorinicial'] = $edad['valorinicial'];
                $edades[$k]['valorfinal'] = $edad['valorfinal'];
            }
            $edades[100]['agrupador'] = $agrupador;
            $edades[100]['tipo'] = 0;
            $edades[100]['indicador'] = 'Edad no conocida';
            $edades[100]['cantidad'] = 0;

            //Se actualizan las cantidades de los rangos de edades
            foreach ($res as $v) {
                //Se verifica que la edad no sea vacia
                if (!empty($v['edad'])) {
                    //Se obtiene la clasificación de la edad
                    foreach ($edades as $id => $edade) {
                        if ($v['edad'] >= $edade['valorinicial'] && $v['edad'] <= $edade['valorfinal']) {
                            //Actualizando la cantidad
                            $edades[$id]['cantidad'] += $v['cantidad'];
                        }
                    }
                } else {
                    //Actualizando la cantidad
                    $edades[100]['cantidad'] += $v['cantidad'];
                }
            }
        } else {
            //Se define la estrutura del arreglo por rango de edades
            $edades = array(
                //Menores de 15 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Menores de 15 años', 'cantidad' => 0),
                //Entre 15 y 16 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 15 y 16 años', 'cantidad' => 0),
                //Entre 17 y 19 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 17 y 19 años', 'cantidad' => 0),
                //Entre 20 y 29 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 20 y 29 años', 'cantidad' => 0),
                //Entre 30 y 39 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 30 y 39 años', 'cantidad' => 0),
                //Entre 40 y 59 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 40 y 59 años', 'cantidad' => 0),
                //Entre 60 y 64 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 60 y 64 años', 'cantidad' => 0),
                //Entre 65 y 69 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Entre 65 y 69 años', 'cantidad' => 0),
                //Mayores de 70 años de edad
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Mayores de 70 años', 'cantidad' => 0),
                //Edad no conocida por no tener definida la fecha de nacimiento
                array('agrupador' => $agrupador, 'tipo' => 0, 'indicador' => 'Edad no conocida', 'cantidad' => 0),
            );
            foreach ($res as $v) {
                //Se verifica que la edad no sea vacia
                if (!empty($v['edad'])) {
                    //Se obtiene la clasificación de la edad
                    $id = ResumenEstadisticoModel::clasificarEdades($v['edad']);
                    //Actualizando la cantidad
                    $edades[$id]['cantidad'] += $v['cantidad'];
                } else {
                    //Actualizando la cantidad
                    $edades[9]['cantidad'] += $v['cantidad'];
                }
            }
        }
        return $edades;
    }

    private function organizarEdades($res)
    {
        $edades = array(
            //Menores de 15 años de edad
            array('name' => 'Menores de 15 años', 'y' => 0),
            //Entre 15 y 16 años de edad
            array('name' => 0, 'indicador' => 'Entre 15 y 16 años', 'y' => 0),
            //Entre 17 y 19 años de edad
            array('name' => 'Entre 17 y 19 años', 'y' => 0),
            //Entre 20 y 29 años de edad
            array('name' => 'Entre 20 y 29 años', 'y' => 0),
            //Entre 30 y 39 años de edad
            array('name' => 'Entre 30 y 39 años', 'y' => 0),
            //Entre 40 y 59 años de edad
            array('name' => 'Entre 40 y 59 años', 'y' => 0),
            //Entre 60 y 64 años de edad
            array('name' => 'Entre 60 y 64 años', 'y' => 0),
            //Entre 65 y 69 años de edad
            array('name' => 'Entre 65 y 69 años', 'y' => 0),
            //Mayores de 70 años de edad
            array('name' => 'Mayores de 70 años', 'y' => 0),
            //Edad no conocida por no tener definida la fecha de nacimiento
            array('name' => 'Edad no conocida', 'y' => 0),
        );
        //Se actualizan las cantidades de los rangos de edades
        foreach ($res as $v) {
            //Se verifica que la edad no sea vacia
            if (!empty($v['edad'])) {
                //Se obtiene la clasificación de la edad
                $id = ResumenEstadisticoModel::clasificarEdades($v['edad']);
                //Actualizando la cantidad
                $edades[$id]['y'] += $v['cant'];
            } else {
                //Actualizando la cantidad
                $edades[9]['y'] += $v['cant'];
            }
        }
        return $edades;
    }

    /**
     * @method clasificarEdades - Función auxiliar que clasifica las edades por rangos.
     * @params $edad - Edad a clasificar.
     * @return Entero - Devuelve un número entero que corresponde con la posición del arreglo $edades declarado en el
     * método getResumenPorEdades.
     * @author Orestes Rodríguez Lorenzo.
     */
    private function clasificarEdades($edad)
    {
        if ($edad < 15) //Verificando edad para menores de 15 años.
            return 0;
        elseif ($edad == 15 || $edad == 16) //Verificando edad para entre 15 y 16 años.
            return 1;
        elseif ($edad >= 17 && $edad <= 19) //Verificando edad para entre 17 y 19 años.
            return 2;
        elseif ($edad >= 20 && $edad <= 29) //Verificando edad para entre 20 y 29 años.
            return 3;
        elseif ($edad >= 30 && $edad <= 39) //Verificando edad para entre 30 y 39 años.
            return 4;
        elseif ($edad >= 40 && $edad <= 59) //Verificando edad para entre 40 y 59 años.
            return 5;
        elseif ($edad >= 60 && $edad <= 64) //Verificando edad para entre 60 y 64 años.
            return 6;
        elseif ($edad >= 65 && $edad <= 69) //Verificando edad para entre 65 y 69 años.
            return 7;
        elseif ($edad >= 70) //Verificando edad para mayores de 70 años.
            return 8;
        else
            return 9;
    }

    /**
     * @method getDatosDashboard - Función que devuelve el resumen estadistico para las gráficas
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico para las gráficas
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getDatosDashboard($id)
    {
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        if (!empty($id)) {
            $idestructura = $id;
        }
        $idcargosArray = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
        $cargos = array();
        foreach ($idcargosArray as $value) {
            array_push($cargos, $value['idcargo']);
        }

        //*******Trabajadores por rango de edades******//
        $sql = "SELECT *
                FROM
                  mod_rrhhmaestro.conf_rangoedades
                  where idestructura = $idestructura order by orden ASC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrayedades = $conn->fetchAll($sql);
        if(!empty($arrayedades)){
            $edades = array();
            foreach ($arrayedades as $k => $edade){
                $edades[$k]['y'] = 0;
                $edades[$k]['nombre'] = $edade['denominacion'];
                $edades[$k]['valorinicial'] = $edade['valorinicial'];
                $edades[$k]['valorfinal'] = $edade['valorfinal'];
            }
            $genedades = $edades;
            $dataedades = $this->obtenerTotalEdades($cargos);

            $unknown = 0;
            foreach ($dataedades as $v) {
                //Se verifica que la edad no sea vacia
                if (!empty($v['index'])) {
                    //Se obtiene la clasificación de la edad
                    foreach ($edades as $id => $edade) {
                        if ($v['index'] >= $edade['valorinicial'] && $v['index'] <= $edade['valorfinal']) {
                            //Actualizando la cantidad
                            $edades[$id]['y'] += $v['valor'];
                        }
                    }
                } else {
                    //Actualizando la cantidad
                    $unknown += $v['valor'];
                }
            }
            $edades[$id+1]['y'] = $unknown;
            $edades[$id+1]['nombre'] = "Edad no conocida";

            //********Trabajadores por genero y rango de edades*******//
            $datageneroedades = $this->obtenerTotalGeneroEdad($cargos);
            $generoedades = array();
            foreach ($genedades as $k => $edade){
                $generoedades['fem'][$k]['y'] = 0;
                $generoedades['fem'][$k]['nombre'] = $edade['nombre'];
                $generoedades['masc'][$k]['y'] = 0;
                $generoedades['masc'][$k]['nombre'] = $edade['nombre'];
            }
            $unknownfem = 0;
            foreach ($datageneroedades['fem'] as $valf) {
                //Se verifica que la edad no sea vacia
                if (!empty($valf['index'])) {
                    //Se obtiene la clasificación de la edad
                    foreach ($genedades as $df => $edadf) {
                        if ($valf['index'] >= $edadf['valorinicial'] && $valf['index'] <= $edadf['valorfinal']) {
                            //Actualizando la cantidad
                            $generoedades['fem'][$df]['y'] += 0 - $valf['valor'];
                        }
                    }
                } else {
                    //Actualizando la cantidad
                    $unknownfem += 0 - $valf['valor'];
                }
            }
            $generoedades['fem'][$df+1]['y'] = $unknownfem;
            $generoedades['fem'][$df+1]['nombre'] = "Edad no conocida";

            $unknownmasc = 0;
            foreach ($datageneroedades['masc'] as $valm) {
                //Se verifica que la edad no sea vacia
                if (!empty($valm['index'])) {
                    //Se obtiene la clasificación de la edad
                    foreach ($genedades as $dm => $edadm) {
                        if ($valm['index'] >= $edadm['valorinicial'] && $valm['index'] <= $edadm['valorfinal']) {
                            //Actualizando la cantidad
                            $generoedades['masc'][$dm]['y'] += $valm['valor'];
                        }
                    }
                } else {
                    //Actualizando la cantidad
                    $unknownmasc += $valm['valor'];
                }
            }
            $generoedades['masc'][$dm+1]['y'] = $unknownmasc;
            $generoedades['masc'][$dm+1]['nombre'] = "Edad no conocida";
        }

        $res['genero'] = $this->obtenerTotalGenero($cargos);
        if(!empty($arrayedades)) {
            $res['serieedades'] = $edades;
            $res['seriegeneroedades'] = $generoedades;
        }else{
            $res['edades'] = $this->obtenerTotalEdades($cargos);
            $res['genedad'] = $this->obtenerTotalGeneroEdad($cargos);
        }
        $res['colorpiel'] = $this->obtenerTotalColorPiel($cargos);
        $res['tipocontrato'] = $this->obtenerTotalTipoContrato($cargos);
        $res['contrato'] = $this->obtenerTotalContrato($cargos);
        $res['categocup'] = $this->obtenerTotalCategOcup($cargos);
        $res['procsocial'] = $this->obtenerTotalProcSocial($cargos);
        $res['sitlab'] = $this->obtenerTotalSitLab($cargos);
        $res['proglab'] = $this->obtenerTotalProgLab($cargos);
        $res['niveleducacional'] = $this->obtenerTotalNivelEducacional($cargos);
        $res['titulo'] = $this->obtenerTotalTitulo($cargos);
        return $res;
    }

    /**
     * @method getGraficasApk - Función que devuelve las gráficas
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico para las gráficas
     * @author Yaricel Guerra Velazquez.
     */
    public function getGraficasApk($idusuario, $iddominio, $idestructura, $fecha)
    {
        $idcargos = array();
        if (isset($idusuario)) {
            $comp = AnalisisFT::getCompartimentacionByIdusuario($idusuario);
            $vser = ZendExt_IoC::getInstance();
            if ($comp[0]['idcompartimentacion'] == 2) {
                $cargos = $vser->metadatos->obtenerCargosEstructura($idestructura, $iddominio);
            } else {
                $cargos = $vser->metadatos->obtenerCargosEstructura($idestructura, true);
            }
            if (count($cargos) > 0) {
                foreach ($cargos as $carg) {
                    array_push($idcargos, $carg['idcargo']);
                }
            }
        }
        if (count($idcargos) > 0) {
            $genero = AnalisisFT::obtenerTotalGenero($idcargos, $fecha);
            $edades = AnalisisFT::obtenerTotalEdades($idcargos, $fecha);
            $rangoed = $this->organizarEdades($edades);
            $tipocontrato = AnalisisFT::obtenerTotalTipoContrato($idcargos, $fecha);
            $contrato = AnalisisFT::obtenerTotalContrato($idcargos, $fecha);
            $categocup = AnalisisFT::obtenerTotalCategOcup($idcargos, $fecha);
            $procsocial = AnalisisFT::obtenerTotalProcSocial($idcargos, $fecha);
            $res[0]['titulo'] = 'Trabajadores por género';
            $res[0]['tipo'] = 2;
            $res[0]['series'][0]['name'] = ($genero[0]['sexo'] == 1) ? 'Masculino' : 'Femenino';
            $res[0]['series'][1]['name'] = ($genero[1]['sexo'] == 1) ? 'Masculino' : 'Femenino';
            $res[0]['series'][0]['y'] = $genero[0]['cant'];
            $res[0]['series'][1]['y'] = $genero[1]['cant'];

            $res[1]['titulo'] = 'Trabajadores por rango de edades';
            $res[1]['tipo'] = 1;
            $res[1]['series'] = $rangoed;

            $res[2]['titulo'] = 'Trabajadores por tipo de contrato';
            $res[2]['tipo'] = 2;
            $res[2]['series'][0]['name'] = ($tipocontrato[0]['determinado'] == 1) ? 'Determinado' : 'Indeterminado';
            $res[2]['series'][1]['name'] = ($tipocontrato[1]['determinado'] == 1) ? 'Determinado' : 'Indeterminado';
            $res[2]['series'][0]['y'] = $tipocontrato[0]['cant'];
            $res[2]['series'][1]['y'] = $tipocontrato[1]['cant'];

            $res[3]['titulo'] = 'Trabajadores por contrato';
            $res[3]['tipo'] = 1;
            foreach ($contrato as $c => $v) {
                $res[3]['series'][$c]['name'] = $v['denominacion'];
                $res[3]['series'][$c]['y'] = $v['cant'];
            }

            $res[4]['titulo'] = 'Trabajadores por categoría ocupacional';
            $res[4]['tipo'] = 2;
            foreach ($categocup as $ka => $v) {
                $res[4]['series'][$ka]['name'] = $v['denominacion'];
                $res[4]['series'][$ka]['y'] = $v['cant'];
            }

            $res[5]['titulo'] = 'Trabajadores por procedencia social ';
            $res[5]['tipo'] = 2;
            foreach ($procsocial as $p => $v) {
                $res[5]['series'][$p]['name'] = $v['denominacion'];
                $res[5]['series'][$p]['y'] = $v['cant'];
            }
            $vserinter = ZendExt_IoC_Inter::getInstance();
            $asistencia = $vserinter->regimentrabajo->getAsistenciaByCargos($fecha, $idcargos);
            $res[6] = $asistencia[0];
            $res[7] = $asistencia[1];
            $res[8] = $asistencia[2];
        } else {
            $res = array();
        }

        return $res;
    }

    /**
     * @method getResumenGraficaPorSexo función auxiliar que devuelve el resumen estadistico para la gráfica por sexo
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico por sexo.
     * @author Orestes Rodríguez Lorenzo.
     */
    private function obtenerTotalGenero($cargos)
    {
        $datos = AnalisisFT::obtenerTotalGenero($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['sexo'], 'valor' => $v['cant']));
        }
        return $res;
    }

    /**
     * @method getResumenGraficaPorEdades - Función auxiliar que devuelve el resumen estadistico para la gráfica por
     *  edades.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @return Array - Arreglo con el resumen estadístico por edades.
     * @author Orestes Rodríguez Lorenzo.
     */
    private function obtenerTotalEdades($cargos)
    {
        //Se obtiene el resumen de la cantidad de trabajadores por edades.
        $datos = AnalisisFT::obtenerTotalEdades($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['edad'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalGeneroEdad($cargos)
    {
        $datos = AnalisisFT::obtenerTotalGeneroEdad($cargos);
        $res = array('fem' => array(), 'masc' => array());
        foreach ($datos as $v) {
            if ($v['sexo'] == 0)
                array_push($res['fem'], array('index' => $v['edad'], 'valor' => $v['cant']));
            else
                array_push($res['masc'], array('index' => $v['edad'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalTipoContrato($cargos)
    {
        $datos = AnalisisFT::obtenerTotalTipoContrato($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['determinado'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalContrato($cargos)
    {
        $datos = AnalisisFT::obtenerTotalContrato($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalCategOcup($cargos)
    {
        $datos = AnalisisFT::obtenerTotalCategOcup($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalProcSocial($cargos)
    {
        $datos = AnalisisFT::obtenerTotalProcSocial($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalColorPiel($cargos)
    {
        $datos = AnalisisFT::obtenerTotalColorPiel($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalSitLab($cargos)
    {
        $datos = AnalisisFT::obtenerTotalSitLab($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant'], 'color' => $v['color']));
        }
        return $res;
    }

    private function obtenerTotalProgLab($cargos)
    {
        $datos = AnalisisFT::obtenerTotalProgLab($cargos);
        $res = array();
        foreach ($datos as $v) {
            array_push($res, array('index' => $v['denominacion'], 'valor' => $v['cant']));
        }
        return $res;
    }

    private function obtenerTotalNivelEducacional($cargos)
    {
        $datos = AnalisisFT::obtenerTotalNivelEducacional($cargos);
        $resultado = array();
        foreach ($datos as $valor) {
            array_push($resultado, array('index' => $valor['denominacion'], 'valor' => $valor['cant']));
        }
        return $resultado;
    }

    private function obtenerTotalTitulo($cargos)
    {
        $datos = AnalisisFT::obtenerTotalTitulo($cargos);
        $resultado = array();
        foreach ($datos as $valor) {
            array_push($resultado, array('index' => $valor['denominacion'], 'valor' => $valor['cant']));
        }
        return $resultado;
    }

    /**
     * @method getResumenAltas - Función para el resumen estadistico de las altas.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el resumen.
     * @params $fdesde - Fecha en que inicia el periodo que se desea analizar.
     * @params $fhasta - Fecha en que concluye el periodo que se desea analizar.
     * @return Array - Arreglo con el resumen estadístico por procedencia.
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getResumenAltas($idestructura, $fdesde, $fhasta)
    {
        //Se obtiene la estrutura de acceso al sistema para establecer el filtro de la búsqueda por defecto
        $estructFiltlo = $_SESSION['Zeolides']['entidad']->idestructura;
        //Si se envian una estructura por parámetro se establece el nuevo filtro para la búsqueda.
        if (!empty($idestructura)) {
            $estructFiltlo = $idestructura;
        }
        //Se obtiene el resumen de la cantidad de trabajadores por procedencia.
        $resumen = DatPersonaentidad::getResumenPorProcedencia($estructFiltlo, $fdesde, $fhasta);
        return $resumen;
    }

    /**
     * @method getDatosGraficasAltas - Función que devuelve el resumen estadistico de las altas.
     * @params $idestructura - Identificador de la estructura de la que se desea obtener el análisis.
     * @params $fdesde - Fecha en que inicia el periodo que se desea analizar.
     * @params $fhasta - Fecha en que concluye el periodo que se desea analizar.
     * @return Array - Arreglo con los datos relacionados con las altas para graficar
     * @author Orestes Rodríguez Lorenzo.
     */
    public function getDatosGraficasAltas($idestructura, $fdesde, $fhasta)
    {
        //Se obtiene la estrutura de acceso al sistema para establecer el filtro de la búsqueda por defecto
        $estructFiltlo = $_SESSION['Zeolides']['entidad']->idestructura;
        //Si se envian una estructura por parámetro se establece el nuevo filtro para la búsqueda.
        if (!empty($idestructura)) {
            $estructFiltlo = $idestructura;
        }
        //Se obtiene el resumen de la cantidad de trabajadores por procedencia.
        $res = DatPersonaentidad::getResumenPorProcedencia($estructFiltlo, $fdesde, $fhasta);
        $data['resumen'] = array();
        foreach ($res as $v) {
            array_push($data['resumen'], array($v['indicador'], $v['cantidad']));
        }
        $tray = DatPersonaentidad::getTrayectoriaAltas($estructFiltlo);
        $data['trayectoria'] = array();
        $indices = array(2015, 2016);
        $data['indices'] = $indices;
        foreach ($indices as $i) {
            $arrAnual = array();
            foreach ($tray as $v) {
                if ($v['anno'] == $i)
                    array_push($arrAnual, array($v['indicador'], $v['cantidad']));
            }
            array_push($data['trayectoria'], $arrAnual);
        }
        return $data;
    }
}