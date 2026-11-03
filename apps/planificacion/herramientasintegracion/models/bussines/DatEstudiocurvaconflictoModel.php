<?php

class DatEstudiocurvaconflictoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /**
     * Obtiene los datos de un estudio de curva de conflicto seleccionado
     *
     * @param $idproyecto
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return Doctrine_Collection
     */
    public function getProyectoProyectoCurvaconflicto($idproyecto) {
        return DatEstudiocurvaconflicto::getProyectocurvaconflicto($idproyecto);
    }

    /**
     * Obtiene la intensidad de conflicto asociada a un estudio de conflicto
     *
     * @param $idestudiocurvaconflicto
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return Doctrine_Collection
     */
    public function getIntensidadconflicto($idestudiocurvaconflicto) {
        return DatIntensidadconflicto::getIntensidadconflicto($idestudiocurvaconflicto, true);
    }

    /**
     * Obtiene las mediciones asociadas a un estudio de curva de conflicto
     *
     * @param $idestudiocurvaconflicto
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return mixed
     */
    public function getMediciones($idestudiocurvaconflicto) {
        return DatMedicion::getMedicion($idestudiocurvaconflicto);
    }

    /**
     * Funcion auxiliar para eliminar un objeto
     *
     * @param $obj
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return bool|Exception
     */
    public function eliminarInformacion($obj) {
        try {
            if ($obj) {
                $obj->delete();
            }
            return true;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    /**
     * Funcion auxiliar para guardar un objeto
     *
     * @param $obj
     *
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return bool|Exception
     */
    public function guardarInformacion($obj) {
        try {
            if ($obj) {
                $obj->save();
            }
            return $obj;
        } catch (Exception $e) {
            print_r($e);
            die;
            return $e;
        }
    }

    public function guardarIntensidadConflictoPlantillas($objeto){
        if($objeto['opcion']){
            if (count($objeto['plantilla']['del']) > 0) {
                $variablesDel = $objeto['plantilla']['del'];
                foreach ($variablesDel as $key) {
                    $objVar = Doctrine::getTable('DatIntensidadconflictoplantilla')->find($key['idintensidadconflictoplantilla']);

                    $this->eliminarInformacion($objVar);
                }
                $res = false;
            }
            if (count($objeto['plantilla']['mod']) > 0) {
                $variablesMod = $objeto['plantilla']['mod'];
                foreach ($variablesMod as $key) {
                    $objVar = Doctrine::getTable('DatIntensidadconflictoplantilla')->find($key['idintensidadconflictoplantilla']);
                    $objVar->denominacion = $key['denominacion'];
                    $objVar->descripcion = $key['descripcion'];

                    $res = $this->guardarInformacion($objVar);
                }
            }
            if (count($objeto['plantilla']['add']) > 0) {
                $variablesAdd = $objeto['plantilla']['add'];
                foreach ($variablesAdd as $key) {
                    $objVar = new DatIntensidadconflictoplantilla();
                    $objVar->denominacion = $key['denominacion'];
                    $objVar->descripcion = $key['descripcion'];
                    $res = $this->guardarInformacion($objVar);
                }
            }
        }else{
            if (count($objeto['plantilla']['del']) > 0) {
                $variablesMod = $objeto['plantilla']['del'];
                foreach ($variablesMod as $key) {
                    $objVar = Doctrine::getTable('DatIntensidadconflictoplantilla')->find($key['idintensidadconflictoplantilla']);
                    $configuracion = Zend_Json_Decoder::decode($objVar->configuracion);

                    $arrayAux = array();
                    foreach ($configuracion as $keyConf => $objConf) {
                        if($key['orden'] != $objConf['orden']){
                            $arrayAux[] = $objConf;
                        }
                    }
                    $objVar->configuracion = Zend_Json_Encoder::encode($arrayAux);
                    $res = $this->guardarInformacion($objVar);
                }
                $res = false;
            }
            if (count($objeto['plantilla']['mod']) > 0) {
                $variablesMod = $objeto['plantilla']['mod'];
                foreach ($variablesMod as $key) {
                    $objVar = Doctrine::getTable('DatIntensidadconflictoplantilla')->find($key['idintensidadconflictoplantilla']);
                    $configuracion = Zend_Json_Decoder::decode($objVar->configuracion);

                    foreach ($configuracion as $keyConf => $objConf) {
                        if($key['orden'] == $objConf['orden']){
                            $configuracion[$keyConf]['terminologia']    = $key['terminologia'];
                            $configuracion[$keyConf]['descripcion']     = $key['descripcion'];
                            $configuracion[$keyConf]['nivelintensidad'] = $key['nivelintensidad'];
                            break;
                        }
                    }
                    $objVar->configuracion = Zend_Json_Encoder::encode($configuracion);
                    $res = $this->guardarInformacion($objVar);
                }
            }
            if (count($objeto['plantilla']['add']) > 0) {
                $objVar = Doctrine::getTable('DatIntensidadconflictoplantilla')->find($objeto['idintensidadconflictoplantilla']);
                if($objVar->configuracion){
                    $configuracion = Zend_Json_Decoder::decode($objVar->configuracion);
                    $pos = count($configuracion);
                    $orden = ($configuracion[$pos - 1]['orden']) + 1;
                }else{
                    $configuracion = array();
                    $pos = 0;
                    $orden = 0;
                }

                $variablesAdd = $objeto['plantilla']['add'];
                foreach ($variablesAdd as $key => $data) {
                    $configuracion[$pos]['terminologia']      = $data['terminologia'];
                    $configuracion[$pos]['descripcion']       = $data['descripcion'];
                    $configuracion[$pos]['nivelintensidad']   = $data['nivelintensidad'];
                    $configuracion[$pos]['orden']             = $orden;
                    $configuracion[$pos++]['idintensidadconflictoplantilla']  = $objeto['idintensidadconflictoplantilla'];
                }

                $objVar->configuracion = Zend_Json_Encoder::encode($configuracion);
                $res = $this->guardarInformacion($objVar);
            }
        }
        return array('success'=> true);
    }

    public function obtenerIntensidadConflictoPlantillas($idintensidadconflictoplantilla){
        $result = array();
        if($idintensidadconflictoplantilla){
            $res = DatIntensidadconflictoplantilla::getPlantilla($idintensidadconflictoplantilla);
            if($res['configuracion']){
                $result = Zend_Json_Decoder::decode($res['configuracion']);
            }
        }else{
            $result = DatIntensidadconflictoplantilla::getIntensidadconflictoplantilla();
        }
        return array('cantidad_filas' => count($result), 'data' => $result);
    }

    /**
     * Funcion que permite la gestion de las intensidades del conflicto
     *
     * @param $objeto
     * @param $idestudiocurvaconflicto
     *
     * @author    Ing Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return bool|Exception
     */
    public function guardarIntensidadconflicto($objeto, $idestudiocurvaconflicto) {
        $mensaje = 'Algunas operaciones no pudieron ejecutarse: <br>';
        $mostMensajes = false;
        // caso ELIMINAR
        if (count($objeto['del']) > 0) {
            $variablesDel = $objeto['del'];
            foreach ($variablesDel as $key) {
                $objVar = Doctrine::getTable('DatIntensidadconflicto')
                        ->find($key['idintensidadconflicto']);
                $this->eliminarInformacion($objVar);
            }
            $res = false;
        }
        // caso MODIFICAR
        if (count($objeto['mod']) > 0) {
            $variablesMod = $objeto['mod'];
            foreach ($variablesMod as $key) {
                $existe = FactoresValidator::validarIntensidad($idestudiocurvaconflicto, $key['terminologia'], $key['nivelintensidad']);
                if ($existe[0]['terminologia'] == $key['terminologia'] && $existe[0]['idintensidadconflicto'] != $key['idintensidadconflicto']) {
                    $mostMensajes = true;
                    $mensaje .= '- ' . $key['terminologia'] . ' : La terminología ya existe.<br>';
                } elseif ($existe[0]['nivelintensidad'] == $key['nivelintensidad'] && $existe[0]['idintensidadconflicto'] != $key['idintensidadconflicto']) {
                    $mostMensajes = true;
                    $mensaje .= '- ' . $key['terminologia'] . ' : El nivel de intensidad ya existe.<br>';
                } else {
                    $objVar = Doctrine::getTable('DatIntensidadconflicto')
                            ->find($key['idintensidadconflicto']);
                    $objVar->terminologia = $key['terminologia'];
                    $objVar->nivelintensidad = $key['nivelintensidad'];
                    $objVar->descripcion = $key['descripcion'];
                    $res = $this->guardarInformacion($objVar);
                }
            }
        }
        // caso ADICIONAR
        if (count($objeto['add']) > 0) {
            $variablesAdd = $objeto['add'];
            foreach ($variablesAdd as $key) {
                $existe = FactoresValidator::validarIntensidad($idestudiocurvaconflicto, $key['terminologia'], $key['nivelintensidad']);
                if ($existe[0]['terminologia'] == $key['terminologia']) {
                    $mostMensajes = true;
                    $mensaje .= '- ' . $key['terminologia'] . ' : La terminología que quiere adicionar ya existe.<br>';
                } elseif ($existe[0]['nivelintensidad'] == $key['nivelintensidad']) {
                    $mostMensajes = true;
                    $mensaje .= '- ' . $key['terminologia'] . ' : El nivel de intensidad  que quiere adicionar ya existe.<br>';
                } else {
                    $objVar = new DatIntensidadconflicto();
                    $objVar->terminologia = $key['terminologia'];
                    $objVar->nivelintensidad = $key['nivelintensidad'];
                    $objVar->idestudiocurvaconflicto = $idestudiocurvaconflicto;
                    $objVar->descripcion = $key['descripcion'];
                    $res = $this->guardarInformacion($objVar);
                }
            }
        }
        if ($mostMensajes) {
            return array('mostrarMens' => $mostMensajes, 'mensaje' => $mensaje);
        } else if ($res->idintensidadconflicto) {
            return array('idintensidadconflicto' => $res->idintensidadconflicto);
        } else {
            return false;
        }
    }

    public function getNivelintensidadmaximo($idestudiocurvaconflicto) {
        $intensidad = DatIntensidadconflicto::getIntensidadconflicto($idestudiocurvaconflicto, false);
        return $intensidad[0]['nivelintensidad'];
    }

    /**
     * Funcion que permite la gestion de las mediciones
     *
     * @param $objeto
     * @param $idestudiocurvaconflicto
     *
     * @author    Ing Frank David Corona Prendes
     * @copyrigth XETID Cuba
     * @return bool|Exception
     */
    public function guardarMediciones($objeto, $idestudiocurvaconflicto) {
        // caso ELIMINAR
        if (count($objeto['del']) > 0) {
            $variablesDel = $objeto['del'];
            foreach ($variablesDel as $key) {
                $objVar = Doctrine::getTable('DatMedicion')
                        ->find($key['idmedicion']);
                $this->eliminarInformacion($objVar);
            }
            $res = false;
        }
        // caso MODIFICAR
        if (count($objeto['mod']) > 0) {
            $intensidadmax = $this->getNivelintensidadmaximo($idestudiocurvaconflicto);
            $cerrors = 0;
            $variablesMod = $objeto['mod'];
            foreach ($variablesMod as $key) {
                $objVar = Doctrine::getTable('DatMedicion')
                        ->find($key['idmedicion']);
                $objVar->fechamedicion = $key['fechamedicion'];
                $objVar->valormedicion = $key['valormedicion'];
                $objVar->descripcion = $key['descripcion'];
                $res = ($key['valormedicion'] <= $intensidadmax) ? $this->guardarInformacion($objVar) : $cerrors++;
            }
        }
        // caso ADICIONAR
        if (count($objeto['add']) > 0) {
            $intensidadmax = $this->getNivelintensidadmaximo($idestudiocurvaconflicto);
            $cerrors = 0;
            $variablesAdd = $objeto['add'];
            foreach ($variablesAdd as $key) {
                $objVar = new DatMedicion();
                $objVar->fechamedicion = $key['fechamedicion'];
                $objVar->valormedicion = $key['valormedicion'];
                $objVar->idestudiocurvaconflicto = $idestudiocurvaconflicto;
                $objVar->descripcion = $key['descripcion'];
                $res = ($key['valormedicion'] <= $intensidadmax) ? $this->guardarInformacion($objVar) : $cerrors++;
            }
        }
        if ($res) {
            return array('tipo' => ($cerrors != 0) ? 4 : 1, 'counterrors' => $cerrors);
        } else {
            return $res;
        }
    }

    /**
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID, Cuba
     *
     * @param $objeto
     * @param $idestudiocurvaconflicto
     *
     * @return mixed
     * Guarda la escala de tiempo de la configuracion
     */
    public function guardarEscalatiempo($objeto, $idestudiocurvaconflicto) {
        try {
            $estudio = Doctrine::getTable('DatEstudiocurvaconflicto')->find($idestudiocurvaconflicto);

            if($objeto['fechainicio']){
                $estudio->fechaini = $objeto['fechainicio'];
            }
            if($objeto['fechaintermedia']){
                $estudio->fechaintermedia = $objeto['fechaintermedia'];
            }
            if($objeto['fechaavanzada']){
                $estudio->fechaavanzada = $objeto['fechaavanzada'];
            }
            if($objeto['descripcion']){
                $estudio->descripcion = $objeto['descripcion'];
            }

            $estudio->save();
            return $estudio->idestudiocurvaconflicto;
        } catch (Exception $e) {
            print_r($e->getMessage());
            die;
        }
    }

    /**
     * Obtiene todos los datos necesarios para realizar la graficacion
     *
     * @param $idestudio
     * @param $idproyecto
     *
     * @return array
     * @author    Ing. Frank David Corona Prendes
     * @copyrigth XETID, Cuba
     */
    public function getDatosgraficador($idestudio, $idproyecto) {
        $intensidades = DatIntensidadconflicto::getIntensidadconflicto($idestudio, true);

        //-------------------------------------------------------------------------------------------------------------- niveles de intensidad
        $maximo = -10000000;
        $yAux = array();
        foreach ($intensidades as $value) {
            $yAux[] = array('key' => $value['nivelintensidad'], 'value' => $value['terminologia']);
            if($value['nivelintensidad'] > $maximo){
                $maximo = $value['nivelintensidad'];
            }
        }
        $maximo ++;

        $yAxis = array();
        for ($i = 0; $i < $maximo; $i++) {
            $add = true;
            foreach ($yAux as $key => $objyAux) {
                if($objyAux['key'] == ($i + 1)){
                    $yAxis[] = $objyAux;
                    $add = false;
                    break;
                }
            }
            if($add){
                $yAxis[] = array('key' => ($i + 1), 'value' => '');
            }
        }
        //-------------------------------------------------------------------------------------------------------------- mediciones del conflicto
        $mediciones = DatMedicion::getMedicion($idestudio);
        $charData = array();
        foreach ($mediciones as $value) {
            $fechatemp = split('/', $value['fechamedicion']);
            $charData[] = array('date' => $fechatemp[0] . '-' . $fechatemp[1] . '-' . $fechatemp[2], 'value' => $value['valormedicion']);
        }

        $guides = DatEstudiocurvaconflicto::getProyectocurvaconflicto($idproyecto);

        if($guides[0]['fechainicio']){
            $fechainiciotemp = split('/', $guides[0]['fechainicio']);
            $guideinicio = $fechainiciotemp[2] . '/' . $fechainiciotemp[1] . '/' . $fechainiciotemp[0];
            $mkfechainicio = mktime(null, null, null, $fechainiciotemp[1], $fechainiciotemp[0], $fechainiciotemp[2]);
            $fechainicio = date('d-m-Y', strtotime($guideinicio));
        }

        if($guides[0]['fechaintermedia']){
            $fechainttemp = split('/', $guides[0]['fechaintermedia']);
            $guideintermedia = $fechainttemp[2] . '/' . $fechainttemp[1] . '/' . $fechainttemp[0];
            $mkfechaintermedia = mktime(null, null, null, $fechainttemp[1], $fechainttemp[0], $fechainttemp[2]);
            $fechaintermedia = date('d-m-Y', strtotime($guideintermedia));
        }

        if($guides[0]['fechaavanzada']){
            $fechaavatemp = split('/', $guides[0]['fechaavanzada']);
            $guideavanzada = $fechaavatemp[2] . '/' . $fechaavatemp[1] . '/' . $fechaavatemp[0];
            $mkfechaavanzada = mktime(null, null, null, $fechaavatemp[1], $fechaavatemp[0], $fechaavatemp[2]);
            $fechaavanzada = date('d-m-Y', strtotime($guideavanzada));
        }

        //----------------------- Fecha hoy

        $objHoy = getdate();
        $mkfechaHoy = mktime(null, null, null, $objHoy['mon'], $objHoy['mday'], $objHoy['year']);
        $fechaHoy = date("d-m-Y", $objHoy[0]);

        //----------------------- Actualizar fecha fin

        $long = count($charData);
        if($long == 0){
            $fechafin = $fechaHoy;
            $mkfechafin = $mkfechaHoy;
        } else{
            $fAux = split('-', $charData[$long - 1]['date']);
            $mkfechaAux = mktime(null, null, null, $fAux[1], $fAux[0], $fAux[2]);
            $fechaAux = $charData[$long - 1]['date'];

            if($mkfechaAux > $mkfechaHoy){
                $fechafin = $fechaAux;
                $mkfechafin = $mkfechaAux;
            }else{
                $fechafin = $fechaHoy;
                $mkfechafin = $mkfechaHoy;
            }
        }

        $fAux1 = split('-', $fechafin);
        $fechafin = date('d-m-Y', mktime(null, null, null, $fAux1[1], $fAux1[0] + 1, $fAux1[2]));
        //----------------------- Actualizar fecha avanzada

        if($guides[0]['fechaavanzada'] && $guides[0]['fechaintermedia']){
            if($mkfechaavanzada > $mkfechafin){
                $fechafin = $fechaavanzada;
            }
        }else if (!$guides[0]['fechaavanzada'] && $guides[0]['fechaintermedia']){
            if($mkfechaintermedia > $mkfechafin){
                $fechafin = $fechaintermedia;
                $fechaavanzada = $fechafin;
            }else{
                $fechaavanzada = $fechafin;
            }
        }else if ($guides[0]['fechaavanzada'] && !$guides[0]['fechaintermedia']){
            if($mkfechaavanzada > $mkfechafin){
                $fechafin = $fechaavanzada;
                $fechaintermedia = $fechaavanzada;
            }else{
                $fechaintermedia = $fechaavanzada;
            }
        }else{
            $fechaavanzada = $fechafin;
            $fechaintermedia = $fechafin;
        }


        return array(
            'yAxis' => $yAxis,
            'xAxis' => $charData,

            'fechainicio' => $fechainicio,
            'fechaintermedia' => $fechaintermedia,
            'fechaavanzada' => $fechaavanzada,
            'fechafin' => $fechafin,

            'title' => $guides[0]['denominacion'],
            'cantidadmediciones' => count($mediciones),
            'maximo' => $maximo
        );
    }

    /**
     * Obtiene todos los datos necesarios para generar reporte
     *
     * @param $idestudio
     * @param $idproyecto
     *
     * @return array
     * @author    Ing. Dasley Tejeda Puentes
     * @copyrigth XETID, Cuba
     */
    public function getDatosReporte($idestudio, $idproyecto) {

        $data = array();
        $etapas = $this->getProyectoProyectoCurvaconflicto($idproyecto);
        $mediciones = $this->getMediciones($idestudio);
        $intensidad = $this->getIntensidadconflicto($idestudio, true);

        $data[0]->tipo = 'descripcion';
        $data[0]->columnas = array('Etapa temprana','Etapa intermedia','Etapa avanzada');
        $data[0]->referencia = array('fechainicio','fechaintermedia','fechaavanzada');
        $data[0]->nombredescripcion = 'Descripción';
        $data[0]->encabezado = 'Fechas de inicio de las etapas del conflicto';
        $data[0]->datos = $etapas;

        $data[1]->tipo = 'descripcion';
        $data[1]->columnas = array('Terminología','Nivel intensidad');
        $data[1]->referencia = array('terminologia','nivelintensidad');
        $data[1]->nombredescripcion = 'Descripción';
        $data[1]->encabezado = 'Intensidad del conflicto';
        $data[1]->datos = $intensidad;


        $data[2]->tipo = 'descripcion';
        $data[2]->columnas = array('Fecha de la medición','Valor');
        $data[2]->referencia = array('fechamedicion','valormedicion');
        $data[2]->nombredescripcion = 'Valoración de medición';
        $data[2]->encabezado = 'Mediciones';
        $data[2]->datos = $mediciones;

        $data[3]->tipo = 'diagrama';
        $data[3]->encabezado = 'Diagrama';
        $data[3]->chartid = 'report_curva';

        return $data;
    }

}
