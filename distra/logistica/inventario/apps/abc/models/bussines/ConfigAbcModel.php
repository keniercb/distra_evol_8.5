<?php


class ConfigAbcModel extends BaseModel
{
    private $idestructura;

    function __construct()
    {
        $this->idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
    }

    function salvarConfiguracion($tipo, $datos)
    {
        $respuesta = array();
        $respuesta['codigo'] = 1;
        try {
            switch ($tipo) {
                case 1:
                {
                    foreach ($datos as $d) {
                        $obj = Doctrine::getTable('Nomclasificacionabc')->find($d->idclasificacionabc);
                        if (!empty($obj)) {
                            $obj->limiteinferior = $d->limiteinferior;
                            $obj->limiteinferiorpeso = $d->limiteinferiorpeso;
                            $obj->limitesuperior = $d->limitesuperior;
                            $obj->limitesuperiorpeso = $d->limitesuperiorpeso;
                            $obj->save();
                            $respuesta['codigo'] = 1;
                            $respuesta['success'] = true;
                        }
                    }

                    break;
                }

                case 2:
                {
                    $obj = null;
                    if ($datos->iddefinicionpeso == -1) {
                        $obj = new Confdefinicionpeso();
                        if ($obj->existeDefinicionPeso($datos->idclasificacionabc, $datos->idcriteriovaloracion)) {
                            $respuesta['codigo'] = 2;
                            $respuesta['success'] = false;
                            return $respuesta;
                        }
                    } else {
                        $obj = Doctrine::getTable('Confdefinicionpeso')->find($datos->iddefinicionpeso);
                    }
                    if (!empty($obj)) {
                        $obj->idclasificacionabc = $datos->idclasificacionabc;
                        $obj->idcriteriovaloracion = $datos->idcriteriovaloracion;
                        $obj->peso = $datos->peso;
                        $obj->idestructura = $this->idestructura;
                        $obj->save();

                    } else {
                        $respuesta['codigo'] = 3;
                        $respuesta['mensaje'] = 'No existe la definicion del peso.';
                        $respuesta['success'] = false;
                        return $respuesta;
                    }

                    $respuesta['success'] = true;

                    break;
                }


                case 3:
                {
                    $obj = null;
                    if ($datos->idconfperiodosclasificacionabc == -1) {
                        $obj = new Confperiodosclasificacionabc();
                        if ($obj->existePeriodosClasificacionABC($datos->fechainicio, $datos->fechafin)) {
                            $respuesta['codigo'] = 2;
                            $respuesta['success'] = false;
                            return $respuesta;
                        }
                    } else {
                        $obj = Doctrine::getTable('Confperiodosclasificacionabc')->find($datos->idconfperiodosclasificacionabc);
                    }

                    if (!empty($obj)) {
                        $aN = $datos->naturalezas;
                        $aD = $datos->depositos;
                        $aUebs = array_unique($datos->uebs);

                        $obj->fechainicio = $datos->fechainicio;
                        $obj->fechafin = $datos->fechafin;
                        $obj->idestructura = $this->idestructura;
                        $obj->analizar = empty($datos->analizar) ? 0 : 1;

                        if($obj->analizar == 1){
                            $sql = "UPDATE mod_logabc.conf_periodosclasificacionabc set analizar = 0 WHERE idestructura = ?";
                            Doctrine_Manager::getInstance()->getCurrentConnection()->execute($sql, array($obj->idestructura));
                        }

                        $obj->naturalezas = json_encode($aN);
                        $obj->depositos = $aD != '' ? json_encode($aD) : null;
                        $obj->uebs = !empty($aUebs) ? json_encode($aUebs) : null;
                        $obj->save();

                    } else {
                        $respuesta['codigo'] = 3;
                        $respuesta['mensaje'] = 'No existe el per&iacute;odo de clasificaci&oacute;n.';
                        $respuesta['success'] = false;
                        return $respuesta;
                    }

                    $respuesta['success'] = true;

                    break;
                }

                case 4:
                {
                    $conexion = Doctrine_Manager::getInstance()->getCurrentConnection();
                    foreach ($datos as $d) {
                        $obj = Doctrine::getTable('Confparametrosinventario')->find($d->idconfparametrosinventario);
                        if (!empty($obj)) {
                            if($d->formacalculo == 1){
                                $sql = "SELECT expresionacalcular FROM mod_utiles.dat_expresionmatematica WHERE idexpresionmatematica = ?";
                                $rExpMat = $conexion->fetchAll($sql, array($d->idformulaovalorsistema));
                                $obj->formulacalcular = $rExpMat[0]['expresionacalcular'];
                                $obj->idformulaovalorsistema = $d->idformulaovalorsistema;
                                $obj->formula = $d->formulavalorsistema;
                                $obj->valorusuario = null;
                            }else if($d->formacalculo == 2){
                                $obj->formula = null;
                                $obj->formulacalcular = null;
                                $obj->idformulaovalorsistema = null;
                                $obj->valorusuario = $d->formulavalorsistema;
                            }

                            $obj->porcentual = $d->porcentual;
                            $obj->lugaresdecimales = $d->lugaresdecimales;

                            $obj->save();
                            $respuesta['codigo'] = 1;
                            $respuesta['success'] = true;
                        }
                    }

                    break;
                }
                case 5:
                {
                    $mg = Doctrine_Manager::getInstance();
                    $conexion = $mg->getCurrentConnection();

                    $conexion->beginTransaction();

                    $conexion->execute("DELETE FROM mod_logabc.conf_depositosparametrizacion WHERE idestructura = ?", array($this->idestructura));
                    $sql = "INSERT INTO mod_logabc.conf_depositosparametrizacion(idestructura, iddeposito, idueb) VALUES (?, ?, ?);";

                    foreach ($datos as $d) {
                        $conexion->execute($sql, array($this->idestructura, $d->iddeposito, $d->idueb));
                    }
                    $conexion->commit();
                    $respuesta['codigo'] = 1;
                    $respuesta['success'] = true;

                    break;
                }
            }
        } catch (Exception $e) {
            $respuesta['codigo'] = 3;
            $respuesta['mensaje'] = $e->getMessage();
        }
        return $respuesta;

    }

    function eliminarConfiguracion($tipo, $id)
    {
        $respuesta = array();
        $respuesta['codigo'] = 1;
        try {
            switch ($tipo) {
                case 2:
                {
                    $obj = Doctrine::getTable('Confdefinicionpeso')->find($id);
                    if (!empty($obj)) {
                        Doctrine_Query::create()->delete()->from('Confdefinicionpeso')->where('iddefinicionpeso = ?', array($id))->execute();
                    } else {
                        $respuesta['codigo'] = 3;
                        $respuesta['mensaje'] = 'No existe la definicion del peso.';
                        $respuesta['success'] = false;
                        return $respuesta;
                    }

                    $respuesta['success'] = true;

                    break;
                }

                case 3:
                {
                    $obj = Doctrine::getTable('Confperiodosclasificacionabc')->find($id);
                    if (!empty($obj)) {
                        Doctrine_Query::create()->delete()->from('Confperiodosclasificacionabc')->where('idconfperiodosclasificacionabc = ?', array($id))->execute();
                    } else {
                        $respuesta['codigo'] = 3;
                        $respuesta['mensaje'] = 'No existe el per&iacuteodo de clasificaci&oacute;n.';
                        $respuesta['success'] = false;
                        return $respuesta;
                    }

                    $respuesta['success'] = true;

                    break;
                }
            }
        } catch (Exception $e) {
            $respuesta['codigo'] = 3;
            if($e->getCode() == '23503'){
                $respuesta['mensaje'] = "El per&iacute;odo de clasificaci&oacute;n está en uso.";
            }else{
                $respuesta['mensaje'] = $e->getMessage();
            }

        }
        return $respuesta;
    }


}
