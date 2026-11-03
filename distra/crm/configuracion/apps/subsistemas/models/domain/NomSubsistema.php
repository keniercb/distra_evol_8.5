<?php

/**
 * Componente para gestionar los subsistemas
 *
 * @package    Configuración
 * @subpackage Subsistemas/Models/Domain
 * @copyright  XETID
 * @version    1.0
 */
class NomSubsistema extends BaseNomSubsistema
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        $this->hasMany(
            'DatEstructurasubsist',
            array('local' => 'idsubsistema', 'foreign' => 'idsubsistema')
        );
        $this->hasMany(
            'DatSubsistemaPrecedencia',
            array('local' => 'idprecedente', 'foreign' => 'idsubsistema')
        );
        parent::setUp();
    }

    /**
     * Buscar subsistema
     *
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object Retorna un objeto de tipo subsistema
     */
    static public function BuscarSubsistema($idsubsistema)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->from("NomSubsistema s")
                ->where("s.idsubsistema= " . $idsubsistema)
                ->execute()
                ->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistema carga inicial
     *
     * @param int $idsubsistema Identificador de subsistema
     *
     * @return object Retorna un objeto de tipo subsistema
     */
    static public function BuscarSubsistemaCargaInicial($idsubsistema)
    {
        try {
            $q = new Doctrine_Query();
            $result = $q->from("NomSubsistema s")
                ->where("s.idsubsistema= " . $idsubsistema)
                ->setHydrationMode(Doctrine::HYDRATE_RECORD)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas
     *
     * @return array Retorna un arreglo de objetos de tipo subsistemas
     */
    static public function ObtenerSubsistemas()
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->from('NomSubsistema')->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas precedentes
     *
     * @param int $numPrecedencia Nùmero de precedencia
     *
     * @return array Retorna un arreglo de objetos de tipo subsistemas encontrados a partir de la precedencia
     */
    static public function BuscarSubsistemasPrecedentes($idestructurasubsist)
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->select('idsubsistema')
                ->from('NomSubsistema ns')
                ->innerJoin('ns.DatSubsistemaPrecedencia dsp on ns.idsubsistema = dsp.idprecedente')
                ->where('dsp.idestructurasubsist=?', array($idestructurasubsist))
                ->orderBy('idsubsistema asc')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Buscar subsistemas posteriores
     *
     * @param int $numPrecedencia Nùmero de precedencia
     *
     * @return array Retorna un arreglo de objetos de tipo subsistemas encontrados a partir de la precedencia
     */
    static public function BuscarSubsistemasPosteriores($idsubsistema,$idestructura)
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->select('idsubsistema')
                ->from('NomSubsistema ns')
                ->innerJoin('ns.DatEstructurasubsist des')
                ->innerJoin('des.DatSubsistemaPrecedencia dsp')
                ->where('dsp.idprecedente=? AND des.idestructuracomun=?', array($idsubsistema,$idestructura))
                ->orderBy('idsubsistema asc')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas que cierran
     *
     * @return array Retorna un arreglo de subsistemas que cierran
     */
    static public function ObtenerSubsistemasCierran()
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->from('NomSubsistema')->where('cierra = 1')->execute()
                ->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas por fecha
     *
     * @return array Retorna un arreglo de subsistemas encontrados por fecha
     */
    static public function obtenerSubsistemasFecha()
    {
        try {
            $q = Doctrine_Query::create();
            $result = $q->from('NomSubsistema')->execute()->toArray();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas por Uri
     *
     * @param string $uri       Ruta
     * @param int    $identidad Identificador de entidad
     *
     * @return array Retorna un arreglo con con los subsistemas encontrados a partir de la ruta
     */
    static public function ObtenerSubsitemaURI($uri, $identidad)
    {
        try {
            $q = new Doctrine_Query();
            if ($uri->nivel2 == 'configuracion/multimoneda') {
                $result = $q->from("NomSubsistema s")
                    ->innerJoin('s.DatEstructurasubsist es')
                    ->where(
                        "s.uri = 'configuracion/multimoneda' AND es.idestructuracomun = ?",
                        $identidad
                    )
                    ->execute()
                    ->toArray(true);
            } else {
                $where
                    = "(s.uri = ? OR s.uri = ?) AND es.idestructuracomun = ?";
                $result = $q->from("NomSubsistema s")
                    ->innerJoin('s.DatEstructurasubsist es')
                    ->where(
                        $where, array($uri->nivel1, $uri->nivel2, $identidad)
                    )
                    ->execute()
                    ->toArray(true);
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas contables
     *
     * @param int $idestructuracomun Identificador estructura comùn
     *
     * @return array Retorna un arreglo con los datos del subsistema contable encontrado
     */
    static public function ObtenerSubsistemasCont($idestructuracomun)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomSubsistema s')
                ->innerJoin('s.DatEstructurasubsist es')
                ->where('es.idestructuracomun = ? AND es.contabiliza = 1', $idestructuracomun)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ZendExt_ClassStandard::ArrayObject($result);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas finanzas
     *
     * @param int $idestructuracomun Identificador estructura comùn
     *
     * @return array Retorna un arreglo con los datos del subsistema contable encontrado
     */
    static public function ObtenerSubsistemasFnz($idestructuracomun)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatEstructurasubsist es')
                ->where(
                    'es.idestructuracomun = ? AND es.idsubsistema = 6 AND es.aperturado = 1',
                    $idestructuracomun
                )
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return ZendExt_ClassStandard::ArrayObject($result);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener subsistemas por limite
     *
     * @param int $agStart    Indice de inicio de la busqueda
     * @param int $agLimit    Cantidad de elementos a buscar
     * @param int $estructura Identificador de estructura
     *
     * @return array Retorna un arreglo con los objetos de tipo subsistemas
     * @throws Doctrine_Exception $ee
     */
    static public function getSubsistemasByLimit($estructura, $agStart = null, $agLimit = null)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $offset = "";
            if ($agStart != null && $agLimit != null) {
                $offset = "OFFSET $agStart LIMIT $agLimit;";
            }
            $queryString = "select q.* from (select  ns.idsubsistema,
                                    ns.denominacion,
                                    ns.uri,estr.idestado,
                                    estr.version,
                                    estr.idestructurasubsist,estr.idestructuracomun,
                                    estr.aperturado,estr.contabiliza,
                                    estr.precedencia,estr.cierra
                                    from mod_datosmaestros.dat_estructurasubsist estr
                                    inner join mod_datosmaestros.nom_subsistema ns
                                    on (estr.idsubsistema = ns.idsubsistema)
                                    where estr.idestructuracomun = $estructura
                            UNION
                            select  DISTINCT ns.idsubsistema,
                                    ns.denominacion,
                                    ns.uri,-1,-1,-1,
                                    -1,-1,-1,-1,-1
                                    from mod_datosmaestros.nom_subsistema ns
                                    where ns.idsubsistema not in (select a.idsubsistema
                                                                  from mod_datosmaestros.dat_estructurasubsist a
                                                                  where a.idestructuracomun = $estructura)) q
                                                                  ORDER BY q.idsubsistema ASC $offset";
            $result = $conexionActual->fetchAll($queryString);
            return $result;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Obtener subsistemas por sql
     *
     * @param int $estructura Identificador de estructura comùn
     *
     * @return array Retorna un arreglo con los objetos de tipo subsistemas
     * @throws Doctrine_Exception $ee
     */
    static public function getSubsistemasBySql($estructura)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $queryString = "select  ns.idsubsistema,
                                    ns.denominacion,
                                    ns.uri,estr.idestado,
                                    estr.version,
                                    estr.idestructurasubsist,estr.idestructuracomun,
                                    estr.aperturado,estr.contabiliza,
                                    estr.precedencia,estr.cierra
                                    from mod_datosmaestros.dat_estructurasubsist estr
                                    inner join mod_datosmaestros.nom_subsistema ns
                                    on (estr.idsubsistema = ns.idsubsistema)
                                    where estr.idestructuracomun = $estructura
                            UNION
                            select  DISTINCT ns.idsubsistema,
                                    ns.denominacion,
                                    ns.uri,-1,-1,-1,
                                    -1,-1,-1,-1,-1
                                    from mod_datosmaestros.nom_subsistema ns
                                    where ns.idsubsistema not in (select a.idsubsistema
                                                                  from mod_datosmaestros.dat_estructurasubsist a
                                                                  where a.idestructuracomun = $estructura)";
            $result = $conexionActual->fetchAll($queryString);
            return $result;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false, $start = null, $limit = null)
    {
        try {
            $query = Doctrine_Query::create();

            if ($start === null && $limit === null) {
                $result = $query->from('NomSubsistema')
                    ->where("$condition", $params)
                    ->execute();
            } else {
                $result = $query->from('NomSubsistema')
                    ->where("$condition", $params)
                    ->offset($start)
                    ->limit($limit)
                    ->execute();
            }
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idsubsistema)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('NomSubsistema')
                ->where("idsubsistema = ?", array($idsubsistema))
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('NomSubsistema')
                ->where("$conditions", $params)
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}
