<?php

/**
 * Clase modelo <b>Tasa</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class TasaModel extends ZendExt_Model
{
    /**
     * Constuctor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona una tasa
     *
     * @param DatTasa $objDatTasa Objeto que ser\xE1 adicionado
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function insertarDatTasa(DatTasa $objDatTasa, $idestructura)
    {
        try {
            $entidad = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $objDatTasa->idestructuracomun = $entidad;

            $nombre = $objDatTasa->buscarDatTasa(
                array('nombretasa' => $objDatTasa->nombretasa, 'idestructuracomun' => $entidad)
            );
            if ($objDatTasa->idtipotasa == 1 && $nombre['cant'] == 0) {
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $objDatTasa->save();
                $cc->commit();
                return '-1';
            } else {
                if ($nombre['cant'] == 0) {
                    $params = array('idtipotasa'        => $objDatTasa->idtipotasa,
                                    'idmoneda'          => $objDatTasa->idmoneda,
                                    'idestructuracomun' => $entidad,
                                    'idmonedacontable'  => $objDatTasa->idmonedacontable);
                    if ($objDatTasa->idtipotasa == 2) {
                        $params['desde'] = $objDatTasa->desde;
                        $params['hasta'] = $objDatTasa->hasta;
                    }
                    $tasa = $objDatTasa->buscarDatTasa($params);
                    if ($tasa['cant'] == 0) {
                        $dm = Doctrine_Manager::getInstance();
                        $cc = $dm->getCurrentConnection();
                        $cc->beginTransaction();
                        $objDatTasa->save();
                        $cc->commit();
                        return '-1';
                    } else {
                        return '-3';
                    }
                } else {
                    return '-2';
                }
            }
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF14', $ee);
        }
    }

    /**
     * Adiciona una tasa base
     *
     * @param mixed $objTasaBase Objeto que ser\xE1 adicionado
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function adicionarTasaBase($objTasaBase)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $cc->beginTransaction();
            $objTasaBase->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            $cc->rollback();
            throw $ee;
        }
    }

    /**
     * Elimina una tasa
     *
     * @param array $array            Array de elementos a ser eliminados
     * @param array $nosepudieronElim Array de elementos que no pueden ser eliminados
     *
     * @return array Elementos que no pudieron ser eliminados
     * @throws Doctrine_Exception
     * @throws Doctrine_Connection_Pgsql_Exception
     */
    public function eliminarDatTasa(&$array, &$nosepudieronElim)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        foreach ($array as $key => $id) {
            $obj = Doctrine::getTable('DatTasa')->find($id);
            try {
                self::auxEliminar($obj);
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    $nosepudieronElim .= (!$nosepudieronElim) ? $obj->nombretasa
                        : ',' . $obj->nombretasa;
                    unset($array[$key]);
                    array_values($array);
                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }
                    self::eliminarDatTasa($array, $nosepudieronElim);
                } else {
                    echo $e->getMessage();
                }
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        return $nosepudieronElim;
    }

    private function auxEliminar($obj)
    {
        if ($obj->idtasa) {
            $obj->delete();
        }
    }

    /**
     * Modifica una tasa
     *
     * @param DatTasa $objDatTasa Objeto a ser modificado
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    public function modificarDatTasa(DatTasa $objDatTasa, $idestructura)
    {
        try {
            $entidad = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $venta = $objDatTasa->venta;
            $compra = $objDatTasa->compra;
            $desde = $objDatTasa->desde;
            $hasta = $objDatTasa->hasta;
            $idcliente = $objDatTasa->idcliente;
            $referencia = $objDatTasa->referencia;
            $idtipotasa = $objDatTasa->idtipotasa;
            $factordeconversion = $objDatTasa->factordeconversion;
            $nombretasa = $objDatTasa->nombretasa;
            $idtasa = $objDatTasa->idtasa;
            $idmonedacontable = $objDatTasa->idmonedacontable;
            $idmoneda = $objDatTasa->idmoneda;
            $version = $objDatTasa->version;
            $tasa = $objDatTasa->buscarDatTasa(
                array('nombretasa'        => $nombretasa,
                      'idestructuracomun' => $entidad,
                      'idmonedacontable'  => $idmonedacontable)
            );

            $params =  array('idmoneda'          => $idmoneda,
                             'idtipotasa' => $idtipotasa,
                             'idestructuracomun' => $entidad,
                             'idmonedacontable'  => $idmonedacontable);
            if ($objDatTasa->idtipotasa == 2) {
                $params['desde'] = $objDatTasa->desde;
                $params['hasta'] = $objDatTasa->hasta;
            }
            $tasac = $objDatTasa->buscarDatTasa($params);
            $valid = false;
            if ((!$tasa['cant'] && !$tasac['cant'])) {
                $valid = true;
            } else {
                if ($tasac['cant'] && !$tasa['cant']) {
                    $valid = self::auxModificarCuatro($tasac, $idtasa);
                } else {
                    $valid = self::auxModificar($tasa, $tasac, $idtasa, $idtipotasa);
                }
            }
            if ($valid) {
                $objDatTasa->venta = $venta;
                $objDatTasa->compra = $compra;
                $objDatTasa->desde = $desde;
                $objDatTasa->hasta = $hasta;
                $objDatTasa->idcliente = $idcliente;
                $objDatTasa->referencia = $referencia;
                $objDatTasa->idtipotasa = $idtipotasa;
                $objDatTasa->idmonedacontable = $idmonedacontable;
                $objDatTasa->idmoneda = $idmoneda;
                $objDatTasa->factordeconversion = $factordeconversion;
                $objDatTasa->nombretasa = $nombretasa;
                $objDatTasa->idtasa = $idtasa;
                $objDatTasa->version = $version;
                $dm = Doctrine_Manager::getInstance();
                $cc = $dm->getCurrentConnection();
                $cc->beginTransaction();
                $objDatTasa->save();
                $cc->commit();

                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    private function auxModificarCuatro($tasac, $idtasa)
    {
        if ($tasac['cant'] == 1 && $idtasa == $tasac['datos'][0]['idtasa']
        ) {
            $valid = true;
        } else {
            $valid = false;

        }
        return $valid;
    }

    private function auxModificar($tasa, $tasac, $idtasa, $idtipotasa)
    {
        if ($tasa['cant'] && !$tasac['cant']) {
            $valid = self::auxModificarDos($tasa, $idtasa);
        } else {
            if (($tasa['cant'] == 1 && $tasac['cant'] == 1)
                && ($idtasa == $tasa['datos'][0]['idtasa']
                    && $idtasa == $tasac['datos'][0]['idtasa'])
            ) {
                $valid = true;
            } else {
                $valid = self::auxModificarTres($tasa, $idtipotasa);
            }
        }
        return $valid;
    }

    private function auxModificarDos($tasa, $idtasa)
    {
        if ($tasa['cant'] == 1
            && $idtasa == $tasa['datos'][0]['idtasa']
        ) {
            $valid = true;
        } else {
            $valid = false;
        }
        return $valid;
    }

    private function auxModificarTres($tasa, $idtipotasa)
    {
        if ($idtipotasa != 1) {
            $valid = false;
        } else {
            if ($tasa['cant'] == 1) {
                $valid = true;
            } else {
                $valid = false;
            }
        }
        return $valid;
    }

    /**
     * Busca una tasa a partir de su identificador
     *
     * @param mixed $idtasa Identificador de la tasa
     *
     * @return DatTasa Tasa
     * @throws Doctrine_Exception
     */
    public function BuscarTasaById($idtasa)
    {
        try {
            $datTasa = Doctrine::getTable('DatTasa')->find($idtasa);
            return $datTasa;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function cargarclientes($post){
        $idestructura = $post['idestructura'];
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $filtro = array();
        if ($post['filtronomb']) {
            $filtro = array('filtronomb' => $post['filtronomb']);
        }
        return $this->integrator->datosmaestros->getClientesProveedorByParams(
            null, $idestructura, true, true, $filtro, $post['start'], $post['limit']
        );
    }

}
