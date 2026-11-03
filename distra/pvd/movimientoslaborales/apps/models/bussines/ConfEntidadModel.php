<?php
class ConfEntidadModel extends ZendExt_Model
{
    protected $_objDomain;
    public function __construct()
    {
        $this->_objDomain = new ConfEntidad();
    }
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function getConfig()
    {
        try {
            $datos = $this->_objDomain->getConfig();
            foreach ($datos as $k => $val) {
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['identidad']);
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idestructura']);
                $datos[$k]['entidad'] = $entidad[0]->denominacion;
                $datos[$k]['estructura'] = $estructura[0]->denominacion;
            }
            $result->datos = $datos;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function existeEntidad($idestructura, $identidad)
    {
        try {
            $datos = $this->_objDomain->existeEntidad($idestructura, $identidad);
            foreach ($datos as $k => $val) {
                $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['identidad']);
                $datos[$k]['entidad'] = $padre[0]->denominacion;
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addConfig($identidad, $arrayEst)
    {
        try {
            foreach ($arrayEst as $v) {
                $existe = $this->_objDomain->existeEntidad($v, $identidad);
                if (count($existe) == 0) {
                    $idcargos = Array();
                    $obj = new ConfEntidad();
                    $obj->identidad = $identidad;
                    $obj->idestructura = $v;
                    $obj->save();
                    //Actualizar UEB en las situaciones laborales correspondientes
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($v, true);
                    if (count($cargos) > 0) {
                        $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                        DatSituacionlaboral::updateUEB($v, $idcargos);
                    }
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateConfig($identidad, $arrayEst)
    {
        try {
            $estructuras = $this->_objDomain->idEntidadByPadre($identidad);
            $this->_objDomain->deleteByIdPadre($identidad);
            foreach ($estructuras as $est) {
                //Poner en null el campo UEB en las situaciones laborales correspondientes
                $idcargos = Array();
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($est['idestructura'], true);
                if (count($cargos) > 0) {
                    $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                    DatSituacionlaboral::updateUEB(null, $idcargos);
                }
            }
            foreach ($arrayEst as $v) {
                $idcargosn = Array();
                $obj = new ConfEntidad();
                $obj->identidad = $identidad;
                $obj->idestructura = $v;
                $obj->save();

                //Actualizar UEB en las situaciones laborales correspondientes
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($v, true);
                if (count($cargos) > 0) {
                    $idcargosn = DatSituacionlaboralModel::getIdCargos($cargos);
                    DatSituacionlaboral::updateUEB($v, $idcargosn);
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteConfig($idestructura)
    {
        try {
            $obj = $this->_objDomain->getById($idestructura);
            $obj->delete();
            //Poner en null el campo UEB en las situaciones laborales correspondientes
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                DatSituacionlaboral::updateUEB(null, $idcargos);
            }
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    /**
     * obtenerIdsConfig Devuelve los identificadores de las unidades organizativas configuradas dada una estructura
     * @param $idestructura Identificador de la estructura que se desea obtener las unidades organizativas configuradas
     * @return array|bool Retorna un arreglo que en la primera posición contiene un número que determina el tipo de
     *      estructuras que está devolviendo (0: Configuraciones de unidades organizativas como Unidades Empresariales
     *      de Base, 1: Entidades del dominio, 2: No posee configuraciones ni entidades en el dominio). En la segunda
     *      posición del arreglo devuelve los identificadores de las estructuras. Cuando se lanza alguna excepción
     *      devuelve falso. Cuando existe alguna configuración para $idestructura devuelve los identificadores de dicha
     *      configuración. Cuando no existe configuración se devuelve en caso de que existan entidades dentro del
     *      dominio de $idestructura los identificadores de las mismas y en caso nogativo devueleve $idestructura.
     * @author Ing. Orestes Rodríguez Lorenzo
     * @update 09/10/2017 Ing. Yaricel Guerra Velázquez. Incorporar datos de las estructuras devueltas.
     *         09/10/2017 Ing. Orestes Rodríguez Lorenzo. Incorporar a la respuesta el tipo de estructura que devuelve,
     *         determinando si son configuraciones de unidades organoizativas, entidades del dominio o dicha estructura
     */
    public function obtenerIdsConfig($idestructura)
    {
        try {
            $config = ConfEntidad::idEntidadByPadre($idestructura);
            $tipo = 0;
            $estructuras = Array();
            if (count($config) > 0) {
                foreach ($config as $idarr => $config) {
                    array_push($estructuras, $config['idestructura']);
                }
            } else {
                $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
                if (count($entidades) > 0) {
                    foreach ($entidades as $idarr => $estructura) {
                        array_push($estructuras, $estructura->idfila);
                    }
                    $tipo = 1;
                } else {
                    array_push($estructuras, $idestructura);
                    $tipo = 2;
                }
            }
            $datos = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($estructuras);
            return array($tipo, $datos);
        } catch (Exception $e) {
            return false;
        }
    }
}