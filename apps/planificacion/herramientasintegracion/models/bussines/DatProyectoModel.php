<?php

class DatProyectoModel extends ZendExt_Model
{

    /**
     * @copyright XETID Cuba
     * @author Ing Roberto Yasel Garcia Quintana
     * @name eliminarProyecto
     * @param $idProyecto : Identificador del proyecto a eliminar
     * @use Funcion para eliminar un proyecto
     * @return mixed
     */
    public static function eliminarProyecto($idProyecto)
    {
        return DatProyecto::eliminarProyecto($idProyecto);
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function eliminarInformacion($obj)
    {
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

    //------------------------------------------------------------------------------------------------------------------ PROYECTOS
    public function saveProyecto($objeto, $concepto)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $mensaje = false;
        $mostMensajes = false;
        $res = false;

        if ($concepto) {
            $conceptoOperacion = $concepto['concepto'];
            $campoId = $concepto['campoid'];
        }
        if (count($objeto['del']) > 0) {
            $variablesDel = $objeto['del'];
            foreach ($variablesDel as $key) {
                $date = date('d/m/Y');
                $objVar = Doctrine::getTable('DatProyecto')->find($key['idproyecto']);
                $objVar->fechafin = $date;
                $this->guardarInformacion($objVar);
            }
            $res = false;
        }
        if (count($objeto['mod']) > 0) {
            if (!$mensaje) {
                $mensaje .= 'Algunas modificaciones no pudieron ejecutarse porque ya existen otros proyectos con la misma denominación: <br>';
            }
            $mensaje .= '&nbsp;&nbsp;&nbsp;* No modificados: <br><i>';

            $variablesMod = $objeto['mod'];
            foreach ($variablesMod as $key) {
                if ($this->validarDenominacionProyecto($key['denominacion'], $concepto, $key['idproyecto'])) {
                    $objVar = Doctrine::getTable('DatProyecto')->find($key['idproyecto']);
                    $objVar->denominacion = $key['denominacion'];
                    $objVar->descripcion = $key['descripcion'];
                    if ($key['fechafin'] != '') {
                        $objVar->fechafin = $key['fechafin'];
                    } else {
                        $objVar->fechafin = null;
                    }
                    $res = $this->guardarInformacion($objVar);

                    if ($key['foco']) {
                        $objNew = Doctrine::getTable($conceptoOperacion)->findOneBy('idproyecto', $key['idproyecto']);
                        $objNew->foco = $key['foco'];
                        $this->guardarInformacion($objNew);
                    }

                } else {
                    $res = (!$res) ? true : $res;
                    $mostMensajes = true;
                    $mensaje .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ' . $key['denominacion'] . '.<br>';
                }
            }
            $mensaje .= '<i><br>';
        }

        if (count($objeto['add']) > 0) {
            if (!$mensaje) {
                $mensaje .= 'Algunas adiciones  no pudieron ejecutarse porque ya existen otros proyectos con la misma denominación: <br>';
            }
            $mensaje .= '&nbsp;&nbsp;&nbsp;* No adicionados: <br><i>';

            $variablesAdd = $objeto['add'];
            foreach ($variablesAdd as $key) {
                if (!$concepto['nativo'] || $this->validarDenominacionProyecto($key['denominacion'], $concepto)) {
                    $objVar = new DatProyecto();
                    $objVar->denominacion = $key['denominacion'];
                    $objVar->descripcion = $key['descripcion'];

                    $objVar->fechaini = date('Y/m/d');
                    if (isset($key['fechafin']))
                        $objVar->fechafin = $key['fechafin'];
                    $res = $this->guardarInformacion($objVar);

                    if ($res->idproyecto && $concepto) {
                        $objNew = new $conceptoOperacion();

                        if ($conceptoOperacion == 'DatProyectoahp') {
                            if($key['foco']){
                                $objNew->foco = $key['foco'];
                            }
                        } else if($conceptoOperacion == 'DatEstudiocurvaconflicto'){
                            if($key['fromproblema']){
                                $objNew->fromproblema = true;
                                $key['escala'] = true;
                            }
                            if($key['escala']){
                                $objNew->escala = true;
                            }
                        }
                        $objNew->idproyecto = $res->idproyecto;
                        if ($concepto['nativo']) {
                            $objNew->nativo = true;
                        }
                        $res1 = $this->guardarInformacion($objNew);

                        if($conceptoOperacion == 'DatEstudiocurvaconflicto' && $key['escala']){

                            $arrayIntensidad = self::obtenerConfiguracion();
                            $long = count($arrayIntensidad);

                            for($i = 0; $i < $long; $i++){
                                $objInt = new DatIntensidadconflicto();
                                $objInt->terminologia = $arrayIntensidad[$i]['terminologia'];
                                $objInt->nivelintensidad = $arrayIntensidad[$i]['nivelintensidad'];
                                $objInt->descripcion = $arrayIntensidad[$i]['descripcion'];
                                $objInt->idestudiocurvaconflicto = $objNew->idestudiocurvaconflicto;
                                $resInt = $this->guardarInformacion($objInt);
                            }
                        }

                        if ($concepto['conceptoAsociado']) {
                            $conceptoAsociado = $concepto['conceptoAsociado'];
                            $campoIdAsociado = $concepto['campoidAsociado'];
                            $idConceptoAsociado = $concepto['idconceptoAsociado'];

                            $objAsoc = new $conceptoAsociado();
                            $objAsoc->$campoIdAsociado = $idConceptoAsociado;
                            $objAsoc->idproyecto = $res->idproyecto;
                            $this->guardarInformacion($objAsoc);

                            if($conceptoAsociado == 'DatPronosticoproblemaproyecto'){
                                $objPronostico = Doctrine::getTable('DatPronosticoproblema')->find($idConceptoAsociado);
                                $idsituacion = $objPronostico->idsituacion;
                                $objSitActual = Doctrine::getTable('DatSituacionactual')->findBy('idsituacion', $idsituacion)->getLast();
                                $idsituacionactual = $objSitActual->idsituacionactual;
                                $arrayFactores = Doctrine::getTable('DatFactores')->findBy('idsituacionactual', $idsituacionactual)->toArray();

                                foreach ($arrayFactores as $keyFac) {
                                    $objFac = new DatFactorahp();
                                    $objFac->idproyectoahp   = $objNew->idproyectoahp;
                                    $objFac->denominacion   = $keyFac['denominacion'];
                                    $objFac->descripcion   =  $keyFac['descripcion'];
                                    $this->guardarInformacion($objFac);
                                }
                            }
                        }
                    }
                } else {
                    $res = (!$res) ? true : $res;
                    $mostMensajes = true;
                    $mensaje .= '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ' . $key['denominacion'] . '.<br>';
                }
            }
            $mensaje .= '<i><br>';
        }
        $conn->commit();
        if ($res) {
            if ($mostMensajes) {
                return array('mostrarMens' => $mostMensajes, 'mensaje' => $mensaje);
            } else {
                return array('idproyecto' => $res->idproyecto, $campoId => $res1->$campoId);
            }
        } else {
            return $res;
        }
    }

    function obtenerConfiguracion() {
        $dir_www = $_SERVER ['DOCUMENT_ROOT'];
        $dir = split("web", $dir_www);
        $dir_abs_mt = $dir[0];

        $configFile = $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'pye' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'configuracion' . DIRECTORY_SEPARATOR . 'configuracion.xml';
        $resXML = array();
        if (file_exists($configFile)) {
            $xmlCargado = simplexml_load_file($configFile);
            $resXML = self::obtenerElementos($xmlCargado);
        }
        return $resXML;
    }

    function obtenerElementos($xmlCargado) {
        $res = array();
        foreach ($xmlCargado as $xml) {
            $temp = array();
            $temp['terminologia']       = (string)  $xml['terminologia'];
            $temp['descripcion']        = (string)  $xml['descripcion'];
            $temp['nivelintensidad']    = (int)     $xml['nivelintensidad'];
            $res[] = $temp;
        }
        return $res;
    }

    public function guardarInformacion($obj)
    {
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

    public function validarDenominacionProyecto($denominacion, $concepto, $idproyecto = false)
    {
        $tabla = $concepto['concepto'];
        $idtabla = $concepto['campoid'];
        $date = date('d/m/Y');
        $query = new Doctrine_Query ();
        $query->from("DatProyecto p, p.$tabla t")->where("lower(p.denominacion) = ? and t.nativo = ? and (p.fechafin is NULL or p.fechafin > ?)", array($denominacion, true, $date));
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if (empty($result)) {
            return true;
        } else {
            if ($idproyecto && $idproyecto == $result[0]['idproyecto']) {
                if (count($result) > 1) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    public function getProyecto($idproyectodelphi)
    {
        return DatProyectodelphi::getProyectodelphi($idproyectodelphi);
    }

    public function getProyectos($concepto, $start, $limit)
    {
        return DatProyecto::getProyectosByConcepto($concepto, $start, $limit);
    }

}
