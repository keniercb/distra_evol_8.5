<?php

class CaracterizacionentidadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listar($identidad, $node) {
        $elementos = DatVariablecontrol::getVariables($node, $identidad);
        $integrator = ZendExt_IoC::getInstance();
        foreach ($elementos as $i => $elemento) {
            $tooltip = "";
            $tooltip .= "<p><b>Denominación: </b>" . $elemento['text'] . "</p>" .
                    "<p><b>Descripción: </b>" . $elemento['descripcion'] . "</p>";

            if ($elemento['variable'] == 1) {
                $unidad = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($elemento['idunidadmedida']));
                $tipoModelo = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($elemento['idtipomodelo']);
                $tooltip .= "<p><b>Tipo de modelo: </b>" . $tipoModelo[0]["denominacion"] . "</p>" .
                        "<p><b>Unidad de medida: </b>" . $unidad[0]["denominacionunidadmedida"] . "</p>";
            }
            $elementos[$i]['qtip'] = $tooltip;
            $elementos[$i]['denomtipomodelo'] = $tipoModelo[0]["denominacion"];
            $elementos[$i]['denomunidadmedida'] = $unidad[0]["denominacionunidadmedida"];
        }
        return $elementos;
    }

    public function adicionarmodificarElemento($params) {
        if ($params['accion'] == 'a') {
            $padre = null;
            if ($params['idelemento'] != 0 && $params['idelemento'] != '' && $params['idelemento'] != null) {
                $padre = $params['idelemento'];
            }
            $idtipomodelo = null;
            $idunidadmedida = null;
            $variable = 0;
            if ($params['tipo'] == 'v') {
                $idtipomodelo = $params['idtipomodelo'];
                $idunidadmedida = $params['idunidadmedida'];
                $variable = 1;
                $tipomodelo = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($idtipomodelo);
            }
            $objVarControl = new DatVariablecontrol();
            $objVarControl->denominacion = $params['denominacion'];
            $objVarControl->descripcion = $params['descripcion'];
            $objVarControl->identidadcrea = $params['identidad'];
            $objVarControl->idtipomodelo = $idtipomodelo;
            $objVarControl->idpadre = $padre;
            $objVarControl->idarbol = $padre;
            $objVarControl->variable = $variable;
            $objVarControl->idunidadmedida = $idunidadmedida;
            $objVarControl->save();

            //adicionar relacion con entidades
            foreach ($params['entidades'] as $ent) {
                $colobjVarControlentidad = new DatVariablecontrolentidad();
                $colobjVarControlentidad->idvariablecontrol = $objVarControl->idvariablecontrol;
                $colobjVarControlentidad->identidad = $ent;
                $colobjVarControlentidad->save();
                if ($params['tipo'] == 'v') {
                    $this->conn->commit();
                    $this->conn->beginTransaction();
                    //insertar en meta
                    $id = $colobjVarControlentidad->idvariablecontrolentidad;
                    //obteniendo campos y datos a insertar
                    $this->_meta = ZendExt_Metadata::getInstance();
                    $campos = $this->_meta->Metadata()->obtenerConfigFormulario($tipomodelo[0]['idtabla']);
                    foreach ($campos->items as $c) {
                        if ($c['xtype'] == 'combo') {
                            $array[] = $c['hiddenName'];
                        }
                    }
                    if (isset($array)) {
                        foreach ($array as $a) {
                            $explode = explode('_', $a);
                            $data = ereg_replace("[^0-9]", "", $explode[4]);
                            $dn = $this->pIntegrator->planmeta->obtenerDatonomencladorPorDefecto($data);
                            $parametros[$a] = $dn->iddatosnomenclador;
                        }
                    }

                    $insertaok = $this->_meta->Metadata()->insertarEnMetadatos($tipomodelo[0]['idtabla'], $parametros, array('idvariablecontrolentidad' => $id));
                    if ($insertaok != true) {
                        $this->conn->rollback();
                    }
                }
            }
        } else {
            $objVarControl = Doctrine::getTable('DatVariablecontrol')->findByDql("idvariablecontrol={$params['idelemento']}");
            $objVarControl[0]->denominacion = $params['denominacion'];
            $objVarControl[0]->descripcion = $params['descripcion'];
            if ($params['tipo'] == 'v') {
                $objVarControl[0]->idunidadmedida = $params['idunidadmedida'];
            }
            $objVarControl[0]->save();
        }
    }

    public function eliminarElemento($idelemento) {
        DatVariablecontrol::eliminarVariables($idelemento);
    }

    public function ordenarFiltros($filtros, $x) {
        $parametrosDinamicosAFiltrar = array();
        if ($filtros[0]) {
            foreach ($filtros as $p => $datos) {
                if ($datos->field == 'idestructura') {
                    $x->where('ve.identidad', $datos->data->value);
                } elseif ($datos->field == 'valor') {
                    if ($datos->data->comparison == "gt") {
                        $x->where('ve.valor >', $datos->data->value);
                    } elseif ($datos->data->comparison == "lt") {
                        $x->where('ve.valor <', $datos->data->value);
                    } else {
                        $x->where('ve.valor =', $datos->data->value);
                    }
                } elseif ($datos->field == 'idunidadmedida') {
                    $x->where('vc.idunidadmedida', $datos->data->value);
                } else {

                    foreach ($x->ar_select as $field) {
                        $pos = strripos($field, ' as ');
                        $inicio = $pos + 4;

                        $lenght = (strlen($field)) - ($pos + 4);
                        $cadena = substr($field, $inicio, $lenght);

                        if ($datos->field == $cadena) {
                            $pos = strripos($cadena, '_');
                            $denomCampo = substr($cadena, $pos + 1, (strlen($cadena)) - ($pos + 1));
                            break;
                        }
                    }
                    if ($datos->field) {
                        $pos = strripos($datos->field, '_');
                        $denomCampo = substr(
                                $datos->field, $pos + 1, (strlen($datos->field)) - ($pos + 1)
                        );
                        if ($datos->data->type == 'string') {
                            //es un nomenclador
                            if (is_numeric($datos->data->value))
                                $x->where("meta." . $denomCampo, $datos->data->value);
                            else {
                                //es una cadena
                                $x->where("upper(meta. $denomCampo) LIKE '%" . strtoupper($datos->data->value) . "%'");
                            }
                        } else {
                            //es un numero
                            if ($datos->data->type == 'numeric') {
                                if ($datos->data->comparison == "gt") {
                                    $x->where("meta." . $denomCampo . ' >', $datos->data->value);
                                } elseif ($datos->data->comparison == "lt") {
                                    $x->where("meta." . $denomCampo . ' <', $datos->data->value);
                                } else {
                                    $x->where("meta." . $denomCampo . ' =', $datos->data->value);
                                }
                            } else {
                                //es una fecha
                                if ($datos->data->type == 'date') {
                                    $fecha = explode('/', $datos->data->value);
                                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                                    if ($datos->data->comparison == "gt") {
                                        $x->where("meta." . $denomCampo . ' >', $fecha);
                                    } elseif ($datos->data->comparison == "lt") {
                                        $x->where("meta." . $denomCampo . ' <', $fecha);
                                    } else {
                                        $x->where("meta." . $denomCampo . ' =', $fecha);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return $x;
    }

    public function listarDatosEntidadVariable($params, $x) {
        $x->select(
                "ve.idvariablecontrolentidad,
                    ve.idvariablecontrol,
                    ve.identidad as idestructura,
                    ve.valor,
                    vc.idunidadmedida"
        );
        $x->join(
                'mod_spouam.dat_variablecontrolentidad ve', 've.idvariablecontrolentidad = meta.idvariablecontrolentidad'
        );
        $x->join(
                'mod_spouam.dat_variablecontrol vc', 'vc.idvariablecontrol = ve.idvariablecontrol'
        );

        $x->where_in('ve.identidad', $params['identidad']);
        $x->where('ve.idvariablecontrol', $params['idvariable']);
        if ($params['limit']) {
            $x->offset($params['start']);
            $x->limit($params['limit']);
        }
        $x->orderby('ve.valor desc');
        $query = $x->get()->result_array();
        return $query;
    }

    public function listarTotalEntidadVariable($params, $x) {
        $x->select(
                "ve.idvariablecontrolentidad"
        );
        $x->join(
                'mod_spouam.dat_variablecontrolentidad ve', 've.idvariablecontrolentidad = meta.idvariablecontrolentidad'
        );
        $x->join(
                'mod_spouam.dat_variablecontrol vc', 'vc.idvariablecontrol = ve.idvariablecontrol'
        );
        $x->where_in('ve.identidad', $params['identidad']);
        $x->where('ve.idvariablecontrol', $params['idvariable']);
        $query = $x->get()->result_array();
        return count($query);
    }

    public function guardar($parametros) {
        $m = json_decode(stripslashes($parametros['filas']));
        if ($m != null) {
            $obj = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($parametros['idtipomodelo']);
            foreach ($m as $key => $std) {
                //si tengo que insertar em metadatos me lo mandan de la interfaz
                if ($std->insertarenmeta) {
                    $this->_meta = ZendExt_Metadata::getInstance();
                    $this->_meta->Metadata()->modificarEnMetadatos(
                            $obj[0]['idtabla'], (array) $std
                    );
                }
                if (isset($std->valor)) {
                    //modificar valor
                    $planif[$key] = Doctrine::getTable('DatVariablecontrolentidad')->find($std->idvariablecontrolentidad);
                    $planif[$key]->valor = $std->valor;
                    $planif[$key]->save();
                }
            }
        }
    }

    public function listarEntidadesAsociar($idvariable, $accion, $identidades, $identidadcrea) {
        $integrator = ZendExt_IoC::getInstance();
        $contador = 0;
        foreach ($identidades as $key => $value) {
            $obj = Doctrine::getTable('DatVariablecontrolentidad')->findByDql("idvariablecontrol=$idvariable AND identidad=$value");

            if ($accion == 'd') {
                if ($obj[0]->idvariablecontrolentidad && $identidadcrea != $value) {
                    //esta asociada
                    $result[$contador]['idestructura'] = $value;
                    $datosEntidad = $integrator->metadatos->DameEstructura($value);
                    $result[$contador]['denominacion'] = $datosEntidad[0]->denominacion;
                    $contador++;
                }
            } else {
                if (!$obj[0]->idvariablecontrolentidad) {
                    //no esta asociada
                    $result[$contador]['idestructura'] = $value;
                    $datosEntidad = $integrator->metadatos->DameEstructura($value);
                    $result[$contador]['denominacion'] = $datosEntidad[0]->denominacion;
                    $contador++;
                }
            }
        }
        if (!$result[0]) {
            $result = array();
        }
        return $result;
    }

    public function asociarElemento($params) {
        //buscar los elementos padres del elemento seleccionado sin incluir el elemento
        $elementospadres = DatVariablecontrol::getVariablesPadres($params['idelemento'],$params['idarbol']);

        foreach ($elementospadres as $el) {
            foreach ($params['entidades'] as $ent) {
                $objVarControlentidad = Doctrine::getTable('DatVariablecontrolentidad')->findByDql("idvariablecontrol={$el} AND identidad={$ent}");

                if ($objVarControlentidad[0]->idvariablecontrolentidad == null) {
                    $objVarControlentidad = new DatVariablecontrolentidad();
                    $objVarControlentidad->idvariablecontrol = $el;
                    $objVarControlentidad->identidad = $ent;
                    $objVarControlentidad->save();
                }
            }
        }
        //buscar los elementos hijos del elemento seleccionado incluyendo el elemento
        $elementos = DatVariablecontrol::getVariablesHijos($params['idelemento'],$params['idarbol'], true);

        foreach ($elementos as $el) {
            if ($el['variable'] == 1) {
                $tipomodelo = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($el['idtipomodelo']);
                $params['idelemento'] = $el['idvariablecontrol'];
                self::asociarEntidadMeta($params, $tipomodelo);
            } else {
                foreach ($params['entidades'] as $ent) {
                    $objVarControlentidad = Doctrine::getTable('DatVariablecontrolentidad')->findByDql("idvariablecontrol={$el['idvariablecontrol']} AND identidad={$ent}");
                    if ($objVarControlentidad[0]->idvariablecontrolentidad == null) {
                        $colobjVarControlentidad = new DatVariablecontrolentidad();
                        $colobjVarControlentidad->idvariablecontrol = $el['idvariablecontrol'];
                        $colobjVarControlentidad->identidad = $ent;
                        $colobjVarControlentidad->save();
                    }
                }
            }
        }
    }

    public function desasociarElemento($params) {       
        $entidades = implode(',', $params['entidades']);      
        self::desasociarHijosYAMi($params['idelemento'], $entidades,$params['idarbol']);         
        self::desasociarPadres($params['idpadre'], $entidades, $params['idelemento'],$params['idarbol']);
    }

    public function desasociarHijosYAMi($idelemento, $entidades,$idarbol) {
        //desasociar elemento y todos sus hijos
        $elementos = DatVariablecontrol::getVariablesHijos($idelemento,$idarbol);
        foreach ($elementos as $el) {
            DatVariablecontrolentidad::desasociarVar($el, $entidades);
        }
    }

    public function desasociarPadres($idelemento, $entidades, $idelementohijo,$idarbol) {

        $cant = DatVariablecontrol::contRelaciones($entidades, $idelemento, $idelementohijo,$idarbol);
       
        if ($cant > 0) {
            return 20;
        } else {
            DatVariablecontrolentidad::desasociarVar($idelemento, $entidades);
            $variable = Doctrine::getTable('DatVariablecontrol')->findByDql("idvariablecontrol=$idelemento");
            $idpadre = $variable[0]->idpadre;           
            $idarbol = $variable[0]->idarbol;           
            self::desasociarPadres($idpadre, $entidades, $idelemento,$idarbol);
        }
    }

    public function asociarEntidadMeta($params, $tipomodelo) {
        foreach ($params['entidades'] as $ent) {
            $objVarControlentidad = Doctrine::getTable('DatVariablecontrolentidad')->findByDql("idvariablecontrol={$params['idelemento']} AND identidad={$ent}");

            if ($objVarControlentidad[0]->idvariablecontrolentidad == null) {
                $colobjVarControlentidad = new DatVariablecontrolentidad();
                $colobjVarControlentidad->idvariablecontrol = $params['idelemento'];
                $colobjVarControlentidad->identidad = $ent;
                $colobjVarControlentidad->save();
                $this->conn->commit();
                $this->conn->beginTransaction();
                //insertar en meta
                $id = $colobjVarControlentidad->idvariablecontrolentidad;
                //obteniendo campos y datos a insertar
                $this->_meta = ZendExt_Metadata::getInstance();
                $campos = $this->_meta->Metadata()->obtenerConfigFormulario($tipomodelo[0]['idtabla']);
                foreach ($campos->items as $c) {
                    if ($c['xtype'] == 'combo') {
                        $array[] = $c['hiddenName'];
                    }
                }
                if (isset($array)) {
                    foreach ($array as $a) {
                        $explode = explode('_', $a);
                        $data = ereg_replace("[^0-9]", "", $explode[4]);

                        $dn = $this->pIntegrator->planmeta->obtenerDatonomencladorPorDefecto($data);
                        //poner una excpcion para cuando no este el nomenclador (-)
                        $parametros[$a] = $dn->iddatosnomenclador;
                    }
                }
                $insertaok = $this->_meta->Metadata()->insertarEnMetadatos($tipomodelo[0]['idtabla'], $parametros, array('idvariablecontrolentidad' => $id));
                if ($insertaok != true) {
                    $this->conn->rollback();
                }
            }
        }
    }

    public function cargarVariables($params) {
        $result = DatVariablecontrol::cargarVariables($params);
        return $result;
    }

    public function cargarAgrupaciones() {
        $result = DatVariablecontrol::cargarAgrupaciones();
        return $result;
    }

}
