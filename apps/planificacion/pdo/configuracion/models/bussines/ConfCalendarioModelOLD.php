<?php

class ConfCalendarioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarDiasCalendario($parametros)
    {
        $anno = $parametros['anno'];
        $fechas = $parametros['fechas'];
        $calendarioFechas = new ConfCalendariofechas();
        $calendario = $calendarioFechas->getCalendarioPorTipodia(
            $parametros
        );
        if (isset($calendario[0])) {
            $idcalendario = $calendario[0]['idcalendario'];
            $fechas = explode(',', $fechas);
            $parametros['fechas'] = $this->getFechasToAdd(
                $idcalendario, $anno, $fechas
            );
            $parametros['heredada'] = 0;
            $calendarioFechasModel = new ConfCalendariofechasModel();
            $result = $calendarioFechasModel->modificar(
                $parametros, $idcalendario
            );
            $parametros['idcalendario'] = $idcalendario;
            $this->actualizarDiasCalendario($parametros, 'MOD');
        } else {
            $parametros['heredada'] = 0;
            $result = $this->adicionarCalendario(
                $parametros
            );
        }
        $result_hijo = $this->adicionarCalendarioEntidadesHijas(
            $parametros, false
        );
        $r['add_estructura'] = $result;
        $r['add_estructura_hija'] = $result_hijo;
        return $r;
    }

    public function eliminarDiasCalendario($parametros)
    {
        $calendario = new ConfCalendario();
        $existe = $calendario->existeEstructuraDadoAnno($parametros);

        if (isset($existe[0])) {
            $result = $this->actualizarDiasCalendario($parametros, 'DEL');
            if ($result) {
                $r['cod'] = 1;
            } else {
                $r['cod'] = 3;
            }
        } else {
            $r['cod'] = 2;
        }
        return $r;
    }

    public function eliminarCalendario($parametros)
    {
        $calendario = new ConfCalendario();
        $existe = $calendario->existeEstructuraDadoAnno($parametros);

        if (isset($existe[0])) {
            foreach ($existe as $value => $key) {
                $result = $calendario->eliminar($key['idcalendario']);
            }
            if ($result) {
                $r['cod'] = 1;
            } else {
                $r['cod'] = 3;
            }
        } else {
            $r['cod'] = 2;
        }
        return $r;
    }

//Funcion para delegar la configuracion de la entidad padre a sus entidades hijas
    public function delegarCalendario($parametros)
    {
        extract($parametros);
        $confCalendario = new ConfCalendario();
        $calendario = $confCalendario->getCalendarioPorEstructura(
            $idestructura, $anno
        );

        if (isset($calendario[0])) {
            $calendario = $this->convertirArrayToUnidimensional($calendario);
            $result = true;
            foreach ($calendario as $value => $key) {
                $parametros['idtipodia'] = $key['idtipodia'];
                $parametros['horas'] = $key['horas'];
                $parametros['fechas'] = $key['fecha'];
                $res = $this->adicionarCalendarioEntidadesHijas(
                    $parametros, true
                );
                if (is_array($res)) {
                    return $res;
                }
                if (!$res) {
                    $result = false;
                }
            }
            ($result) ? $r['cod'] = 1 : $r['cod'] = 3;
        } else {
            $r['cod'] = 2;
        }
        return $r;
    }

    public function compartirCalendario($parametros)
    {
        extract($parametros);
        $confCalendario = new ConfCalendario();
        $calendario = $confCalendario->getCalendarioPorEstructura(
            $idestructuracompartir, $anno
        );

        if (isset($calendario[0])) {
            $calendario = $this->convertirArrayToUnidimensional($calendario);
            $result = true;
            $eliminar = $this->eliminarCalendarioPorEstructura($parametros);

            if ($eliminar) {
                foreach ($calendario as $value => $key) {
                    $parametros['idtipodia'] = $key['idtipodia'];
                    $parametros['horas'] = $key['horas'];
                    $parametros['fechas'] = $key['fecha'];
                    $res = $this->adicionarCalendario($parametros);
                    if (!$res) {
                        $result = false;
                    }
                }
                ($result) ? $r['cod'] = 1 : $r['cod'] = 2;
            } else {
                $r['cod'] = 3;
            }
        } else {
            $r['cod'] = 3;
        }
        return $r;
    }
//Funcion que actualiza las fechas segun el tipo de dia despues de la accion de
// adicionar o eliminar para evitar que se repitan la fechas.
    public function actualizarDiasCalendario($parametros, $accion)
    {
        $fechasUpdate = $parametros['fechas'];
        $idcalendario = $parametros['idcalendario'];
        $calendarioFechas = new ConfCalendariofechas();
        $calendario = $calendarioFechas->getDiasDadoEstructura($parametros);
        $calendarioMod = $this->getFechasCalendarioPostAccion(
            $calendario, $fechasUpdate, $accion, $idcalendario
        );
        $modelConfCalendarioFechas = new ConfCalendariofechasModel();
        foreach ($calendarioMod as $value => $key) {
            if ($key['idcalendario']
                != $idcalendario
            ) {
                $fechas = $key['fechas'];
                $idcalendario = $key['idcalendario'];
                $result = $modelConfCalendarioFechas->modificarFechas(
                    $fechas, $idcalendario
                );
            }
        }
        return $result;
    }

    public function getEstructuraPorTipodia($idestructura, $idtipodia)
    {
        try {

            $calendario = Doctrine::getTable('ConfCalendario')->findByDql(
                "idestructura = $idestructura AND idtipodia = $idtipodia", null,
                Doctrine::HYDRATE_ARRAY
            );
            if (isset($calendario[0])) {
                return $calendario;
            } else {
                return false;
            }

        } catch (Exception $e) {
            throw $e;
        }

    }

    public function adicionarCalendario($params)
    {
        try {
            $calendario = new ConfCalendario();
            $calendario->idestructura = $params['idestructura'];
            $calendario->idtipodia = $params['idtipodia'];
            $calendario->save();
            $params['idcalendario'] = $calendario->idcalendario;
            $calendarioFechasModel = new ConfCalendariofechasModel();
            $calendarioFechasModel->adicionar($params);

            $this->actualizarDiasCalendario($params, 'ADD');
            return true;
        } catch (Exception $e) {
            throw $e;
        }

    }

    //Funcion para delegar(antonimo de heredar) el calendario a las entidades hijas segun el tipo de dia
    public function adicionarCalendarioEntidadesHijas($parametros, $delegar
    ) {
        $idestructura = $parametros['idestructura'];
        $entidades_hijas = $this->getEntidadesHijas($idestructura);
        $cant = count($entidades_hijas);
        $result = true;
        $calendarioFechas = new ConfCalendariofechas();
        if ($cant > 0) {
            for ($i = 0; $i < $cant; $i++) {
                $parametros['idestructura'] = $entidades_hijas[$i];
                $calendario = $calendarioFechas->getCalendarioPorTipodia(
                    $parametros
                );
                if (!isset($calendario[0])) {
                    $parametros['heredada'] = 1;
                    $res = $this->adicionarCalendario($parametros);
                    if (!$res) {
                        $result = false;
                    }
                } else {
                    $isHeredada = $calendario[0]['heredada'];
                    if ($delegar || $isHeredada) {
                        $idcalendario = $calendario[0]['idcalendario'];
                        $calendarioFechasModel = new ConfCalendariofechasModel(
                        );
                        $parametros['heredada'] = 1;
                        $res = $calendarioFechasModel->modificar(
                            $parametros, $idcalendario
                        );
                        $parametros['idcalendario'] = $idcalendario;
                        $this->actualizarDiasCalendario($parametros, 'MOD');
                        if (!$res) {
                            $result = false;
                        }

                    }
                }
            }
        } else {
            $r['cod'] = 4;
            $result = $r;
        }
        return $result;
    }

//Funcion para fusionar las fechas que estaban insertadas con las nuevas sin que se repitan
    public function getFechasToAdd($idcalendario, $anno, $fechasNew
    ) {
        $confCalendarioFechas = new ConfCalendariofechas();
        $fechasOld = $confCalendarioFechas->getFechasEstructuraPorTipodia(
            $idcalendario, $anno
        );

        if (isset($fechasOld[0])) {
            $fechasOld = explode(',', $fechasOld[0]['fechas']);
            $fechasNew = array_diff($fechasNew, $fechasOld);
            $result = array_merge($fechasNew, $fechasOld);
            return implode(',', $result);
        }
    }


    public function getEntidadesHijas($idestructura
    ) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura(
            $idestructura
        );

        $entidades_hijas = array();
        foreach ($dominios as $entidad_hija) {
            if ($entidad_hija->leaf == true) {
                $entidades_hijas[] = $entidad_hija->id;
            } else {
                $entidades_hijas[] = $entidad_hija->id;
                $entidades_hijas = array_merge(
                    $entidades_hijas,
                    self::getEntidadesHijas($entidad_hija->id)
                );
            }
        }
        return $entidades_hijas;
    }

//Funcion que actualiza las fechas segun las acciones de adicionar o eliminar
    public function getFechasCalendarioPostAccion($calendario, $fechasUpd,
        $accion, $idcalendario
    ) {
        $result = $this->convertirArrayToUnidimensional($calendario);
        $fechasUpd = (!is_array($fechasUpd)) ? explode(',', $fechasUpd)
            : $fechasUpd;
        foreach ($result as $value => $key) {
            if ($accion == 'DEL'
                || (($accion == 'MOD' || $accion == 'ADD')
                    && $key['idcalendario'] != $idcalendario)
            ) {
                $fechasOld = explode(',', $key['fechas']);
                $fechasNew = implode(',', array_diff($fechasOld, $fechasUpd));
                $result[$value]['fechas'] = $fechasNew;
            }
        }
        return $result;
    }

    public function eliminarCalendarioPorEstructura($parametros)
    {
        $confCalendario = new ConfCalendario();
        $calendarioEliminar = $confCalendario->existeEstructuraDadoAnno(
            $parametros
        );
        $result = true;
        if (isset($calendarioEliminar[0])) {
            foreach ($calendarioEliminar as $value => $key) {
                $res = $confCalendario->eliminar($key['idcalendario']);
                if (!$res) {
                    $result = false;
                }
            }
        }

        return $result;
    }

    public function convertirArrayToUnidimensional($array
    ) {
        $temp = array();
        $result = array();
        foreach ($array as $value => $key) {
            foreach ($key as $value1 => $key1) {
                if ($value1 == 'ConfCalendario') {
                    foreach ($key1 as $value2 => $key2) {
                        if ($value2 == 'NomTipoDia') {
                            foreach ($key2 as $value3 => $key3) {
                                $temp[$value3] = $key3;
                            }
                        } else {
                            $temp[$value2] = $key2;
                        }
                    }
                } else {
                    $temp[$value1] = $key1;
                }
            }
            $result[$value] = $temp;
        }
        return $result;
    }

}