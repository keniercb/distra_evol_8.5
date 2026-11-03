<?php

/**
 *
 *
 * @author         Ing. Lisvany Alonso Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Models/Bussines
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class ElementoTipoContratoModel extends ZendExt_Model
{
    private $_helper;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_helper = new HelperModel();
        $this->_tipocontrato = new DatTipoContrato();
    }

    public function guardarElementoTipoContrato($data)
    {
        $addData = json_decode($data['addData']);
        if (!empty($addData)) {
            $array = json_decode(self::rowElemento());
            $resulAdd = self::addElementoTipoContrato($addData, $array);
        }
        $upData = json_decode($data['upData']);
        if (!empty($upData)) {
            $array = json_decode(self::rowElemento());
            $resulUp = self::upElementoTipoContrato($upData, $array);
        }
        $delData = json_decode($data['delData']);
        if (!empty($delData)) {
            $resulDel = self::delElementoTipoContrato($delData);
        }
        $fallos = array();
        $fallos = $this->getFails($resulAdd, $fallos, $resulUp, $resulDel);
        if (empty($fallos)) {
            return array('success' => true);
        } else {
            return array('success' => false, 'fallos' => $fallos);
        }
    }

    public function guardarHerenciaTipoContrato($params)
    {
        try {
            if ($this->global->Perfil->idestructuracomun
                != $params['idestructura']
            ) {
                $conexionActual = Doctrine_Manager::getInstance()
                    ->getCurrentConnection();
                $tipocontrato = $conexionActual->fetchAll(
                    "SELECT * FROM mod_crmcontratacion.dat_tipocontrato WHERE 
                               idestructuracomun=" . $params['idestructura']
                );
                if (count($tipocontrato) > 0) {
                    foreach ($tipocontrato as $nuevo) {
                        $tcontrato = $this->_tipocontrato->cargartipocontrato($idestructura= $this->global->Estructura->idestructura
                        );
                        $iguales = false;
                        if (count($tcontrato) > 0) {
                            foreach ($tcontrato as $viejo) {
                                $n_denominacion=str_ireplace('Á', 'A', str_ireplace('É', 'E', str_ireplace('Í', 'I', str_ireplace('Ó', 'O', str_ireplace('Ú', 'U', $nuevo['denominacion'])))));
                                $v_denominacion=str_ireplace('Á', 'A', str_ireplace('É', 'E', str_ireplace('Í', 'I', str_ireplace('Ó', 'O', str_ireplace('Ú', 'U', $viejo['denominacion'])))));

                                if ($n_denominacion == $v_denominacion) {
                                    $iguales = true;
                                    break;
                                }
                            }
                        }

                        if (!$iguales || count($tcontrato) == 0) {
                            $nuevotipocontrato = new DatTipoContrato();
                            $nuevotipocontrato->idestructuracomun
                                = $this->global->Perfil->idestructuracomun;
                            $nuevotipocontrato->idtipocontrato
                                = $nuevo['idtipocontrato'];
                            $nuevotipocontrato->denominacion
                                = $nuevo['denominacion'];
                            $nuevotipocontrato->tipo = $nuevo['tipo'];
                            $nuevotipocontrato->editable = $nuevo['editable'];
                            $nuevotipocontrato->compartimentacion
                                = $nuevo['compartimentacion'];
                            $nuevotipocontrato->cliente = $nuevo['cliente'];
                            $nuevotipocontrato->save();
                        }


                    }
                    return array('success' => true, 'code' => 1);
                } else {
                    return array('success' => true, 'code' => 2);
                }
            } else {
                return array('success' => true, 'code' => 3);
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    private function addElementoTipoContrato($addData, $array)
    {
        $addEx = array();
        if (empty($array) && !is_array($array)) {
            foreach ($addData as $add) {
                $id = self::getID();
                $array [] = [
                    "idelemento"    => $id, "idpadre" => $id, "denominacion" => $add->denominacion,
                    "tipo"          => $add->tipo, "humanlabel" => $add->humanlabel,
                    "namecomponent" => $add->namecomponent, "mextype" => $add->mextype,
                    "cfg"           => $add->cfg, "event" => $add->event, "fuente" => $add->fuente,
                    "ruta"          => $add->ruta, "descripcion" => $add->descripcion, "depth" => $add->depth,
                    "index"         => $add->index, "compartimentacion" => $add->compartimentacion,
                    "obligatorio"   => $add->obligatorio, "leaf" => true
                ];
            }
            $query = "INSERT INTO mod_crmcontratacion.conf_elementotipocontrato(elemento) ";
            $query .= " VALUES ('" . json_encode($array) . "') RETURNING idelemento ;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $addEx[] = $add->denominacion;
            }
            if (empty($addEx)) {
                return array('success' => true);
            }

            return array('success' => false, $addEx);
        } else {
            return self::addElementoTipoContratoIsBe($addData, $array);
        }
    }

    private function addElementoTipoContratoIsBe($addData, $data)
    {
        $upEx = array();
        foreach ($addData as $add) {
            $id = self::getID();
            $data [] = [
                "idelemento"        => $id,
                "idpadre"           => $add->idpadre ? $add->idpadre : $id,
                "denominacion"      => $add->denominacion,
                "tipo"              => $add->tipo,
                "humanlabel"        => $add->humanlabel,
                "namecomponent"     => $add->namecomponent,
                "mextype"           => $add->mextype,
                "cfg"               => $add->cfg,
                "event"             => $add->event,
                "fuente"            => $add->fuente,
                "ruta"              => $add->ruta,
                "descripcion"       => $add->descripcion,
                "depth"             => $add->depth,
                "index"             => $add->index,
                //"orderby"           => $add->orderby,
                "compartimentacion" => $add->compartimentacion,
                "obligatorio"       => $add->obligatorio,
                "leaf"              => true
            ];
        }
        $query = "UPDATE mod_crmcontratacion.conf_elementotipocontrato SET elemento = '" . json_encode($data) . "'";
        $query .= "RETURNING idelemento;";
        $ex = $this->executeQuery($query);
        if (!$ex) {
            $upEx[] = $add->denominacion;
        }
        if (empty($upEx)) {
            return array('success' => true);
        }

        return array('success' => false, $upEx);
    }

    private function upElementoTipoContrato($upData, $data)
    {
        $upEx = array();
        foreach ($upData as $up) {
            foreach ($data as $index => $dat) {
                if ($up->idelemento == $dat->idelemento) {
                    $data [$index] = $up;
                    break;
                }
            }
        }
        $query = "UPDATE mod_crmcontratacion.conf_elementotipocontrato SET elemento = '" . json_encode($data) . "'";
        $query .= "RETURNING idelemento;";
        $ex = $this->executeQuery($query);
        if (!$ex) {
            $upEx[] = $up->denominacion;
        }
        if (empty($upEx)) {
            return array('success' => true);
        }

        return array('success' => false, $upEx);
    }

    /**
     * @param $delData
     * @param $idtipocontrato
     * @param $data
     *
     * @return array
     */
    private function delElementoTipoContrato($delData)
    {
        $upEx = array();
        $queryToExcludeDataDelete
            = "SELECT e ->> 'idelemento' AS idelemento,e ->> 'idpadre' AS idpadre,e ->> 'denominacion' AS denominacion,
                  e ->> 'tipo' AS tipo,e ->> 'humanlabel' AS humanlabel,e ->> 'namecomponent' AS namecomponent,
                  e ->> 'mextype'           AS mextype, e ->> 'cfg' AS cfg,e ->> 'event' AS event,
                  e ->> 'fuente'AS fuente, e ->> 'ruta' AS ruta,e ->> 'descripcion' AS descripcion,e ->> 'leaf' AS leaf,
                  e ->> 'compartimentacion' AS compartimentacion,e ->> 'obligatorio' AS obligatorio,
                  e ->> 'depth' AS depth, e ->> 'index'AS index
                FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e
                WHERE cast (e ->> 'idelemento' AS INTEGER) NOT IN (" . implode(',', $delData) . ")
                ORDER BY idpadre, idelemento, index;";
        $tmp = $this->executeQuery($queryToExcludeDataDelete, 1);
        $query = "UPDATE mod_crmcontratacion.conf_elementotipocontrato SET elemento = '" . json_encode($tmp) . "'";
        $query .= "RETURNING idelemento ;";
        $ex = $this->executeQuery($query);
        if (!$ex) {
            $upEx[] = 'ERROR';
        }
        $queryForValueLost = $this->createQueryForvalueLost();

        $queryForUpdateValueOutValueLost = $this->createQueryForUpdateValueOutValueLost();

        while ($this->executeQuery($queryForValueLost) > 0) {
            $dataUp = $this->executeQuery($queryForUpdateValueOutValueLost, 1);
            $query = "UPDATE mod_crmcontratacion.conf_elementotipocontrato SET elemento = '"
                . json_encode($dataUp) . "'";
            $query .= "RETURNING idelemento;";
            $ex = $this->executeQuery($query);
            if (!$ex) {
                $upEx[] = 'ERROR';
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }

        return array('success' => false, $upEx);
    }

    private function rowElemento()
    {
        $query = "SELECT ce.elemento FROM mod_crmcontratacion.conf_elementotipocontrato ce";
        return self::executeQuery($query);
    }

    private function getID()
    {
        return self::executeQuery("SELECT nextval('mod_crmcontratacion.sec_elementotipocontratoidelemento_seq');");
    }

    /**
     * @param $query
     *
     * @return string
     * @throws Doctrine_Connection_Exception
     */
    private function executeQuery($query, $up = 0)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            if ($up) {
                return $conexionActual->fetchAll($query);
            } else {
                $statementCant = $conexionActual->execute($query);
                return $statementCant->fetchColumn(0);
            }
        } catch (Exception $e) {
            throw $e;
            return false;
        }
    }

    public function cargarDir($request)
    {
        $ruta = $request['node'];
        $arrtreedirectorios = array();
        $arrtreefiles = array();

        if ($ruta == 'root') {
            $arrtreedirectorios = $this->getFirstLevel($arrtreedirectorios);
        } else {
            list($arrtreefiles, $arrtreedirectorios) = $this->getOtherlevel($ruta, $arrtreefiles, $arrtreedirectorios);

        }
        return (!empty($arrtreefiles)) ? $arrtreefiles : $arrtreedirectorios;
    }

    public function cargarCampos($request)
    {
        $ruta = str_replace(Zend_Registry::get('config')->dir_aplication, '/', $request['ruta']);
        $this->_helper->inludeDomainModel(Zend_Registry::get('config')->dir_aplication . $ruta);
        $entidad = new $request['clase']();
        $array = array_keys($entidad->getData());
        foreach ($array as $key => $value) {
            $response[$key]['denominacion'] = $value;
        }
        return $response;
    }

    /**
     * @param $resulAdd
     * @param $fallos
     * @param $resulUp
     * @param $resulDel
     *
     * @return mixed
     */
    private function getFails($resulAdd, $fallos, $resulUp, $resulDel)
    {
        if (!$resulAdd['success']) {
            $tmp = array();
            foreach ($resulAdd[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['add'] = $tmp;
            }
        }
        if (!$resulUp['success']) {
            $tmp = array();
            foreach ($resulUp[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['edit'] = $tmp;
            }
        }
        if (!$resulDel['success']) {
            $tmp = array();
            foreach ($resulDel[0] as $r) {
                if ($r['success']) {
                    $tmp[] = $r;
                }
            }
            if (!empty($tmp)) {
                $fallos['del'] = $tmp;
                return $fallos;
            }
            return $fallos;
        }
        return $fallos;
    }

    /**
     * @param $idtipocontrato
     *
     * @return string
     */
    private function createQueryForvalueLost()
    {
        $queryForValueLost
            = "SELECT count(e ->> 'denominacion') AS cant
                            FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e
                            WHERE (SELECT count(e2 ->> 'idelemento')
                            FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e2
                            WHERE e ->> 'idpadre' = e2 ->> 'idelemento') = 0;";
        return $queryForValueLost;
    }

    /**
     * @param $idtipocontrato
     *
     * @return string
     */
    private function createQueryForUpdateValueOutValueLost()
    {
        $queryForUpdateValueOutValueLost
            = "SELECT e ->> 'idelemento' AS idelemento, e ->> 'idpadre' AS idpadre,e ->> 'denominacion' AS denominacion,
                      e ->> 'tipo' AS tipo,e ->> 'humanlabel' AS humanlabel,e ->> 'namecomponent' AS namecomponent,
                      e ->> 'mextype' AS mextype,e ->> 'cfg' AS cfg,e ->> 'event' AS event,e ->> 'fuente' AS fuente,
                      e ->> 'ruta' AS ruta,e ->> 'descripcion' AS descripcion,e ->> 'leaf' AS leaf,
                      e ->> 'compartimentacion' AS compartimentacion,e ->> 'obligatorio' AS obligatorio,
                      e ->> 'depth' AS depth,e ->> 'index' AS index
                    FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e
                    WHERE (SELECT count(e2 ->> 'idelemento')
                    FROM mod_crmcontratacion.conf_elementotipocontrato el, json_array_elements(el.elemento) e2
                    WHERE e ->> 'idpadre' = e2 ->> 'idelemento') > 0
                    ORDER BY idpadre, idelemento, index;";
        return $queryForUpdateValueOutValueLost;
    }

    /**
     * @param $arrtreedirectorios
     *
     * @return array
     * @throws Zend_Exception
     */
    private function getFirstLevel($arrtreedirectorios)
    {
        $dirapplication = Zend_Registry::get('config')->dir_aplication;

        //toma la ruta de todos los directorios que hay en dir_aplication
        $arrdirectorios = glob($dirapplication . '*', GLOB_ONLYDIR);

        foreach ($arrdirectorios as $value) {
            $arrexplode = explode('/', $value);
            $cantexplode = count($arrexplode);
            $arrtreedirectorios[] = array('id' => $value, 'text' => $arrexplode[$cantexplode - 1], 'leaf' => false);
        }
        return $arrtreedirectorios;
    }

    /**
     * @param $ruta
     * @param $arrtreefiles
     * @param $arrtreedirectorios
     *
     * @return array
     */
    private function getOtherlevel($ruta, $arrtreefiles, $arrtreedirectorios)
    {
//toma la ruta de todos los directorios que hay en $ruta
        $arrdirectorios = glob($ruta . '/*', GLOB_ONLYDIR);
        //Ciclo que controla los directorios
        foreach ($arrdirectorios as $dir) {
            $explodedir = explode('/', $dir);
            $cantexplodedir = count($explodedir);

            if ($explodedir[$cantexplodedir - 1] === 'models'
                || $explodedir[$cantexplodedir - 1] === 'controllers'
            ) {

                $clases = 'domain/';
                $arrphpfiles = glob($ruta . '/models/' . $clases . '*.php', GLOB_BRACE);
                foreach ($arrphpfiles as $file) {
                    $this->_helper->inludeDomainModel($file);
                    $arrclasesbyfile = $this->_helper->get_class_name_from_file($file, true);
                    foreach ($arrclasesbyfile as $class) {
                        $arrtreefiles[] = array('id' => $file, 'text' => $class, 'leaf' => true, 'tablename' => Doctrine::getTable($class)->getTableName());
                    }
                }
                break;
            } else {
                $arrtreedirectorios[] = array('id'   => $dir, 'text' => $explodedir[$cantexplodedir - 1],
                                              'leaf' => false);
            }
        }
        return array($arrtreefiles, $arrtreedirectorios);
    }

}
